// miniprogram/pages/shop/shopRecommend.js
Page({

  /**
   * 页面的初始数据
   * recoToday:[] 今日推荐
   * allShop:[
   *  A:[],
   *  B:[]
   *  ...
   * ]
   */
  data: {
    listHeight: 400,
    jrtj: [
      {
        shopId: 1,
        shopName: '新光速卡丁车',
        logoPath: "/images/qysy/u139.jpg"
      },
      {
        shopId: 2,
        shopName: '龙门花甲',
        logoPath: "/images/qysy/u99.jpg"
      },
      {
        shopId: 3,
        shopName: '唱吧麦颂KTV',
        logoPath: "/images/qysy/u115.jpg"
      },
      {
        shopId: 4,
        shopName: '千伊秀',
        logoPath: "/images/qysy/u127.jpg"
      },
    ],
    syhd: [
      {
        tagName: '美食饮品',
        datas: [
          {
            shopId: 2,
            shopName: '龙门花甲',
            logoPath: "/images/qysy/u99.jpg"
          }
        ]
      },
      {
        tagName: '休闲娱乐',
        datas: [
          {
            shopId: 1,
            shopName: '新光速卡丁车',
            logoPath: "/images/qysy/u139.jpg"
          },
          {
            shopId: 3,
            shopName: '唱吧麦颂KTV',
            logoPath: "/images/qysy/u115.jpg"
          }
        ]
      },
      {
        tagName: '服饰美妆',
        datas: [
          {
            shopId: 4,
            shopName: '千伊秀',
            logoPath: "/images/qysy/u127.jpg"
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight - 150,
          winWidth: res.windowWidth
        })
      }
    })
  },

  /**
   * 进入店铺
   */
  goToShop: function (options) {
    let shopId = options.target.id
    wx.navigateTo({
      url: '../shopDetail/shopDetail?shopId=' + shopId
    })
  }

})