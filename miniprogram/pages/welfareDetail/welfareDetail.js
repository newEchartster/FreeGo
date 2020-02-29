const util = require('../../utils/util.js')
const app = getApp()
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
    let commodityId = options.commodityId
    wx.getSystemInfo({
      success: res => {
        me.setData({
          imageHeight: res.windowWidth / 2.4
        })
      }
    })
    // 权益条形码
    httputil.request('api/user/code/' + commodityId, {
      success(re) {
        util.barcode("barcode", re.data.data, 500, 80)
        me.setData({
          codeStr: re.data.data
        })
      }
    })
    // 权益详细
    httputil.request('admin/commodity/' + commodityId, {
      success(re) {
        let detail = re.data.data == undefined ? {} : re.data.data
        me.setData(detail)
      }
    })

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
  }
})