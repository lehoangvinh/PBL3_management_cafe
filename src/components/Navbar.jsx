import React, { useState } from "react";
import {
  AiOutlineUnorderedList,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineCreditCard,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsSun, BsMoon } from "react-icons/bs";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { createContext } from "react";
import { useAuth } from "../context/auth.context";
export const ThemeContext = createContext(null);
const Navbar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  function stringToBoolean(str) {
    const trimmedString = str?.trim().toLowerCase();
    return trimmedString === "true" || trimmedString === "1";
  }
  const [mode, setMode] = useState(
    stringToBoolean(localStorage.getItem("theme")) ?? true
  );
  const { role, logout } = useAuth();
  // role: ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER
  // const role = "ROLE_ADMIN";
  const staffItems = [
    {
      path: "/",
      name: "Order",
      icon: <AiOutlineCreditCard size={20} />,
    },
  ];
  const adminItems = [
    {
      path: "/",
      name: "Thống Kê",
      icon: <AiOutlineHome size={20} />,
    },
    {
      path: "/staff",
      name: "Nhân Viên",
      icon: <AiOutlineUser size={20} />,
    },
    {
      path: "/menu",
      name: "Thực Đơn",
      icon: <AiOutlineUnorderedList size={20} />,
    },
    {
      path: "/bill",
      name: "Hóa Đơn",
      icon: <AiOutlineCreditCard size={20} />,
    },
    {
      path: "/ingredient",
      name: "Nguyên Liệu",
      icon: <AiOutlineShoppingCart size={20} />,
    },
    {
      path: "/import",
      name: "Nhập Hàng",
      icon: <AiOutlineShoppingCart size={20} />,
    },
  ];
  if (
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/reset-password"
  ) {
    return (
      <ThemeContext.Provider value={{ mode, setMode }}>
        <div className="flex">
          <div
            className={`min-h-screen w-[300px] border-r-2 relative font-semibold duration-300 ${
              mode ? "bg-white text-gray-700" : "bg-[#1f1f1f] text-white"
            }`}
          >
            <div className="flex items-center justify-center py-6 border-b-2">
              <h1 className="text-xl font-bold">Hệ Thống Quản Lý</h1>
            </div>
            <div className="flex p-6">
              <p className="text-sm">Danh Mục Quản Lý</p>
            </div>
            <nav className="list-none mx-6">
              {role === "ROLE_ADMIN"
                ? adminItems?.map((item, index) => (
                    <NavLink
                      to={item.path}
                      key={index}
                      className={`flex rounded-xl  ${
                        mode
                          ? "[&.active]:bg-blue-400  [&.active]:font-bold"
                          : "[&.active]:bg-white [&.active]:text-black [&.active]:font-bold"
                      } items-center mb-4 p-2`}
                    >
                      {item.icon}
                      <span className="ml-4">{item.name}</span>
                    </NavLink>
                  ))
                : staffItems?.map((item, index) => (
                    <NavLink
                      to={item.path}
                      key={index}
                      className={`flex rounded-xl  ${
                        mode
                          ? "[&.active]:bg-blue-400  [&.active]:font-bold"
                          : "[&.active]:bg-white [&.active]:text-black [&.active]:font-bold"
                      } items-center mb-4 p-2`}
                    >
                      {item.icon}
                      <span className="ml-4">{item.name}</span>
                    </NavLink>
                  ))}
            </nav>
            <div className="absolute w-full bottom-10 flex p-6 items-center cursor-pointer mx-6">
              <AiOutlineShoppingCart size={20} />
              <span
                className="ml-4"
                onClick={() => {
                  logout();
                  navigate("/signin");
                }}
              >
                Đăng xuất
              </span>
            </div>
            <div className="absolute w-full bottom-0 p-4 border-t-2 flex items-center cursor-pointer justify-center">
              <BsSun size={20} />
              <span
                onClick={() => {
                  setMode(!mode);
                  mode
                    ? localStorage.setItem("theme", false)
                    : localStorage.setItem("theme", true);
                }}
                className={`w-[50px] mx-3 h-[20px] border border-neutral-900 rounded-full relative flex items-center duration-300 ${
                  mode ? "  bg-[#1f1f1f]" : " bg-white"
                }`}
              >
                <div
                  className={`mx-[.5] w-[18px]  absolute h-[18px] border bg-white border-neutral-900 duration-1000 ease-out rounded-full ${
                    mode ? "left-0" : " right-0"
                  }`}
                ></div>
              </span>
              <BsMoon size={20} />
            </div>
          </div>
          <main
            className={`w-full duration-300 ${
              mode ? "" : "bg-[#1f1f1f] text-white"
            }`}
          >
            {children}
          </main>
        </div>
      </ThemeContext.Provider>
    );
  } else {
    return (
      <main
        className={`w-full duration-300 ${
          mode ? "" : "bg-[#1f1f1f] text-white"
        }`}
      >
        {children}
      </main>
    );
  }
};

export default Navbar;
