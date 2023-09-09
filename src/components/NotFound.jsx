import React from "react";
import { Link, useNavigate } from "react-router-dom";
const NotFound = () => {
  const nav = useNavigate();
  return (
    <>
      <div className="max-w-[1440px] flex flex-col gap-4 items-center justify-center w-full h-screen m-auto">
        <h1 className="text-8xl">Oops!</h1>
        {/* <h1 className="text-4xl">404 Not Found</h1> */}
        <h2 className="text-xl pt-2">
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </h2>
        <img src="/notfound.gif" alt="" width={"400px"} />
        <div className="bg-blue-400 px-5 py-3 rounded-md">
          <Link to={"/"} className="text-lg font-semibold">
            Go to homepage
          </Link>
        </div>
        <span
          className="cursor-pointer text-lg font-medium"
          onClick={(e) => {
            nav(-1);
          }}
        >
          Go back
        </span>
      </div>
    </>
  );
};

export default NotFound;
