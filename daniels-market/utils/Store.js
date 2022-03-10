import { createContext, useReducer } from "react";
import jsCookie from "js-cookie";

export const Store = createContext();
const initialState = {
  darkMode: jsCookie.get("darkMode") === "ON" ? true : false,
  cart: {
    cartItems: jsCookie.get("cartItems")
      ? JSON.parse(jsCookie.get("cartItems"))
      : [],
    shippingAddress: jsCookie.get("shippingAddress")
      ? JSON.parse(jsCookie.get("shippingAddress"))
      : {},
    paymentMethod: jsCookie.get("paymentMethod")
      ? jsCookie.get("paymentMethod")
      : "",
  },
  userInfo: jsCookie.get("userInfo")
    ? JSON.parse(jsCookie.get("userInfo"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      return { ...state, darkMode: false };
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      jsCookie.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      jsCookie.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case "USER_LOGIN": {
      return { ...state, userInfo: action.payload };
    }
    case "USER_LOGOUT": {
      return { ...state, userInfo: null, cart: { cartItems: [] } };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
