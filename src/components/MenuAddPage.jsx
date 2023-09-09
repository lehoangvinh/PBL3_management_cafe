import React, { useContext, useState, useEffect } from "react";
import IngredientInput from "./IngredientInput";
import { toast } from "react-toastify";
import { ThemeContext } from "./Navbar";
import axios from "axios";
import { isValidData, isValidNumber, isValidCost } from "../utils/helper";
const MenuAddPage = (props) => {
  const [name, setName] = useState();
  const [type, setType] = useState("Đồ ăn");
  const [numOfI, setNumOfI] = useState();
  const [idType, setIdType] = useState(1);
  const [ingredients, setIngredients] = useState(props.listIngredient);
  // list ingredients in DB
  const [listIngredients, setListIngredients] = useState();
  // list ingredients made up product
  const [isChanged, setIsChanged] = useState(false);
  const [cost, setCost] = useState();
  const [image, setImage] = useState("imageTemp.png");
  // -----------------------------------------------------------------
  const [data, setData] = useState(() => {});
  // -----------------------------------------------------------------
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  const token = localStorage.getItem("token");

  const handleSetData = (data) => {
    setData(data);
  };
  const uploadFile = (file, token) => {
    const formData = new FormData();
    formData.append("image", file);
    return axios.post("images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("token"); // Lấy token từ local storage hoặc cookies

    uploadFile(file, token)
      .then((response) => setImage(response.data.filename))
      .catch((error) => console.error(error));
  };
  const validData = () => {
    const nameIngredient = document.querySelector(".nameIngredientError");
    const costIngredient = document.querySelector(".costIngredientError");
    const numberIngredient = document.querySelector(".numberIngredientError");

    nameIngredient.style.display =
      !name || !isValidData(name) ? "block" : "none";
    numberIngredient.style.display = !data ? "block" : "none";
    costIngredient.style.display = !isValidNumber(cost) ? "block" : "none";

    if (name && isValidData(name) && data && isValidNumber(cost)) {
      contentPost(data);
    }
  };

  const contentPost = (a) => {
    if (a.length) {
      var isValid = true;
      const Details = a.map((ingredient) => {
        if (!isValidNumber(ingredient.quantity)) isValid = false;
        return {
          productId: ingredient.id,
          quantity: ingredient.quantity,
        };
      });
      if (isValid) {
        handlePost({
          name: name,
          categoryId: idType,
          cost: cost,
          imageUrl: image,
          menuDetails: Details,
        });
      } else toast.error("Vui lòng nhập số lượng của các nguyên liệu phù hợp");
    } else toast.error("Số lượng nguyên liệu không hợp lệ");
  };

  const handlePost = (e) => {
    axios
      .post(`menu`, e, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Thêm thành công");
        props.handleGetItems();
        props.handleCloseForm(false);
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <div
      className={`m-auto max-w-[1440px] w-full grid grid-cols-3 gap-4  px-4 py-12 `}
    >
      <div
        className={`col-span-2 shadow-xl border-2 rounded-xl ${
          theme.mode ? "bg-white" : "bg-transparent"
        }`}
      >
        <form action="" className="py-4 px-8 w-full flex flex-col gap-4 ">
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Tên sản phẩm
            </label>
            <input
              value={name}
              type="text"
              className="border w-[550px] py-2 px-3 invalid:border-red-600"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="nameIngredientError hidden flex w-full min-h-[40px] items-center justify-between ">
            <label
              htmlFor=""
              className=" text-red-600  w-[550px] px-3 float-right font-semibold"
            >
              Vui lòng nhập tên hợp lệ !
            </label>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Loại sản phẩm
            </label>
            <select
              className="bg-transparent px-3 w-[550px] border min-h-[40px]"
              aria-label="Default select example"
              value={idType}
              onChange={(e) => {
                setType(e.target.value == "1" ? "Đồ ăn" : "Thức uống");
                setIdType(e.target.value);
              }}
            >
              <option className="bg-transparent text-black" value={idType}>
                {type}
              </option>
              <option className="bg-transparent text-black" value="2">
                Thức uống
              </option>
              <option className="bg-transparent text-black" value="1">
                Đồ ăn
              </option>
            </select>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Số nguyên liệu tạo thành
            </label>
            <input
              value={numOfI}
              type="number"
              className="border w-[550px] py-2 px-3 invalid:border-red-600"
              onChange={(e) => {
                const numberIngredient = document.querySelector(
                  ".numberIngredientError"
                );
                setIsChanged(true);
                setNumOfI(e.target.value);
                if (!isValidCost(e.target.value)) {
                  numberIngredient.style.display = "block";
                } else {
                  numberIngredient.style.display = "none";
                }
              }}
              required
            />
          </div>
          <div className="numberIngredientError hidden flex w-full min-h-[40px] items-center justify-between ">
            <label
              htmlFor=""
              className=" text-red-600  w-[550px] px-3 float-right font-semibold"
            >
              Vui lòng nhập số lượng nguyên liệu hợp lệ!
            </label>
          </div>
          <div>
            <IngredientInput
              numOfI={numOfI}
              listIngredients={listIngredients}
              ingredients={ingredients}
              isChanged={isChanged}
              handleSetData={handleSetData}
            />
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Giá bán
            </label>
            <input
              value={cost}
              type="number"
              min={0}
              className="border w-[550px] invalid:border-red-600 py-2 px-3"
              required
              onChange={(e) => {
                setCost(e.target.value);
              }}
            />
          </div>
          <div className="costIngredientError hidden flex w-full min-h-[40px] items-center justify-between ">
            <label
              htmlFor=""
              className=" text-red-600  w-[550px] px-3 float-right font-semibold"
            >
              Vui lòng nhập giá hợp lệ !
            </label>
          </div>
        </form>
      </div>
      <div
        className={`sticky -top-1 h-[500px] flex flex-col justify-center shadow-xl border-2 rounded-xl py-4 px-8 ${
          theme.mode ? "bg-white" : "bg-transparent"
        }`}
      >
        <h5 className="font-bold">Hình ảnh sản phẩm</h5>
        <p className="mb-6">Thêm hoặc thay đổi ảnh cho sản phẩm</p>
        <div className="">
          <label className=""></label>
          <div className="">
            <div className="relative p-4 border-[3px] rounded-lg border-dashed hover:border-indigo-600">
              <input
                className="block absolute w-full h-full opacity-0"
                type="file"
                title=""
                onChange={handleFileChange}
              />
              <div className="my-12 text-center">
                <img
                  src={image ? image : "imageTemp.png"}
                  alt=""
                  className="mx-auto my-4 max-w-[120px] max-h-[120px]"
                />
                <p className="font-semibold">
                  <span>Drop your image here, or </span>
                  <span className="text-blue-500">browse</span>
                </p>
                <p className="mt-1 opacity-60">Support: jpeg, png</p>
              </div>
            </div>
          </div>
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
                validData();
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

export default MenuAddPage;
