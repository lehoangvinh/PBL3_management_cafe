import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./Navbar";
import { unitConst } from "../constants/unit.const";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fomatQuantity, isValidData, isValidNumber } from "../utils/helper";
import axios from "axios";
const IngredientEditPage = (props) => {
  const [name, setName] = useState(props.data?.name);
  const [id, setId] = useState(props.data?.id);
  const [cost, setCost] = useState(props.data?.cost);
  const [quantity, setQuantity] = useState(props.data?.quantity);
  const [unit, setUnit] = useState(props.data?.unit);

  const token = localStorage.getItem("token");
  const handleUpdateProduct = (updateIngredient) => {
    axios
      .put(`products/${props.data.id}`, updateIngredient, {
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      })
      .then((response) => {
        toast.success("Cập nhật thành công");
        props.handleCloseForm();
        props.handleGetItems();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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
  //   ------------------------------

  const [image, setImage] = useState(props.data?.image);
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
      className={` max-w-[1440px] w-full grid grid-cols-3 gap-4 h-[600px] px-4 py-12 mt-[150px]`}
    >
      <div
        className={`col-span-2  shadow-xl border-2 rounded-xl items-center justify-center h-[505px] ${
          theme.mode ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="flex flex-col my-auto mt-[100px]">
          <form action="" className="py-4 px-8 w-full flex flex-col gap-4 ">
            <div className="flex w-full min-h-[40px] items-center justify-between ">
              <label htmlFor="" className="">
                Tên sản phẩm
              </label>

              <input
                value={name || ""}
                type="text"
                className="border w-[550px] py-2 px-3 invalid:border-red-600"
                required
                onChange={(e) => {
                  var str = e.target.value.trim();
                  str =
                    e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1);
                  setName(str);
                }}
              />
            </div>

            <div className=" nameIngredientError hidden flex w-full min-h-[40px] items-center justify-between ">
              <label
                htmlFor=""
                className=" text-red-600  w-[550px] px-3 float-right font-semibold"
              >
                Vui lòng nhập tên hợp lệ !
              </label>
            </div>

            <div className="flex w-full min-h-[40px] items-center justify-between">
              <label htmlFor="" className="">
                Đơn vị
              </label>
              <select
                className="bg-transparent min-h-[40px] border w-[550px]"
                aria-label="Default select example"
                onChange={(e) => {
                  setUnit(e.target.value);
                }}
              >
                <option className="bg-transparent text-black" value={unit}>
                  {unit}
                </option>
                {unitConst.map((item) => (
                  <option className="bg-transparent text-black" value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full min-h-[40px] items-center justify-between">
              <label htmlFor="" className="">
                Số lượng
              </label>
              <input
                value={fomatQuantity(quantity) || 0}
                // type="number"
                min={0}
                className="border w-[550px] invalid:border-red-600 py-2 px-3"
                required
              />
            </div>
            <div className="flex w-full min-h-[40px] items-center justify-between">
              <label htmlFor="" className="">
                Giá sản phẩm
              </label>

              <input
                value={cost}
                type="number"
                min={0}
                className="border w-[550px] py-2 px-3 invalid:border-red-600"
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
          <div className="flex items-center justify-end py-4 col-span-3  border-gray-200 float-right">
            <div className="flex items-center w-[550px] justify-evenly float-right mx-8">
              <button
                onClick={props.handleCloseForm}
                className="min-w-[100px] rounded-lg bg-red-400 border   hover:opacity-80  h-9 px-3 py-2 text-sm "
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const nameIngredient = document.querySelector(
                    ".nameIngredientError"
                  );
                  const costIngredient = document.querySelector(
                    ".costIngredientError"
                  );
                  if (!isValidData(name)) {
                    nameIngredient.style.display = "block";
                    costIngredient.style.display = "none";
                  } else if (!isValidNumber(cost)) {
                    costIngredient.style.display = "block";
                    nameIngredient.style.display = "none";
                  } else {
                    costIngredient.style.display = "none";
                    handleUpdateProduct({
                      id: id,
                      name: name,
                      cost: cost,
                      imageUrl: image,
                      unit: unit,
                    });
                  }
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
      <div
        className={`min-h-[400px] flex flex-col justify-center shadow-xl border-2 rounded-xl py-4 px-8 ${
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
                  src={
                    image
                      ? image
                      : "https://th.bing.com/th/id/OIP.jRUsfeTB-brrm-3lbqBjugHaKn?pid=ImgDet&rs=1"
                  }
                  alt="anh san pham"
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
      </div>
    </div>
  );
};

export default IngredientEditPage;
