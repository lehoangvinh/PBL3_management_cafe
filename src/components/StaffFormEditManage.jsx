import React, { useContext, useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  isValidCost,
  isValidNumber,
  isValidData,
  isValidEmail,
  isValidPhoneNumber,
  isValidDate,
} from "../utils/helper";
import { ThemeContext } from "./Navbar";
import { toast } from "react-toastify";
import axios from "axios";
const StaffFormEditManage = (props) => {
  const [userId, setuserId] = useState(props.data?.userId);
  const [fname, setFName] = useState(props.data?.firstname);
  const [lname, setLName] = useState(props.data?.lastname);
  const [email, setEmail] = useState(props.data?.email);
  const [phoneNumber, setPhoneNumber] = useState(
    props.data?.phoneNumber || "0978961783"
  );
  const [dayStart, setDayStart] = useState(props.data?.startDate);
  const [shift, setShift] = useState(props.data?.shift);
  const originId = props.data?.shiftId;
  const [shiftId, setShiftId] = useState(props.data?.shiftId);
  const [salary, setSalary] = useState(props.data?.salary);
  const token = localStorage.getItem("token");

  const ValidData = () => {
    const fields = [
      { selector: ".firstNameError", isValid: isValidData(fname) },
      { selector: ".lastNameError", isValid: isValidData(lname) },
      { selector: ".emailError", isValid: isValidEmail(email) },
      {
        selector: ".phoneNumberError",
        isValid: isValidPhoneNumber(phoneNumber),
      },
      { selector: ".daystartError", isValid: isValidDate(dayStart) },
      { selector: ".salaryError", isValid: isValidCost(salary) },
    ];

    fields.forEach((field, index) => {
      const errorElement = document.querySelector(field.selector);
      if (!field.isValid) {
        errorElement.style.display = "block";
        fields.slice(0, index).forEach((prevField) => {
          const prevErrorElement = document.querySelector(prevField.selector);
          prevErrorElement.style.display = "none";
        });
      } else {
        errorElement.style.display = "none";
      }
    });

    if (fields.every((field) => field.isValid)) {
      contentPut({
        userId,
        fname,
        lname,
        email,
        phoneNumber,
        salary,
        dayStart,
        shift,
        shiftId,
      });
    }
  };

  const contentPut = (a) => {
    const staffInfor = {
      firstname: a.fname,
      lastname: a.lname,
      phoneNumber: a.phoneNumber,
    };

    const staffShift = {
      userId: a.userId,
      shiftId: originId,
      salary: a.salary,
      startDate: a.dayStart,
      newShiftId: a.shiftId,
    };

    handleUpdate(staffInfor, staffShift);
  };

  const handleUpdate = async (staffInfor, staffShift) => {
    await axios
      .put(`users/${staffShift.userId}`, staffInfor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((err) => console.log(err));

    await axios
      .put(`time-sheets`, staffShift, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Cập nhật thông tin thành công");
        props.handleGetStaff();
        props.handleCloseForm(false);
      })
      .catch((err) => toast.error("Email thực sự đã được đăng ký"));
  };

  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  return (
    <div
      className={`ml-[125px] w-[600px] rounded-xl popup ${
        theme.mode ? "border-2 shadow-lg" : "border-2 border-white shadow-lg"
      } min-h-[300px] text-black bg-white fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`}
    >
      <div className="flex items-center border-b-2 border-teal-400 justify-between">
        <h3 className="p-3 font-semibold ">Nhân viên</h3>
        <AiOutlineCloseCircle
          onClick={props.handleCloseForm}
          size={25}
          className="mr-3 cursor-pointer fill-red-600"
        />
      </div>
      <div>
        <form
          action=""
          className="py-4 px-8 w-full flex flex-col gap-4 border-b-2 border-teal-400"
        >
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Họ
            </label>
            <input
              value={fname}
              type="text"
              className="border w-[350px] py-2 px-3 invalid:border-red-600"
              required
              onChange={(e) => {
                setFName(e.target.value);
              }}
            />
          </div>
          <div className="firstNameError hidden flex w-full min-h-[40px] items-center">
            <label
              htmlFor=""
              className=" text-red-600  w-[350px] px-3 float-right font-semibold"
            >
              Vui lòng nhập tên hợp lệ !
            </label>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Tên
            </label>
            <input
              value={lname}
              type="text"
              className="border w-[350px] py-2 px-3 invalid:border-red-600"
              required
              onChange={(e) => {
                setLName(e.target.value);
              }}
            />
          </div>
          <div className="lastNameError hidden flex w-full min-h-[40px] items-center">
            <label
              htmlFor=""
              className=" text-red-600  w-[350px] px-3 float-right font-semibold"
            >
              Vui lòng nhập tên hợp lệ !
            </label>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Email
            </label>
            <input
              value={email}
              type="email"
              className="border w-[350px] py-2 px-3 invalid:border-red-600"
              required
              readOnly
            />
          </div>
          <div className=" emailError hidden flex w-full min-h-[40px] items-center">
            <label
              htmlFor=""
              className=" text-red-600  w-[350px] px-3 float-right font-semibold"
            >
              Vui lòng nhập email hợp lệ !
            </label>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Số điện thoại
            </label>
            <input
              value={phoneNumber}
              type="text"
              className="border w-[350px] py-2 px-3 invalid:border-red-600"
              required
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>
          <div className=" phoneNumberError hidden flex w-full min-h-[40px] items-center">
            <label
              htmlFor=""
              className=" text-red-600  w-[350px] px-3 float-right font-semibold"
            >
              Vui lòng nhập số điện thoại hợp lệ !
            </label>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Ngày vào làm
            </label>
            <input
              value={dayStart}
              type="date"
              className="border w-[350px] py-2 px-3"
              onChange={(e) => {
                setDayStart(e.target.value);
              }}
            />
          </div>
          <div className=" daystartError hidden flex w-full min-h-[40px] items-center">
            <label
              htmlFor=""
              className=" text-red-600  w-[350px] px-3 float-right font-semibold"
            >
              Vui lòng nhập ngày vào làm hợp lệ !
            </label>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Ca làm
            </label>
            <select
              className="form-select appearance-none w-[350px] px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              aria-label="Default select example"
              onChange={(e) => {
                setShiftId(e.target.value);
                setShift(
                  e.target.options[e.target.selectedIndex].getAttribute(
                    "data-shift"
                  )
                );
              }}
            >
              <option selected value={shiftId} data-shift={shift}>
                {shift}
              </option>
              <option value="1" data-shift="Ca Sáng">
                Ca Sáng
              </option>
              <option value="2" data-shift="Ca Chiều">
                Ca Chiều
              </option>
              <option value="3" data-shift="Ca Tối">
                Ca Tối
              </option>
              <option value="4" data-shift="Ca Đêm">
                Ca Đêm
              </option>
            </select>
          </div>
          <div className="flex w-full min-h-[40px] items-center justify-between">
            <label htmlFor="" className="">
              Tiền lương
            </label>
            <input
              value={salary}
              type="number"
              className="border w-[350px] py-2 px-3 invalid:border-red-600"
              required
              onChange={(e) => {
                setSalary(e.target.value);
              }}
            />
          </div>
          <div className=" salaryError hidden flex w-full min-h-[40px] items-center">
            <label
              htmlFor=""
              className=" text-red-600  w-[350px] px-3 float-right font-semibold"
            >
              Vui lòng nhập lương hợp lệ !
            </label>
          </div>
        </form>
      </div>
      <div>
        <div className="flex gap-4 justify-end mr-8 py-2">
          <button
            onClick={props.handleCloseForm}
            className={`px-4 ${
              theme.mode ? "" : "text-white"
            } py-2 hover:opacity-80 border rounded-xl text-gray-700 font-medium bg-red-400`}
          >
            Hủy
          </button>
          <button
            onClick={() => {
              ValidData();
            }}
            className={`px-4 ${
              theme.mode ? "" : "text-white"
            } py-2 hover:opacity-80 border rounded-xl text-gray-700 font-medium bg-blue-300`}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffFormEditManage;
