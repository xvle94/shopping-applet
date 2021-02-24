// page/component/orders/orders.js
const util= require("../../../util/util.js");
const app = getApp()
Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    orders:[], 
    curIndex: 0,
    imgheader: app.baseUrl + '/appletImg/upload/',
    addressId:'',
    contactName:'',
    contactPhone:'',
    adsId:'',
    postage: 0.00,
    //验证订单是否含有虚拟商品 0-无
    invented: 0,
    buttonClicked: false
  },
  
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
    //计算总价格
    this.getTotalPrice();
  },

  onReady() {
  },
  
  onShow:function(){
    const self = this;
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data.adsId)  // data中会含有testdata
    if(currPage.data.adsId==''){
      self.getAddress();
    }else{
      self.getAddressById();
    }
    //默认进来获取用户信息
    var sysUserInfo = wx.getStorageSync('sysUserInfo');
    //如果用户信息存在,那么赋值用户昵称跟手机号
    if(sysUserInfo != undefined && sysUserInfo != null && sysUserInfo != ''){
      this.setData({
        contactName: sysUserInfo.nickName,
        contactPhone: sysUserInfo.phone
      })
    }else{
      this.setData({
        contactName: '',
        contactPhone:''
      })
    }
  },

  /**
   * 获取自取信息
   */
  contactName:function (e) {
    this.setData({
      contactName: e.detail.value
    })
   
  },
  contactPhone:function (e) {
    this.setData({
      contactPhone: e.detail.value
    })
  
  },

    /**
   * 发起支付请求
   */
  doPay(){
    wx.showLoading({
      title: '加载中',
    })
    util.buttonClicked(this);
    var that = this;
    var curIndex=this.data.curIndex;
    let cartData = {
      orderNo : that.data.orderNo,
      payType:'0',
      deliveryMethod:that.data.curIndex
    }
    if(curIndex===1){
      cartData.addressId=this.data.addressId
      console.log(cartData.addressId)
      if(cartData.addressId==''){
        //隐藏加载中 弹框
        wx.hideLoading();
          wx.showToast({
            title: '请添加地址',
            icon: 'none',
            duration: 1500,
          })
      }else{
        app.postReq('/api/wechart/pay',cartData,(res)=>{
          wx.hideLoading();
          console.log(res);
          // that.doWxPay(res);
          if(res.success && res.code === 200){
            that.doWxPay(res);
          }else{
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    }else{
      cartData.contactName=this.data.contactName;
      cartData.contactPhone=this.data.contactPhone;
      var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      var isMobile = mobile.exec(cartData.contactPhone) 
      if (cartData.contactName == "" || cartData.contactPhone=="") {
        //隐藏加载中 弹框
        wx.hideLoading();
        wx.showModal({
          title: '提示！！',
          content: '请填写联系人和联系电话！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              return false;
            }
          }
        })
        wx.hideNavigationBarLoading();
      }
     //判断电话号格式是否正确
      else if (!isMobile) {
        //隐藏加载中 弹框
        wx.hideLoading();
          wx.showModal({
            title: '提示！！',
            content: '你输入的电话不符，请重新检查填写',
          })
      }else{
        console.log(cartData)
        app.postReq('/api/wechart/pay',cartData,(res)=>{
          console.log(res);
          wx.hideLoading();
          if(res.success && res.code === 200){
            that.doWxPay(res);
          }else{
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    }

  },

  doWxPay(param){
    var that=this
    wx.requestPayment({
      timeStamp:param.result.timeStamp,
      nonceStr: param.result.nonceStr,
      package: param.result.package,
      signType:param.result.signType,
      paySign: param.result.paySign,
      success: function(res){
        console.log(res);
        wx.showModal({
          content:'支付成功',
          showCancel: false,
          success: function (res) {
            console.log(that.data.curIndex)
            if (res.confirm && that.data.curIndex===1) {
              wx.redirectTo({
              url: '/page/component/order2/order2?status=os_003'
              })
            }else{
              wx.redirectTo({
                url: '/page/component/order2/order2?status=os_002'
              })
            }
          }
        })       
      },
      fail: function(res) {
        wx.showModal({
          title:'支付失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
  },
  getOrders(){
    var that = this;
    let cartData = {
      orderNo : that.data.orderNo,
    }
    app.getReq('/api/applet/create/pay',cartData,(res)=>{
        var invented = res.result.invented;
        var curIndex = that.data.curIndex;
        if(parseInt(invented) > 0){
          curIndex =0;
        }
        that.setData({
          orders:res.result.parntMap,
          postage: res.result.postage,
          invented: invented,
          curIndex: curIndex
        })
        //计算总计金额
        that.getTotalPrice();
    })
  },
  getAddress(){
    var that = this;
    var result = wx.getStorageSync('result');
    let addressData = {
      userId : result.userInfo.id,
      pageNo : 1,
      pageSize:10,
      column:'defaultStatus',
      order:'desc'
    }
    app.getReq('/api/user/address/list',addressData,(res)=>{
      console.log(res);
      that.setData({
        address:res.result.records[0],
        addressId:res.result.records[0].id
      })
    })
  },
  getAddressById(){
    var that = this;
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data.adsId)  // data中会含有testdata
    let addressData = {
      id:currPage.data.adsId
    }
    app.getReq('/api/user/address/info',addressData,(res)=>{
      console.log(res);
      that.setData({
        address:res.result,
        addressId:res.result.id
      })
    })
  },
  goAddress(){
    var that = this;
    wx.navigateTo({  
      url:"../address/address",
      success:function(){
      }   
    })
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    var orders = this.data.orders;
    var postage = this.data.postage
    var curIndex = this.data.curIndex;
    let total = 0;
    //如果是快递配送
    if(curIndex === 1){
      total += postage ; 
    }
    if(orders.length===0){
      this.setData({
        total: 0
      })
    }else{
      for(var k in orders){
        for(var key in orders[k]){
          var price = ((orders[k][key].goodsPrice * orders[k][key].goodsNum) /100)
          total +=price;
        }
      }
      this.setData({
        total: total
      })
    }
  },
  onLoad:function(options){
    var that = this;
    console.log(options.orderNo);
    that.setData({
      orderNo:options.orderNo,
    },()=>{
      that.getOrders();
    })
  },
})