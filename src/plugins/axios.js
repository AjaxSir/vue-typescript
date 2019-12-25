"use strict";

import Vue from "vue";
import axios from "axios";
import store from '../store/index.ts'
import { MessageBox, Message } from 'element-ui';
import { getToken, removeToken } from '@/utils/auth'
import Cookie from 'js-cookie'
// Full config:  https://github.com/axios/axios#request-config

export const serverURL = process.env.NODE_ENV === 'development' ? '/v1' : 'http://47.103.184.184'
console.log(process.env.NODE_ENV, '环境变量', serverURL, '请求地址')
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

let config = {
  baseURL:serverURL,
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
          if (!Cookie.get('error')) {
            Cookie.set('error', Date.now(), { expires: new Date(new Date().getTime() + 3 * 1000) }) // 五秒钟内不会重复出现提示框
            Message({
              type: 'warning',
              message: response.data.message
            });
          }
          break
      case 500:
          if (!Cookie.get('error')) {
            Cookie.set('error', Date.now(), { expires: new Date(new Date().getTime() + 3 * 1000) }) // 五秒钟内不会重复出现提示框
            Message({
              type: 'warning',
              message: '服务器出错!'
            });
          }

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
        removeToken()
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
