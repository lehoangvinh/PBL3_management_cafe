import React, { lazy, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
const StaffOrder = lazy(() => import("./StaffOrder"));
const Dashboard = lazy(() => import("./Dashboard"));

const HomePage = () => {
  // const role = "ROLE_ADMIN";
  const { role } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!role) navigate("/signin");
  }, []);
  if (role === "ROLE_ADMIN") return <Dashboard />;
  if (role === "ROLE_STAFF") return <StaffOrder></StaffOrder>;
};

export default HomePage;
