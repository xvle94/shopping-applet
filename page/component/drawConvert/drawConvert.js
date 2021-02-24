// page/component/drawConvert/drawConvert.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //订单数组
     drawData: [],
     //订单子编号
     id: '',
     showInfo: false,
     showLoadding: false,
     userId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户id
    var result =  wx.getStorageSync('result');
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
    }else{
      var sysUserInfo=  wx.getStorageSync('sysUserInfo');
      this.setData({
        userId: sysUserInfo.id
      })
    }  
    if (options.scene) {
      var id = decodeURIComponent(options.scene)
      if(id === undefined || id === null || id === ""){
        console.log("获取页面传递参数");
        console.log(pages);
        return false;
      }
      //赋值变量
      this.setData({
        id: id
      })
      //查询数据
      this.queryDrawInfo();
    }

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
    //获取用户id
    var result =  wx.getStorageSync('result');
    if(!result){
       wx.showToast({
        title: '请登录',
        icon: 'none'
      })
      return;
    }else{
      var sysUserInfo=  wx.getStorageSync('sysUserInfo');
      this.setData({
        userId: sysUserInfo.id
      })
    } 
    var that = this;
    // 获取当前页面栈
    var pages = getCurrentPages();
    //获取上一页的数据，-1表示上一页
    var paramData = pages[pages.length - 1];
    //得到对应的子订单号
    var id = paramData.options.scene;
    if(id === undefined || id === null || id === ""){
      console.log("获取页面传递参数");
      console.log(pages);
      return false;
    }else{
      //赋值变量
      this.setData({
        id: id
      })
    }
    //查询数据
    this.queryDrawInfo();
    

  },
  //取消事件，跳转个人中心
  cancel:function(){
    //登录成功 跳转首页
    wx.switchTab({
      url: '/page/component/user/user'
    })
  },
  //查询兑奖订单信息
  queryDrawInfo: function(){
    
    var that = this;
    //查询兑奖订单信息
    app.getReq('/api/applet/prize/history/info',{historyId: this.data.id, operator: this.data.userId},(res) => {
      if(res.success && res.result){
        var drawData = res.result;
        that.setData({
          drawData: drawData,
          showInfo: true,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })

  },
  //兑奖事件，修改订单状态
  confirmExtract: function(){
    var that = this;
    this.setData({
      showLoadding: true
    });
    //修改兑奖订单状态
    app.getReq('/api/applet/prize/history/update',{historyId: this.data.id},(res) => {
      if(res.success){
        wx.showToast({
          title: '兑奖完成',
          icon: 'none'
        })
        //刷新数据
        that.queryDrawInfo();
        //取消加载lodding
        that.setData({
          showLoadding: false
        })
        //三秒后跳转个人中心
          setTimeout(function () {
          //个人中心
          wx.switchTab({
            url: '/page/component/user/user'
          })
        }, 3000)
      }
    })
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