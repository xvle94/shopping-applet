const app = getApp()
Page({
  data: {
    imgUrls: [],
    category: [],
    product:[],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    toView: 'guowei',
    curIndex: 0,
    isScroll: false,
    markId:'',
    imgheader: app.baseUrl + '/appletImg/upload/',
    select:{
      color: '#d81e06',
      fontSize: '30rpx'
    }
  },
  switchTab(e){
    console.log(e);
    // console.log(e.target.dataset.id);
    // console.log(e.target.dataset.index);
    const self = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function(){
      self.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    },0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    },1)
    self.getCommodity(e.target.dataset.id);
  },


  //首页全部商圈信息
  getshopPage:function(){
    var that = this;
    var marksInfo =  wx.getStorageSync('marksInfo');
    var markId = {
      markId:marksInfo.markId
    }
    app.getReq('/api/applet/shops/page',markId,(res) => {
      console.log(res)
      that.setData({
        category:res.result.commodityType,
        imgUrls:res.result.imageText.bannerList,
        posterList:res.result.imageText.posterList
      },()=>{
        that.getCommodity();
      })
    })
  },

  //商品类型商品
  getCommodity(id){
    var that = this;
    var marksInfo =  wx.getStorageSync('marksInfo');
    console.log(marksInfo)
    var query = {
      typeId : id?id:that.data.category[0].id,
      // typeId : '1247551440420495361',
      recommend : 'cst_001',
      markId:marksInfo.markId
    }
    app.getReq('/api/applet/shops/commodity',query,(res) => {
      console.log(res)
      that.setData({
        product:res.result
      })
    })
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
              url:"../../login/login"
            })
          }, 1000);
        }
      })
    }else{
      wx.navigateTo({
        url:"../parking2/parking2"
      })
    }
  },
    //跳转展示
    jumpToType: function(item){
      
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
    },
  

  onShow: function () {
    let that = this;
    that.getshopPage();
    // that.getCommodity();
    that.setData({
      curIndex:0
    })
  },

  onLoad: function(){
    var that = this;
    
  },

  /*下拉刷新 */
  onPullDownRefresh :function () {
    let that = this;
    setTimeout(()=>{
      that.onShow();
    },1000)
  }
})