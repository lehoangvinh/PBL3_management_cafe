import React, { useContext, useState, useEffect } from "react";
import { BsBell } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

import { ThemeContext } from "./Navbar";
import { useNotification } from "../context/notification.context";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment/moment";
import { useAuth } from "../context/auth.context";
import axios from "axios";
import { formatCostNumber } from "../utils/helper";
import { PaginationControl } from "react-bootstrap-pagination-control";
import useClickOutSIde from "../hooks/useClickOutSide";
const StaffOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [orders, setOrders] = useState();

  const { nodeRef, setShow, show } = useClickOutSIde();

  const { token } = useAuth();
  const theme = useContext(ThemeContext);

  const {
    numberOfUnreadNotification,
    notifications,
    getNotifications,
    clearNotifications,
    last,
    fetchMoreNotification,
    changeToRead,
    getNumberOfUnreadNotification,
  } = useNotification();

  const navigate = useNavigate();

  const [currentFilterType, setCurrentFilterType] = useState("Đang Chờ");
  const [currentNotiFilterType, setCurrentNotiFilterType] = useState("Tất cả");

  const changeTextStatus = (status) => {
    if (status === "PENDING") return "Đang chờ";
    if (status === "DELIVERING") return "Đang giao hàng";
    if (status === "FAILED") return "Đã huỷ";
    if (status === "PAID") return "Đã thanh toán";
  };

  useEffect(() => {
    document
      .querySelectorAll("li[name]")
      .forEach((item) => item?.classList.remove("active"));
    document
      .querySelectorAll("li[name]")
      .forEach((item) =>
        item.innerHTML === currentFilterType ||
        item.innerHTML === currentNotiFilterType
          ? item.classList.add("active")
          : null
      );
  });

  useEffect(() => {
    if (currentFilterType === "Đang Chờ")
      axios
        .get(`orders/pending?size=${postsPerPage}&page=${currentPage - 1}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrders(response.data);
        });
    else
      axios
        .get(`users/me/orders?size=${postsPerPage}&page=${currentPage - 1}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrders(response.data);
        });
  }, [currentFilterType, currentPage]);

  return (
    <div
      className={`m-auto max-w-[1540px] w-full flex flex-col h-screen px-4 py-12`}
    >
      <div className="flex my-8 items-center justify-between">
        <div>
          <ul className="flex">
            <li
              onClick={() => {
                setCurrentFilterType("Đang Chờ");
                setCurrentPage(1);
              }}
              name="Đang Chờ"
              className={`py-2 px-4 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              Đang Chờ
            </li>
            <li
              onClick={() => {
                setCurrentFilterType("Đã Nhận");
                setCurrentPage(1);
              }}
              name="Đã Nhận"
              className={`py-2 px-4 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              Đã Nhận
            </li>
          </ul>
        </div>
        <div className="relative select-none" ref={nodeRef}>
          <div
            onClick={() => {
              setShow(!show);
              clearNotifications();
              getNumberOfUnreadNotification();
              getNotifications(
                0,
                10,
                currentNotiFilterType === "Tất cả" ? true : false
              );
            }}
            className={`w-12 h-12  relative cursor-pointer rounded-full ${
              theme.mode ? "bg-gray-300" : "text-black bg-white"
            } flex items-center justify-center px-2`}
          >
            <BsBell size={24} />
            <span className="block w-6 h-6 rounded-full text-center text-white text-sm font-bold  bg-red-500 absolute top-[-10px] right-0">
              {numberOfUnreadNotification}
            </span>
          </div>
          {show && (
            <>
              <div class="w-4 z-50 absolute left-[50%] bottom-[-10px] translate-x-[-50%] overflow-hidden inline-block">
                <div class=" h-3 w-3 bg-white rotate-45 transform origin-bottom-left"></div>
              </div>
              <div
                id="scrollableDiv"
                className={`absolute right-[5px] rounded-xl  shadow-2xl top-[57px] z-40 w-[400px] min-h-[100px] max-h-[500px] overflow-y-auto ${
                  theme.mode
                    ? "bg-gray-200 border-2 border-black/25"
                    : "text-white border-2 bg-[#1f1f1f]"
                }`}
              >
                <h1
                  className={`text-center p-3 font-bold ${
                    theme.mode
                      ? " border-b-2 border-black/25"
                      : "text-white border-b-2 bg-[#1f1f1f]"
                  }`}
                >
                  Thông báo
                </h1>
                <div
                  className={`flex items-center justify-start p-3 ${
                    theme.mode
                      ? " border-b-2 border-black/25"
                      : "text-white border-b-2 bg-[#1f1f1f]"
                  }`}
                >
                  <ul className="flex">
                    <li
                      onClick={() => {
                        setCurrentNotiFilterType("Tất cả");
                        clearNotifications();
                        getNotifications(0, 10, true);
                      }}
                      name="Tất cả"
                      className={`py-2 px-4 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                        theme.mode
                          ? "border-b-2 border-black/25"
                          : ` [&.active]:bg-white [&.active]:text-black`
                      }`}
                    >
                      Tất cả
                    </li>
                    <li
                      onClick={() => {
                        setCurrentNotiFilterType("Chưa đọc");
                        clearNotifications();
                        getNotifications(0, 10, false);
                      }}
                      name="Chưa đọc"
                      className={`py-2 px-4 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                        theme.mode
                          ? "border-b-2 border-black/25"
                          : ` [&.active]:bg-white [&.active]:text-black`
                      }`}
                    >
                      Chưa đọc
                    </li>
                  </ul>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {notifications && notifications.length === 0 && (
                    <div className="text-lg text-center">
                      Không có thông báo
                    </div>
                  )}
                  {notifications && notifications.length > 0 && (
                    <InfiniteScroll
                      dataLength={notifications.length}
                      next={() =>
                        fetchMoreNotification(
                          currentNotiFilterType === "Tất cả" ? true : false
                        )
                      }
                      hasMore={!last}
                      loader={<h5 className="mt-3 text-center">Loading...</h5>}
                      scrollableTarget="scrollableDiv"
                      endMessage={
                        <h5 className="pt-3 text-center">Hết thông báo</h5>
                      }
                    >
                      {notifications.map((notification) => (
                        <ul
                          key={notification.id}
                          className={`mt-2 p-3 border-2 shadow-xl rounded-xl flex gap-4 items-center justify-between cursor-pointer ${
                            theme.mode ? "bg-white" : "text-white bg-[#333333]"
                          } hover:opacity-60`}
                          onClick={() => {
                            if (notification.watched === false)
                              changeToRead(notification.id);
                            navigate(`/order/${notification.slug}`);
                          }}
                        >
                          <li className="px-3">
                            <BsBell size={24} />
                          </li>
                          <li className="flex flex-col">
                            <span>
                              {notification.message}
                              <i></i>
                            </span>
                            <span className="text-sm">
                              {moment(notification.createdAt).fromNow()}
                            </span>
                          </li>
                          <li>
                            <span className="text-blue-500">
                              {!notification.watched && (
                                <RxDotFilled size={30} />
                              )}
                            </span>
                          </li>
                        </ul>
                      ))}
                    </InfiniteScroll>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full mx-auto">
        <ul className="flex font-bold items-center text-center mb-4">
          {/* <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 px-4 min-w-[150px]`}
          >
            Mã Đơn Hàng
          </li> */}
          <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 px-4 w-[200px]`}
          >
            Tên Khách Hàng
          </li>
          <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 px-4 w-[200px]`}
          >
            Số Điện Thoại
          </li>
          <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 px-4 w-[250px]`}
          >
            Trạng Thái
          </li>
          <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 px-4 w-[300px]`}
          >
            Địa chỉ
          </li>
          <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 px-4 w-[200px]`}
          >
            Tổng Tiền
          </li>
          <li
            className={`${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            } py-2 w-[270px]`}
          >
            <span className="justify-center">Ngày đặt</span>
          </li>
        </ul>
        {orders?.content?.map((item) => (
          <ul
            key={item.id}
            className={`flex border ${
              theme.mode ? "bg-white" : "bg-transparent"
            } rounded-xl shadow-xl my-3 cursor-pointer hover:opacity-60 items-center text-center`}
            onClick={() => {
              navigate(`order/${item.id}`);
            }}
          >
            {/* <li className="py-6 px-4 w-[150px] flex items-center justify-center">
              {`ĐH${item.id}`}
            </li> */}
            <li className="py-6 px-4 w-[200px] flex items-center justify-center">
              {item.customer?.lastname + " " + item.customer?.firstname}
            </li>
            <li className="py-6 px-4 w-[200px] flex items-center justify-center">
              {item.customer.phoneNumber}
            </li>
            <li
              className={`${
                item.status === "DELIVERING" ? "text-green-500" : ""
              } ${item.status === "FAILED" ? "text-red-500" : ""} 
              ${item.status === "PAID" ? "text-blue-500" : ""}
              py-6 px-4 w-[250px] flex items-center justify-center font-semibold `}
            >
              {changeTextStatus(item.status)}
            </li>
            <li className="py-6 px-4 w-[300px] flex items-center justify-center text-center">
              {item.address}
            </li>
            <li className="py-6 px-4 w-[200px] flex items-center justify-center">
              {formatCostNumber(item.totalCost)}
            </li>
            <li className="py-6 ml-4 w-[200px] flex flex-1 font-semibold items-center justify-center">
              {/* <span className="text-center items-start "> */}
              {moment(item.createdAt).format("lll")}
              {/* </span> */}
            </li>
          </ul>
        ))}
        <div className="mt-5">
          <PaginationControl
            page={currentPage}
            between={4}
            total={orders?.totalElements}
            limit={postsPerPage}
            changePage={(page) => {
              setCurrentPage(page);
            }}
            ellipsis={1}
            last
          />
        </div>
      </div>
    </div>
  );
};

export default StaffOrder;
