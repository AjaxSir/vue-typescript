"use strict";

import Vue from "vue";
import axios from "axios";
import store from '../store/index.ts'
import { MessageBox, Message } from 'element-ui';
import { getToken, getName } from '@/utils/auth'

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
    if (getToken()) {
          config.headers['token'] = getToken()
        }
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
            message: response.data.message
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
    if (error.response.status === 401) {
      MessageBox.confirm('你已被登出，请重新登录', '警告', {
        confirmButtonText: '重新登录',
        showClose: false,
        showCancelButton: false,
        center: true,
        type: 'warning'
      }).then(() => {
        clearCookie()
        location.reload()
      })
    }else{
      Message({
        type: 'warning',
        message: `请求出错! ${data.message}`
      });
    }
    return Promise.reject(error);
  },
);

export default _axios;
