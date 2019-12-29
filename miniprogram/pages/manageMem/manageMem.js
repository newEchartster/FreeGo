// 员工管理
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
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
    let employeeId = options.target.id
    httputil.request({
      method: 'post',
      data: {
        employeeId: employeeId
      },
      success(re) {
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
          duration: 2000
        })
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'api/store/employee/del')
  }
})