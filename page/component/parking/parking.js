// page/component/parking/parking.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryList:[],
    select: false,
    markId:{
      markId:''
    },
    //车牌号
    carNum: "",
    //是否显示添加车牌号框的
    showAdd: true,
    numberData: [
      {id: "num0", value: ""}, 
      {id: "num1", value: ""}, 
      {id: "num2", value: ""},
      {id: "num3", value: ""},
      {id: "num4", value: ""},
      {id: "num5", value: ""},
      {id: "num6", value: ""}],
    tihuoWay:'',
    iptValue: "",
    isFocus: false,
  },
  onFocus: function (e) {
    var that = this;
    that.setData({ isFocus: true });
  },
  setValue: function (e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({ iptValue: e.detail.value });
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
  bindShowMsg() {
    this.setData({
        select:!this.data.select
    })
  },
  mySelect(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    this.setData({
      markId:{
        markId:id
      },
      select: false,
      tihuoWay:name
    })
  },
  getList(){
    app.getReq('/api/applet/mark/queryAll','',(res) => {
      var that = this;
      that.setData({
        tihuoWay:res.result[0].name,
        markId:{
          markId:''
        },
        queryList:res.result
      })
    })
  },
  //根据车牌号查询信息
  queryByCarNum(){
    wx.showLoading({
      title: '加载中',
    })
    var carNum = this.data.iptValue;
    // var carNum = "";
    // numberData.forEach(item => {
    //   if(item.value != undefined && item.value != null && item.value != ""){
    //         if(carNum != undefined && carNum != null && carNum != ""){
    //           carNum += item.value
    //         }else{
    //           carNum = item.value
    //         }
    //   }
    // });
    // if(carNum.length < this.data.numberData.length){
    //   wx.hideLoading();
    //   wx.showToast({ icon: 'none', title: '请输入正确的车牌号', })
    //   return false;
    // }
    //车牌号正则
    var cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if(!(cPattern.test(carNum))) {
      wx.hideLoading();
      wx.showToast({ icon: 'none', title: '请输入正确的车牌号', })
      return false;
    }

    //保存车牌号
    this.setData({
      carNum: carNum
    })
     //读取缓存中的信息
     var result = wx.getStorageSync('result');
     var userId = result.userInfo.id;
     //封装查询参数
     var queryData = {
      carNum: carNum,
      userId: userId,
      configId: ""
     }
     //查询订单信息
     app.getReq('/api/park/third/order',queryData,(res)=>{
        console.log(res);
        //如果返回有结果
        if(res.result){
          wx.setStorage({
            key: "parkPayInfo",
            data: res.result
          })
           //跳转详情页面
           wx.navigateTo({
            url: '../parkPay/parkPay'
          })
        }
     })
    wx.hideLoading();

  },
  //添加一位车牌号
  addCase(){
    var numberData = this.data.numberData;
    numberData.push({id: "num7", value: ""});
    this.setData({
      showAdd : false,
      numberData: numberData
    })
  },
  //得到页面输入的结果
  bindKeyInput(e){
     //拿到当前input的编号
    var num = parseInt(e.target.id.charAt(e.target.id.length-1));
     //拿到当前input的值
    var value = e.detail.value;
    if(value.length > 1){
      wx.showToast({ icon: 'none', title: '每个框内只允许填一位', })
      var numberData = "numberData[" + num + "].value";
      this.setData({
        [numberData]: ''
      })
      return ;
    }else{
      //拿到车牌号数组
      var numberData = this.data.numberData;
      numberData[num].value = value;
      //保存输入的信息
      this.setData({
        numberData: numberData
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.getList();
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