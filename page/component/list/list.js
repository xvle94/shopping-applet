// page/component/list/list.js
const app=getApp()
Page({
  data:{
    product:[],
    category: [
      {name:'综合',id:'create_time'},
      // {name:'销量',id:'shucai'},
      {name:'新品',id:'create_time'},
      {name:'价格',id:'new_money'}
    ],
    curIndex: 0,
    isScroll: false,
    id: 'guowei',
    shop:{},
    imgheader:'https://erbu.fyitgroup.net/appletImg/upload/',
    markId:'',
    orderBy:'create_time',
    orderType:'DESC',
  },
  switchTab(e){
    const self = this;
    this.setData({
      isScroll: true
    })
    console.log(e);
    setTimeout(function(){
      self.setData({
        orderBy: e.target.dataset.id,
        curIndex: e.currentTarget.dataset.index
      })
    },0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    },1)
    let orderBy = e.target.dataset.id;
    self.getProduct(orderBy);
  },
  getshop(){
    var that = this;
    var query = {
      id:that.data.id
    }
    app.getReq('/api/applet/shops/info',query,(res) => {
      console.log(res);
      that.setData({
        shop:res.result
      })
    })
  },
  getProduct(orderBy){
    var that=this;
    var query={
      // type : "1247551108441333762",
      shopsId:that.data.id,
      orderBy:orderBy,
      orderType:that.data.orderType,
      pageNo:1,
      pageSize:10,
      markId:that.data.markId
    }
    app.postReq('/api/applet/commodity/all',query,(res) => {
      console.log(res);
      that.setData({
        product:res.result.result
      })
    })
  },
  //拨打电话
  call: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.shop.linkPhone,
    })

  },
  onLoad:function(options){
    var that = this;
    console.log(options.id);
    that.setData({
      id:options.id
    },()=>{
      that.getshop()
      that.getProduct(that.data.orderBy)

    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that=this;
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})