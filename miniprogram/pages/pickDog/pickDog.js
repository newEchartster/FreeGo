// miniprogram/pages/pickDog/pickDog.js
const httputil = require('../../utils/httputil.js')

Page({

  data: {
    hidden: true,
    second: 60,
    btnValue: '获取验证码'
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
  },
  // 绑定手机号
  tiesPhone: function () {
    let me = this
    let phone = this.data.phone;
    let re = new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$")
    if (!re.test(phone)) {
      wx.showToast({
        title: '请填写正确手机号',
        duration: 2000
      })
      return
    }
    httputil.request('api/user/sms/send?phone=' + phone, {
      method: 'post',
      success(re) {
        console.log('获取验证码成功！')
        me.timer();
        return;
      }
    })
  },
  bindPhoneInput(e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    })
    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  bindCodeInput(e) {
    var val = e.detail.value;
    if (val.length == 6) {
      let phone = this.data.phone
      httputil.request('api/store/dog/add?phone=' + phone, {
        method: 'post',
        success(re) {
          wx.showToast({
            title: re.data.msg,
            icon: 'success',
            duration: 5000
          })
        }
      })
    }
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  }
})