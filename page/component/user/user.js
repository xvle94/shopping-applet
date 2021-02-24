// page/component/new-pages/user/user.js
const app = getApp()
Page({
  data:{
    nickName:'',
    avatarUrl:'',
    totalScore:'0',
    userInfo: {},
    orders:[],
    hasAddress:false,
    address:{},
    signFlag:true,
    status:[],
    loginStatus:false,
    /**提货扫码权限*/
    scanningCode: false,
    /**兑奖扫码权限*/
    drawScanning: false,
  },
  onLaunch: function(){
  },

  //签到
  sign(){
    var that = this;
    var result = wx.getStorageSync('result');
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
    that.time();
    let signData = {
      userId : result.userInfo.id,
      signTime : that.time()
    }
    app.postReq('/api/user/signByUser',signData,(res)=>{
      console.log(res);
      if(res.code == 200){
        //查询用户信息
        that.refreshUserInfo(signData.userId);
        //更新用户信息后 在提示
        wx.showToast({
          title: '签到成功！',
          icon: 'none'
        })
        that.setData({
          signFlag:false,
        })
      }else if(res.code == 206 ){
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        that.setData({
          signFlag:false
        })
      }
    })
  },
  time() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    month = month < 10 ? ("0" + month) : month;
    var day = date.getDate();
    day = day < 10 ? ("0" + day) : day;
    return year + "-" + month + "-" + day;
  },
  //查询签到信息
  querySignNow(){
    var that = this;
    var result = wx.getStorageSync('result');
    var userId = result.userInfo.id;
    console.log(that.data.userInfo);
    that.time();
    let signData = {
      userId : result.userInfo.id,
      signTime : that.time()
    }
    app.postReq('/api/user/querySignNow',signData,(res)=>{
      console.log(res);
      //如果返回结果
      if(res.result){
        //如果结果返回签到时间
        if(res.result.signTime){
          //如果签到时间是今天
          if(res.result.signTime == that.time()){
            that.setData({signFlag:false})
          }
        }
      }
      
    })
  },
  //查询订单状态
  getStatus(){
    var that=this;
    var result = wx.getStorageSync('result');
    let param = {
      userId : result.userInfo.id,
    }
    app.getReq('/api/applet/order/status',param,(res)=>{
        console.log(res)
        var list=res.result
        for(var k in list){
          that.setData({
            os_001:list[0].total,
            os_002:list[1].total,
            os_003:list[2].total,
            os_004:list[3].total,
          })
        }
        
    })
  },

  onLoad(){
    var that = this
    var sysUserInfo=  wx.getStorageSync('sysUserInfo');
    if(sysUserInfo != undefined && sysUserInfo != null && sysUserInfo != ''){
      //刷新数据
      this.refreshUserInfo(sysUserInfo.id);
    }
    
  },
  onShow(){
    var that = this;
    /**
     * 获取本地缓存 地址信息
     */
    var result =  wx.getStorageSync('result');
    if(!result){
       wx.showToast({
        title: '请登录',
        icon: 'none'
      })
    }else{
      var sysUserInfo=  wx.getStorageSync('sysUserInfo');
      that.setData({
        totalScore: sysUserInfo.totalScore,
        loginStatus:true,
        phoneNumber:sysUserInfo.phone
      })
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          nickName: userInfo.nickName,
          avatarUrl:userInfo.avatarUrl,
        })
      })
      that.querySignNow();
      that.getStatus();
      that.refreshUserInfo(result.userInfo.id)
    }
  },
  // 退出登录
  signOut(){
    var that=this
    wx.showModal({
      content: '确定退出登录？',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
         if (res.cancel) {
            //点击取消,默认隐藏弹框
         } else {
           //从缓存中读取商场
           var marksInfo =  wx.getStorageSync('marksInfo');
           //清除其他缓存
           wx.clearStorageSync()
           //保留商场缓存数据
           wx.setStorageSync('marksInfo', marksInfo);
           
            that.setData({
              loginStatus:false,
              totalScore:'0',
              //扫码兑换恢复默认值
              scanningCode: false,
              //兑奖权限恢复默认值
              drawScanning: false,
              //抽奖状态恢复默认值
              signFlag:true,
              nickName:'',
              avatarUrl:'',
              totalScore:'0',
              userInfo: {},
              orders:[],
              hasAddress:false,
              address:{},
              status:[],
            })
         }
      }
   })
   
  },
 

  /*下拉刷新 */
  onPullDownRefresh :function () {
    let that = this;
    setTimeout(()=>{
      that.onLoad();
    },1000)
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
        //如果扫码权限不为空在处理
        var scanningCode = userInfo.scanningCode;
        if(scanningCode != undefined && scanningCode != null && scanningCode != ''){
          //如果是1，那么表示有扫码权限
          if(scanningCode === "1"){
            that.setData({
                scanningCode: true
              })
          }else{
            that.setData({
              scanningCode: false
            })
          }
        }
        //如果兑奖权限不为空再处理
        var drawScanning = userInfo.drawScanning;
        if(drawScanning != undefined && drawScanning != null && drawScanning != ''){
          //如果是1，那么表示有扫码权限
          if(drawScanning === "1"){
            that.setData({
              drawScanning: true
              })
          }else{
            that.setData({
              drawScanning: false
            })
          }
        }
        //更新页面的用户信息
        that.setData({
          totalScore: userInfo.totalScore,
          userInfo: userInfo,
          nickName: userInfo.nickName,
          avatarUrl:userInfo.avatarUrl,
        })
      }

    })

  },
  //扫码-跳转提货页面
  getScancode: function () {
    wx.scanCode({
      success (res) {
        //只有存在路径再跳转
        if(res.path){
          wx.navigateTo({
            url: '/' + res.path
          })
        }
      }
    })
  }

})