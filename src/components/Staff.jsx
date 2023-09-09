import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ThemeContext } from "./Navbar";
import StaffFormManage from "./StaffFormManage";
import StaffFormEditManage from "./StaffFormEditManage";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { formatDateShip, formatCostNumber } from "../utils/helper";
import { toast } from "react-toastify";
import axios from "axios";
import ModalPopup from "./ModalPopup";
import NotFound from "./NotFound";
const Staff = () => {
  const [data, setData] = useState();
  const [search, setSearch] = useState("");

  const [staffs, setStaffs] = useState([]);

  //pagination
  const [id, setId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);
  const [listIngredient, setListIngredient] = useState();
  const [currentFilterType, setDataFilterType] = useState("");
  const token = localStorage.getItem("token");
  const [notFound, setNotFound] = useState(false);

  const handleGetStaff = () => {
    axios
      .get(
        `time-sheets/staff?page=${
          currentPage - 1
        }&size=${postsPerPage}&keyword=${search}&sid=${currentFilterType}`,
        {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        }
      )
      .then((res) => {
        setStaffs(res.data.content);
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
        } else toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    handleGetStaff();
  }, [currentPage, search, currentFilterType]);

  const hanldeSetData = (data) => {
    setData(data);
    setShow(true);
    setStatus("Edit");
  };
  const handleDeleteStaff = async (id) => {
    try {
      const res = await axios.delete(`users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      });
      console.log("deleted");
      handleGetStaff();
    } catch (err) {
      console.log(err);
    }
  };
  // ----------------------------------------------------------------
  const theme = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    document
      .querySelectorAll("li[name]")
      .forEach((item) => item?.classList.remove("active"));
    document
      .querySelectorAll("li[name]")
      .forEach((item) =>
        item.getAttribute("name") == currentFilterType
          ? item.classList.add("active")
          : null
      );
  });
  const handleCloseForm = () => {
    setShow(false);
  };

  if (notFound) return <NotFound></NotFound>;

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
              className={`shadow-xl py-2 px-4 hover:opacity-60 mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer active ${
                theme.mode ? "" : "bg-white text-black"
              }`}
            >
              Thêm
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex">
            <li
              onClick={() => {
                setCurrentPage(1);
                setDataFilterType("");
              }}
              name=""
              className={`shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              All
            </li>
            <li
              onClick={() => {
                setCurrentPage(1);
                setDataFilterType(1);
              }}
              name="1"
              className={`shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              Sáng
            </li>
            <li
              onClick={() => {
                setCurrentPage(1);
                setDataFilterType(2);
              }}
              name="2"
              className={`shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              Chiều
            </li>
            <li
              onClick={() => {
                setCurrentPage(1);
                setDataFilterType(3);
              }}
              name="3"
              className={`shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              Tối
            </li>
            <li
              onClick={() => {
                setCurrentPage(1);
                setDataFilterType(4);
              }}
              name="4"
              className={`shadow-xl py-2 px-4 hover:opacity-60 border mx-2 font-semibold rounded-full min-w-[100px] text-center cursor-pointer ${
                theme.mode
                  ? "border-b-2 border-black/25"
                  : " [&.active]:bg-white [&.active]:text-black"
              }`}
            >
              Đêm
            </li>
          </ul>
        </div>
        <div
          className={`bg-white shadow-xl rounded-full ${
            theme.mode ? "border-b-2 border-black/25" : "text-black"
          } flex items-center px-2`}
        >
          <AiOutlineSearch size={20} />
          <input
            className={`bg-transparent rounded-full p-2 min-w-[200px] duration-200 ease-in focus:min-w-[400px] outline-none ${
              theme.mode ? "" : "bg-white text-black"
            } focus:outline-none w-full`}
            type="text"
            placeholder="Tìm kiếm"
            name=""
            id=""
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="w-full mx-auto">
        <ul className={`flex font-bold items-center text-center`}>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[50px]`}
          >
            #
          </li>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[250px]`}
          >
            Tên Nhân Viên
          </li>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[300px]`}
          >
            Email
          </li>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[200px]`}
          >
            Ngày Vào Làm
          </li>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[150px]`}
          >
            Ca Làm
          </li>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[175px]`}
          >
            Tiền Lương
          </li>
          <li
            className={`border ${
              theme.mode ? "bg-[#dcf4fc]" : "bg-[#1f1f1f] text-white"
            }  py-2 px-4 min-w-[275px]`}
          >
            Chức Năng
          </li>
        </ul>
        {staffs?.map((staff) => (
          <ul key={staff.userId} className={`flex `}>
            <li
              className={`border py-2 px-4 w-[50px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center justify-center`}
            >
              {staff.userId}
            </li>
            <li
              className={`border py-2 px-4 w-[250px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center `}
            >
              <img
                className="w-[60px] mr-3 rounded-full border-2 border-white h-[60px] object-cover"
                src="avataTemp.png"
                alt=""
              />
              {`${staff.lastname} ${staff.firstname}`}
            </li>
            <li
              className={`border py-2 px-4 w-[300px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center justify-center`}
            >
              {staff.email}
            </li>
            <li
              className={`border py-2 px-4 w-[200px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center justify-center`}
            >
              {formatDateShip(staff.startDate)}
            </li>
            <li
              className={`border py-2 px-4 w-[150px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center justify-center`}
            >
              {staff.shift}
            </li>
            <li
              className={`border py-2 px-4 w-[175px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center justify-center`}
            >
              {formatCostNumber(staff.salary)}
            </li>
            <li
              className={`border py-2 px-4 w-[275px] ${
                theme.mode ? "bg-white" : "bg-transparent"
              } flex items-center font-semibold justify-around`}
            >
              <button
                onClick={() => {
                  setId(staff.userId);
                  setShow(true);
                  setStatus("Delete");
                }}
                className="p-2 bg-red-400  hover:opacity-80 w-[100px] border rounded-xl"
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  hanldeSetData(staff);
                }}
                className="p-2 bg-blue-300  hover:opacity-80  w-[100px] border rounded-xl"
              >
                Sửa
              </button>
            </li>
          </ul>
        ))}
      </div>
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
      {show && status === "Add" && (
        <StaffFormManage
          handleCloseForm={handleCloseForm}
          handleGetStaff={handleGetStaff}
        />
      )}
      {show && status === "Edit" && (
        <StaffFormEditManage
          handleCloseForm={handleCloseForm}
          data={data}
          handleGetStaff={handleGetStaff}
        />
      )}
      {show && status === "Delete" && (
        <ModalPopup
          handleCloseForm={handleCloseForm}
          handleDeleteMenu={handleDeleteStaff}
          id={id}
        />
      )}
    </div>
  );
};

export default Staff;
