const app = getApp()
Page({
    data: {
        category: [],
        product:[],
        indicatorDots: false,
        autoplay: false,
        interval: 3000,
        duration: 800,
        curIndex: 0,
        sortIndex:-1,
        isScroll: false,
        id: '',
        markId:'',
        orderBy:'order_num',
        orderType:'DESC',
        imgheader: app.baseUrl + '/appletImg/upload/',
        sortColor: '#d81e06',
        sortList:[{name:'默认'},{name:'价格'}],
        scrollTop:0,
        scrollHeight:0,
        pageNo:1,
        pageSize:6,
        flag:true
    },
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true,
        product:[],
        pageNo:1,
        flag:true
      })
      setTimeout(function(){
        self.setData({
          id: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
      self.getCommodity(self.data.orderBy,e.target.dataset.id,self.data.orderType);
    },

    //默认排序
    sortFn(e){
      console.log(e.currentTarget.dataset.index);
      var that = this;
      let index = e.currentTarget.dataset.index;
      let orderBy = index==0?'order_num':'new_money';
      console.log(that.data.orderType);
      let orderType = that.data.orderType=='DESC'?'ASC':'DESC';
      that.setData({
        sortIndex: index,
        orderBy:orderBy,
        orderType:orderType,
        product:[],
        pageNo:1,
        flag:true
      })
      that.getCommodity(orderBy,that.data.id,orderType);
    },

    getshopPage:function(){
      var that = this;
      var markId = {
        markId:that.data.markId
      }
      app.getReq('/api/applet/commodity/sort',markId,(res) => {
        console.log(res)
        that.setData({
          category:res.result,
        },()=>{
          that.getCommodity(that.data.orderBy,that.data.id,that.data.orderType);
        })
      })
    },
    getCommodity(orderBy,id,orderType){
      var that = this;
      var query = {
        type : id?id:that.data.category[0].id,
        shopsId:'',
        orderBy:orderBy,
        orderType:orderType,
        pageNo:that.data.pageNo,
        pageSize:that.data.pageSize,
        markId:that.data.markId
      }
      console.log(query)
      if(that.data.flag){
        app.postReq('/api/applet/commodity/all',query,(res) => {
          let arr1 = that.data.product;
          let arr2 = res.result.result;
          arr1 = arr1.concat(arr2);
          that.setData({
            product:arr1
          });
          if(arr2.length==0){
            that.setData({
              flag:false
            })
          }
        })
      }
    },

  //页面滑动到底部
  bindDownLoad:function(){   
    let that = this;
    let pageNo = that.data.pageNo + 1;
    that.setData({
      pageNo:pageNo
    },()=>{
      that.getCommodity(that.data.orderBy,that.data.id,that.data.orderType);
    });
  },

  onShow: function () {
    let that = this;
    var marksInfo =  wx.getStorageSync('marksInfo');
    console.log(marksInfo)
    wx.getSystemInfo({
      success:function(res){
          that.setData({
            scrollHeight:res.windowHeight
        });
      }
    });
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data)
    that.setData({
      curIndex:currPage.data.curIndex,
      id:currPage.data.id,
      product:[],
      pageNo:1,
      flag:true,
      markId:marksInfo.markId
    })
    that.getshopPage();
  },

  onLoad: function(){
    var that = this;
    
  },
})