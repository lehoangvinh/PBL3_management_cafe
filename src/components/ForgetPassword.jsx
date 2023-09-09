import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineArrowRight } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`/auth/reset-password?email=${email}`);
      setLoading(false);
      toast.success("Mật khẩu đã gửi đến email của bạn");
    } catch (err) {
      toast.error("Không tìm thấy email!!!");
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container w-full h-screen max-w-[1920px]">
        <div className="w-full m-auto max-w-[1440px] select-none">
          <div
            className="m-6 grid grid-cols-10 bg-gray-400 h-[700px] rounded-[35px]  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-gray-100"
            style={{ color: "white" }}
          >
            <div className="col-span-10 md:col-span-6 rounded-tl-[35px] flex flex-col gap-4 items-center mt-16 rounded-bl-[35px]">
              <h1 className="text-4xl py-6 text-center">Khôi phục tài khoản</h1>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex justify-center items-center flex-col gap-4"
              >
                <div className="flex flex-col my-2">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Email"
                    type="email"
                    name=""
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="border-2 mt-4 hover:opacity-60 rounded-full w-[50px] h-[50px] grid place-items-center"
                >
                  <AiOutlineArrowRight />
                </button>
              </form>
              <span>
                <Link to={"/signin"} className="text-blue-100">
                  Quay trở lại trang Đăng nhập
                </Link>
              </span>
              <div className="mt-20 flex flex-col">
                <span>
                  Chưa có tài khoản ?{" "}
                  <Link to={"/signup"} className="text-blue-400">
                    Đăng ký ngay !
                  </Link>
                </span>
              </div>
            </div>
            <div className="hidden md:col-span-4 md:block h-[700px]">
              <img className="w-full h-full" src="/img1.png" alt="anh"></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
