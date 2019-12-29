// miniprogram/pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')
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
    // 未登录进行登录
    if (!app.globalData.logged) {
      wx.showLoading({
        title: '登录中',
      })
      util.info('登录中...')
      let appid = app.globalData.appid
      let appsecret = app.globalData.appsecret
      httputil.login(undefined, appid, appsecret, function(r) {
        // 登录成功跳转到首页
        util.info('已获取到用户信息，跳转到首页')
        wx.redirectTo({
          url: '../index/index'
        })
        wx.hideLoading()
      })
    }
    // let start = setInterval(function () {
    //   let userInfo = app.globalData.userInfo
    //   if (userInfo) {
    //     clearInterval(me.interval)
    //     // 登录成功跳转到首页
    //     wx.redirectTo({
    //       url: '../index/index'
    //     })
    //     wx.hideLoading()
    //   }else {
    //     util.info('未获取到用户信息')
    //   }
    // }, 100)
    // me.interval = start
  }
})