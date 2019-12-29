// miniprogram/pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')

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
    wx.showLoading({
      title: '登录中',
    })
    util.info('登录中...')
    let start = setInterval(function () {
      let userInfo = app.globalData.userInfo
      if (userInfo) {
        console.info('已获取到用户信息，跳转到首页')
        clearInterval(me.interval)
        // 登录成功跳转到首页
        wx.redirectTo({
          url: '../index/index'
        })
        wx.hideLoading()
      }else {
        console.info('未获取到用户信息')
      }
    }, 20)
    me.interval = start
  }
})