// components/welfare/welfare.js
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
    curPrecision: 0,  // 当前范围
    pageNo: 1, 
    pageSize: 20,
    query: undefined, // 搜索值
    searchLoading: false, // 正在加载
    loadingCompleted: false, // 已加载完数据
    precision: [
      {
        value: 1,
        text: '1千米内'
      },
      {
        value: 2,
        text: '2千米内'
      },
      {
        value: 20,
        text: '20千米内'
      },
      {
        value: 0,
        text: '全部'
      }
    ]
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let me = this
      let now = new Date().getTime()
      me.setData({
        search: this.search.bind(this),
        now: now
      })
      if (app.globalData.userInfo) {
        me.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          me.setData({
            wxUserInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.wxUserInfo = res.userInfo
            me.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }

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
          me.initData()
          
        }
      })
      // 位置变化
      wx.onLocationChange(function(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        me.setData({
          latitude: latitude,
          longitude: longitude
        })
        // me.loadData(1, false)
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
     * 搜索附近权益
     */
    search: function (value) {
      let me = this
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 搜索结果设置
          me.setData({
            query: value
          })
          me.loadData(1, false)
        }, 300)
      })
    },
    onBlur: function(e) {
      this.setData({
        query: e.detail.value
      })
    },
    clearSearch: function() {
      this.setData({
        query: undefined
      })
      this.loadData(1, false)
    },
    /**
     * 打开权益详细
     */
    openDetail: function (e) {
      let me = this
      // 是否已领取
      if (me.data.isMember) {
        let commodityId = e.target.id
        wx.navigateTo({
          url: '../welfareDetail/welfareDetail?commodityId=' + commodityId
        })
      }else {
        wx.showModal({
          title: '福瑞狗提示',
          content: '您还未领取狗狗哦！领取后可享受权益.点击【确定】查看如何领取',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../dog/noDog'
              })
            }
          }
        })
      }
    },
    /**
     * 加载更多
     */
    addMore: function(e) {
      let pageNo = this.data.pageNo + 1
      this.loadData(pageNo, true)
    },
    /**
     * 加载权益数据
     * @param pageNum 页数
     * @param isAppend 是否追加
     */
    loadData: function(pageNum, isAppend) {
      var me = this
      me.setData({
        searchLoading: true
      })
      // 请求地址
      let url = 'api/store/commodity-page?lat=' + me.data.latitude 
        + '&lon=' + me.data.longitude
        + '&precision=' + me.data.precision[me.data.curPrecision].value
        + '&pageNo=' + pageNum
        + '&pageSize=' + me.data.pageSize

      if (me.data.query) {
        url = url + '&storeName=' + me.data.query
      }
      wx.showLoading({
        title: '正在加载...',
      })
      // 获取门店权益
      httputil.request(url, {
        success(re) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          let datas
          let resData = re.data.data.data == undefined ? [] : re.data.data.data
          resData.forEach(function (e) {
            if (e.storeInfo.distance) {
              e.distance = util.getDistance(e.storeInfo.distance)
            }
          })
          if (isAppend) {
            datas = me.data.datas.concat(resData)
          }else {
            datas = resData
          }
          if (resData.length == 0) {
            me.setData({
              loadingCompleted: true
            })
            setTimeout(function(){
              wx.showToast({
                title: '已全部加载',
                icon: 'success',
                duration: 1000
              })
            }, 1000)
          }
          me.setData({
            datas: datas,
            searchLoading: false,
            pageNo: pageNum
          })
        }
      })
    },
    swichNav: function (e) {
      var me = this
      if (me.data.curPrecision === e.target.dataset.current) {
        return false
      } else {
        me.setData({
          curPrecision: e.target.dataset.current,
          datas: [],
        })
        me.loadData(1, false)
      }
    },
    /**
     * 初始化数据
     */
    initData: function () {
      let me = this
      if (util.isMember()) {
        let dog = me.data.userInfo.dog
        let start = new Date().getTime()
        let days = util.getTimeDiff(start, dog.lastDate) + 1
        me.setData({
          isMember: true,
          remainsDays: days
        })
      }
      // 系统信息
      if (!app.globalData.systemInfo) {
        wx.getSystemInfo({
          success: res => {
            app.globalData.systemInfo = res
            let listHeight = (me.data.isMember ? res.windowHeight - 324 : res.windowHeight - 184)
            me.setData({
              listHeight: listHeight,
              detailWidth: res.windowWidth - 125
            })
          }
        })
      }

      // 获取门店权益
      me.loadData(1, false)
    }
  }
})
