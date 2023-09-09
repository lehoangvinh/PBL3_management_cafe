import React, { Suspense, lazy, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/auth.context";
import { useNotification } from "./context/notification.context";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { toast } from "react-toastify";
import { NotificationToast } from "./components/NotificationToast";

const StaffOrderDetailPage = lazy(() =>
  import("./components/StaffOrderDetailPage")
);
const NotFound = lazy(() => import("./components/NotFound"));
const ForgetPassword = lazy(() => import("./components/ForgetPassword"));
const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));
const Import = lazy(() => import("./components/Import"));
const MenuManagePage = lazy(() => import("./components/MenuManagePage"));
const Ingredient = lazy(() => import("./components/Ingredient"));
const Bill = lazy(() => import("./components/Bill"));
const Staff = lazy(() => import("./components/Staff"));
const HomePage = lazy(() => import("./components/HomePage"));

function App() {
  const { role, token, user } = useAuth();
  const { setNumberOfUnreadNotification, setNotifications } = useNotification();
  let { stompClient } = useNotification();

  const onError = (err) => {
    console.log(err);
  };

  const onConnected = () => {
    if (!stompClient) return;
    if (role && role === "ROLE_CUSTOMER") {
      stompClient.subscribe(
        `/user/${user.id}/notification`,
        onUserNotificationReceived
      );
    } else if (role && role === "ROLE_STAFF") {
      stompClient.subscribe(
        "/system/notification",
        onSystemNotificationReceived
      );
    }
  };

  const onUserNotificationReceived = (payload) => {
    const data = JSON.parse(payload.body);
    setNumberOfUnreadNotification((prev) => prev + 1);
    setNotifications((prev) => [data, ...prev]);
    toast(data.message);
  };

  const onSystemNotificationReceived = (payload) => {
    const data = JSON.parse(payload.body);
    setNumberOfUnreadNotification((prev) => prev + 1);
    setNotifications((prev) => [data, ...prev]);
    toast(
      <NotificationToast text={data.message} slug={`/order/${data.slug}`} />,
      {
        position: "bottom-left",
        autoClose: false,
        className: "notification-toast",
      }
    );
  };

  useEffect(() => {
    var socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    if (stompClient && token && role !== "ROLE_ADMIN") {
      stompClient.connect({}, onConnected, onError);
    }
  }, []);
  return (
    <Navbar>
      <Suspense fallback={<p></p>}>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/menu" element={<MenuManagePage />}></Route>
          {/* <Route path="/order" element={<StaffOrder />}></Route> */}
          <Route path="/staff" element={<Staff />}></Route>
          <Route path="/bill" element={<Bill />}></Route>
          <Route path="/ingredient" element={<Ingredient />}></Route>
          <Route path="/import" element={<Import />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/reset-password" element={<ForgetPassword />}></Route>
          <Route
            path="/order/:id"
            element={
              role === "ROLE_CUSTOMER" ? (
                <div>CUSTOMER</div>
              ) : role === "ROLE_STAFF" ? (
                <StaffOrderDetailPage />
              ) : (
                <NotFound />
              )
            }
          ></Route>
          <Route path="/not-found" element={<NotFound></NotFound>}></Route>
        </Routes>
      </Suspense>
    </Navbar>
  );
}
export default App;
