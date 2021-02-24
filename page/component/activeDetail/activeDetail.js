// page/component/activeDetail/activeDetail.js
// 引入对HTML内容解析的处理类
const WxParse = require('../../../util/wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:{},
    imgheader: app.baseUrl + '/appletImg/upload/',
    createTime: "",
    // attrs: {
    //   class: 'div_class',
    //   style: 'line-height: 60px; color: red;'
    // },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){
    var that = this;
    console.log(options.id);
    that.setData({
      id:options.id
    },()=>{
      that.getActiveInfo()
    })
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

  //活动详情
  getActiveInfo(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var query = {
      id : that.data.id
    }
    app.getReq('/api/applet/activity/info',query,(res) => {
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      if(res.result){
        var result = res.result
        var data = { content: res.result.introduceString };
        result.createTime = res.result.createTime.substring(5,16)
        that.setData({
          active: result,
        })
        WxParse.wxParse('content', 'html', data.content, that, 25);
      }
    })
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