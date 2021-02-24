// page/component/parkHistory/parkHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    park:[],
    pageNo:1,
    pageSize:4,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getParkList(){
    var that = this;
    var result = wx.getStorageSync('result');
    var userId = result.userInfo.id;
    console.log(that.data.userInfo);
    let parkData = {
      userId : result.userInfo.id,
      pageNo:this.data.pageNo,
      pageSize:this.data.pageSize,
    }
    app.getReq('/api/park/list',parkData,(res)=>{
      console.log(res)
      that.setData({
        park:res.result.result
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
    let that = this;
    that.getParkList();
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
    let that = this;
    that.getParkList();

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