import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ThemeContext } from "./Navbar";
import MenuAddPage from "./MenuAddPage";
import MenuEditPage from "./MenuEditPage";
import { PaginationControl } from "react-bootstrap-pagination-control";
import ModalPopup from "./ModalPopup";
import {
  isValidData,
  isValidNumber,
  formatDate,
  formatCostNumber,
} from "../utils/helper";
import { toast } from "react-toastify";
import axios from "axios";
import NotFound from "./NotFound";
const MenuManagePage = () => {
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const [status, setStatus] = useState("");
  const [currentFilterType, setDataFilterType] = useState("");
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);
  const [listIngredient, setListIngredient] = useState();
  const token = localStorage.getItem("token");
  const [notFound, setNotFound] = useState(false);

  const handleGetItems = () => {
    axios
      .get(
        `menu?page=${
          currentPage - 1
        }&size=${postsPerPage}&keyword=${search}&cid=${currentFilterType}`,
        {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        }
      )
      .then((res) => {
        setProducts(res.data.content);
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
    handleGetItems();
  }, [currentPage, search, currentFilterType]);

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
      .catch((err) => {
        console.log("Error::", err);
      });
  }, []);

  const handleDeleteMenu = async (id) => {
    const token = localStorage.getItem("token");
    await axios
      .delete(`menu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      })
      .then((response) => {
        console.log("Deleted");
        handleGetItems();
      })
      .catchh((err) => {
        toast.error(err.response.data);
      });
  };
  const handleSetData = (id) => {
    axios
      .get(`menu/${id}/detail?size=50`, {
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      })
      .then((res) => {
        setData(() => res.data);
        setShow(true);
        setStatus("Edit");
      })
      .catch((err) => {
        console.log("Error::", err);
        toast.error("Không tìm thấy dữ liệu của vật phẩm này");
      });
  };
  useEffect(() => {
    document
      .querySelectorAll("li[name]")
      .forEach((item) => item?.classList.remove("active"));
    document
      .querySelectorAll("li[name]")
      .forEach((item) =>
        item.getAttribute("name") == currentFilterType
          ? item.classList.add("active")
          : null
      );
  });

  const handleCloseForm = () => {
    setShow(false);
  };
  if (notFound) return <NotFound></NotFound>;

  if (!show) {
    return (
      <div
        className={`m-auto max-w-[1440px] w-full flex flex-col h-screen px-4 py-12`}
      >
        <div className="flex my-8 items-center justify-between">
          <div>
            <ul className="flex">
              <li
                onClick={() => {
                  setShow(true);
                  setStatus("Add");
                }}
                className={` shadow-xl py-2 px-4 mx-2 font-semibold hover:opacity-60 rounded-full min-w-[100px] text-center cursor-pointer active ${
                  theme.mode
                    ? "border-b-2 border-black/25"
                    : " [&.active]:bg-white [&.active]:text-black"
                }`}
              >
                Thêm
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex">
              <li
                onClick={() => {
                  setCurrentPage(1);
                  setDataFilterType("");
                }}
                name=""
                className={`active:bg-blue-400  shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                  theme.mode
                    ? "border-b-2 border-black/25"
                    : " [&.active]:bg-white [&.active]:text-black"
                }`}
              >
                Tất Cả
              </li>
              <li
                onClick={() => {
                  setCurrentPage(1);
                  setDataFilterType(2);
                }}
                name="2"
                className={`active:bg-blue-400 shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                  theme.mode
                    ? "border-b-2 border-black/25"
                    : " [&.active]:bg-white [&.active]:text-black"
                }`}
              >
                Thức Uống
              </li>
              <li
                onClick={() => {
                  setCurrentPage(1);
                  setDataFilterType(1);
                }}
                name="1"
                className={`active:bg-blue-400 shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                  theme.mode
                    ? "border-b-2 border-black/25"
                    : " [&.active]:bg-white [&.active]:text-black"
                }`}
              >
                Đồ Ăn
              </li>
            </ul>
          </div>
          <div
            className={`bg-white shadow-xl  rounded-full ${
              theme.mode ? "border-b-2 border-black/25" : "text-black"
            } flex items-center px-2`}
          >
            <AiOutlineSearch size={20} />
            <input
              className={`bg-transparent rounded-full p-2 min-w-[200px] duration-200 ease-in focus:min-w-[400px] outline-none ${
                theme.mode ? "" : "bg-white text-black"
              } focus:outline-none w-full`}
              type="text"
              placeholder="Tìm kiếm"
              name=""
              id=""
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-full mx-auto">
          <ul className="flex font-bold  items-center text-center">
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[100px]`}
            >
              #
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[200px]`}
            >
              Mã Sản Phẩm
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[400px]`}
            >
              Tên Sản Phẩm
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[200px]`}
            >
              Loại Sản Phẩm
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[200px]`}
            >
              Đơn Giá
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[300px]`}
            >
              Chức Năng
            </li>
          </ul>
          {products?.map((product) => (
            <ul key={product.id} className={`flex `}>
              <li
                className={`border py-2 px-4 ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } w-[100px] flex items-center justify-center`}
              >
                {product.id}
              </li>
              <li
                className={`border py-2 px-4 w-[200px] flex items-center ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } justify-center`}
              >
                {`SP${product.id}`}
              </li>
              <li
                className={`border py-2 px-4 w-[400px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center justify-start`}
              >
                <img
                  className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                  src={product.imageUrl}
                  alt=""
                />
                {product.name}
              </li>
              <li
                className={`border py-2 px-4 w-[200px] flex items-center ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } justify-center`}
              >
                {product.category.id == 1 ? "Đồ ăn" : "Thức uống"}
              </li>
              <li
                className={`border py-2 px-4 w-[200px] flex items-center ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } justify-center`}
              >
                {formatCostNumber(product.cost)}
              </li>
              <li
                className={`border py-2 px-4 w-[300px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center font-semibold justify-around`}
              >
                <button
                  className="p-2 bg-red-400  hover:opacity-80  w-[100px] border rounded-xl"
                  onClick={() => {
                    setShow(true);
                    setStatus("Popup");
                    setId(product.id);
                  }}
                >
                  Xóa
                </button>
                <button
                  onClick={() => {
                    handleSetData(product.id);
                  }}
                  className="p-2 bg-blue-300  hover:opacity-80  w-[100px] border rounded-xl"
                >
                  Sửa
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
        <MenuAddPage
          handleCloseForm={handleCloseForm}
          listIngredient={listIngredient}
          handleGetItems={handleGetItems}
          data={[]}
        />
      </>
    );
  }
  if (show && status === "Edit") {
    return (
      <>
        <MenuEditPage
          handleCloseForm={handleCloseForm}
          listIngredient={listIngredient}
          handleGetItems={handleGetItems}
          data={data}
        />
      </>
    );
  }
  if (show && status === "Popup") {
    return (
      <>
        <ModalPopup
          handleCloseForm={handleCloseForm}
          handleDeleteMenu={handleDeleteMenu}
          id={id}
        />
      </>
    );
  }
};

export default MenuManagePage;
