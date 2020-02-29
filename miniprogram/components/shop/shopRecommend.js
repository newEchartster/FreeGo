// components/shop/shopRecommend.js
const app = getApp()
const util = require('../../utils/util.js')
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
    pageNo: 1,
    pageSize: 20,
    searchLoading: false, // 正在加载
    loadingCompleted: false, // 已加载完数据
    allShop: []
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
    goToShop: function (options) {
      let me = this
      let shopId = options.target.id
      let detail = me.getStoreDetail(shopId)
      wx.navigateTo({
        url: '../shopDetail/shopDetail?shopId=' + shopId + '&storeDetail=' + JSON.stringify(detail)
      })
    },
    //事件处理函数
    bindChange: function (e) {
      var me = this;
      me.setData({ currentTab: e.detail.current });
    },
    /**
     * 加载更多
     */
    addMore: function (e) {
      let pageNo = this.data.pageNo + 1
      this.loadData(pageNo)
    },
    /**
     * 加载权益数据
     * @param pageNum 页数
     */
    loadData: function (pageNum) {
      let me = this
      me.setData({
        searchLoading: true
      })
      let typeId = me.data.category[me.data.currentTab].id
      // 请求地址
      let url = 'admin/store/page/' + typeId + '?pageNo=' + pageNum + '&pageSize=' + me.data.pageSize

      wx.showLoading({
        title: '正在加载...',
      })
      // 获取分类门店
      httputil.request(url, {
        success(re) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          let resData = re.data.data.data == undefined ? [] : re.data.data.data
          resData.forEach(function (e) {
            if (e.distance) {
              e.distance = util.getDistance(e.distance)
            }
          })
          let datas = me.data.allShop.concat(resData)
          if (resData.length == 0) {
            me.setData({
              loadingCompleted: true
            })
            setTimeout(function () {
              wx.showToast({
                title: '已全部加载',
                icon: 'success',
                duration: 1000
              })
            }, 1000)
          }
          me.setData({
            allShop: datas,
            searchLoading: false,
            pageNo: pageNum
          })
        }
      })
    },
    swichNav: function (e) {
      var me = this;
      if (me.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        me.setData({
          currentTab: e.target.dataset.current,
          allShop: [],
        })
        // 获取门店列表
        me.loadData(1)
      }
    },
    initData: function() {
      let me = this
      // 获取今日推荐
      httputil.request('api/store/page/recommend', {
        success(re) {
          me.setData({
            jrtj: re.data.data.data == undefined ? [] : re.data.data.data
          })
        }
      })
   
      // 获取门店分类
      httputil.request('admin/store/types', {
        success(re) {
          me.setData({
            category: re.data.data == undefined ? [] : re.data.data
          })
          // 获取门店列表
          me.loadData(1)
        }
      })
    },
    getStoreDetail: function(storeId) {
      if (storeId) {
        let me = this
        // 今日推荐的商铺
        let store = me.data.jrtj
        for(let i=0;i<store.length;i++) {
          if (storeId == store[i].storeId) {
            return store[i]
          }
        }
        // 所有店铺
        let store2 = me.data.allShop
        for (let i = 0; i < store2.length; i++) {
          if (storeId == store2[i].storeId) {
            return store2[i]
          }
        }
      }
    }
  }
})
