// page/component/point/point.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    pointData: {},
    imgheader:'https://erbu.fyitgroup.net/appletImg/upload/',
    contactName:'',
    contactPhone:'',
    buyIntegral:'',
    status:true
  },

  /**
   * 获取自取信息
   */
  // contactName:function (e) {
  //   this.setData({
  //     contactName: e.detail.value
  //   })
  //   console.log(this.data.contactName)
  // },
  // contactPhone:function (e) {
  //   this.setData({
  //     contactPhone: e.detail.value
  //   })
  //   console.log(this.data.contactPhone)
  // },

  //积分商品详情
  commodityInfo(id){
    var that = this;
    var query = {
      id : id
    }
    app.getReq('/api/applet/integral/commodity/info',query,(res) => {
      console.log(res);
      that.setData({
        pointData: res.result,
        buyIntegral:res.result.buyIntegral
      })
      console.log(that.data.buyIntegral)
    })
  },

  //积分兑换
  doPay(){
    var that = this;
    var result = wx.getStorageSync('result');
    if(!result){
      wx.showToast({
       title: '请登录',
       icon: 'none'
     })
     setTimeout(function () {
       //跳转登录页面
       wx.navigateTo({
         url: '/page/login/login',
       })
     }, 3000)
     return;
   }


    if(result.userInfo.id==null || result.userInfo.id==""){
        that.setData({
          status:false
        })
    }
    var userId = result.userInfo.id;
    var query = {
      userId:userId,
      commodityId:that.data.id,
      contactName:result.userInfo.nickName,
      contactPhone:result.userInfo.phone,
    }
    console.log(query)
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // if(that.data.contactName.length == 0){
    //   wx.showToast({
    //     title: '联系人不能为空',
    //     icon:'none',
    //     duration: 1500
    //   })
    //   return false;
    // }else if(that.data.contactPhone.length == 0){
    //   wx.showToast({
    //     title: '手机号不能为空',
    //     icon:'none',
    //     duration: 1500
    //   })
    //   return false;
    // }else if(that.data.contactPhone.length < 11){
    //   wx.showToast({
    //     title: '手机号长度有误',
    //     icon:'none',
    //     duration: 1500
    //   })
    //   return false;
    // }else if(!myreg.test(that.data.contactPhone)){
    //   wx.showToast({
    //     title: '手机号格式有误',
    //     icon:'none',
    //     duration: 1500
    //   })
    //   return false;
    // }else{
      app.postReq('/api/applet/integral/commodity/buy',query,(res) => {
        console.log(res);
        if(res.code == 206){
          wx.showToast({
            title: res.message,
            icon:'none',
            duration: 2000
          })
          return false;
        }else{
          wx.showModal({
            content: res.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                url: '/page/component/order2/order2?status=os_002'
                })
              }
            }
          })
          var sysUserInfo =  wx.getStorageSync('sysUserInfo');
          var inteNum=sysUserInfo.totalScore-that.data.buyIntegral
          sysUserInfo.totalScore = inteNum;
          wx.setStorageSync('sysUserInfo', sysUserInfo);

        }
      })
    // }
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
      this.commodityInfo(that.data.id);
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