import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./Navbar";
import { unitConst, payment } from "../constants/unit.const";
import {
  formatDate,
  formatCostNumber,
  isValidData,
  isValidNumber,
} from "../utils/helper";
import { PaginationControl } from "react-bootstrap-pagination-control";
import axios from "axios";
import { toast } from "react-toastify";
const ImportAddPage = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [totalProducts, setTotalProducts] = useState(1);
  const [productsToSelect, setProductsToSelect] = useState(props.products);
  // list to select products
  const [products, setProducts] = useState(props.products);
  // list ingres in DB
  const [listIngre, setListIngre] = useState([]);
  //list ingre to import
  const [listSupplier, setListSupplier] = useState([]);
  // list supplier in DB
  const [seletedIngre, setSeletedIngre] = useState(props.products[0]);
  // ingre selected
  const [quantity, setQuantity] = useState("");
  const [paymentBy, setPaymentBy] = useState(payment[0]);
  const [supplier, setSupplier] = useState();
  const token = localStorage.getItem("token");

  const handleAddIngredients = (prod) => {
    const newList = [...listIngre];
    const index = newList.findIndex((obj) => obj.id === prod.id);
    if (index !== -1) {
      newList[index] = {
        ...newList[index],
        quantity: (
          parseFloat(newList[index].quantity) + parseFloat(prod.quantity)
        ).toFixed(3),
        totalCost:
          parseInt(newList[index].totalCost) + parseInt(prod.totalCost),
      };
    } else {
      newList.push(prod);
    }

    setListIngre(newList);
  };

  const handleGetSupplier = () => {
    axios
      .get(`suppliers?size=50`, {
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      })
      .then((res) => {
        setSupplier(() => res.data.content[0].id);
        setListSupplier(() => res.data.content);
      })
      .catch((err) => {
        console.log("Error::", err);
      });
  };
  const handleRemoveIngre = (id) => {
    const tmp = listIngre.filter((item) => {
      return item.id !== id;
    });
    setListIngre(tmp);
  };
  useEffect(() => {
    handleGetSupplier();
  }, []);

  const handleGetItemById = (id) => {
    return products.find((product) => product.id == id);
  };

  const contentPost = (a) => {
    const purchaseOrderDetails = a.map((ingredient) => {
      return {
        productId: ingredient.id,
        quantity: ingredient.quantity,
      };
    });
    const order = {
      supplierId: supplier,
      payment: paymentBy,
      purchaseOrderDetails: purchaseOrderDetails,
    };
    handleImport(order);
  };
  const handleImport = (contentPost) => {
    axios
      .post("purchase-orders", contentPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("post success");
        toast.success("Thêm thành công");
        props.handleCloseForm();
      })
      .catch((err) => console.log(err));
  };

  // ----------------------------------------------------------------
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");

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
      className={`m-auto max-w-[1440px] w-full grid grid-cols-3 gap-4 px-4 py-12 `}
    >
      <div
        className={`col-span-2 w-full shadow-xl border-2 rounded-xl ${
          theme.mode ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="flex p-3 w-full items-center justify-between border-b-2">
          <label htmlFor="" className="">
            Tên sản phẩm
          </label>
          <select
            className="bg-transparent border rounded-xl px-3 min-w-[250px] min-h-[40px]"
            aria-label="Default select example"
            onChange={(e) => {
              setSeletedIngre(handleGetItemById(e.target.value));
            }}
          >
            {productsToSelect.map((item) => (
              <option
                className="bg-transparent text-black"
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <label htmlFor="" className="">
            Số lượng
          </label>
          <input
            type="number"
            min={0}
            className="border max-w-[100px] py-2 px-3 invalid:border-red-600"
            required
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />

          <label htmlFor="" className="">
            Đơn vị
          </label>
          <div
            className="bg-transparent border rounded-xl px-3 min-w-[150px] min-h-[40px] text-black  text-center items-stretch"
            aria-label="Default select example"
          >
            <p
              className={`leading-10 ${
                theme.mode ? "bg-[transparent]" : "bg-[#1f1f1f] text-white"
              }`}
              aria-label="Default select example"
            >
              {seletedIngre.unit}
            </p>
          </div>
          <div>
            <ul className="flex">
              <li
                onClick={() => {
                  !seletedIngre.id || !isValidNumber(quantity)
                    ? toast.error("Hãy nhập số lượng hợp lệ!")
                    : handleAddIngredients({
                        id: seletedIngre.id,
                        productName: seletedIngre.name,
                        quantity: quantity,
                        unit: seletedIngre.unit,
                        totalCost: seletedIngre.cost * quantity,
                        image: seletedIngre.imageUrl,
                        productCost: seletedIngre.cost,
                      });
                }}
                className={`py-2 px-4 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer active ${
                  theme.mode ? "" : "bg-white text-black"
                }`}
              >
                Thêm
              </li>
            </ul>
          </div>
        </div>
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
                Đơn Giá
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
                Tổng tiền
              </li>
              <li
                className={` ${
                  theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
                } py-2 px-4 min-w-[150px]`}
              >
                Chức năng
              </li>
            </ul>
            {listIngre
              .slice(
                (currentPage - 1) * postsPerPage,
                (currentPage - 1) * postsPerPage + postsPerPage
              )
              .map((ingredient) => (
                <ul className="my-2 flex border-2 rounded-xl shadow-xl text-sm">
                  <li className="py-2 px-4 w-[200px] flex items-center justify-start">
                    <img
                      className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                      src={ingredient.image}
                      alt="Product Img"
                    />
                    {ingredient.productName}
                  </li>
                  <li className="py-2 px-4 w-[110px] flex items-center justify-center">
                    {ingredient.quantity}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center justify-center">
                    {formatCostNumber(ingredient.productCost)}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center justify-center">
                    {ingredient.unit}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center justify-center">
                    {formatCostNumber(ingredient.totalCost)}
                  </li>
                  <li className="py-2 px-4 w-[150px] flex items-center font-semibold justify-around">
                    <button
                      className="p-2 bg-red-400  hover:opacity-80  w-[100px] border rounded-xl"
                      onClick={() => {
                        handleRemoveIngre(ingredient.id);
                      }}
                    >
                      Xóa
                    </button>
                  </li>
                </ul>
              ))}
          </div>
          <div className="my-4">
            <PaginationControl
              page={currentPage}
              between={4}
              total={listIngre.length}
              limit={postsPerPage}
              changePage={(page) => {
                setCurrentPage(page);
              }}
              ellipsis={1}
            />
          </div>
        </div>
      </div>
      <div
        className={`h-[500px] flex flex-col justify-center shadow-xl border-2 rounded-xl py-4 px-8 ${
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
          <select
            className="bg-transparent border rounded-xl px-3 min-w-[200px] min-h-[40px]"
            aria-label="Default select example"
            onChange={(e) => {
              setSupplier(e.target.value);
            }}
          >
            {listSupplier.map((item) => (
              <option className="bg-transparent text-black" value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between border-b-2 py-6">
          <label htmlFor="" className="">
            Tổng tiền hàng
          </label>
          <span>
            {formatCostNumber(
              listIngre.reduce((acc, cur) => acc + cur.totalCost, 0)
            )}
          </span>
        </div>
        <div className="flex items-center justify-between border-b-2 py-6">
          <label htmlFor="" className="">
            Phương thức thanh toán
          </label>
          <select
            className="bg-transparent border rounded-xl px-3 min-w-[200px] min-h-[40px]"
            aria-label="Default select example"
            onChange={(e) => {
              setPaymentBy(e.target.value);
            }}
          >
            {payment.map((item) => (
              <option className="bg-transparent text-black" value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="sticky -bottom-1 flex items-center justify-end my-3 py-4 col-span-3  border-gray-200 ">
          <div className="flex items-center  w-[450px] justify-around">
            <button
              onClick={props.handleCloseForm}
              // className="min-w-[100px] rounded-lg bg-red-400 border   hover:opacity-80  h-9 px-3 mr-8 py-2 text-sm "
              className="min-w-[100px] rounded-lg bg-red-400 border   hover:opacity-80  h-9 px-3 mr-8 py-2 text-sm "
              type="button"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                listIngre.length
                  ? contentPost(listIngre)
                  : toast.error("Vui lòng thêm danh sách nguyên liệu");
              }}
              className="min-w-[100px] rounded-lg bg-blue-300 border hover:opacity-80 h-9 px-3 py-2 text-sm"
              type="submit"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportAddPage;
