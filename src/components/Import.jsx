import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ThemeContext } from "./Navbar";
import ImportAddPage from "./ImportAddPage";
import ImportViewDetailPage from "./ImportViewDetailPage";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { formatDate, formatCostNumber } from "../utils/helper";
import { toast } from "react-toastify";
import axios from "axios";
import NotFound from "./NotFound";
const Import = () => {
  const theme = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState();
  const [listIngredient, setListIngredient] = useState();
  const [listImports, setListImports] = useState();
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const token = localStorage.getItem("token");
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("2025-12-31");
  const [notFound, setNotFound] = useState(false);

  const handleGetData = (data) => {
    setShow(true);
    setStatus("View");
    setData(data);
  };
  const handleGetItems = () => {
    axios
      .get(
        `purchase-orders?page=${
          currentPage - 1
        }&size=${postsPerPage}&keyword=${search}&start=${dayStart}&end=${dayEnd}`,
        {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        }
      )
      .then((res) => {
        setListImports(() => res.data.content);
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
    axios
      .get(`products?size=50`, {
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      })
      .then((res) => {
        setListIngredient(() => res.data.content);
      })
      .catch((error) => {
        console.log("Error::", error);
        if (error.response.status === 404 || error.response.status === 401) {
          setNotFound(true);
        }
      });
  }, []);

  useEffect(() => {
    handleGetItems();
  }, [currentPage, search, show, dayEnd, dayStart]);

  const handleSearchProducts = () => {
    handleGetItems();
  };
  const handleCloseForm = () => {
    setShow(false);
  };
  if (notFound) return <NotFound />;

  if (!show) {
    return (
      <div
        className={`m-auto max-w-[1440px] w-full flex flex-col h-screen px-4 py-12`}
      >
        <div className="flex my-8 bg-white text-black p-6 shadow-xl items-center justify-between">
          <div>
            <ul className="flex">
              <li
                onClick={() => {
                  setShow(true);
                  setStatus("Add");
                }}
                className={`py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer active ${
                  theme.mode ? "" : "bg-white border-2 border-black text-black"
                }`}
              >
                Nhập hàng
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-8">
            <label htmlFor="">Ngày bắt đầu</label>
            <div className="bg-white px-4 border-2 border-black py-2 rounded-full shadow-xl">
              <input
                type="date"
                className="focus:outline-none"
                name=""
                id=""
                onChange={(e) => {
                  setCurrentPage(1);
                  setDayStart(e.target.value);
                }}
              />
            </div>
            <label htmlFor="">Ngày kết thúc</label>
            <div className="bg-white px-4 border-2 border-black py-2 rounded-full shadow-xl">
              <input
                type="date"
                className="focus:outline-none"
                name=""
                id=""
                onChange={(e) => {
                  setCurrentPage(1);
                  setDayEnd(e.target.value);
                }}
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
              className={`bg-transparent rounded-full p-2 min-w-[200px] duration-200 ease-in focus:min-w-[300px] outline-none ${
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
            <ul
              className="flex"
              onClick={() => {
                handleSearchProducts();
              }}
            >
              <li
                className={`py-2 px-4 shadow-xl mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer hover:opacity-60 active ${
                  theme.mode ? "" : "bg-white border-2 border-black text-black"
                }`}
              >
                Tìm kiếm
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <ul className="flex font-bold items-center text-center">
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[150px]`}
            >
              Mã Đơn Hàng
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[300px]`}
            >
              Nhà Cung Cấp
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[300px]`}
            >
              Ngày Nhập
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[200px]`}
            >
              Tổng Tiền
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[450px]`}
            >
              Chức Năng
            </li>
          </ul>
          {listImports?.map((tmp) => (
            <ul
              key={tmp.id}
              className={`flex ${theme.mode ? "bg-white" : "bg-transparent"}`}
            >
              <li className="border py-2 px-4 w-[150px] flex items-center justify-center">
                {`DH0${tmp.id}`}
              </li>
              <li className="border py-2 px-4 w-[300px] flex items-center justify-center">
                {tmp.supplier?.name}
              </li>
              <li className="border py-2 px-4 w-[300px] flex items-center justify-center">
                {formatDate(tmp.createdAt)}
              </li>
              <li className="border py-2 px-4 w-[200px] flex items-center justify-center">
                {formatCostNumber(tmp.totalCost)}
              </li>
              <li className="border py-2 px-4 w-[450px] flex font-semibold items-center justify-around">
                <button
                  onClick={() => {
                    handleGetData(tmp);
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
        <div className="mt-5">
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
  }

  if (show && status === "Add") {
    return (
      <>
        <ImportAddPage
          handleCloseForm={handleCloseForm}
          products={listIngredient}
        />
      </>
    );
  }
  if (show && status === "View") {
    return (
      <>
        <ImportViewDetailPage handleCloseForm={handleCloseForm} data={data} />
      </>
    );
  }
};

export default Import;
