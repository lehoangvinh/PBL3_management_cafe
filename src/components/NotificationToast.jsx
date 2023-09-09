import React, { useContext } from "react";
import { ThemeContext } from "./Navbar";
import { Link, useNavigate } from "react-router-dom";

export const NotificationToast = ({ text, slug }) => {
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  console.log(theme);
  // const navigate = useNavigate();
  return (
    <div className="pl-3 py-2 relative">
      <Link to={slug}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="capitalize font-semibold">Thông báo mới</h3>
          <i
            onClick={(e) => e.preventDefault()}
            className="fa fa-times cursor-pointer w-[30px] h-[30px] rounded-3xl flex items-center justify-center bg-[#f0f2f5] text-sm"
          ></i>
        </div>
        <div className="flex items-start">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
              alt=""
              className="w-[60px] h-[60px] rounded-[60px] object-cover"
            />
          </div>
          <div className="w-[calc(100%-60px)] pl-5 leading-5">
            <p className="notification-text">{text}</p>
            <span className="text-[#1876f2] font-semibold text-sm">
              a few seconds ago
            </span>
          </div>
          <span className="absolute right-[15px] top-[50%] w-[15px] h-[15px] bg-[#1876f2] rounded-full"></span>
        </div>
      </Link>
    </div>
  );
};
