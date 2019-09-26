import _axios from './../plugins/axios'
export function deleteRow(url:string) {
    return _axios({
        url,
        method: 'delete'
    })
}