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
        "iconPath": "/images/icon/zuanshi.svg",
        "selectedIconPath": "/images/icon/zuanshi.svg",
        "pagePath": "/pages/welfare/welfare"
      },
      {
        "text": "好店",
        "title": "门店",
        "iconPath": "/images/icon/store.svg",
        "selectedIconPath": "/images/icon/store.svg",
        "pagePath": "/pages/shop/shopRecommend"
      },
      {
        "text": "我的",
        "title": "我的",
        "iconPath": "/images/icon/bussiness-man.svg",
        "selectedIconPath": "/images/icon/bussiness-man.svg",
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
        title: that.data.navigations[index].title
      })
    }
  }
})