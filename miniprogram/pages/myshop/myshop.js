// miniprogram/pages/myshop/myshop.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoPath: "/images/qysy/u139.jpg",
    shopName: "光速卡丁车"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let memType = app.globalData.memType
    if(memType) {
      if(memType == 'DZ') {
        this.setData({
          userType: '店长'
        })
      }else {
        this.setData({
          userType: '店员'
        })
      }
    }
    // TODO 获取店家信息，核销信息
    this.setData({
      todayHX: 5,
      totalHX: 103,
      memberList: 26
    })
  },

  scan4UseWelfare: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
      }
    })
  }
})