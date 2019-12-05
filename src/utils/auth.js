import {setCookie, getCookie, removeCookie } from "@/utils/cookie";

const TokenKey = 'User-Token'
const NameKey = 'username'
// const RoleKey = 'role'

export function getToken() {
  return getCookie(TokenKey)
}

export function setToken(token) {
  return setCookie(TokenKey, token)
}

export function removeToken() {
  return removeCookie(TokenKey)
}

export function getName() {
  return getCookie(NameKey)
}

export function setName(name) {
  return setCookie(NameKey, name)
}

export function removeName() {
  return removeCookie(NameKey)
}

// export function setRole(role) {
//   return setCookie(RoleKey, role)
// }

// export function getRole() {
//   return getCookie(RoleKey)
// }

// export function removeRole() {
//   return removeCookie(RoleKey)
// }
