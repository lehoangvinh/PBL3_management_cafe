import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./Navbar";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { formatCostNumber, formatDate, formatDateShip } from "../utils/helper";
import { PaginationControl } from "react-bootstrap-pagination-control";

const BillDetailPage = (props) => {
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);
  const [orderDetails, setOrderDetails] = useState(props.data?.orderDetails);

  return (
    <div
      className={`m-auto max-w-[1440px] w-full flex justify-between px-4 py-11 `}
    >
      <div className="flex flex-col basis-7/12 ">
        <div
          className={`col-span-2 shadow-xl min-h-[570px] mb-16 ${
            theme.mode ? "bg-white" : "bg-transparent"
          } rounded-lg p-3 border-2 `}
        >
          <h1 className="text-center font-bold text-2xl py-2">
            Chi tiết đơn hàng
          </h1>
          <ul className="flex font-bold  items-center">
            <li
              className={`border-b ${
                theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[300px]`}
            >
              Sản phẩm
            </li>
            <li
              className={`border-b ${
                theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[150px]`}
            >
              Size
            </li>
            <li
              className={`border-b ${
                theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[150px]`}
            >
              Giá
            </li>
            <li
              className={`border-b ${
                theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[120px]`}
            >
              Số lượng
            </li>
            <li
              className={`border-b ${
                theme.mode ? "bg-transparent" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[150px]`}
            >
              Tổng cộng
            </li>
          </ul>
          {orderDetails
            .slice(
              (currentPage - 1) * postsPerPage,
              (currentPage - 1) * postsPerPage + postsPerPage
            )
            ?.map((ingredient) => (
              <ul className="flex ">
                <li className="border-b py-2 px-4 w-[300px] flex items-center justify-start">
                  <img
                    className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                    src={ingredient.imageUrl || "imageTemp.png"}
                    alt=""
                  />
                  {ingredient.menu}
                </li>
                <li className="border-b py-2 px-4 w-[150px] flex items-center justify-start">
                  {ingredient?.menuSize?.split("_")[1]}
                </li>
                <li className="border-b py-2 px-4 w-[150px] flex items-center justify-start">
                  {formatCostNumber(ingredient.menuCost)}
                </li>
                <li className="border-b py-2 px-4 w-[120px] flex items-center justify-start">
                  {ingredient.quantity}
                </li>
                <li className="border-b py-2 px-4 w-[150px] flex items-center justify-start">
                  {formatCostNumber(ingredient.totalCost)}
                </li>
              </ul>
            ))}

          <div className="my-4">
            <PaginationControl
              page={currentPage}
              between={4}
              total={orderDetails.length}
              limit={postsPerPage}
              changePage={(page) => {
                setCurrentPage(page);
              }}
              ellipsis={1}
            />
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3 min-h-[200px]">
          <div
            className={`col-span-1 border rounded-xl shadow-xl ${
              theme.mode ? "bg-white" : "bg-transparent"
            }`}
          >
            <h5 className="font-bold p-3 border-b-2">Thông tin giao hàng</h5>
            <div>
              <ul
                className={`p-3 text-sm ${
                  theme.mode ? "text-gray-600" : "text-white"
                }`}
              >
                <li className="flex items-center justify-between py-1">
                  <span>Nhân viên giao hàng</span>
                  <span>{`${props.data?.staffFullName || "Không có"} `}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-t-2">
                  <span>Ngày giao hàng</span>
                  <span>{formatDateShip(props.data?.createdAt)}</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Trạng thái</span>
                  <span className="font-bold text-green-400">Thành công</span>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`col-span-1 border-2 rounded-xl shadow-xl ${
              theme.mode ? "bg-white" : "bg-transparent"
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
                  <span>{formatCostNumber(props.data?.subTotalCost)}</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Phí vận chuyển</span>
                  <span>{formatCostNumber(props.data?.deliveryCost)}</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Giảm giá</span>
                  <span>{formatCostNumber(props.data?.amountDiscount)}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-t-2">
                  <span>Tổng cộng</span>
                  <span>{formatCostNumber(props.data?.totalCost)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={` shadow-xl rounded-lg flex flex-col basis-4/12 justify-center p-3 border-2 ${
          theme.mode ? "bg-white" : "bg-transparent"
        } `}
      >
        <h5 className="font-bold text-center">Thông tin khách hàng</h5>
        <div className="flex items-center border-b-2 p-2 my-1 text-lg">
          <span>{`${props.data?.customer.lastname || ""} ${
            props.data?.customer.firstname || ""
          }`}</span>
        </div>
        <div className="flex flex-col border-b-2 p-2 my-1">
          <div className="flex mb-2">
            <AiOutlineMail size={20} className="mr-4" />
            <span className="text-sm">{props.data?.customer.email}</span>
          </div>
          <div className="flex">
            <AiOutlinePhone size={20} className="mr-4" />
            <span className="text-sm">+{props.data?.customer.phoneNumber}</span>
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
            <li>{props.data?.address?.split(",")[0]}</li>
            <li>{props.data?.address?.split(",")[1]}</li>
            <li>{props.data?.address?.split(",")[2]}</li>
            <li>TP. Đà Nẵng</li>
          </ul>
        </div>
        <div className="w-[100%] flex items-center justify-between py-4 col-span-3  border-gray-200">
          <div className="flex items-center m-auto ">
            <button
              onClick={props.handleCloseForm}
              className="min-w-[100px] rounded-lg bg-red-400 border   hover:opacity-80  h-9 px-3 py-2 text-sm "
              type="button"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailPage;
