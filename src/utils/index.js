/**
 * Created by jiachenpan on 16/11/18.
 */
import axios from 'axios'
import es6Promise from 'es6-promise'


// HH: 扩展 axios，让 axios 支持 jsonp
axios.jsonp = (url, index) => {
    if (!url) {
        console.error('Axios.JSONP 至少需要一个url参数!')
        return;
    }
    let callbackName = 'jsonCallBack' + index;
    return new Promise((resolve, reject) => {
        let JSONP = document.createElement("script");
        JSONP.type = "text/javascript";
        JSONP.src = `${url}&jsonpCall=${callbackName}`;
        document.getElementsByTagName("head")[0].appendChild(JSONP);
        window[callbackName] = (res) => {
          console.log(res, '返回')
            resolve(res)
        }
        setTimeout(() => {
            document.getElementsByTagName("head")[0].removeChild(JSONP)
        }, 500)
    })
}


export const jsonp = (url, index) => axios.jsonp(url, index)
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function weekDate() {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  var s = parseTime(new Date(start))
  var e = parseTime(new Date(end))
  return [s, e]
}

// 日期格式化
export function formatTime(datetime) {
  let Y, M, D, W, H, Min, S;
  let date = new Date(datetime);
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  W = date.getDay();
  H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  Min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  S = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  switch (W) {
    case 1:
      W = "星期一";
      break;
    case 2:
      W = "星期二";
      break;
    case 3:
      W = "星期三";
      break;
    case 4:
      W = "星期四";
      break;
    case 5:
      W = "星期五";
      break;
    case 6:
      W = "星期六";
      break;
    case 7:
      W = "星期天";
      break;
  }
  const time = {
    ymd: Y.toString() + "年" + M.toString() + "月" + D + "日",
    week: W,
    hour: H.toString() + ":" + Min.toString(),
    sec: ":" + S.toString()
  };

  return time;
}

// 日期格式化
export function formatTimeObj(datetime, type = 'day') {
  if (!datetime) return "";
  let Y, M, D, W, H, Min, S;
  let date = new Date(datetime);
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  Min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  S = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  // return (
  //   Y.toString() +
  //   "-" +
  //   M.toString() +
  //   "-" +
  //   D +
  //   " " +
  //   H.toString() +
  //   ":" +
  //   Min.toString() +
  //   ":" +
  //   S.toString()
  // );
  return type === 'day' ? (
    Y.toString() +
    "-" +
    M.toString() +
    "-" +
    D
  ) : (
    Y.toString() +
    "-" +
    M.toString() +
    "-" +
    D +
    " " +
    H.toString() +
    ":" +
    Min.toString() +
    ":" +
    S.toString()
  )
}

// 今日时间格式化
export function todayTime() {
  let Y, M, D, endY, endM, endD;
  let date = new Date(); //当前时间
  var nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000); //后一天
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  endY = nextDate.getFullYear();
  endM =
    nextDate.getMonth() + 1 < 10
      ? "0" + (nextDate.getMonth() + 1)
      : nextDate.getMonth() + 1;
  endD =
    nextDate.getDate() < 10 ? "0" + nextDate.getDate() : nextDate.getDate();
  const time = [
    Y.toString() + "-" + M.toString() + "-" + D + " " + "00:" + "00",
    endY.toString() + "-" + endM.toString() + "-" + endD + " " + "00:" + "00"
  ];
  return time;
}

// 今日时间格式化
export function todayYM() {
  let Y, M;
  let date = new Date(); //当前时间
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const time = [Y.toString() + "-" + M.toString()];
  return time;
}

// 近七日日期
export function nearlySevenDays() {
  var now = new Date();
  var nowTime = now.getTime();
  var oneDayTime = 24 * 60 * 60 * 1000;
  var ShowTime, myDate, month, date;
  const SevenDays = [];

  for (var i = 0; i > -7; i--) {
    ShowTime = nowTime + i * oneDayTime;

    //初始化日期时间
    myDate = new Date(ShowTime);
    month =
      myDate.getMonth() + 1 < 10
        ? "0" + (myDate.getMonth() + 1)
        : myDate.getMonth() + 1;
    date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
    SevenDays.unshift(month + "/" + date);
  }
  return SevenDays;
}

export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }

  const paramsObj = JSON.parse(
    '{"' +
      search
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
  for (const k in paramsObj) {
    paramsObj[k] = decodeURIComponent(paramsObj[k]);
  }
  return paramsObj;
}

// 防抖
export function debounce(fn, time) {
  let timeout = null // 创建一个标记用来存放定时器的返回值
  return function() {
    clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments)
    }, time)
  }
}

// 防抖
export function baiduDebounce(fn, time) {
  let timeout = null // 创建一个标记用来存放定时器的返回值
  return function() {
    clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments)
    }, time)
  }
}
