import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { useAuth } from "../context/auth.context";

const NotificationContext = createContext();
var stompClient = null;

function NotificationProvider(props) {
  const { token, role, user } = useAuth();
  const [numberOfUnreadNotification, setNumberOfUnreadNotification] =
    useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationPage, setNotificationPage] = useState(1);
  const [last, setLast] = useState(false);

  const getNotifications = async (
    page = notificationPage,
    size = 10,
    read = true
  ) => {
    const res = await axios.get(
      `users/notification?page=${page}&size=${size}&read=${read}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (res.status !== 200) {
      return;
    }
    setNotifications((prev) => [...prev, ...res.data.content]);
    setLast(res.data.last);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationPage(1);
  };

  const changeToRead = (id) => {
    fetch(`http://localhost:8080/api/v1/notification/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.id) setNumberOfUnreadNotification((prev) => prev - 1);
      });
  };

  const getNumberOfUnreadNotification = () => {
    axios
      .get("users/unread-notification", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setNumberOfUnreadNotification(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!token) return;
    getNumberOfUnreadNotification();
    // getNotifications(0, 10);
    connect();
  }, [token]);

  const connect = () => {
    var socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
  };

  const onError = (err) => {
    console.log(err);
  };

  const onConnected = (callback) => {
    if (!stompClient) return;
    if (role === "ROLE_CUSTOMER") {
      stompClient.subscribe(`/user/${user.id}/notification`, callback);
    } else {
      stompClient.subscribe("/system/notification", callback);
    }
  };

  const fetchMoreNotification = (read = true) => {
    setNotificationPage((prev) => prev + 1);
    getNotifications(notificationPage, 10, read);
  };

  const value = {
    stompClient,
    onError,
    onConnected,
    connect,
    numberOfUnreadNotification,
    notifications,
    setNumberOfUnreadNotification,
    setNotifications,
    getNotifications,
    clearNotifications,
    notificationPage,
    setNotificationPage,
    last,
    changeToRead,
    getNumberOfUnreadNotification,
    fetchMoreNotification,
  };

  return (
    <NotificationContext.Provider
      value={value}
      {...props}
    ></NotificationContext.Provider>
  );
}

function useNotification() {
  const context = useContext(NotificationContext);
  if (typeof context === "undefined")
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  return context;
}

export { NotificationProvider, useNotification };
