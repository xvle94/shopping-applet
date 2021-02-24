// page/component/details2/details2.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:{},
    imgheader: app.baseUrl + '/appletImg/upload/',
    detailMap:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id);
    that.setData({
      id:options.id
    },()=>{
      that.getCommodityInfo()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //商品详情
  getCommodityInfo(){
    var that = this;
    var query = {
      id : that.data.id
    }
    app.getReq('/api/applet/integral/commodity/info',query,(res) => {
      console.log(res);
      if(res.code=200){
        if(res.result.detailMap!=null){
          that.setData({
            goods:res.result,
            detailMap:res.result.detailMap.split(','),
          })
        }else{
          that.setData({
            goods:res.result,
            detailMap:res.result.detailMap
          })
        }
      }else{
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
      }

      
      
    })
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
  onPullDownRefresh :function () {
      var that = this;
      setTimeout(()=>{
        that.getCommodityInfo();
    }, 1000)
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