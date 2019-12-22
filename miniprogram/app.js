//app.js
const httputil = require('/utils/httputil.js')

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      appid: "wx52a0703cd61e42af",
      appsecret: "91ca88dd4bd98cf5a0acbe13853d347a",
      serverDomain: "http://47.93.36.254/"
    }

    // 未登录进行登录
    if (!this.globalData.logged) {
      // 获取openid进行平台登录，登录成功修改logged为true
      this.getOpenid(function (openid) {
        httputil.login(openid)
      })
    }
  },
  /**
   * 获取用户唯一凭证openid
   * @FIXME 使用云开发如此，不使用需要调用服务api获取 
   */
  getOpenid: function (fn) {
    let me = this
    // 调用云函数
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     me.globalData.openid = res.result.openid
    //     me.globalData.logged = true
    //     if (typeof fn === 'function') {
    //       fn(me.globalData.openid)
    //     }
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //   }
    // })
    // 非云开发
    wx.login({
      //获取code
      success: function (res) {
        const code = res.code //返回code
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + me.globalData.appid + '&secret=' + me.globalData.appsecret +'&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            me.globalData.openid = res.data.openid //返回openid
            if (typeof fn === 'function') {
              fn(me.globalData.openid)
            }
          }
        })
      }
    })
  }

})
