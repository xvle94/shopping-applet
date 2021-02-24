// page/component/inteDetail/inteDetail.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral:[],
    pageNo: 1,
    pageSize: 3,
    totalPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 查询积分历史
   */
  getList(){
    var that = this;
    var result = wx.getStorageSync('result');
    let param = {
      userId : result.userInfo.id,
      pageNo : this.data.pageNo,
      pageSize: this.data.pageSize,
    }
    app.getReq('/api/user/integral/list',param,(res)=>{
      //如果返回有数据在加载
      if(res.result){
        var data = res.result.result;
        var integralData = that.data.integral;
        if(integralData.length === 0){
          integralData = data;
        }else{
          data.forEach(function(item, index){
            integralData.push(item);
          })
          
        }
       
        that.setData({
          integral: integralData,
          totalPage: res.result.totalPage,
          pageNo: res.result.pageNo,
          pageSize: res.result.pageSize,
        })
      }
    })
    console.log(that.data.integral.length);
    console.log("返回结果");
    console.log(that.data.integral);
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
    that.getList();
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
    wx.showNavigationBarLoading();
    console.log("下拉刷新");
    //用户下拉 加载下一页
    var totalPage = this.data.totalPage;
    var pageNo = this.data.pageNo;
    //如果当前页等于最后一页show无更多数据了
    if(totalPage === pageNo){
      wx.showToast({ icon: 'none', title: '没有更多数据了', })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      return;
    }else{
      this.setData({
        pageNo: (pageNo +1)
      })
      //加载列表数据
      let that = this;
      that.getList();
    }
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉刷新");

     //用户下拉 加载下一页
     var totalPage = this.data.totalPage;
     var pageNo = this.data.pageNo;
     //如果当前页等于最后一页show无更多数据了
     if(totalPage === pageNo){
       wx.showToast({ icon: 'none', title: '没有更多数据了', })
       return;
     }else{
       this.setData({
         pageNo: (pageNo +1)
       })
       //加载列表数据
       let that = this;
       that.getList();
     }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})