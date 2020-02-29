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
      serverDomain: "https://www.luttevip.cn/api/"
    }
  }

})
