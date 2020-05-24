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
    loadingCompleted: false, // 已加载完数据,
    showCode: false, // 显示二维码
    curNavi: 0,
    status: [
      {
        value: 'created',
        text: '未使用'
      },
      {
        value: 'used',
        text: '已使用'
      },
      {
        value: 'overtime',
        text: '已过期'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this
    wx.getSystemInfo({
      success: res => {
        me.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        })
      }
    })
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
    util.qrcode("barcode", verificationCode, 750, 750)
    me.setData({
      showCode: true,
      codeStr: verificationCode
    })
  },
  /**
   * 点击二维码隐藏
   */
  tapCode: function() {
    let me = this
    me.setData({
      datas: [],
      showCode: false
    })
    // 刷新
    me.loadData(1)
  },
  /**
   * 切换菜单
   */
  swichNav: function (e) {
    var me = this
    if (me.data.curNavi === e.target.dataset.current) {
      return false
    } else {
      me.setData({
        curNavi: e.target.dataset.current,
        datas: [],
      })
      me.loadData(1, false)
    }
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
  /**
   * 使用须知
   */
  notice: function() {
    wx.navigateTo({
      url: '../usageNotice/usageNotice'
    })
  }
})