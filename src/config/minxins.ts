// import axiosConfig from './axios';
import { Vue, Mixins, Component } from "vue-property-decorator";
import { MessageBox, Message } from 'element-ui';
import { deleteRow } from "./../api/common"
declare module 'vue/types/vue' {
    interface Vue {
        fetchData(method: any, url: string, ...arg: any): void;  // 记得声明一下，要不然会报错 Property 'methodFromMixins' does not exist on type 'App'.
    }
  }
@Component
export default class GlobalMimins extends Vue{
public page: any =  {
    total: 1,
    current: 1,
    size: 10
}
public orderBy: Object = {
    prop: "", // 需要的根据什么排序
    order: "descending" // ascending 表示升序，descending 表示降序
}
public list_data: Array<Object> = [];
fetchData(page: number): void {
    // axiosConfig({
    //     method,
    //     url,
    //     ...arg
    // }).then(res => {
    //     console.log(res, "back")
    // })
  }
  /**
   * 
   * @param size 每页数据条数
   */
  sizeChange(size: number) {
    this.page.size = size
    this.fetchData(1)
  }
  /**
   * 
   * @param page 翻页页码
   */
  pageChange(page: number) {
    this.fetchData(page)
  }
  /**
   * 
   * @param id 需要删除的id数据
   * @param url 需要请求的地址
   */
  deleteRow(url: string) {
    MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRow(url).then((res: any) => {
          Message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        });          
      });
  }
  // 待补充
}