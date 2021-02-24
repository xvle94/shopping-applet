// page/component/new-pages/user/address/address.js
const app = getApp()
Page({
  data:{
    address:[],
  },
  getList(){
    var that = this;
    var result = wx.getStorageSync('result');
    var userId = result.userInfo.id;
    let addressData = {
      userId : result.userInfo.id,
      pageNo : 1,
      pageSize:10,
      column:'defaultStatus',
      order:'desc'
    }
    app.getReq('/api/user/address/list',addressData,(res)=>{
      console.log(res);
      that.setData({
        address:res.result.records
      })
    })
  },
  getid(e){
    const pages = getCurrentPages()
    const prevPage = pages[pages.length-2] // 上一页
    // 调用上一个页面的setData 方法，将数据存储
    prevPage.setData({
      adsId:e.currentTarget.dataset.id
    })
    // prevPage.loadData();
    // 返回上一页
    wx.navigateBack({
      delta: 1,
      success: function () {
        //调用前一个页面的方法updateTime()。
        // prevPage.getAddress(); 
      }
    })
  },
  goAddressEdit(e){
    var that = this;
    var id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({  
      url:"../editAddress/editAddress?id="+id,
      // url:"../editAddress2/editAddress2?id="+id,
    })
  },
  onShow: function () {
    let that = this;
    that.getList();
    // that.getCommodity();
  },
  onLoad:function(options){
    var that = this;
  },

})