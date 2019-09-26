// const url = {
//     loginUrl: "/account/login/user-login/", // 获取登录数据
//     exitUser: "/account/login/user-exist/", // 是否存在第一个用户
//     getMovieList: "/v2/movie/new_movies" // 获取豆瓣电影列表
// }
// export default url
import _axios from "./../plugins/axios";
export function login(data: Object) {
    return _axios({
        url: '/account/login/user-login/',
        method: 'post',
        data
    })
}