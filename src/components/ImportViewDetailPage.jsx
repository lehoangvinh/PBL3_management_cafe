import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./Navbar";
import { formatDate, formatCostNumber } from "../utils/helper";
import { PaginationControl } from "react-bootstrap-pagination-control";
const ImportViewDetailPage = (props) => {
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [totalProducts, setTotalProducts] = useState(
    props.data.purchaseOrderDetails.length
  );

  useEffect(() => {
    window.onbeforeunload = function () {
      return true;
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);
  return (
    <div
      className={`m-auto max-w-[1440px] w-full grid grid-cols-3 gap-4 px-4 py-12  `}
    >
      <div
        className={`col-span-2 w-full shadow-xl border-2 rounded-xl ${
          theme.mode ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="w-full">
          <h3 className="text-2xl text-center py-6 font-semibold">
            Danh sách sản phẩm
          </h3>
          <div className="flex flex-col items-center justify-center">
            <ul className="mb-3 border-b flex font-bold text-center items-center">
              <li
                className={` ${
                  theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[200px]`}
              >
                Tên Sản Phẩm
              </li>
              <li
                className={` ${
                  theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[110px]`}
              >
                Số lượng
              </li>
              <li
                className={` ${
                  theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[150px]`}
              >
                Đơn vị
              </li>
              <li
                className={` ${
                  theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[150px]`}
              >
                Đơn Giá
              </li>
              <li
                className={` ${
                  theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[150px]`}
              >
                Tổng tiền
              </li>
            </ul>
            {props.data?.purchaseOrderDetails
              .slice(
                (currentPage - 1) * postsPerPage,
                (currentPage - 1) * postsPerPage + postsPerPage
              )
              ?.map((ingre) => (
                <ul
                  key={ingre.id}
                  className="my-2 flex border-2 rounded-xl shadow-xl text-sm"
                >
                  <li className="py-2 px-4 w-[200px] flex items-center justify-start">
                    <img
                      className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                      src="./imageTemp.png"
                      alt=""
                    />
                    {ingre.productName}
                  </li>
                  <li className="py-2 px-4 w-[110px] flex items-center justify-center">
                    {ingre.quantity}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center justify-center">
                    {ingre.unit}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center justify-center">
                    {formatCostNumber(ingre.productCost)}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center justify-center">
                    {formatCostNumber(ingre.totalCost)}
                  </li>
                </ul>
              ))}
          </div>
        </div>
        <div className="my-4">
          <PaginationControl
            page={currentPage}
            between={4}
            total={totalProducts}
            limit={postsPerPage}
            changePage={(page) => {
              setCurrentPage(page);
            }}
            ellipsis={1}
          />
        </div>
      </div>
      <div
        className={`h-[400px] flex flex-col h-[500px] justify-center shadow-xl border-2 rounded-xl py-4 px-8 ${
          theme.mode ? "bg-white" : "bg-transparent"
        }`}
      >
        <h5 className="font-bold text-center text-3xl border-b-2 py-3">
          Nhà cung cấp
        </h5>
        <div className="flex items-center justify-between border-b-2 py-6">
          <label htmlFor="" className="">
            Tên nhà cung cấp
          </label>
          <span className="font-bold">{props.data.supplier.name}</span>
        </div>
        <div className="flex items-center justify-between border-b-2 py-6">
          <label htmlFor="" className="">
            Ngày nhập
          </label>
          <span className="font-bold">{formatDate(props.data.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between border-b-2 py-6">
          <label htmlFor="" className="">
            Tổng tiền hàng
          </label>
          <span className="font-bold">
            {formatCostNumber(props.data.totalCost)}
          </span>
        </div>
        <div className="flex items-center justify-between border-b-2 py-6">
          <label htmlFor="" className="">
            Phương thức thanh toán
          </label>
          <span className="font-bold">{props.data.paymentType}</span>
        </div>
        <div className="sticky -bottom-1 flex items-center justify-between py-4 col-span-3  border-gray-200">
          <div></div>
          <div className="flex items-center mx-auto mt-4">
            <button
              onClick={props.handleCloseForm}
              className="min-w-[100px] rounded-lg bg-red-400 border   hover:opacity-80  h-9 px-3  py-2 text-sm "
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

export default ImportViewDetailPage;
