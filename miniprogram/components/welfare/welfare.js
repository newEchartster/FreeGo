// components/welfare/welfare.js
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
    curPrecision: 0,
    pageSize: 20,
    query: undefined,
    precision: [
      {
        value: 6,
        text: '1千米内'
      },
      {
        value: 5,
        text: '2千米内'
      },
      {
        value: 4,
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
      me.setData({
        search: this.search.bind(this)
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

      // 系统信息
      if (!app.globalData.systemInfo) {
        wx.getSystemInfo({
          success: res => {
            app.globalData.systemInfo = res
            me.setData({
              listHeight: res.windowHeight - 185,
              detailWidth: res.windowWidth - 125
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
        me.loadData(1, false)
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
    openDetail: function () {
      wx.navigateTo({
        url: '../welfareDetail/welfareDetail'
      })
    },
    /**
     * 加载权益数据
     * @param pageNum 页数
     * @param isAppend 是否追加
     */
    loadData: function(pageNum, isAppend) {
      var me = this
      // 请求地址
      let url = 'api/store/commodity-page?lat=' + me.data.latitude 
        + '&lon=' + me.data.longitude
        + '&precision=' + me.data.precision[me.data.curPrecision].value
        + '&pageNo=' + pageNum
        + '&pageSize=' + me.data.pageSize

      if (me.data.query) {
        url = url + '&storeName=' + me.data.query
      }

      // 获取门店权益
      httputil.request({
        method: 'get',
        success(re) {
          let datas = re.data.data.data == undefined ? [] : re.data.data.data
          datas.forEach(function (e) {
            if (e.storeInfo.distance) {
              e.distance = me.getDistance(e.storeInfo.distance)
            }
          })
          me.setData({
            datas: datas
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, url)
    },
    swichNav: function (e) {
      var me = this
      if (me.data.curPrecision === e.target.dataset.current) {
        return false
      } else {
        me.setData({
          curPrecision: e.target.dataset.current
        })
        me.loadData(1, false)
      }
    },
    getDistance: function(dis) {
      if (dis <= 100) {
        return '<100m'
      }
      if (dis <= 1000) {
        return Math.round(dis) + 'm'
      }
      if(dis > 20000) {
        return '>20km'
      }
      return Math.round(dis/1000) + 'km'
    },
    /**
     * 初始化数据
     */
    initData: function () {
      let me = this
      // 是否是会员
      if (app.globalData.userInfo.type == 'HY') {
        me.setData({
          isMember: true
        })
      }
      // 获取权益券数量
      httputil.request({
        method: 'get',
        success(re) {
          me.setData({
            canUseCount: re.data.data == undefined ? 0 : re.data.data
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/user/code/count/unuse')
      // 获取权益券价值
      httputil.request({
        method: 'get',
        success(re) {
          me.setData({
            totalValue: re.data.data == undefined ? 0 : re.data.data
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/user/code/amount/unuse')
      // 获取权益优惠值
      httputil.request({
        method: 'get',
        success(re) {
          me.setData({
            saveValue: re.data.data == undefined ? 0 : re.data.data
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/user/code/amount/used')

      // 获取门店权益
      me.loadData(1, false)
    }
  }
})
