// components/myshop/myshop.js
const app = getApp()

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
    logoPath: "/images/qysy/u139.jpg",
    shopName: "光速卡丁车"
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let memType = app.globalData.memType
      if (memType) {
        if (memType == 'DZ') {
          this.setData({
            userType: '店长'
          })
        } else {
          this.setData({
            userType: '店员'
          })
        }
      }
      // TODO 获取店家信息，核销信息
      this.setData({
        todayHX: 5,
        totalHX: 103,
        memberList: 26
      })
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
          console.log(res)
        }
      })
    },
    /**
     * 打开核销统计页面
     */
    openStatistc: function (e) {
      let shopId = e.target.id
      wx.navigateTo({
        url: '/pages/myshop/statistic/statistic?isToday=' + shopId
      })
    },
    /**
     * 打开会员列表
     */
    memberList: function () {
      let shopId = e.target.id
      wx.navigateTo({
        url: 'statistic/statistic?isToday=' + shopId
      })
    }
  }
})
