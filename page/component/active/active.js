// page/component/active/active.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      active:[],
      // taId:'1247450275682967553',
      markId:'',
      pageNo:1,
      pageSize:10,
      imgheader:'https://erbu.fyitgroup.net/appletImg/upload/',
      flag:true,
  },

  //活动列表
  activityList(markId,pageNo,pageSize){
    // wx.showLoading({title: '加载中…'})
    var that = this;
    var query = {
      markId:markId,
      pageNo:pageNo,
      pageSize:pageSize,
    }
    if(that.data.flag){
      app.getReq('/api/applet/activity/list',query,(res) => {
        // wx.hideLoading()
        console.log(res);
        let arr1 = that.data.active;
        let arr2 = res.result.result;
        arr1 = arr1.concat(arr2);
        that.setData({
          active:arr1,
        });
        if(arr2.length==0){
          that.setData({
            flag:false
          })
        }
      })
    }else{
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 滚动事件 
  onPageScroll(e){ 
    //滚动距离+屏幕高度换算vw倍数
    let listIndex = (e.scrollTop + this.data.screenHeight) / (this.data.screenWidth * 0.63)
    this.setData({
      listIndex: listIndex
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取屏幕尺寸
    const screenWidth = wx.getSystemInfoSync().windowWidth
    const screenHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      //获取页面初始状态图片数量，0.63为图片容器的高度值(63vw)，将代码中0.63改为你的容器对应高度
      listIndex: screenHeight / (screenWidth * 0.63),
      screenWidth: screenWidth,
      screenHeight: screenHeight
    })

    var that = this;
    var marksInfo =  wx.getStorageSync('marksInfo')
    console.log(marksInfo)
    that.setData({
      active:[],
      flag:true,
      pageNo:1,
      pageSize:10,
      markId:marksInfo.markId,
      // pageSize:10
    })
    that.activityList(that.data.markId,that.data.pageNo,that.data.pageSize);
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
      that.onShow();
    },1000)
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
    that.activityList(that.data.markId,pageNo,that.data.pageSize);
    })
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
            wx.navigateTo({
              url: '../activeDetail/activeDetail?id=' + itemData.id
            })
          }
      }else{
        wx.navigateTo({
          url: '../activeDetail/activeDetail?id=' + itemData.id
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})