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
    httputil.request({
      method: 'post',
      success(re) {
        console.log('获取验证码成功！')
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'api/user/sms/send?phone=' + phone)
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
    // 校验
    // if (!this.WxValidate.checkForm(e)) {
    //   //表单元素验证不通过，此处给出相应提示
    //   let error = this.WxValidate.errorList[0];
    //   wx.showToast({
    //     title: error.msg,
    //     icon: 'none',
    //     duration: 3000
    //   })
    //   return false;
    // }
    // 后台保存
    httputil.request({
      method: 'post',
      data: formData,
      success(re) {
        wx.showToast({
          title: '添加成功！',
          icon: 'success',
          duration: 2000
        })
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'api/store/employee/add-phone?phone=' + formData.phone)
  }
})