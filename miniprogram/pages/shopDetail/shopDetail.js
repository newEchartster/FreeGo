const app = getApp()
const util = require('../../utils/util.js')
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   * 1，轮播图链接地址列表
   * 2，店铺信息
   * 3，权益列表
   */
  data: {
    positionIcon: '/images/icon/map2.svg',
    phoneIcon: '/images/icon/tele.svg',
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
    let me =this
    let shopId = options.shopId
    let now = new Date().getTime()
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        me.setData({
          imageHeight: res.windowWidth / 2.4,
          now: now
        })
      }
    })
    me.setData({
      storeId: shopId
    })
    // 获取店铺权益数据
    httputil.request('api/store/get/' + shopId , {
      success(re) {
        let storeDetail = re.data.data
        me.setData(storeDetail)
      }
    })
    // 加载权益列表
    me.loadData(1)
  },
  /**
     * 购买下单
     */
  createOrder: function (e) {
    let commodityId = e.target.id
    wx.showModal({
      title: '福瑞狗提示',
      content: '您确认需要购买该优惠吗？',
      success(res) {
        if (res.confirm){
          // 获取店铺权益数据
          httputil.request('api/pay/create-dorder?commodityId=' + commodityId, {
            method: 'post',
            success(re) {
              let orderId = re.data.data.id
              let url = 'api/pay/unifiedorder?openId=' + app.globalData.openid + '&orderId=' + orderId
              httputil.request(url, {
                method: 'post',
                success(re) {
                  wx.requestPayment({
                    timeStamp: re.data.data.timeStamp,
                    nonceStr: re.data.data.nonceStr,
                    package: re.data.data.package,
                    signType: 'MD5',
                    paySign: re.data.data.paySign,
                    success(res) {
                      // 查询是否成功
                      httputil.request('api/pay/info/' + orderId, {
                        method: 'get',
                        success(re) {
                          if (re.data.data.status == 'suc') {
                            wx.showToast({
                              title: '支付成功！',
                              icon: 'success',
                              duration: 500
                            })
                          }else {
                            wx.showToast({
                              title: '支付失败！',
                              icon: 'fail',
                              duration: 500
                            })
                          }
                        }
                      })
                    },
                    fail(res) { 

                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  //预览图片
  previewImg: function (e) {
    util.previewImg(e)
  },
  /**
   * 定位导航
   */
  locateShop: function () {
    const latitude = this.data.latitude
    const longitude = this.data.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  /**
   * 拨打电话
   */
  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shopPhone
    })
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
    httputil.request('api/commodity/page', {
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