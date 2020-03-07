// miniprogram/pages/dog/noDog.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dogImg: '/images/icon/dog.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now = new Date().getTime()
    this.setData({ now: now })
    if (app.globalData.userInfo) {
      let dog = app.globalData.userInfo.dog
      this.setData(dog)
    }
  }
})