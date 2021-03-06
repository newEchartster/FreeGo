// 员工管理
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    searchLoading: false, // 正在加载
    loadingCompleted: false, // 已加载完数据
    datas: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        me.setData({
          listHeight: res.windowHeight - 85
        })
      }
    })
  },
  onShow: function() {
    // 重新加载
    this.setData({
      datas: [],
      total: 0
    })
    // 获取核销数据
    this.loadData(1)
  },
  /**
     * 加载数据
     * @param pageNum 页数
     */
  loadData: function (pageNum) {
    let me = this
    me.setData({
      searchLoading: true
    })

    wx.showLoading({
      title: '正在加载...',
    })
    // 获取本店会员
    httputil.request('api/store/employee/page', {
      data: {
        pageNo: pageNum,
        pageSize: me.data.pageSize
      },
      success(re) {
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        let resData = re.data.data.data == undefined ? [] : re.data.data.data
        let datas = me.data.datas.concat(resData)
        if (resData.length == 0) {
          me.setData({
            loadingCompleted: true
          })
          setTimeout(function () {
            wx.showToast({
              title: '已全部加载',
              icon: 'success',
              duration: 1000
            })
          }, 1000)
        }
        me.setData({
          datas: datas,
          total: re.data.data.total,
          searchLoading: false,
          pageNo: pageNum
        })
      }
    })
  },
  /**
   * 删除员工
   */
  delEmp: function (options) {
    let me =this
    let employeeId = options.target.id
    httputil.request('api/store/employee/del?employeeId=' + employeeId, {
      method: 'post',
      success(re) {
        wx.showToast({
          title: re.data.msg,
          icon: 'success',
          duration: 2000
        })
        if(re.data.code == '000') {
          // 重新加载
          me.setData({
            datas: [],
            total: 0
          })
          me.loadData(1)
        }
      }
    })
  },
  /**
     * 加载更多
     */
  addMore: function (e) {
    let pageNo = this.data.pageNo + 1
    this.loadData(pageNo)
  }
})