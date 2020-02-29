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
      httputil.login(undefined, function(r) {
        // 登录成功跳转到首页
        util.info('已获取到用户信息，跳转到首页')
        if (r.type == 'DZ' || r.type == 'DY') {
          wx.redirectTo({
            url: '../index/index'
          })
        }else {
          wx.redirectTo({
            url: '../index2/index'
          })
        }
        wx.hideLoading()
      })
    }else {
      let userInfo = app.globalData.userInfo
      if (userInfo.type == 'DZ' || userInfo.type == 'DY') {
        wx.redirectTo({
          url: '../index/index'
        })
      } else {
        wx.redirectTo({
          url: '../index2/index'
        })
      }
    }
  }
})