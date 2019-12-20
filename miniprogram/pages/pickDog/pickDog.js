// miniprogram/pages/pickDog/pickDog.js
Page({

  data: {
    
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight,
          inputWidth: res.windowWidth - 130
        })
      }
    })
  }
})