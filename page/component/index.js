// let interval1,interval2;
const app = getApp()
Page({
  data: {
    homeBannerList: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    homeNewActivityList:[],
    homeIconList:[],
    homeActivityList:[],
    posterList:[],
    commodity:[],
    integralCommodity:[],
    imgheader: app.baseUrl + '/appletImg/upload/',
    pace: 1,  //滚动速度
    marginLeft: 60  , //水平滚动方法中两条文本之间的间距
    select: false,
    tihuoWay:'周浦绿地缤纷广场',
    markName:'',
    queryList:[],
    markId:{
      markId:"1247578892161146882"
    },
    //滚动公告
    noticeList: [],
    broadcast_arr: {
      speed: 4, //滚动速度，每秒2.8个字
      font_size: "16", //字体大小(px)
      text_color: "#fff", //字体颜色
      back_color: "#fff", //背景色
    },
    loginStatus:false,
    bottomBannerList:[],
    goodsRecommendList:[],
  },
  bindShowMsg() {
    this.setData({
        select:!this.data.select
    })
  },
  mySelect(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    console.log(name)
    this.setData({
      markId:{
        markId:id
      },
      select: false,
      tihuoWay:name,
    })
    //重新调用首页查询方法和修改用户方法
    that.getQueryAll()
    //切换修改用户信息的markInfo缓存
    var result =  wx.getStorageSync('result');
    var markInfo={
      markId:e.currentTarget.dataset.id,
      markName:e.currentTarget.dataset.name
    }
    //用户信息存在 再修改用户信息
    if(!result && result != null && result != ''){
      result.markInfo=markInfo
      wx.setStorageSync('result', result);
    }
    //修改自定义缓存markInfo
    var marksInfo =  wx.getStorageSync('marksInfo');
    var marksInfo= markInfo
    wx.setStorageSync('marksInfo', marksInfo);

    if(!result){
      //未登录不调用修改用户信息方法
    }else{
      that.editUser()
    }
  },
  //修改用户信息
  editUser(){
    var that=this
    var sysUserInfo=  wx.getStorageSync('sysUserInfo');
    console.log(sysUserInfo)
    //修改用户信息
    app.postReq("/api/user/edit", {"id": sysUserInfo.id, "markId": that.data.markId.markId},(res) => {
      if(res.code == 200) {
        //修改成功
        console.log(res)
      }
    })
  },
  //查询各商场信息
  getList(){
    app.getReq('/api/applet/mark/queryAll','',(res) => {
      console.log(res)
      var that = this;
      that.setData({
        queryList:res.result
      })
    })
  },
  //首页全部商场信息
  getQueryAll:function(){
    var that=this
    app.getReq('/api/applet/home/page',that.data.markId,(res) => {
      that.setData({
        noticeList:res.result.imageText.noticeList,//滚动广播
        homeBannerList:res.result.imageText.homeBannerList,//banner
        homeIconList:res.result.imageText.homeIconList,//iconList
        homeActivityList:res.result.imageText.homeActivityList,//首页活动
        posterList:res.result.imageText.posterList,//广告
        commodity:res.result.commodity,//线上商城
        integralCommodity:res.result.integralCommodity,//线上商城 （积分商品）
        homeNewActivityList:res.result.imageText.homeNewActivityList,//最新活动
        bottomBannerList:res.result.imageText.bottomBannerList,
        goodsRecommendList:res.result.imageText.goodsRecommendList,
      })
      let ititdata = this.data.noticeList,
      assist = this.data.broadcast_arr,
      this_width = 0,
      spacing = 0,
      speed = (this.data.broadcast_arr.speed); //m每秒行走的距离
      // * this.data.broadcast_arr.font_size
      for (let i in ititdata) {
        ititdata[i].starspos = wx.getSystemInfoSync().windowWidth; //以取屏幕宽度为间距
        this_width += (ititdata[i].outline.length+ititdata[i].title.length) * this.data.broadcast_arr.font_size;
        if (i != ititdata.length - 1) {
          spacing += ititdata[i].starspos
        }
      }
      let total_length = this_width + spacing;//总长
      assist.time = total_length / speed; /**滚动时间*/
      assist.width_mal = total_length; 
      this.setData({
        broadcast_arr: assist,
        noticeList: ititdata
      })
    })
  },

  onShow: function () {
    let that = this;
    //转发小程序
    wx.showShareMenu({
      withShareTicket: true
    })
    
    //定义默认缓存为绿地滨江
    var marksInfo={
      markId:that.data.markId.markId,
      markName:that.data.tihuoWay
    }
    wx.setStorageSync('marksInfo', marksInfo)
    //查询商场列表
    that.getList()
    that.getQueryAll()
    var result =  wx.getStorageSync('result')
    console.log(result)
    if(!result){
      //未登录不调用修改用户信息方法
    }else{
      that.editUser()
      var markName=result.markInfo.markName
      var markId=result.markInfo.markId
      //登录情况下 修改默认商场 修改缓存
      if(markName!=null){
        that.setData({
          tihuoWay:markName,
          markId:{
            markId:markId,
          },
        })
        //修改缓存为用户信息中的markInfo
        var marksInfo =  wx.getStorageSync('marksInfo');
        marksInfo={
          markId:result.markInfo.markId,
          markName:result.markInfo.markName
        }
        wx.setStorageSync('marksInfo', marksInfo);
      }else{
       
      }
    }
  },
  //跳转停车
  goPark(){
    var result =  wx.getStorageSync('result');
    if(!result){
       wx.showToast({
        title: '请登录',
        icon: 'none',
        duration:2000,
        success:function(){
          setTimeout(function() {
            wx.navigateTo({
              url:"../login/login"
            })
          }, 1000);
        }
      })
    }else{
      wx.navigateTo({
        url:"../component/parking2/parking2"
      })
    }
  },
  //跳转商品列表
  goMall: function(){
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url:"../component/integral/integral"
    })
  },
  //跳转活动列表
  goActive: function(){
    wx.switchTab({
      url: '../component/active/active'
    })
  },
  //扫码 门禁
  getScancode: function () {
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        _this.setData({
          result: result,
        })
      }
    })
  },
  onHide: function() {
    // clearInterval(interval1);
    // clearInterval(interval2);
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      //拿到分享的参数
      var extendId = decodeURIComponent(options.scene);
      //缓存分享参数
      wx.setStorage({
        key: "extendId",
        data: extendId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getQueryAll();
   
  },

  /*下拉刷新 */
  onPullDownRefresh :function () {
    var that = this;
    setTimeout(()=>{
      that.getQueryAll();
  }, 1000)
    
  },

  //跳转展示
  jumpToType: function(item){
   console.log(item)
    var itemData = item.currentTarget.dataset.item;
    //如果得到数据，那么进行判断
    if(itemData != undefined || itemData === null || itemData === ''){
      //判断跳转路径是否为空
      if(itemData.jumpUrl != undefined && itemData.jumpUrl != null && itemData.jumpUrl != ''){
          wx.showLoading({
            title: '加载中',
          })
          //如果是跳转文章或者商品
          if(itemData.jumpType === 'jt_001' || itemData.jumpType === 'jt_004'){
            wx.hideLoading();
            wx.navigateTo({
              url: itemData.jumpUrl
            })
          }else if(itemData.jumpType === 'jt_002'){
            //如果是跳转外链
            wx.hideLoading();
            wx.navigateTo({
              url: '/page/component/poster/poster?url=' + itemData.jumpUrl
            })
          }else if(itemData.jumpType === 'jt_005'){
            //如果是跳转小程序
            wx.hideLoading();
            wx.navigateToMiniProgram({
              appId:itemData.appId,
              path: itemData.jumpUrl
            })
          }else{
            wx.hideLoading();
          }
      }
    }
  }
})