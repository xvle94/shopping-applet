const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop:[],
    markId:'',
    pageNo:1,
    pageSize:5,
    imgheader:'https://erbu.fyitgroup.net/appletImg/upload/',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getShopList(that.data.markId,that.data.pageNo,that.data.pageSize);
  },

  getShopList(markId,pageNo,pageSize){
    var that = this;
    var query = {
      markId:markId,
      pageNo:pageNo,
      pageSize:pageSize,
      status:2,
    }
    app.getReq('/api/applet/shops/list',query,(res) => {
      console.log(res);
      that.setData({
        shop:res.result.result
      })
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