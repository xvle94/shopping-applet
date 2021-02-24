// page/component/integral/integral.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      product:[],
      // markId:'',
      totalScore:'',
      pageNo:1,
      pageSize:10,
      flag:true,
      queryList:[],
      select: false,
      markId:{
       markId:'1247578892161146882'
      },
      tihuoWay:'',
  },
  bindShowMsg() {
    this.setData({
        select:!this.data.select
    })
  },
  mySelect(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      markId:{
        markId:id
      },
      select: false,
      tihuoWay:name,
      product:[],
      flag:true
    })
    that.getProduct(1,that.data.pageSize,that.data.markId.markId);
  },
  getList(){
    app.getReq('/api/applet/mark/queryAll','',(res) => {
      var that = this;
      that.setData({
        // tihuoWay:res.result[0].name,
        queryList:res.result
      })
    })
  },
  getProduct(pageNo,pageSize,markId){
    var that = this;
    var query = {
      pageNo : pageNo,
      pageSize : pageSize,
      markId: markId||that.data.markId.markId
    }
    console.log(query+that.data.flag)
    if(that.data.flag){
      app.getReq('/api/applet/integral/commodity/list',query,(res) => {
        console.log(res);
        let arr1 = that.data.product;
        let arr2 = res.result.result;
        arr1 = arr1.concat(arr2);
        that.setData({
          product:arr1,
        });
        if(arr2.length==0){
          that.setData({
            flag:false
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var sysUserInfo=  wx.getStorageSync('sysUserInfo');
    that.setData({
      totalScore: sysUserInfo.totalScore
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
    that.getList();
    var sysUserInfo=  wx.getStorageSync('sysUserInfo');
    var marksInfo =  wx.getStorageSync('marksInfo');
    console.log(marksInfo)
    that.setData({
      product:[],
      totalScore:sysUserInfo.totalScore,
      markId:{
        markId:marksInfo.markId
      },
      tihuoWay:marksInfo.markName
    })
    that.getProduct(1,10,that.data.markId.markId);
  },

  //跳转积分商品详情
  goIntegralInfo(e){
    // url="/page/component/details2/details2?id={{item.id}}"
    var id=e.currentTarget.dataset.id
    var result =  wx.getStorageSync('result');
    if(!result){
       wx.showToast({
        title: '请登录后使用',
        icon: 'none',
        duration:2000,
        success:function(){
          setTimeout(function() {
            wx.navigateTo({
              url:"../../login/login"
            })
          }, 1000);
        }
      })
    }else{
      wx.navigateTo({
        url:"../details2/details2?id="+id
      })
    }
  },
  goExchange(e){
    var id=e.currentTarget.dataset.index
    var result =  wx.getStorageSync('result');
    if(!result){
       wx.showToast({
        title: '请登录后进行兑换',
        icon: 'none',
        duration:2000,
        success:function(){
          setTimeout(function() {
            wx.navigateTo({
              url:"../../login/login"
            })
          }, 1000);
        }
      })
    }else{
      wx.navigateTo({
        url:"../point/point?id="+id
      })
    }
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
    setTimeout(()=>{
      that.setData({
        product:[]
      })
      that.getProduct(1,10,that.data.markId.markId);
    }, 1000)
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
    that.getProduct(pageNo,that.data.pageSize,that.data.markId.markId);
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})