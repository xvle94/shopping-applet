// page/component/order2/order2.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    status:'',
    pageNo:1,
    pageSize:10,
    imgheader: app.baseUrl + '/appletImg/upload/',
    hasList:true,
    total:0,
    price:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.status);
    that.setData({
      status:options.status
    },()=>{
      that.getOrderList();
    })
  },

  getOrderList(){
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

    var query = {
      userId: result.userInfo.id,
      status : that.data.status,
      pageNo:that.data.pageNo,
      pageSize:that.data.pageSize
    }
    let total = 0;
    let price = 0;
    app.getReq('/api/user/order/list',query,(res) => {
      var order=res.result.result;
      console.log(order);
      let dataList = [];
      for (var k in order){
        let list = {
          productList:[],
          orderNo:'',
          shopsName:'',
          price:0,
          total:0,
        };
        let orderNo_ = '';
        let shopsName_ = '';
        let price_ = 0;
        let total_ = 0;
        for(var key in order[k]){
          orderNo_ = order[k][key].orderNo;
          shopsName_ = order[k][key].shopsName;
          price_ += (order[k][key].goodsPrice*order[k][key].goodsNum)/100;
          total_ += order[k][key].goodsNum;
        }
        list.orderNo = orderNo_;
        list.shopsName = shopsName_;
        list.price = price_;
        list.total = total_;
        list.productList = order[k];
        dataList.push(list);
      }
      console.log(dataList);
      if(Object.keys(order).length != 0){
        that.setData({
          orders:dataList,
          hasList:true,
          // total:total,
          // price:price,
        })
      }else{
        that.setData({
          orders:order,
          hasList:false
        })
      }
      // that.setData({
      //   orders:res.result.result
      // },()=>{
      //   console.log(that.data.orders);
      // })
    })
  },
  cancelOrder(e){
    var that=this
    var orderNo=e.currentTarget.dataset.orderno
    console.log(orderNo)
    let param={
      orderNo:orderNo
    }
    wx.showModal({
      content:'确认取消订单吗',
      success: function (res) {
        if (res.confirm) {
          app.getReq('/api/applet/order/cancel',param,(res)=>{
            console.log(res)
            if(res.code==200){
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000,
                success: function(){
                  setTimeout(function() {
                    wx.redirectTo({
                        url: '/page/component/order2/order2?status=os_001'
                    })
                  }, 2000);
                }
              })
            }else{
              wx.showToast({
                title:res.massage,
                icon: 'success',
                duration: 2000,
              })
            }
          })
        }else if (res.cancel) {
          console.log('用户点击取消')
         }
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
    // var that=this;
    // that.getOrderList();
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