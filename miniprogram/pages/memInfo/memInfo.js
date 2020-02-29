// miniprogram/pages/memInfo/memInfo.js
import WxValidate from "../../utils/wxValidate";
const app = getApp()
const httputil = require('../../utils/httputil.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    second: 60,
    genderRadio: [{
      key: 'M',
      value: '男'
    }, {
      key: 'F',
      value: '女'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this
    this.initValidate()
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth,
          inputWidth: res.windowWidth - 110
        })
      }
    })
    // 获取个人资料
    httputil.request('api/user/info', {
      success(re) {
        let data = re.data.data
        if(!data.birthday) {
          data.birthday = '请选择'
        }
        if(!data.address) {
          data.address = '请选择'
        }
        me.setData(data)
        app.globalData.userInfo = data
      }
    })
  },

  /**
   * 保存个人资料
   */
  formSubmit: function(e) {
    let formData = e.detail.value
    // 校验
    if (!this.WxValidate.checkForm(e)) {
      //表单元素验证不通过，此处给出相应提示
      let error = this.WxValidate.errorList[0];
      wx.showToast({
        title: error.msg,
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    let url = 'api/user/update?nickName=' + formData.nickName
      + '&gender=' + formData.gender
      + '&phone=' + formData.phone
      + '&birthday=' + formData.birthday
      + '&address=' + formData.address

    // 后台保存
    httputil.request(url, {
      method: 'post',
      success(re) {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生日修改
   */
  bindDateChange: function(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  /**
   * 地址修改
   */
  bindRegionChange: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  /**
   * 初始化校验
   */
  initValidate() {
    let rules = {
      nickName: {
        maxlength: 20
      },
      phone: {
        required: true,
        tel: true
      }
    }

    let message = {
      nickName: {
        maxlength: '昵称不能超过20个字'
      },
      phone: {
        required: '请输入手机号',
        tel: "请输入正确的电话号码"
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  },
  //预览图片
  previewImg: function (e) {
    util.previewImg(e)
  },
  // 绑定手机号
  tiesPhone: function() {
    let me = this
    let phone = this.data.phone;
    let re = new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$")
    if (!re.test(phone)) {
      wx.showToast({
        title: '请填写正确手机号',
        duration: 2000
      })
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
    if(val.length == 6) {
      httputil.request('api/user/sms/bind?code=' + val, {
        method: 'post',
        success(re) {
          console.log('绑定手机号成功！')
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
  },
  upload: function () {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        const uid = app.globalData.userInfo.uid
        // 获取上传地址
        httputil.request('api/user/generateSignHeaderUrl', {
          success(re) {
            let data = re.data.data
            // wx.uploadFile({
            //   // method: 'post',
            //   url: re.data.data,
            //   header: {
            //     'x-oss-meta-author': uid,
            //     'Content-Type': 'application/octet-stream'
            //   },
            //   filePath: tempFilePaths[0],
            //   name: 'file',
            //   formData: {
            //     'success_action_status': '200',
            //   },
            //   success(res) {
            //     const data = res.data
            //     debugger
            //   }
            // })
            let formData = {
              'policy': "xxxxxxxxxxxxxxxxxxxxxx",
              'success_action_status': '200',
              'key': 'abaa003a2397404fbff1294b59121e50.jpg'
            }
            wx.uploadFile({
              url: 'https://tide-life-pub.oss-accelerate.aliyuncs.com/imgs/header',//开发者服务器 url
              filePath: tempFilePaths[0],
              name: 'file',//必须填file
              formData: formData,
              header: {
                "Content-Type": "multipart/form-data",
              },
              // formData: {
              //   'key': 'abaa003a2397404fbff1294b59121e50.jpg',
              //   'OSSAccessKeyId': accessid,
              //   'signature': signature,
              //   'success_action_status': '200',
              // },
              success: function (res) {
                if (res.statusCode != 200) {
                  failc(new Error('上传错误:' + JSON.stringify(res)))
                  return;
                }
                successc(aliyunServerURL + aliyunFileKey);
              },
              fail: function (err) {
                err.wxaddinfo = aliyunServerURL;
                failc(err);
              }
            })
          }
        })
      }
    })
  }
})