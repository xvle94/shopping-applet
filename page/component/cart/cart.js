// page/component/new-pages/cart/cart.js
const app = getApp()
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:false,    // 全选状态，默认全不选
    pageSize:0,
    orderNo:'',
    params:[],
    totalCount:0,
    shopCheckStatus:false,
  },
  onShow() {
    let that = this;
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
      return;
    }
    that.getList();
    // that.getTotalPrice();
    this.setData({
      carts:[],
      hasList: true,
      selectAllStatus:false,
      totalPrice:0,
    });
  },
  //跳转店铺详情
  goShopInfo(e){
    var id = e.currentTarget.dataset.shopid;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url:"../list/list?id=" + id
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList:function(e) {
    let that = this;
    let list = this.data.carts;
    let shopId = e.currentTarget.dataset.shopid;
    let selectAllStatus = that.data.selectAllStatus; 

    for (var i in list){
      for(var k in list[i].productList){
        if(shopId == list[i].productList[k].shopsId){
          list[i].productList[k].isCheck = !list[i].shopCheckBox || false;
          
        }
      }
      if(list[i].shopId==shopId)
      {
        list[i].shopCheckBox=!list[i].shopCheckBox || false;
      }
    }

    let checkAllFlag = 0;
    for(var i in list){
      if(list[i].shopCheckBox){
        checkAllFlag++;
      }
    }
    if(checkAllFlag==list.length){
      selectAllStatus = true;
    }
    else{
      selectAllStatus=false;
    }
    this.setData({
      carts:list,
      selectAllStatus:selectAllStatus
    })
    that.getTotalPrice()
  },
  checkboxChange(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let list =that.data.carts;   
    let selectAllStatus = that.data.selectAllStatus; 
    for(var i in list){
      for(var k in list[i].productList){
        if(list[i].productList[k].id == id){
          list[i].productList[k].isCheck = !list[i].productList[k].isCheck || false;
          
        }
      }

      let flag = 0;
      for(var m in list[i].productList){
          if(list[i].productList[m].isCheck){
            flag++;
          }
        
      }
      if(flag==list[i].productList.length)
      {
        list[i].shopCheckBox = true;
      }else{
        list[i].shopCheckBox = false;
      }

    }
    let checkAllFlag = 0;
    for(var i in list){
      if(list[i].shopCheckBox){
        checkAllFlag++;
      }
    }
    if(checkAllFlag==list.length){
      selectAllStatus = true;
    }
    else{
      selectAllStatus=false;
    }
    that.setData({
        carts: list,
        selectAllStatus:selectAllStatus
    });
    that.getTotalPrice()
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index,1);
    this.setData({
      carts: carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e){
    let that = this;
    let list = that.data.carts;
    let selectAllStatus =that.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    for (var i in list){
      for(var k in list[i].productList){
          list[i].productList[k].isCheck = selectAllStatus;
          list[i].shopCheckBox = selectAllStatus;
      }
    }
    that.setData({
        selectAllStatus:selectAllStatus,
        carts: list
    });



    that.getTotalPrice()
  },

 
  /**
   * 绑定加数量事件
   */
  addToCart(e) {
    var that = this;
    var result = wx.getStorageSync('result');
    var userId = result.userInfo.id;
    let cart = that.data.carts;
    var query = {
      userId:userId,
      commodityId:e.currentTarget.dataset.id,
      commodityNumber:1,
    }
    app.postReq('/api/applet/cart/add',query,(res) => {
      if(res.code == 200){
        this.onShow();
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 绑定减数量事件
   */
  minusCount(e){
    var that=this;
    var query = {
      id:e.currentTarget.dataset.cid,
    }
    app.getReq('/api/applet/cart/del',query,(res) => {
      console.log(res);
      if(res.code == 200){
        this.onShow();
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let that = this;
     let carts = that.data.carts;                  // 获取购物车列表
     let total = 0;
    for(var k in carts){
      for(var key in carts[k].productList){
        if(carts[k].productList[key].isCheck){
          var num=carts[k].productList[key].commodityNumber
          var price=carts[k].productList[key].newMoney;
          total += num * price;
        }
        
      } 
    }
    that.setData({ 
      carts: carts,
      totalPrice: total.toFixed(2)
    }); 
  },

  getList(){
    var that = this;
    var result = wx.getStorageSync('result');
    var userId = result.userInfo.id;
    console.log(userId)
    let cartData = {
      userId : result.userInfo.id,
      pageNo : 1,
      pageSize:10,
    }
    app.getReq('/api/applet/cart/list',cartData,(res)=>{
      console.log(res);
      let data = res.result.result;
      let dataList = [];
     
      for(var i in data){
        let list ={
          productList:[],
          shopCheckBox:false,
          shopId:0,
          shopName:''
        };
        let shopId_=0;
        let shopName_ ='';
        for(var k in data[i]){
          data[i][k].isCheck = false;
          shopId_= data[i][k].shopsId;
          shopName_= data[i][k].shopsName;
        }
        list.productList=data[i];
        list.shopId=shopId_;
        list.shopName=shopName_;
        dataList.push(list);
      }
      console.log(dataList);
      that.setData({
        carts:dataList,
        totalCount:res.result.totalCount
      });
      
    });
  },
  //订单
  addOrder(){
    var that = this;
    let carts = that.data.carts;
    let order = [];
    for(var i in carts){
      for(var k in carts[i].productList){
        if(carts[i].productList[k].isCheck == true){
          order.push(carts[i].productList[k])
        }
      }
      
    }
    let param;
    param = order.map(function(item){
      return {
        id:item.id,
        userId:item.userId,
        commodityId:item.commodityId,
        commodityNumber:item.commodityNumber,
        shopsId:item.shopsId,
      }
    });
    if(param === null || param === undefined || param === '' || param.length === 0){
      wx.showToast({
        title: "购物车是空的哦~",
        icon:"none",
        duration: 2000
      })
      return false;
    }
    app.postReq('/api/applet/order/add',param,(res)=>{
      console.log(res);
      if(res.code==200){
        var orderNo=res.result.orderNo
        wx.navigateTo({
          url: '../orders/orders?orderNo='+orderNo,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:"none",
          duration: 2000
        })
      }
      
    })
    
  },
  onLoad(){
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