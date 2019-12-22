// miniprogram/pages/newIndex/newIndex.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    currentTab: 0,
    navigations: [
      {
        "text": "权益",
        "title": "权益列表",
        "iconPath": "/images/qysy/u36.png",
        "selectedIconPath": "/images/qysy/u36.png",
        "pagePath": "/pages/welfare/welfare"
      },
      {
        "text": "好店",
        "title": "门店",
        "iconPath": "/images/qysy/u40.png",
        "selectedIconPath": "/images/qysy/u40.png",
        "pagePath": "/pages/shop/shopRecommend"
      },
      {
        "text": "本店",
        "title": "商家中心",
        "iconPath": "/images/qysy/u40.png",
        "selectedIconPath": "/images/qysy/u40.png",
        "pagePath": "/pages/myshop/myshop"
      },
      {
        "text": "我的",
        "title": "我的",
        "iconPath": "/images/qysy/u44.png",
        "selectedIconPath": "/images/qysy/u44.png",
        "pagePath": "/pages/member/member"
      }
    ] 
  },

  /**
   * 首页加载
   * 1，获取用户信息
   * 2，该用户是否是会员
   * 2.1，是，跳转到权益页面
   * 2.2，否，停留在当前页面
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: that.data.navigations[0].title
    })
    that.initNav(app.globalData.userInfo)
  },

  swichNav: function (e) {
    let that = this;
    let index = e.target.dataset.current
    if (that.data.currentTab === index) {
      return false;
    } else {
      that.setData({
        currentTab: index
      })
      wx.setNavigationBarTitle({
        title: that.data.items[index].title
      })
    }
  },
  /**
   * 初始化导航菜单
   */
  initNav: function(userInfo) {
    let type = userInfo.type
    let items = []
    items[0] = this.data.navigations[0]
    items[1] = this.data.navigations[1]
    items[2] = this.data.navigations[2]
    items[3] = this.data.navigations[3]
    if(type == 'DY') {
      items.push(this.data.navigations[2])
    }
    if(type == 'HY') {
      items.push(this.data.navigations[3])
    }
    this.setData({
      items: items
    })
  }
})