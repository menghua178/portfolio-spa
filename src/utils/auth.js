// src/utils/auth.js
import axios from "axios";

// 设置请求头令牌
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// 移除请求头令牌
export const removeAuthToken = () => {
  delete axios.defaults.headers.common["Authorization"];
};