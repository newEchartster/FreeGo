// miniprogram/pages/welfare/welfare.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUseCount: 63,
    totalValue: 3650,
    saveValue: 1200,
    list: [{
        "text": "权益",
        "iconPath": "/images/qysy/u36.png",
        "selectedIconPath": "/images/qysy/u36.png",
        "pagePath": "/pages/welfare/welfare"
      },
      {
        "text": "门店",
        "iconPath": "/images/qysy/u40.png",
        "selectedIconPath": "/images/qysy/u40.png",
        "pagePath": "/pages/shop/shopRecommend"
      }, {
        "text": "本店",
        "iconPath": "/images/qysy/u40.png",
        "selectedIconPath": "/images/qysy/u40.png",
        "pagePath": "/pages/myshop/myshop"
      }, {
        "text": "我的",
        "iconPath": "/images/qysy/u44.png",
        "selectedIconPath": "/images/qysy/u44.png",
        "pagePath": "/pages/member/member"
      }
    ],
    datas: [
      {
        id:1,
        title: '免费体验一圈',
        shopId: 1,
        shopName: '新光速卡丁车',
        detail: '',
        num: 1,
        value: 188,
        startDate: '2019.10.15',
        endDate: '2020.9.15',
        logoPath: "/images/qysy/u139.jpg"
      },
      {
        id:2,
        title: '到店即送花甲一份',
        shopId: 2,
        shopName: '龙门花甲',
        detail: '',
        num: 1,
        value: 20,
        startDate: '2019.10.15',
        endDate: '2020.12.15',
        logoPath: "/images/qysy/u99.jpg"
      },
      {
        id:3,
        title: '唱K即送哈啤24瓶',
        shopId: 3,
        shopName: '唱吧麦颂KTV',
        detail: '',
        num: 1,
        value: 288,
        startDate: '2019.11.15',
        endDate: '2020.2.15',
        logoPath: "/images/qysy/u115.jpg"
      },
      {
        id:1,
        title: '买衣服送T恤',
        shopId: 4,
        shopName: '千伊秀',
        detail: '',
        num: 1,
        value: 88,
        startDate: '2019.11.25',
        endDate: '2020.12.15',
        logoPath: "/images/qysy/u127.jpg"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 系统信息
    if (!app.globalData.systemInfo) {
      wx.getSystemInfo({
        success: res => {
          app.globalData.systemInfo = res
          this.setData({
            listHeight: res.windowHeight - 130,
            detailWidth: res.windowWidth - 125
          })
          // 未登录进行登录，是会员登录后直接跳转权益主页
          if (!app.globalData.logged) {
            // 获取openid进行校验用户是否是会员
            app.getOpenid(function (openid) {
              app.isMember(openid, function (res) {
                // if (res) {
                //   wx.redirectTo({
                //     url: '../welfare/welfare',
                //   })
                //   return
                // }
              });
            })
          }
        }
      })
    }
    // var tabbar = []
    // tabbar[0] = this.data.list[0]
    // tabbar[1] = this.data.list[1]
    // if (app.globalData.userInfo.type) {
    //   var type = app.globalData.userInfo.type
    //   if(type == 'DY' || type == 'DZ') {
    //     tabbar[2] = this.data.list[2]
    //   }else {
    //     tabbar[2] = this.data.list[3]
    //   }
    // }
    // this.setData({
    //   tabbars: tabbar,
    //   listHeight: app.globalData.systemInfo.windowHeight - 200,
    //   detailWidth: app.globalData.systemInfo.windowWidth - 125
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  search: function(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '搜索结果',
          value: 1
        }, {
          text: '搜索结果2',
          value: 2
        }])
      }, 200)
    })
  },
  // 切换tab页
  tabChange(e) {
    // wx.switchTab({
    //   url: '/pages/member/member'
    // })
  }
})