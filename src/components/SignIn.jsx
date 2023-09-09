import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineArrowRight } from "react-icons/ai";
import { useAuth } from "../context/auth.context";
const SignIn = () => {
  const { login, setState } = useAuth();
  const [error, setError] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleShowPassword = () => {
    document.querySelector("#input-pass").type === "text"
      ? (document.querySelector("#input-pass").type = "password")
      : (document.querySelector("#input-pass").type = "text");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      setState(res.data.accessToken);
      localStorage.setItem("token", res.data.accessToken);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="container w-full h-screen max-w-[1920px]">
        <div className="w-full m-auto max-w-[1440px] select-none">
          <div
            className="m-6 grid grid-cols-10 bg-gray-400 h-[700px] rounded-[35px]  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-gray-100"
            style={{ color: "white" }}
          >
            <div className="col-span-10 md:col-span-6 rounded-tl-[35px] flex flex-col gap-4 items-center mt-16 rounded-bl-[35px]">
              <h1 className="text-4xl py-6 text-center">Đăng Nhập</h1>
              <form
                action=""
                className="flex justify-center items-center flex-col gap-4"
                onSubmit={(e) => handleSignIn(e)}
              >
                <div className="flex flex-col my-2">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Nhập username"
                    type="text"
                    name=""
                    id=""
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <span className="text-[#FA9884]">
                    {error?.usernameOrEmail ||
                      (error?.message ? error?.message : null)}
                  </span>
                </div>
                <div className="flex flex-col my-2 relative">
                  <input
                    className="px-3 border-b rounded-none min-h-[40px]  w-[300px] md:min-w-[350px] focus:outline-none"
                    placeholder="Nhập mật khẩu"
                    type="password"
                    id="input-pass"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <span className="text-[#FA9884]">
                    {error?.password ||
                      (error?.message ? error?.message : null)}
                  </span>
                  <Link
                    to={"/reset-password"}
                    className="text-sm mt-4 text-blue-100"
                  >
                    Quên mật khẩu?
                  </Link>
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
              <div className="mt-14">
                <span>
                  Chưa có tài khoản ?{" "}
                  <Link to={"/signup"} className="text-blue-400">
                    Đăng ký ngay !
                  </Link>
                </span>
              </div>
            </div>
            <div className="hidden md:col-span-4 md:block h-[700px]">
              <img className="w-full h-full" src="/img1.png" alt="i"></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
