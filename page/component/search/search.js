let timeId = null;
const app=getApp()
Page({
    data: {
        history: [],
        product:[],
        showResult: false,
        markId:'',
        // imgheader: app.baseUrl + '/sys/common/static/',
        imgheader:app.baseUrl + '/appletImg/upload/',
        productName:'',
        shopsId:''
    },
    cancelSearch(){
      wx.navigateBack({
        delta: 1
      })
    },
    getCommodity(e){
      var that = this;
      var query = {
        shopsId:that.data.shopsId,
        pageNo:1,
        pageSize:10,
        markId:that.data.markId,
        name: e.detail.value
      }
      console.log(query)
      app.postReq('/api/applet/commodity/all',query,(res) => {
        console.log(res)
        that.setData({
          product:res.result.result,
          showResult: true
        })
      })
    },
    onLoad:function(options){
      var that = this;
      console.log(options.shopsId);
      that.setData({
        shopsId:options.shopsId
      },()=>{
      })
    },
})