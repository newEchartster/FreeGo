// 员工管理
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // datas: [
    //   {
    //     name: '张三',
    //     phone: '18712345678',
    //     address: '时光领域'
    //   },
    //   {
    //     name: '李四',
    //     phone: '18912345678',
    //     address: '时光领域'
    //   },
    //   {
    //     name: '王五',
    //     phone: '18712345678',
    //     address: '汇景新城'
    //   },
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this
    // 加载员工列表
    httputil.request({
      method: 'get',
      data: {
        pageNo: 1,
        pageSize: 20
      },
      success(re) {
        me.setData({
          datas: re.data.data.data
        })
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'api/store/employee/page')
  },
  /**
   * 删除员工
   */
  delEmp: function (options) {

  }
})