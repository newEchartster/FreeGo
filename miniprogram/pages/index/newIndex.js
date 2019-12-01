// miniprogram/pages/newIndex/newIndex.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false
  },

  /**
   * 首页加载
   * 1，获取用户信息
   * 2，该用户是否是会员
   * 2.1，是，跳转到权益页面
   * 2.2，否，停留在当前页面
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 系统信息
    if (!app.globalData.systemInfo) {
      wx.getSystemInfo({
        success: res => {
          app.globalData.systemInfo = res
          // 未登录进行登录，是会员登录后直接跳转权益主页
          if (!app.globalData.logged) {
            // 获取openid进行校验用户是否是会员
            this.getOpenid(function(openid) {
              app.isMember(openid, function(res) {
                if(res) {
                  wx.redirectTo({
                    url: '../welfare/welfare',
                  })
                  return
                }
              });
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 获取用户唯一凭证openid
   * @FIXME 使用云开发如此，不使用需要调用服务api获取 
   */
  getOpenid: function (fn) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        app.globalData.logged = true
        if(typeof fn === 'function') {
          fn(app.globalData.openid)
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    // 非云开发
    // wx.login({
    //   //获取code
    //   success: function (res) {
    //     code = res.code //返回code
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.appid + '&secret=' + app.globalData.appsecret +'&js_code=' + code + '&grant_type=authorization_code',
    //       data: {},
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function (res) {
    //         app.globalData.openid = res.data.openid //返回openid
              // if (typeof fn === 'function') {
              //   fn(app.globalData.openid)
              // }
    //       }
    //     })
    //   }
    // })
  },
  /**
   * 跳转权益主页
   */
  onGotoWelfare: function() {
    wx.redirectTo({
      url: '../welfare/welfare',
    })
  }

})