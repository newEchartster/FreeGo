const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   * 1，轮播图链接地址列表
   * 2，店铺信息
   * 3，权益列表
   */
  data: {
    positionIcon: '/images/location.png',
    phoneIcon: '/images/phone.png',
    latitude: 30.82404,
    longitude: 104.15801,
    address: '成都市武侯区万顺一路',
    shopPhone: '13655555555'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopId = options.shopId
    // 获取店铺详细数据 TODO
    this.setData({
      shopPics: [
        '/images/qysy/u139.jpg',
        '/images/qysy/u99.jpg',
        '/images/qysy/u115.jpg'
      ],
      shopName: '新光速卡丁车',
      listHeight: 400,
      datas: [
        {
          id: 1,
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
          id: 2,
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
          id: 3,
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
          id: 1,
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
        }
      ]
    })
  },

  //预览图片
  previewImg: function (e) {
    util.previewImg(e)
  },
  /**
   * 定位导航
   */
  locateShop: function () {
    const latitude = this.data.latitude
    const longitude = this.data.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  /**
   * 拨打电话
   */
  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shopPhone
    })
  }
})