// miniprogram/pages/coupon/myCoupon.js
const app = getApp()
const httputil = require('../../utils/httputil.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    datas: [],
    searchLoading: false, // 正在加载
    loadingCompleted: false, // 已加载完数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this
    // 获取数据
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
    // 获取店铺权益数据
    httputil.request('api/verification/page', {
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
  },
  /**
   * 使用券
   */
  useCoupon: function(e) {
    let me = this
    let verificationCode = e.target.id
    util.qrcode("barcode", verificationCode, 400, 400)
    me.setData({
      codeStr: verificationCode
    })
  },
  /**
   * 进去商店
   */
  goToShop: function (options) {
    let me = this
    let shopId = options.target.id
    wx.navigateTo({
      url: '../shopDetail/shopDetail?shopId=' + shopId
    })
  },
})