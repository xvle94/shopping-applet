const app = getApp()
Page({
  data: {
    drawId:'',
    rouletteData: {
      speed: 10,/**转盘速度 */
      // award: res.result,/**奖项内容 */
      award: [],/**奖项内容 */
      fontColor: '#e21b58',/**文字颜色 */
      font: '12px Arial',
      bgOut: '#ffe774',/**外层 */
      bgMiddle: '#ffc046',/**中间层 */
      bgInner: ['#fff2ca', '#fdd890', '#FFE774', '#fdd890', '#FFE774', '#fdd890'],
      speedDot: 1000,/**点切换速度 */
      dotColor: ['#ffffff', '#b1ffdd'],
      dotColor_1: ['#ffffff', '#b1ffdd'],
      dotColor_2: ['#b1ffdd', '#ffffff'],
      angel: 0 /**选择角度 */
    },
    lottery:'',
    flag:true,
    bgImg:'',
    imgheader: app.baseUrl + '/appletImg/upload/',
    dot_inter:'',
    drawIntroduceString:'',
    integral:'',
    timer:''
  },

  //调用获取奖品接口
  getPrizeList(){
    var that=this;
    var query = {
      drawId:that.data.drawId
    }
    app.getReq('/api/applet/draw/info',query,(res)=>{
      console.log(res);
      let arr = res.result.prizeInfo;
      arr.push({prizeName:'谢谢参与'});
        that.setData({
          'rouletteData.award':arr,
          bgImg:res.result.luckyDrawInfo.backGroundUrl,
          drawIntroduceString:res.result.luckyDrawInfo.drawIntroduceString
        },()=>{
          that.drawCanvas();
          that.dotStart();
      })
    })
  },

  drawCanvas: function (item){
    var that = this;
    const ctx = wx.createCanvasContext('roulette', that);
    let options=that.data.rouletteData;
    var angelTo = that.data.angelTo || 0;
    var width=295;
    var height=295;
    var x = width / 2;
    var y = width / 2;
    var num=6;
    var awardTitle = options.award;
    ctx.translate(x, y)
    ctx.clearRect(-width, -height, width, height);

    var angel = (2 * Math.PI / 360) * (360 / awardTitle.length);
    var startAngel = 2 * Math.PI / 360 * (-90);
    var endAngel = 2 * Math.PI / 360 * (-90) + angel;
    
    ctx.rotate(angelTo * Math.PI / 180);
    // 画外圆
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = options.bgOut;
    ctx.arc(0, 0, 130, 0, 2 * Math.PI)
    ctx.stroke();
    // 画里圆
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = options.bgMiddle;
    ctx.arc(0, 0, 120, 0, 2 * Math.PI)
    ctx.stroke();

    // 装饰点
    var dotColor = options.dotColor;
    for (var i = 0; i < 26; i++) {
      ctx.beginPath();
      var radius = 131;
      var xr = radius * Math.cos(startAngel)
      var yr = radius * Math.sin(startAngel)
      ctx.fillStyle = dotColor[i % dotColor.length]
      ctx.arc(xr, yr, 5, 0, 2 * Math.PI)
      ctx.fill()
      startAngel += (2 * Math.PI / 360) * (360 / 26);
    }
     // 画里转盘   
    var colors = options.bgInner;
    for (var i = 0; i < awardTitle.length; i++) {
      ctx.beginPath();
      ctx.lineWidth =116;
      ctx.strokeStyle = colors[i % colors.length]
      ctx.arc(0, 0, 60, startAngel, endAngel)
      ctx.stroke();
      startAngel = endAngel
      endAngel += angel
    }

    startAngel = angel / 2
    for (var i = 0; i < awardTitle.length; i++) {
      ctx.save();
      ctx.rotate(startAngel);
      ctx.font = options.font;
      ctx.fillStyle = options.fontColor,
      ctx.textAlign = "center";
      ctx.fillText(awardTitle[i].prizeName, 0, -90);
      startAngel += angel
      ctx.restore();
    }
    ctx.draw()
  },
  rollStart(e){
    var that = this;

    // that.getPrize();
    let sysUserInfo=  wx.getStorageSync('sysUserInfo');
    if(sysUserInfo.totalScore>=50){
      if(that.data.flag){
        that.getAngel();
        // that.drawCanvas();
        that.dotStart();
        that.start();
      }else{
        return false
      }
    }else{
      wx.showToast({
        title: '积分不足',
        icon:"none"
      })
    }
    
  },
  start(){
    var that = this;
    if(that.data.flag){
      that.setData({flag:false})
      that.getPrize();
    }else{
      return false
    }
    
  },
  dotStart: function () {
    var that = this;
    let times = 0;
    let options =that.data.rouletteData;
    that.data.dot_inter = setInterval(function () {
      if (times % 2) {
        options.dotColor = options.dotColor_1
      } else {
        options.dotColor = options.dotColor_2
      }
      times++;
      that.setData({
        rouletteData: options
      })
      that.drawCanvas();
    }, options.speedDot)
  },
  
  onLoad: function (options) {
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
    that.getPrizeList();
  },

  getAngel(e) {
    var that = this;
    this.setData({
      // angel: Math.floor(Math.random(1) * 360) /**传入的角度 */
      angel: 0 /**传入的角度 */
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
      }
    })
  },

  getPrize(e) {
    var that = this;
    let angel = that.data.angel;
    let options = that.data.rouletteData;
    let index = parseInt(that.data.angel / 60);
    let sysUserInfo=  wx.getStorageSync('sysUserInfo');
    let query = {
      userId:sysUserInfo.id,
      drawId:that.data.drawId
    }
    app.getReq('/api/applet/prize/lottery',query,(res)=>{
      if(res.result==null){
        wx.showToast({
          title: res.message,
          icon:"none"
        })
        that.setData({
          flag:true
        })
      }else{
        that.refreshUserInfo(sysUserInfo.id);
        that.setData({
          lottery:res.result,
          integral:res.result.totalScore
        },()=>{
          // var that=this;
          let options=that.data.rouletteData;
          var angel = that.data.angel;
          let res = that.data.lottery.prize;
          let arr = that.data.rouletteData.award;
          let number = 0;
          for(var i=0;i<arr.length;i++){
            if(arr[i].id == res.id){
              number = i;
            }
          }
          angel = 360 - angel - number*(360/arr.length)-(Math.random() * ((360/arr.length/2) - 1) + 1);
          angel += 360*6;
          var baseStep = 30
          // 起始滚动速度
          var baseSpeed = 0.3
          var count = 1;
          clearInterval(that.data.dot_inter);

          that.data.timer = setInterval(function () {
            that.setData({
              angelTo:count,
            })
            that.drawCanvas();
            if (count == angel) {
              clearInterval(that.data.timer)
              if(that.data.lottery.prize==null || that.data.lottery.prize.id==null){
                wx.showToast({
                  title: '差一点就中奖了哦!',
                  icon:"none"
                });
              }else{
                wx.showModal({
                  title: '恭喜你获得',
                  content: that.data.lottery.prize.prizeName,
                  success:function(res){

                  }
                })
              }
              that.setData({
                flag:true
              })
              // that.dotStart();
            }
            count = count + baseStep * (((angel - count) / angel) > baseSpeed ? baseSpeed : ((angel - count) / angel))
            if (angel - count < 0.5) {
              count = angel
            }
          }, options.speed)
        })
      }
    })
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },
})
