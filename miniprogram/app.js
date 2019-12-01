//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      appid: "wx52a0703cd61e42af",
      appsecret: "91ca88dd4bd98cf5a0acbe13853d347a"
    }
  },
  /**
   * 判断用户是否是会员
   */
  isMember: function(openid, fn) {
    var me = this
    const db = wx.cloud.database()
    db.collection('Member').where({
      _openid: openid // 填入当前用户 openid
    }).get({
      success: function (res) {
        var isMember = false
        if (res.data.length == 1) {
          isMember = true
          me.globalData.memType = res.data[0].type
          me.globalData.userInfo.type = res.data[0].type
        }
        if (typeof fn === 'function') {
          fn(isMember)
        }
      }
    })
  },
  /**
   * 获取用户唯一凭证openid
   * @FIXME 使用云开发如此，不使用需要调用服务api获取 
   */
  getOpenid: function (fn) {
    let me = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        me.globalData.openid = res.result.openid
        me.globalData.logged = true
        if (typeof fn === 'function') {
          fn(me.globalData.openid)
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
  }

})
