// miniprogram/pages/initDB.js

/**
 * 初始化数据库
 * @author : kingc
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member : [
      { name: '杨过', gender: '男', type: 'DZ', phone: 13511111111, birth: '1987-01-01', address:'七一国际广场A'},
      { name: '韦小宝', gender: '男', type: 'DY', phone: 13922222222, birth: '1997-11-21', address:'嘉乐国际'},
      { name: '水笙', gender: '女', type: 'HY', phone: 13533333333, birth: '1985-05-06', address:'汇景新城'},
      { name: '狄云', gender: '男', type: 'YK', phone: 18744444444, birth: '1987-11-01', address:'七一国际广场B'}
    ],
    shop : [
      { code: 's001', name: '唱玩吧', managerId: '', location: '七一国际广场负一层',tel:'028-88888888',logo:'',detail:''},
      { code: 's002', name: '衣然', managerId: '', location: '七一国际广场负一层',tel:'028-66666666',logo:'',detail:''},
      { code: 's003', name: '翻滚吧，小龙虾', managerId: '', location: '七一国际广场负一层',tel:'13855555555',logo:'',detail:''}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    for(var i=0;i<4;i++) {
      db.collection('Member').add({
        data: this.data.member[i],
        success: res => {
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
      })
    }
    for(var i=0;i<3;i++) {
      db.collection('Shop').add({
        data: this.data.shop[i],
        success: res => {
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})