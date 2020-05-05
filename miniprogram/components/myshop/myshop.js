// components/myshop/myshop.js
const app = getApp()
const httputil = require('../../utils/httputil.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    totalHX: 0,//总共核销
    todayHX: 0 //今日核销
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let me = this
      let userInfo = app.globalData.userInfo
      me.setData(userInfo)
      let memType = userInfo.type
      if (memType) {
        if (memType == 'DZ') {
          this.setData({
            isEmp: false,
            userType: '店长'
          })
        } else {
          this.setData({
            isEmp: true,
            userType: '店员'
          })
        }
      }

      // 店家信息
      let storeInfo = userInfo.storeInfo
      if (userInfo.storeInfo) {
        this.setData({
          logoPath: storeInfo.imgUrl,
          shopName: storeInfo.name
        })
        let storeId = userInfo.storeInfo.storeId
        if (storeId) {
          // 获取所有核销数量
          httputil.request('api/store/code/used/count?storeId=' + storeId, {
            success(re) {
              me.setData({
                totalHX: re.data.data
              })
            }
          })
          // 获取今日核销数量
          httputil.request('api/store/code/used/day-count?storeId=' + storeId, {
            success(re) {
              me.setData({
                todayHX: re.data.data
              })
            }
          })
        }
      }
      
    },
    moved: function () { },
    detached: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 扫码核销权益
    scan4UseWelfare: function () {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          let code = res.result
          // 扫码核销权益
          httputil.request('api/store/useCode', {
            method: 'post',
            data: {
              code: code
            },
            success(re) {
              console.log('扫码核销成功')
            }
          })
        }
      })
    }
  }
})
