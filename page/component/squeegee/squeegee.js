const app = getApp()
Page({
  data:{
    drawId:'',
    awardCanvas:"",
    awardBg:'../../assets/images/award.jpg',
    windowWidth:0,
    windowHeight:0,
    startX:0,
    startY:0,
    flag:true,
    prize:'',
    prizeInfo:'',
    imgheader: app.baseUrl + '/appletImg/upload/',
    bgImg:'',
    drawIntroduceString:'',
    integral:''
  },
  onLoad: function(options){
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
      setTimeout(function () {
        //跳转登录页面
        wx.navigateTo({
          url: '/page/login/login',
        })
      }, 3000)
    }
    that.setData({
      drawId:options.id,
      integral:wx.getStorageSync('sysUserInfo').totalScore
    })
    this.getSysInfo();
    that.getPrizeList();
  },
  onReady(){
    this.createCanvas();
  },
  onShow(){},
  getSysInfo(){
    let that=this;
    wx.getSystemInfo({
      complete: (res) => {
        that.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight
        })
      },
    })
  },
  createCanvas() {
    this.data.awardCanvas = wx.createCanvasContext('awardCanvas');
    let left=0
    let top=0
    this.data.awardCanvas.moveTo(left,0)
    this.data.awardCanvas.lineTo(left+400,0);
    this.data.awardCanvas.lineTo(left+400,150);
    this.data.awardCanvas.lineTo(left,150);
    this.data.awardCanvas.stroke();
    this.data.awardCanvas.setFillStyle('#aaa');
    this.data.awardCanvas.fill();
    this.data.awardCanvas.draw();
  },
  buttonFn() {
    var that = this;
    // that.setData({flag:true})
    that.createCanvas();
    that.getPrize();
    
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
      }
    })
  },

  getPrize() {
    var that = this;
    let sysUserInfo=  wx.getStorageSync('sysUserInfo');
    let query = {
      userId:sysUserInfo.id,
      drawId:that.data.drawId
    }
    app.getReq('/api/applet/prize/lottery',query,(res)=>{
      if(res.result==null){
        that.setData({
          prize:res.message
        })
      }else if(res.result.prize==null || res.result.prize.id==null){
        that.setData({
          prize:'差一点就中奖了哦!'
        })
      }else{
        that.refreshUserInfo(sysUserInfo.id);
        that.setData({
          prize:'恭喜你获得：'+res.result.prize.prizeName,
          integral:res.result.totalScore
        })
      }
    })
  },
  touchStart(e){
    var that = this;
    if(that.data.flag){
      that.getPrize();
      that.setData({flag:false})
    }
    let { x, y } = e.changedTouches[0];
    this.data.startX = x;
    this.data.startY = y;
  },
  touchMove(e){
    var that = this;
    let { x, y } = e.changedTouches[0]; 
    this.data.awardCanvas.clearRect(x,y,30,30);
    this.data.awardCanvas.draw(true)
    this.data.startX = x;
    this.data.startY = y;
  },

  //调用获取奖品接口
  getPrizeList(){
    var that=this;
    var query = {
      drawId:that.data.drawId
    }
    app.getReq('/api/applet/draw/info',query,(res)=>{
    console.log(res);
    that.setData({
      prizeInfo:res.result.prizeInfo,
      bgImg:res.result.luckyDrawInfo.backGroundUrl,
      drawIntroduceString:res.result.luckyDrawInfo.drawIntroduceString
    })
  })
},
})