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
      let storeId = undefined
      if (userInfo.storeInfo) {
        storeId = userInfo.storeInfo.storeId
      }
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
      // 获取所有会员数量
      httputil.request('api/store/vip/count?storeId=' + storeId, {
        success(re) {
          me.setData({
            memberList: re.data.data
          })
        }
      })
      
      // 店家信息
      let storeInfo = userInfo.storeInfo
      if (storeInfo) {
        this.setData({
          logoPath: storeInfo.imgUrl,
          shopName: storeInfo.name
        })
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
    },
    /**
     * 打开核销统计页面
     */
    openStatistc: function (e) {
      let shopId = undefined
      if (this.data.storeInfo) {
        shopId = this.data.storeInfo.storeId
      }
      let url = '/pages/statistic/statistic?shopId=' + shopId
      if (e.currentTarget.id == 'today') {
        url += '&istoday=' + 1
      }
      wx.navigateTo({
        url: url
      })
    },
    /**
     * 打开会员列表
     */
    memberList: function () {
      let shopId = undefined
      if (this.data.storeInfo) {
        shopId = this.data.storeInfo.storeId
      }
      wx.navigateTo({
        url: '/pages/hisMember/hisMember?shopId=' + shopId
      })
    }
  }
})
