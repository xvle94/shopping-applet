// page/component/drawQrCode/drawQrCode.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCodeUrl: '',
    //兑奖编号
    id: '',
    //默认二维码宽度
    width: '430',
    //要跳转的页面
    page: 'page/component/drawConvert/drawConvert'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    // 获取当前页面栈
    var pages = getCurrentPages();
    //获取上一页的数据，-1表示上一页
    var paramData = pages[pages.length - 1];
    //得到对应的子订单号
    var id = paramData.options.id;
    if(id === undefined || id === null || id === ""){
      console.log("获取页面传递参数");
      console.log(pages);
      return false;
    }
    //赋值变量
    this.setData({
      id: id
    })
    //获取二维码
    this.getQrCode();

  },
  //获取兑奖二维码
  getQrCode: function(){
    var that = this;
    var params = {
      historyId: this.data.id,
      page: this.data.page,
      width: this.data.width
    }
    app.postReq('/api/wechart/qrCode/byHistoryId',params,(res)=>{
      console.log(res);
      if(res.code == 200){
        that.setData({
          qrCodeUrl: "data:image/png;base64," + res.result.qrCodeUrl
        })
      }
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