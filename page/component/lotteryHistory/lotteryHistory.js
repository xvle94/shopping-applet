// page/component/lotteryHistory/lotteryHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history:[],
    pageNo:1,
    pageSize:10,
    flag:true,
  },

  //抽奖历史列表
  getHistoryList(pageNo,pageSize){
    var that=this;
    let sysUserInfo=  wx.getStorageSync('sysUserInfo');
    var query = {
      userId:sysUserInfo.id,
      pageNo:pageNo,
      pageSize:pageSize
    }
    if(that.data.flag){
      app.getReq('/api/applet/prize/history',query,(res)=>{
        console.log(res);
        let arr1 = that.data.history;
        let arr2 = res.result.result;
        arr1 = arr1.concat(arr2);
        that.setData({
          history:arr1
        })
      })
    }else{
      wx.stopPullDownRefresh();
    }
  },
  // 跳转抽奖兑换二维码页面
  goDrawCode(item){
    var itemData = item.currentTarget.dataset.item;
    //如果得到数据，那么进行判断
    if(itemData != undefined || itemData === null || itemData === ''){
      //如果是跳转外链
      wx.navigateTo({
        url: '/page/component/drawQrCode/drawQrCode?id=' + itemData.id
      })
   }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getHistoryList(that.data.pageNo,that.data.pageSize);
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
    var that = this;
    that.getHistoryList(1,10);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let pageNo = that.data.pageNo + 1;
    that.setData({
      pageNo:pageNo
    },()=>{
    that.getHistoryList(pageNo,that.data.pageSize);
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})