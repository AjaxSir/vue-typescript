// export default url
import _axios from "./../plugins/axios";

export function login(data: Object) {
    return _axios({
        url: '/account/login/user-login/',
        method: 'post',
        data
    })
}

