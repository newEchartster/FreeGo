// miniprogram/pages/welfare/welfare.js
const app = getApp()
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUseCount: 63,
    totalValue: 3650,
    saveValue: 1200,
    isMember: true,
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
        logoPath: "/images/qysy/u139.jpg",
        distance: "300m"
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
        logoPath: "/images/qysy/u99.jpg",
        distance: "500m"
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
        logoPath: "/images/qysy/u115.jpg",
        distance: "1.2km"
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
        logoPath: "/images/qysy/u127.jpg",
        distance: "2.3km"
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
          // // 未登录进行登录
          // if (!app.globalData.logged) {
          //   // 获取openid进行校验用户是否是会员
          //   app.getOpenid(function (openid) {
          //     httputil.login(openid)
          //     app.isMember(openid, function (res) {
          //       if (res && me.globalData.memType == 'HY') {
          //         this.setData({
          //           isMember: true
          //         })
          //       }
          //     });
          //   })
          // }
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
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      search: this.search.bind(this)
    })
  },
  /**
   * 搜索附近权益
   */
  search: function(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 搜索结果设置
      }, 200)
    })
  },
  /**
   * 打开权益详细
   */
  openDetail: function() {
    wx.navigateTo({
      url: '../welfareDetail/welfareDetail'
    })
  }
})