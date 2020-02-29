// miniprogram/pages/hisMember/hisMember.js
const app = getApp()
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
    let storeId = options.shopId
    let me = this
    me.setData({
      storeId: storeId
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        me.setData({
          listHeight: res.windowHeight - 85
        })
      }
    })
    // 获取核销数据
    me.loadData(1)
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
    httputil.request('api/store/vip/page', {
      data: {
        pageNo: pageNum,
        pageSize: me.data.pageSize,
        storeId: me.data.storeId
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
     * 加载更多
     */
  addMore: function (e) {
    let pageNo = this.data.pageNo + 1
    this.loadData(pageNo)
  }
})