import Cookies from "js-cookie";

const namespace = "yishi-access-v3";
const saveCookie = [`${namespace}-username`,`${namespace}-codetype`]; // 退出时不清除cookie的key

export function setCookie(cookieName, data, property) {
  return Cookies.set(`${namespace}-${cookieName}`, data, property);
}

export function getCookie(cookieName) {
  return Cookies.get(`${namespace}-${cookieName}`);
}

export function removeCookie(cookieName) {
  return Cookies.remove(`${namespace}-${cookieName}`);
}

export function clearCookie() {
  for (const name in Cookies.get()) {
    if (saveCookie.includes(name)) {
      continue;
    }
    Cookies.remove(name);
  }
}
