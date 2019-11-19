// import axiosConfig from './axios';
import { Vue, Mixins, Component } from "vue-property-decorator";
import { MessageBox, Message } from 'element-ui';
// import { deleteRow } from "./../api/common"
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
public dialogCreate: Boolean = false
public orderBy: Object = {
    prop: "", // 需要的根据什么排序
    order: "descending" // ascending 表示升序，descending 表示降序
}
public Form:Object = {} // 新增修改弹框表单信息
public TreeData: Array<Object> = []
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
   * @param page 关闭新增框
   */
  handleClose() {
    this.$refs['Forms']['resetFields']();
    this.dialogCreate = false
  }
  /**
   *
   * @param row
   * @param column
   * @param cell
   * @param event
   */
  enterRowChange(row, column, cell, event) {
    /**@description hover enter tab 行 */
    row.showMenu = true;
  }
  /**
   *
   * @param row
   */
  leaveRowChange(row) {
    /**@description hover leave tab 行 */
    row.showMenu = false;
  }
  /**
   *
   * @param page 翻页页码
   */
  pageChange(page: number) {
    this.fetchData(page)
  }
  // 区分执行的操作
  returnCommand(action:string, row:object) {
    return {
      action,
      row
    }
  }
  // exportPassList(this.pageForm).then(res => {
  //   this.exportFunc('通行记录.xls', res.data)
  // })
  // 导出excel函数
  exportFunc(fileName:string, data: any):void {
    var blob = new Blob([data])
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      // elink.href = '/static/file/school_format.xls'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }
  /**
   * table内的操作
   * @param action
   */
  commandClick(options: Object):void {
    switch (options['action']) {
      case 'update' :
        this.Form = Object.assign(this.Form, options['row'])
        this.dialogCreate = true
        break
      case 'delete':
          MessageBox.confirm('此操作将永久删除该列表, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // deleteRow('url').then((res: any) => {
            //   Message({
            //     type: 'success',
            //     message: '删除成功!'
            //   });
            // })
          }).catch(() => {
            Message({
              type: 'info',
              message: '已取消删除'
            });
          });
          break
       case 'whiteList':
          MessageBox.confirm('此操作将添加该用户至白名单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // deleteRow('url').then((res: any) => {
            //   Message({
            //     type: 'success',
            //     message: '添加成功!'
            //   });
            // })
          }).catch(() => {
            Message({
              type: 'info',
              message: '已取消添加'
            });
          });
          break
    }
  }
}
