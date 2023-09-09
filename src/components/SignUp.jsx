import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineArrowRight } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const handleShowPassword = () => {
    document.querySelector("#input-pass").type === "text"
      ? (document.querySelector("#input-pass").type = "password")
      : (document.querySelector("#input-pass").type = "text");
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const reqBody = {
      email,
      phoneNumber: phone,
      firstname,
      lastname,
      username,
      password,
    };
    try {
      const res = await axios.post("/auth/signup", reqBody);
      navigate("/signin");
      toast.success("Bạn đã đăng ký tài khoản thành công");
    } catch (err) {
      setErr(err.response.data);
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
              <h1 className="text-4xl py-6 text-center">Đăng Ký</h1>
              <form
                className="flex justify-center items-center flex-col gap-1"
                onSubmit={(e) => handleSignUp(e)}
              >
                <div className="flex flex-row my-2">
                  <input
                    className="px-3 border-b mr-12 rounded-none min-h-[40px]  w-[100px] md:min-w-[130px] focus:outline-none"
                    placeholder="Họ"
                    type="text"
                    name=""
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[150px] md:min-w-[170px] focus:outline-none"
                    placeholder="Tên"
                    type="text"
                    name=""
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col my-2">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Username"
                    type="text"
                    name=""
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <span className="text-red-400 mt-2">
                    {err?.message?.includes("Username")
                      ? "Username đã được đăng ký"
                      : ""}
                  </span>
                </div>
                <div className="flex flex-col my-2">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Email"
                    type="email"
                    name=""
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="text-red-400 mt-2">
                    {err?.message?.includes("Email")
                      ? "Email đã được đăng ký"
                      : ""}
                  </span>
                </div>
                <div className="flex flex-col my-2">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Số điện thoại"
                    type="tel"
                    name=""
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <span className="text-red-400 mt-2">
                    {err?.phoneNumber
                      ? "Số điện thoại không hợp lệ"
                      : err?.message?.includes("Phone")
                      ? "Số điện thoại đã được đăng ký"
                      : ""}
                  </span>
                </div>
                <div className="flex flex-col my-2 relative">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Mật khẩu"
                    type="password"
                    id="input-pass"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                  {password ? (
                    <AiOutlineEye
                      size={30}
                      className="absolute right-0"
                      onClick={(e) => handleShowPassword(e.target)}
                      id="input-icon"
                    />
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="border-2 mt-4 hover:opacity-60 rounded-full w-[50px] h-[50px] grid place-items-center"
                >
                  <AiOutlineArrowRight />
                </button>
              </form>
              <div className="mt-16 mb-4">
                <span>
                  Đã có tài khoản?{" "}
                  <Link to={"/signin"} className="text-blue-400">
                    Đăng nhập ngay!
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

export default SignUp;
