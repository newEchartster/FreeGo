// components/mine/mine.js
const app = getApp()
const util = require('../../utils/util.js')

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
    dogImg: '/images/icon/dog.png',
    contactImg: '/images/icon/contact.svg',
    docImg: '/images/icon/doc.svg',
    noteImg: '/images/icon/note.svg'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let me = this
      wx.getSystemInfo({
        success: res => {
          me.setData({
            headHeight: res.windowWidth / 2.4
          })
        }
      })
    },
    moved: function () { },
    detached: function () { },
  },
})
