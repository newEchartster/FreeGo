// components/shop/shopRecommend.js
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
    currentTab: 0,
    listHeight: 400,
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let me = this
      wx.getSystemInfo({
        success: res => {
          me.setData({
            winHeight: res.windowHeight - 220,
            winWidth: res.windowWidth
          })
        }
      })
      // 位置信息
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          me.setData({
            latitude: latitude,
            longitude: longitude
          })
         
          me.initData(app.globalData.userInfo)
        }
      })
      // 位置变化
      wx.onLocationChange(function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        me.setData({
          latitude: latitude,
          longitude: longitude
        })
        // me.reload()
      })
    },
    moved: function () { },
    detached: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 进入店铺
     */
    goToShop: function (options) {debugger
      let shopId = options.target.id
      wx.navigateTo({
        url: '../shopDetail/shopDetail?shopId=' + shopId,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (shopId) {
            console.log(data)
          }
        },
      })
    },
    //事件处理函数
    bindChange: function (e) {
      var me = this;
      me.setData({ currentTab: e.detail.current });
    },
    swichNav: function (e) {
      var me = this;
      if (me.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        me.setData({
          currentTab: e.target.dataset.current
        })
      }
    },
    initData: function() {
      let me = this
      // 获取今日推荐
      httputil.request({
        method: 'get',
        success(re) {
          me.setData({
            jrtj: re.data.data.data == undefined ? [] : re.data.data.data
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/store/page/recommend')
      // 获取门店列表
      httputil.request({
        method: 'get',
        data: {
          lat: me.data.latitude,
          lon: me.data.longitude,
          precision: 0
        },
        success(re) {
          me.setData({
            allShop: re.data.data.data == undefined ? [] : re.data.data.data
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/store/page')
      // 获取门店分类
      httputil.request({
        method: 'get',
        success(re) {
          me.setData({
            category: re.data.data == undefined ? [] : re.data.data
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'admin/store/types')
    }
  }
})
