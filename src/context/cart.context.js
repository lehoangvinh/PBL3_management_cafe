import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const CartContext = createContext();

function CartProvider(props) {
  const token = localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [amountCart, setAmountCart] = useState(0);

  const checkOne = (cartId) => {
    const result = cartItems.map((cartItem) => {
      if (cartItem.id === cartId) {
        return { ...cartItem, selected: true };
      }
      return { ...cartItem };
    });
    setCartItems(result);
  };
  const unCheckOne = (cartId) => {
    const result = cartItems.map((cartItem) => {
      if (cartItem.id === cartId) {
        return { ...cartItem, selected: false };
      }
      return { ...cartItem };
    });
    setCartItems(result);
  };
  const unCheckAll = () => {
    const result = cartItems.map((item) => ({
      ...item,
      selected: false,
    }));
    setCartItems(result);
  };
  const checkAll = () => {
    const result = cartItems.map((item) => ({
      ...item,
      selected: true,
    }));
    setCartItems(result);
  };

  const addCart = async (cartReq) => {
    if (!token) return false;
    const res = await axios.post("carts", cartReq, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let isHave = false;
    const updateCarts = cartItems.map((item) => {
      if (item.id === res.data.id) {
        isHave = true;
        return {
          ...item,
          quantity: res.data.quantity,
          totalCost: res.data.totalCost,
        };
      }
      return { ...item };
    });
    if (isHave) {
      setCartItems(updateCarts);
    } else {
      setCartItems((prevItems) => {
        return [...prevItems, { ...res.data, selected: false }];
      });
      setAmountCart((prev) => prev + 1);
    }
    return await true;
  };

  const updateCart = (cartReq) => {
    if (cartReq.quantity <= 0) {
      return;
    }
    axios
      .put(`carts/${cartReq.id}`, cartReq, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const updateCarts = cartItems.map((item) => {
          if (item.id === res.data.id) {
            return {
              ...item,
              quantity: res.data.quantity,
              totalCost: res.data.totalCost,
            };
          }
          return item;
        });
        setCartItems(updateCarts);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteCart = async (cartId) => {
    const res = await axios.delete(`carts/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) {
      // navigate("/signin");
    } else if (res.status === 403) {
      // navigate("/403");
    }
    setCartItems((prevItems) => {
      const result = prevItems.filter((item) => item.id !== cartId);
      return result;
    });
  };

  const value = {
    cartItems,
    amountCart,
    checkAll,
    unCheckAll,
    checkOne,
    unCheckOne,
    setAmountCart,
    addCart,
    deleteCart,
    updateCart,
  };

  useEffect(() => {
    if (!token) return;
    axios
      .get("/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCartItems(
          response.data.map((item) => ({ ...item, selected: false }))
        );
        setAmountCart(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <CartContext.Provider value={value} {...props}></CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (typeof context === "undefined")
    throw new Error("useCart must be used within a CartProvider");
  return context;
}

export { CartProvider, useCart };
