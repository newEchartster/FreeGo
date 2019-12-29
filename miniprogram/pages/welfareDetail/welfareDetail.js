const util = require('../../utils/util.js')
const app = getApp()
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // codeStr: 123456789,
    // title: '免费体验一圈',
    // value: 188,
    // startDate: '2019-12-08',
    // endDate: '2020-03-31',
    // logoPath: "/images/qysy/u139.jpg",
    // useNote: [
    //   '1、本权益券不兑换现金，不参与外送服务；',
    //   '2、本券不得与其他优惠同时使用；',
    //   '3、请在消费前初始本券；'
    // ],
    // shopPhone: '13558656094',
    // latitude: 30.82404,
    // longitude: 104.15801
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this
    let commodityId = options.commodityId
    // 权益条形码
    httputil.request({
      method: 'get',
      success(re) {
        util.barcode("barcode", re.data.data, 500, 80)
        me.setData({
          codeStr: re.data.data
        })
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'api/user/code/' + commodityId)
    // 权益详细
    httputil.request({
      method: 'get',
      success(re) {
        let detail = re.data.data == undefined ? {} : re.data.data
        me.setData(detail)
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'admin/commodity/' + commodityId)

  },
  /**
   * 拨打电话
   */
  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.storeInfo.shopPhone
    })
  },
  //预览图片
  previewImg: function (e) {
    util.previewImg(e)
  },
  /**
   * 查看店铺位置
   */
  locateShop: function() {
    const latitude = this.data.storeInfo.lat
    const longitude = this.data.storeInfo.lon
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     debugger
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
  }
})