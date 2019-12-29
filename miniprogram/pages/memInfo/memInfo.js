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
    // nickname: '大西瓜',
    // portrait: '',// 头像地址
    // phoneNum: 13556767788,
    // birthday: '1987-10-21',
    // address: '西环里'
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
    if (!app.globalData.userInfo) {
      // 获取个人资料
      httputil.request({
        method: 'get',
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
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/user/info')
    }else {
      me.setData(app.globalData.userInfo)
    }
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
    // 后台保存
    httputil.request({
      method: 'post',
      data: formData,
      success(re) {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 2000
        })
      },
      fail(r) {
        console.error('[' + r.data.code + ']:' + r.data.message)
      }
    }, 'api/user/update')
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
  upload: function () {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        const uid = app.globalData.userInfo.uid
        // 获取上传地址
        httputil.request({
          method: 'get',
          success(re) {
            wx.uploadFile({
              method: 'put',
              url: re.data.data,
              header: {
                'x-oss-meta-author': uid,
                'Content-Type': 'application/octet-stream'
              },
              filePath: tempFilePaths[0],
              name: 'file',
              // formData: {
              //   'success_action_status': '200',
              // },
              success(res) {
                const data = res.data
                debugger
              }
            })
          },
          fail(r) {
            console.error('[' + r.data.code + ']:' + r.data.message)
          }
        }, 'api/user/generateSignHeaderUrl')
      }
    })
  }
})