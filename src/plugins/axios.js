"use strict";

import Vue from "vue";
import axios from "axios";
import { MessageBox, Message } from 'element-ui';
// Full config:  https://github.com/axios/axios#request-config
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

let config = {
  baseURL: process.env.baseURL || "/v1",
  timeout: 60 * 1000, // Timeout
  withCredentials: true // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    switch (response.data.code) {
      case 200:
          return response
      case 400:
          Message({
            type: 'warning',
            message: '参数传错!'
          });
          break
      case 500:
          Message({
            type: 'warning',
            message: '服务器出错!'
          });
          break
    }
  },
  function(error) {
    const { data } = error.response;
    Message({
      type: 'warning',
      message: `请求出错! ${data.message}`
    });
    return Promise.reject(error);
  }
);

export default _axios;
