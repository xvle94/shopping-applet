// page/component/parkPay/parkPay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    infoData:[],
    userInfo: [],
    configId: "",
    //商场id
    markId: '',
  },
  radioChange: function (e) {
    this.setData({
      configId: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //页面加载完成 读取缓存中数据
    var result =  wx.getStorageSync('result');
    //如果没有用户信息,那么提示重新登录
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
    
    var parkPayInfo = wx.getStorageSync('parkPayInfo');
    this.setData({
      userInfo: result.userInfo,
      infoData: parkPayInfo,
    })
    //读取缓存中所选商场id
    var markId =  wx.getStorageSync('markId');
    if(markId === undefined || markId===null || markId===''){
      markId=wx.getStorageSync('markId').markId;
    }
    var queryData = {
      type: "1",
      markId: markId
     }
     console.log(markId)
    //查询支付方式参数
    app.getReq('/api/park/config/byType', queryData,(res)=>{
      if(res.result){
        var items = res.result;
        //给数组下标0追加数据
        items.splice(0,0 ,{id: "", integralNumber: 0, title: "不使用积分", checked: 'true'});
        this.setData({
          items: items
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
    var that=this
    var result =  wx.getStorageSync('result');
    that.refreshUserInfo(result.userInfo.id)
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

  },
  //缴费
  payMoney(){
    // wx.showLoading({
    //   title: '加载中',
    // })
    var that=this
    var configId = this.data.configId;
    var infoData = this.data.infoData;
    //只有选择积分抵扣 才进行抵扣操作
    if(configId != undefined && configId != null && configId != ""){
        //封装数据
        var payData = {
          carNum: infoData.carNum,
          userId: this.data.userInfo.id,
          configId: configId,
          tradeId: infoData.tradeId,
          accountId: infoData.accountId,
          outTradeNo: infoData.outTradeNo
        }
        app.postReq('/api/park/third/deduct',payData,(res)=>{
          if(res.success){
           // wx.hideLoading();
            that.goPayApplet(infoData.appletParams);
          }else{
            //wx.hideLoading();
            // wx.showToast({ 
            //   icon: 'none', title: res.message, success:function(){
            //     setTimeout(function(){
            //     })
            //   }
            // })
            wx.showModal({
              title: res.message+',是否立即支付？',
              success: function (res) {
                if (res.cancel) {
                  //点击取消,默认隐藏弹框
               }else{
                 that.goPayApplet(infoData.appletParams);
               }
              }
            })
          }
        })

        
    }else{
        wx.hideLoading();
        this.goPayApplet(infoData.appletParams);
    }
    

  },
    //跳转支付小程序
    goPayApplet(res){
      wx.navigateToMiniProgram({
         appId:res.appId,
         path:res.path,
         extraData: res.extraData,
         success(res) {
           // 打开成功
           console.log("打开成功");
           console.log(res);
         },
         fail(res){
           console.log("打开失败");
           console.log(res);
         }
       })
    },
   //刷新用户信息
   refreshUserInfo(userId){
    var that = this;
    app.getReq('/api/user/queryById', {"id": userId}, (res)=>{
      if(res.result){
        var userInfo = res.result;
        //缓存用户信息
        wx.setStorage({
          key: "sysUserInfo",
          data: userInfo
        })
        console.log(userInfo.totalScore)
        //更新页面的用户信息
        that.setData({
          totalScore: userInfo.totalScore,
          userInfo: userInfo,
          nickName: userInfo.nickName,
          avatarUrl:userInfo.avatarUrl,
        })
      }

    })
  }

})