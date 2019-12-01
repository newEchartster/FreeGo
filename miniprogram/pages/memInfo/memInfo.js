// miniprogram/pages/memInfo/memInfo.js
const app = getApp()

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
    let winHeight = app.globalData.systemInfo.windowHeight
    this.setData({
      winHeight: winHeight
    })
    // 获取个人资料 TODO

  },

  /**
   * 保存个人资料
   */
  saveInfo: function() {

  }
})