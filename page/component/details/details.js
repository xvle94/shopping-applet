// page/component/details/details.js
const app = getApp()
Page({
  data:{
    goods: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    imgheader: app.baseUrl + '/appletImg/upload/',
    detailMap:{

    }
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },
  goCart:function() {
    wx.switchTab({
      url: '/page/component/cart/cart',
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
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
    var userId = result.userInfo.id;
    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        },()=>{
          self.addCart(userId,self.data.id,self.data.num);
        })
      }, 200)
    }, 300)
    
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  //跳转到商品详情
  goShopInfo(){
    var goods = this.data.goods;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url:"../list/list?id=" + goods.shopsId
    })
  },

  //商品详情
  getCommodityInfo(){
    var that = this;
    var query = {
      id : that.data.id
    }
    app.getReq('/api/applet/commodity/info',query,(res) => {
      //只要数据正常返回
      if(res.result){
        if(res.result.detailMap!=null){
          that.setData({
            goods:res.result,
            detailMap:res.result.detailMap.split(','),
          })
        }else{
          that.setData({
            goods:res.result,
            detailMap:res.result.detailMap
          })
        }
      }else{
        wx.showToast({
          title: '该商品已下架',
          icon: 'none'
        })
      }
    })
  },
  //添加到购物车
  addCart(userId,commodityId,commodityNumber){
    var query = {
      userId:userId,
      commodityId:commodityId,
      commodityNumber:commodityNumber,
    }
    app.postReq('/api/applet/cart/add',query,(res) => {
      console.log(res);
      if(res.code == 200){
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
 
  //立即购买
  addOrder(e){
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
    var userId = result.userInfo.id;
    var commodityId=e.currentTarget.dataset.pid;
    var shopsId=e.currentTarget.dataset.sid;
    let param=[{
      userId:userId,
      commodityId:commodityId,
      commodityNumber:1,
      shopsId:shopsId,
      id:'',
    }]
    console.log(param)
    app.postReq('/api/applet/order/add',param,(res)=>{
      if(res.success && res.code === 200){
        var orderNo=res.result.orderNo
        wx.navigateTo({
          url: '../orders/orders?orderNo='+orderNo,
        })
      }else{
        wx.showModal({
          title: '提示！！',
          content: res.message,
        })
      }
      
    })
  },
  onLoad:function(options){
    var that = this;
    console.log(options.id);
    console.log(options.curIndex);
    that.setData({
      id:options.id
    },()=>{
      that.getCommodityInfo()

      const pages = getCurrentPages()
      const prevPage = pages[pages.length-2] // 上一页
      // 调用上一个页面的setData 方法，将数据存储
      prevPage.setData({
        curIndex: options.curIndex
      })
    })
  },

  
})