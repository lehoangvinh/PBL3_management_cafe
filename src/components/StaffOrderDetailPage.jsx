import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./Navbar";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { FaRegDotCircle, FaRegCheckCircle } from "react-icons/fa";
import { BiErrorCircle, BiHeartCircle } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth.context";
import { useNotification } from "../context/notification.context";
import { toast } from "react-toastify";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { formatCostNumber } from "../utils/helper";
import NotFound from "./NotFound";
const StaffOrderDetailPage = () => {
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);
  const [order, setOrder] = useState();
  const [notFound, setNotFound] = useState(false);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts = order?.orderDetails.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const { stompClient } = useNotification();

  const handleReceiveOrder = () => {
    fetch(`http://localhost:8080/api/v1/orders/${id}/receive`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.id) {
          sendUserNotificationDelivery();
          toast.success("Nhận đơn thành công");
          setOrder(json);
        } else {
          toast.error(json.message);
        }
      });
  };
  const handleCancelOrder = async () => {
    fetch(`http://localhost:8080/api/v1/orders/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.id) {
          sendUserNotificationFailed();
          toast.info("Đã huỷ đơn!!!");
          setOrder(json);
        } else {
          toast.error(json.message);
        }
      });
  };
  const handlePayOrder = () => {
    fetch(`http://localhost:8080/api/v1/orders/${id}/paid`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.id) {
          sendUserNotificationPaid();
          toast.success("Đơn đã thanh toán thành công");
          setOrder(json);
        } else toast.error(json.message);
      })
      .catch((err) => console.log(err));
  };

  const sendUserNotificationDelivery = async () => {
    if (stompClient) {
      const notification = {
        title: "Đặt hàng thành công",
        message: "Đơn hàng đang được giao đến cho bạn",
        type: "delivery",
        slug: order.id,
        toUser: {
          id: order.customer.id,
        },
      };
      const res = await axios.post("notification", notification, {
        headers: { Authorization: `Bearer ${token}` },
      });
      stompClient.send("/app/user-notification", {}, JSON.stringify(res.data));
    }
  };
  const sendUserNotificationPaid = async () => {
    if (stompClient) {
      const notification = {
        title: "Thanh toán thành công",
        message: "Bạn đã thanh toán đơn hàng thành công!",
        type: "paid",
        slug: order.id,
        toUser: {
          id: order.customer.id,
        },
      };
      const res = await axios.post("notification", notification, {
        headers: { Authorization: `Bearer ${token}` },
      });
      stompClient.send("/app/user-notification", {}, JSON.stringify(res.data));
    }
  };

  const sendUserNotificationFailed = async () => {
    if (stompClient) {
      const notification = {
        title: "Đặt đơn hàng thất bại",
        message: "Đã hết hàng. Vui lòng đặt lại sau!!!",
        type: "FAILED",
        slug: order.id,
        toUser: {
          id: order.customer.id,
        },
      };
      const res = await axios.post("notification", notification, {
        headers: { Authorization: `Bearer ${token}` },
      });
      stompClient.send("/app/user-notification", {}, JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    axios
      .get("orders/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          navigate("/");
          toast.info("Đơn hàng này đã được nhận!!!");
        }
        if (error.response.status === 404 || error.response.status === 401) {
          setNotFound(true);
        }
      });
  }, [id]);

  if (notFound) return <NotFound />;
  else
    return (
      order && (
        <div
          className={`m-auto max-w-[1440px] w-full grid grid-cols-3 gap-4 min-h-screen px-4 py-12 `}
        >
          <div
            className={`col-span-2 shadow-xl ${
              theme.mode
                ? "text-gray-600 bg-white"
                : "text-white bg-transparent"
            } rounded-lg p-3 border-2 `}
          >
            <h1 className="text-center font-bold text-2xl py-2">
              Chi tiết đơn hàng
            </h1>
            <ul className="flex font-bold  items-center">
              <li
                className={`border-b ${
                  theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[340px]`}
              >
                Sản phẩm
              </li>
              <li
                className={`border-b text-center ${
                  theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[100px]`}
              >
                Size
              </li>
              <li
                className={`border-b text-center ${
                  theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[120px]`}
              >
                Số lượng
              </li>
              <li
                className={`border-b text-center ${
                  theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[150px]`}
              >
                Giá
              </li>
              <li
                className={`border-b text-center ${
                  theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[200px]`}
              >
                Tổng cộng
              </li>
            </ul>
            {currentPosts?.map((item) => (
              <ul className="flex" key={item.id}>
                <li className="border-b py-2 px-4 min-w-[340px] flex items-center justify-start">
                  <img
                    className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                    src={item.imageUrl || "/imageTemp.png"}
                    alt=""
                  />
                  {item.menu}
                </li>
                <li className="border-b py-2 px-4 min-w-[100px] flex items-center justify-center">
                  {item?.menuSize?.split("_")[1]}
                </li>
                <li className="border-b py-2 px-4 min-w-[120px] flex items-center justify-center">
                  {item.quantity}
                </li>
                <li className="border-b py-2 px-4 min-w-[150px] flex items-center justify-center">
                  {item.menuCost}
                </li>
                <li className="border-b py-2 px-4 min-w-[200px] flex items-center justify-center">
                  {item.totalCost}
                </li>
              </ul>
            ))}
            <div className="mt-5">
              <PaginationControl
                page={currentPage}
                between={3}
                total={order?.orderDetails.length}
                limit={postsPerPage}
                changePage={(currentPage) => {
                  setCurrentPage(currentPage);
                }}
                last={true}
                ellipsis={0}
              />
            </div>
          </div>
          <div
            className={`min-h-[400px] shadow-xl rounded-lg flex flex-col justify-center p-3 border-2 ${
              theme.mode
                ? "text-gray-600 bg-white"
                : "text-white bg-transparent"
            }`}
          >
            <h5 className="font-bold text-center">Thông tin khách hàng</h5>
            <div className="flex items-center border-b-2 p-2 my-1">
              <img
                className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                src="https://i.ytimg.com/vi/OYUY7Ugupts/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLACdrTOvQW93hRDja8qfVAFHs4VAg"
                alt=""
              />
              <span>
                {`${order?.customer?.lastname || ""} ${
                  order?.customer?.firstname
                }`}
              </span>
            </div>
            <div className="flex flex-col border-b-2 p-2 my-1">
              <div className="flex mb-2">
                <AiOutlineMail size={20} className="mr-4" />
                <span className="text-sm">{order.customer?.email}</span>
              </div>
              <div className="flex">
                <AiOutlinePhone size={20} className="mr-4" />
                <span className="text-sm">{order.customer?.phoneNumber}</span>
              </div>
            </div>
            <div className="flex flex-col border-b-2 p-2 my-1">
              <h5 className="font-bold pb-3">Địa chỉ đặt hàng ( Mặc định )</h5>
              <ul className="text-sm">
                <li>54 Nguyễn Lương Bằng</li>
                <li>Phường Hòa Khánh Bắc</li>
                <li>Quận Liên Chiểu</li>
                <li>TP. Đà Nẵng</li>
              </ul>
            </div>
            <div className="flex flex-col border-b-2 p-2 my-1">
              <h5 className="font-bold pb-3">Địa chỉ nhận hàng</h5>
              <ul className="text-sm">
                <li>{order.address?.split(",")[0]}</li>
                <li>{order.address?.split(",")[1]}</li>
                <li>{order.address?.split(",")[2]}</li>
                <li>TP. Đà Nẵng</li>
              </ul>
            </div>
            <div className="sticky -bottom-1 flex items-center justify-between py-4 col-span-3  border-gray-200">
              <div></div>
              <div className="flex items-center m-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="min-w-[100px] rounded-lg bg-red-400 border   hover:opacity-80  h-9 px-3  py-2 text-sm "
                  type="button"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
          <div
            className={`col-span-1 border-2 rounded-xl shadow-xl ${
              theme.mode
                ? "text-gray-600 bg-white"
                : "text-white bg-transparent"
            }`}
          >
            <h5 className="font-bold p-3 border-b-2">Payment Summary</h5>
            <div>
              <ul
                className={`p-3 text-sm ${
                  theme.mode ? "text-gray-600" : "text-white"
                }`}
              >
                <li className="flex items-center justify-between py-1">
                  <span>Subtotal</span>
                  <span>{formatCostNumber(order.subTotalCost)}</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Phí vận chuyển</span>
                  <span>{formatCostNumber(order.deliveryCost)}</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Giảm giá</span>
                  <span>{formatCostNumber(order.amountDiscount)}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-t-2">
                  <span>Tổng cộng</span>
                  <span>{formatCostNumber(order.totalCost)}</span>
                </li>
                <li>
                  <div className="flex items-center justify-around mt-6">
                    <button
                      onClick={handleReceiveOrder}
                      className={`min-w-[100px] rounded-lg  ${
                        theme.mode ? "bg-green-200" : "bg-green-700"
                      } border hover:opacity-80  h-9 px-3 mr-8 py-2 font-semibold`}
                      type="button"
                    >
                      Nhận đơn
                    </button>
                    <button
                      onClick={handlePayOrder}
                      className={`min-w-[100px] rounded-lg  ${
                        theme.mode ? "bg-blue-200" : "bg-blue-500"
                      } border hover:opacity-80  h-9 px-3 mr-8 py-2 font-semibold`}
                      type="button"
                    >
                      Thanh toán
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className={`min-w-[100px] rounded-lg ${
                        theme.mode ? "bg-red-200" : "bg-red-500"
                      } border hover:opacity-80  h-9 px-3 mr-8 py-2 font-semibold`}
                      type="button"
                    >
                      Huỷ đơn
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-3 min-h-[200px]">
            <div
              className={`col-span-1 border rounded-xl shadow-xl ${
                theme.mode
                  ? "text-gray-600 bg-white"
                  : "text-white bg-transparent"
              }`}
            >
              <h5 className="font-bold p-3 border-b-2">Thông tin giao hàng</h5>
              <div>
                <ul
                  className={`p-3 text-sm ${
                    theme.mode ? "text-gray-600" : "text-white"
                  }`}
                >
                  <li className="flex items-center justify-between py-3">
                    <span>Nhân viên giao hàng</span>
                    <span>{order?.staffFullName || "Chưa có"}</span>
                  </li>
                  <li className="flex items-center justify-center py-1 border-b-2">
                    <span>Trạng thái</span>
                  </li>
                  <li className="flex items-center justify-around py-4 border-b-2">
                    {order.status === "FAILED" ? (
                      <div className="flex flex-col items-center justify-center">
                        <BiErrorCircle size={25} color="red" />
                        <span>Đơn hàng đã bị huỷ</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center">
                          <FaRegDotCircle size={25} color="green" />
                          <span>Đơn hàng đã đặt</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <FaRegCheckCircle
                            size={25}
                            color={order.status !== "PENDING" ? "green" : null}
                          />
                          <span>Đang vận chuyển</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <BiHeartCircle
                            size={25}
                            color={order.status === "PAID" ? "green" : null}
                          />
                          <span>Đã thanh toán</span>
                        </div>
                      </>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    );
};

export default StaffOrderDetailPage;
