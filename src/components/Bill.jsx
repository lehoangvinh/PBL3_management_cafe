import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ThemeContext } from "./Navbar";
import BillDetailPage from "./BillDetailPage";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { toast } from "react-toastify";
import axios from "axios";
import { formatCostNumber, formatDate } from "../utils/helper";
import NotFound from "./NotFound";
const Bill = () => {
  const [show, setShow] = useState(false);
  const theme = useContext(ThemeContext);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  const [listBill, setListBill] = useState();
  const [billDetail, setBillDetail] = useState();

  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("2025-12-31");
  const [notFound, setNotFound] = useState(false);

  const getAllBill = () => {
    axios
      .get(
        `orders?status=paid&page=${
          currentPage - 1
        }&size=${postsPerPage}&keyword=${search}&start=${dayStart}&end=${dayEnd}`,
        {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        }
      )
      .then((res) => {
        setListBill(res.data.content);
        setTotalProducts(res.data.totalElements);
      })
      .catch((error) => {
        console.log("Error::", error);
        if (
          error.response.status === 404 ||
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          setNotFound(true);
        } else toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    getAllBill();
  }, [currentPage, search, show, dayEnd, dayStart]);
  const handleCloseForm = () => {
    setShow(false);
  };
  if (notFound) return <NotFound></NotFound>;

  if (!show) {
    return (
      <div
        className={`m-auto max-w-[1440px] w-full flex flex-col h-screen px-4 py-12`}
      >
        <div className="flex my-8 bg-white min-w-[1200px] text-black p-6  shadow-xl items-center justify-between">
          <div className="flex items-center gap-8">
            <label htmlFor="">Ngày bắt đầu</label>
            <div className="bg-white px-4 border-2 border-black py-2 rounded-full shadow-xl">
              <input
                type="date"
                onChange={(e) => {
                  setCurrentPage(1);
                  setDayStart(e.target.value);
                }}
                className="focus:outline-none"
                name=""
                id=""
              />
            </div>
            <label htmlFor="">Ngày kết thúc</label>
            <div className="bg-white px-4 border-2 border-black py-2 rounded-full shadow-xl">
              <input
                type="date"
                onChange={(e) => {
                  setCurrentPage(1);
                  setDayEnd(e.target.value);
                }}
                className="focus:outline-none"
                name=""
                id=""
              />
            </div>
          </div>
          <div
            className={`bg-white shadow-xl rounded-full ${
              theme.mode
                ? "border-b-2 border-black/25"
                : "text-black border-2 border-black"
            } flex items-center px-2`}
          >
            <AiOutlineSearch size={20} />
            <input
              className={` bg-transparent rounded-full p-2 min-w-[200px] duration-200 ease-in focus:min-w-[300px] outline-none ${
                theme.mode ? "" : "bg-white  text-black"
              } focus:outline-none w-full`}
              type="text"
              placeholder="Tìm kiếm"
              name=""
              id=""
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <div>
            <ul className="flex">
              <li
                className={`py-2 px-4 shadow-xl mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer hover:opacity-60 active ${
                  theme.mode ? "" : "bg-white border-2 border-black text-black"
                }`}
                onClick={() => {}}
              >
                Tìm kiếm
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto  ">
          <ul className="flex font-bold items-center text-center">
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[100px]`}
            >
              #
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[250px]`}
            >
              Tên Khách Hàng
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[175px]`}
            >
              Số Điện Thoại
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[250px]`}
            >
              Tên Nhân Viên
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[250px]`}
            >
              Ngày Bán
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[200px]`}
            >
              Tổng Tiền
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 w-[300px]`}
            >
              Chức Năng
            </li>
          </ul>
          {listBill?.map((item, index) => (
            <ul
              key={index}
              className={`flex ${theme.mode ? "bg-white" : "bg-transparent"}`}
            >
              <li className="border py-2 px-4 w-[100px] flex items-center justify-center">
                {item.id}
              </li>
              <li className="border py-2 px-4 w-[250px] flex items-center justify-center text-center">
                {`${item.customer.firstname} ${item.customer.lastname} `}
              </li>
              <li className="border py-2 px-4 w-[175px] flex items-center justify-center">
                {item.customer.phoneNumber}
              </li>
              <li className="border py-2 px-4 w-[250px] flex items-center justify-center">
                {`${item.staffFullName} `}
              </li>
              <li className="border py-2 px-4 w-[250px] flex items-center justify-center">
                {formatDate(item.createdAt)}
              </li>
              <li className="border py-2 px-4 w-[200px] flex items-center justify-center">
                {formatCostNumber(item.totalCost)}
              </li>
              <li
                className={`border py-2 px-4 w-[300px] flex font-semibold items-center justify-around ${
                  theme.mode ? "bg-white" : "bg-[#1f1f1f] text-white"
                }`}
              >
                <button
                  onClick={() => {
                    setBillDetail(item);
                    setShow(true);
                  }}
                  className={`p-2 ${
                    theme.mode ? "bg-yellow-400" : "bg-pink-700 "
                  } hover:opacity-80  w-[200px] border rounded-xl`}
                >
                  Xem Chi Tiết
                </button>
              </li>
            </ul>
          ))}
        </div>
        <div className="mt-4">
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
    );
  } else {
    return (
      <>
        <BillDetailPage handleCloseForm={handleCloseForm} data={billDetail} />
      </>
    );
  }
};

export default Bill;
