// miniprogram/pages/manageMem/addEmp/addEmp.js
const httputil = require('../../../utils/httputil.js')

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
  },
  /**
   * 获取短信验证码
   */
  getCode: function() {
    let phone = this.data.phone
    httputil.request('api/user/sms/send?phone=' + phone, {
      method: 'post',
      success(re) {
        console.log('获取验证码成功！')
      }
    })
  },
  /**
   * 设置电话
   */
  setPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 添加员工
   */
  formSubmit: function (e) {
    let formData = e.detail.value
    // 后台保存
    httputil.request('api/store/employee/add-phone?phone=' + formData.phone, {
      method: 'post',
      data: formData,
      success(re) {
        wx.showToast({
          title: re.data.msg,
          icon: 'success',
          duration: 2000
        })
        if (re.data.code == '000') {
          // 返回列表页
          wx.navigateBack({
            success: function(res) {
            }
          })
        }
      }
    })
  }
})