// import axiosConfig from './axios';
import { Vue, Component } from "vue-property-decorator";
import { MessageBox, Message } from 'element-ui';
import _axios from '@/plugins/axios.js'
// import { deleteRow } from "./../api/common"
declare module 'vue/types/vue' {
  interface Vue {
    fetchData(option: object): void;  // 记得声明一下，要不然会报错 Property 'methodFromMixins' does not exist on type 'App'.
    page: object,
    initForm: object
  }
}
@Component
export default class GlobalMimins extends Vue {
  public page: any = {
    total: 1,
    page: 1,
    limit: 10,
  }
  public dialogCreate: any = false
  public notifyInstance: any; //防止notify重复多次出现提示
  public showLoading: any = true
  public orderBy: Object = {
    prop: "", // 需要的根据什么排序
    order: "descending" // ascending 表示升序，descending 表示降序
  }
  public Form: Object = {} // 新增修改弹框表单信息
  public TreeData: Array<Object> = []
  public list_data: Array<Object> = [];
  updateArray: Array<string> = [] /// 行内需要修改的状态
  initForm: object = {
    url: '',
    method: 'get',
    params: {}
  }
  deleteForm: object = {
    url: '',
    method: 'delete'
  }

  mounted() {
    this.fetchData(this.initForm)
  }
  is_Phone(str:string) {
    return (/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(str)
  }
  fetchData(option: object) {
    /**@description init数据
     * @argument tag no 不init数据
     * @argument tag pagination 不分页init数据
     */
    if (option['params'].tag !== 'no') {
      for (let key in option['params']) {
        if (option['params'][key] === '') {
          option['params'][key] = null
        }
      }
      this.page.limit = Number(option['params'].limit)
      console.log('mixins获取数据')
      this.showLoading = true;
      _axios(option).then((res: any) => {
        if (res.data && res.data.data) {
          if (option['params'].tag === 'pagination') {
            if (res.data.data.length) {
              res.data.data.forEach((ele: object) => {
                this.updateArray.forEach((itemStatus: string) => {
                  ele[itemStatus] = false
                })
                this.$set(ele, 'showMenu', false)
              })
              this.page.total = res.data.data.length
              this.list_data = res.data.data
              console.log(this.list_data)
            }
          } else {
            this.page.total = res.data.data.total
            this.list_data = res.data.data.records
            console.log(this.list_data)
            if (res.data.data.records.length) {
              res.data.data.records.forEach((ele: object) => {
                this.updateArray.forEach((itemStatus: string) => {
                  ele[itemStatus] = false
                })
                this.$set(ele, 'showMenu', false)
              })

            } else {
              if (this.initForm['params']['page'] > 1) {
                this.initForm['params']['page']--
                this.fetchData(this.initForm)
              }
            }
          }
        }
        this.showLoading = false
      })
    }

  }
  /**
   * 打开创建框
   */
  OpenCreate() {
    this.dialogCreate = true
  }
  /**
   *
   * @param page 关闭新增/修改框
   */
  handleClose() {
    for (let key in this.Form) {
      this.Form[key] = ''
    }
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
    this.$set(row, 'showMenu', true)
    // row.showMenu = true;
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
    this.list_data = []
    this.page.page = page
    console.log(this.page.limit)
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page)
    this.fetchData(this.initForm)
  }
  // 区分执行的操作
  returnCommand(action: string, row: object) {
    return {
      action,
      row
    }
  }
  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm['data'] = []
    val.forEach((ele: Object) => {
      this.deleteForm['data'].push(ele['id'])
    })
  }
  // 导出excel函数 处理数据
  exportFunc(fileName: string, url: string): void {
    // var blob = new Blob([data])
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = url
      // elink.href =URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(Blob, fileName)
    }
  }
  // 删除某行或多行数据
  deleteRow(option: object) {
    return _axios(option).then(res => {
      if (res.data.code === 200) {
        this.deleteForm['data'] = []
        this.$message.success('删除成功')
        this.fetchData(this.initForm)
      }
    })
  }
  /**
   * table内的操作
   * @param action
   */
  commandClick(options: Object): void {
    switch (options['action']) {
      case 'update':
        this.Form = Object.assign(this.Form, options['row'])
        this.dialogCreate = true
        break
        case 'rebind':
          const copyForm = Object.assign({}, this.Form)
            this.Form = Object.assign(this.Form, options['row'])
            this.Form['bindingType'] = copyForm['bindingType']
            this.dialogCreate = true
            break
      case 'resetPassword':
        this['resetVisible'] = true
        this['resetForms'] = Object.assign(this['resetForms'], options['row'])
        break
      case 'delete':
        if (!this.deleteForm['data'].length) {
          this.deleteForm['data'].push(options['row'].id)
        }
        MessageBox.confirm('此操作将永久删除该列表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRow(this.deleteForm)
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

  /**
   * 新增成功弹出框
   * @param action
   */
  notify(val: string) {
    if (this.notifyInstance) {
      this.notifyInstance.close();
    }
    this.notifyInstance = this.$notify({
      type: "success",
      title: "成功",
      message: val
    });
  }

  /**
 * 限制备注
 * @param action
 */
  constraintLength(value, note) {
    switch (note) {
      case '200':
        if (value.length === 200) {
          value = value.slice(200)
          this.message('备注不能超过200个字符')
        }
        return;
      case '7':
        if (value.length === 7) {
          this.message('车牌不能超过7个字符')
        }
        return;
      case '10':
        if (value.length === 10) {
          this.message('此项不能超过10个字符')
        }
        return;
      case '11':
        if (value.length === 11) {
          this.message('电话不能超过11个字符')
        }
        return;
      case '18':
        if (value.length === 18) {
          this.message('身份证号不能超过18个字符')
        }
        return;
    }

  }
  message(val) {
    this.$message({
      message: val,
      type: "warning"
    });
  }

  channelInputLimit(e) {
    let key = e.key;
    // 不允许输入'e'和'.'
    if (key === "e" || key === ".") {
      e.returnValue = false;
      return false;
    }
    return true;
  }

}

