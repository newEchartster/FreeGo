// miniprogram/pages/manageMem/addEmp/addEmp.js
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
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight,
          inputWidth: res.windowWidth - 110
        })
      }
    })
  }
})