import React from "react";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
const ModalPopup = (props) => {
  return (
    <div className=" fixed left-[50%] w-[500px]  h-[300px] flex flex-col rounded-xl shadow-xl border-2 top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
      <div className=" justify-self-end p-3">
        <AiOutlineClose
          onClick={() => props.handleCloseForm()}
          size={20}
          className="text-gray-400 font-bold cursor-pointer float-right"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <img src="/closeImg.png" alt="" />
        <span className="text-center text-gray-700 px-16 mt-4">
          Bạn có muốn xóa thông tin này không? Quá trình này không thể được hoàn
          tác !
        </span>
      </div>
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => props.handleCloseForm()}
          className="min-w-[100px] rounded-lg bg-gray-400 border  hover:opacity-80  h-9 px-3 mr-8 py-2 text-sm  text-white"
          type="button"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            toast.success("Xóa thành công");
            props.handleCloseForm();
            props.handleDeleteMenu(props.id);
          }}
          className="min-w-[100px] rounded-lg bg-red-400 border hover:opacity-80 h-9 px-3 py-2 text-sm text-white"
          type="submit"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default ModalPopup;
