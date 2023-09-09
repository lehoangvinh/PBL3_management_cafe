import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ThemeContext } from "./Navbar";
import IngredientAddPage from "./IngredientAddPage";
import IngredientEditPage from "./IngredientEditPage";
import { PaginationControl } from "react-bootstrap-pagination-control";
import axios from "axios";
import { formatCostNumber, fomatQuantity } from "../utils/helper";
import ModalPopup from "./ModalPopup";
import NotFound from "./NotFound";

const Ingredient = () => {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleGetData = (data) => {
    setShow(true);
    setStatus("Edit");
    setData(data);
  };

  const [products, setProducts] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);

  const token = localStorage.getItem("token");

  const handleGetItems = () => {
    axios
      .get(
        `products?page=${
          currentPage - 1
        }&size=${postsPerPage}&keyword=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        }
      )
      .then((res) => {
        setProducts(() => res.data.content);
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
        }
      });
  };

  useEffect(() => {
    handleGetItems();
  }, [currentPage, search]);

  const handleDeleteIngredient = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}}`,
      },
    });
    handleGetItems();
  };

  //----------------------------------------------------------------

  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  const [currentFilterType, setDataFilterType] = useState("All");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [id, setId] = useState(0);
  useEffect(() => {
    document
      .querySelectorAll("li[name]")
      .forEach((item) => item?.classList.remove("active"));
    document
      .querySelectorAll("li[name]")
      .forEach((item) =>
        item.innerHTML === currentFilterType
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
                className={`shadow-xl py-2 px-4 mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer hover:opacity-60 active ${
                  theme.mode ? "" : "bg-white text-black"
                }`}
              >
                Thêm
              </li>
            </ul>
          </div>

          <div
            className={`shadow-xl bg-white rounded-full ${
              theme.mode ? "border-b-2 border-black/25" : "text-black"
            } flex items-center px-2`}
          >
            <AiOutlineSearch size={20} />
            <input
              className={`bg-transparent rounded-full p-2 min-w-[200px] duration-200 ease-in focus:min-w-[300px] outline-none ${
                theme.mode ? "" : "bg-white text-black"
              } focus:outline-none w-full`}
              type="text"
              placeholder="Tìm kiếm"
              name=""
              id=""
              value={search || ""}
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
              } py-2 px-4 min-w-[400px]`}
            >
              Tên Sản Phẩm
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
              } py-2 px-4 min-w-[200px]`}
            >
              Tồn kho
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[150px]`}
            >
              Đơn vị
            </li>
            <li
              className={`border ${
                theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
              } py-2 px-4 min-w-[350px]`}
            >
              Chức Năng
            </li>
          </ul>

          {products?.map((product) => (
            <ul key={product.id} className={`flex `}>
              <li
                className={`border py-2 px-4 w-[100px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center justify-center`}
              >
                {`NL${product.id}`}
              </li>

              <li
                className={`border py-2 px-4 w-[400px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center justify-start`}
              >
                <img
                  className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                  src={product.imageUrl ? product.imageUrl : "./imageTemp.png"}
                  alt=""
                />
                {product.name}
              </li>
              <li
                className={`border py-2 px-4 w-[200px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center justify-center`}
              >
                {formatCostNumber(product.cost)}
              </li>
              <li
                className={`border py-2 px-4 w-[200px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center justify-center`}
              >
                {fomatQuantity(product.quantity)}
              </li>
              <li
                className={`border py-2 px-4 w-[150px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center justify-center`}
              >
                {product.unit}
              </li>
              <li
                className={`border py-2 px-4 w-[350px] ${
                  theme.mode ? "bg-white" : "bg-transparent"
                } flex items-center font-semibold justify-around`}
              >
                <button
                  className="p-2 bg-red-400  hover:opacity-80  w-[100px] border rounded-xl"
                  onClick={() => {
                    // handleDeleteIngredient(product.id);
                    setId(product.id);
                    setShow(true);
                    setStatus("PopUp");
                  }}
                >
                  Xóa
                </button>
                <button
                  onClick={() => {
                    handleGetData({
                      name: product.name,
                      id: product.id,
                      unit: product.unit,
                      cost: product.cost,
                      image: product.imageUrl,
                      quantity: product.quantity,
                    });
                  }}
                  className="p-2 bg-blue-300  hover:opacity-80  w-[100px] border rounded-xl"
                >
                  Sửa
                </button>
              </li>
            </ul>
          ))}
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
      </div>
    );
  }
  if (show && status === "Add") {
    return (
      <>
        <IngredientAddPage
          handleCloseForm={handleCloseForm}
          handleGetItems={handleGetItems}
        />
      </>
    );
  }
  if (show && status === "Edit") {
    return (
      <>
        <IngredientEditPage
          handleCloseForm={handleCloseForm}
          data={data}
          handleGetItems={handleGetItems}
        />
      </>
    );
  }
  if (show && status === "PopUp") {
    return (
      <>
        <ModalPopup
          handleCloseForm={handleCloseForm}
          handleDeleteMenu={handleDeleteIngredient}
          id={id}
        />
      </>
    );
  }
};

export default Ingredient;
