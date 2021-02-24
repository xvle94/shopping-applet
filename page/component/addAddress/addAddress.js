const app = getApp()
Page({
  data: {
    switch1Checked: false,
    items: [
      { name: '家', value: '家', checked: 'true'  },
      { name: '学校', value: '学校'},
      { name: '公司', value: '公司' },
    ],
    areaList:[],
    multiArray: [],  // 三维数组数据
    multiIndex: [0, 0, 0], // 默认的下标
    step: 0, // 默认显示请选择
    currnetCityQueryId:'',
    pCode:''
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  formSubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    var isMobile = mobile.exec(e.detail.value.contactPhone) 
     
    var whereProvince=that.data.pid
    var whereCity=that.data.cid
    var whereCounty=that.data.aid
    var detailedAddress=e.detail.value.detailedAddress
    var contactName=e.detail.value.contactName
    var contactPhone=e.detail.value.contactPhone
    if (whereProvince == "" || whereCity=="" || whereCounty=="" || detailedAddress=="" || contactName==""|| contactPhone=="") {
      wx.showModal({
        title: '提示！！',
        content: '您的信息缺失，请重新填写！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            return false;
          }
        }
      })
      wx.hideNavigationBarLoading();
    }else if (whereProvince == undefined || whereCity==undefined || whereCounty==undefined) {
      wx.showModal({
        title: '提示！！',
        content: '请选择地址！',
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
      console.log('电话：', e.detail.value.contactPhone)
        wx.showModal({
          title: '提示！！',
          content: '你输入的电话不符，请重新检查填写',
        })
    }else{
      var result = wx.getStorageSync('result');
      var ds=0;
      if(e.detail.value.defaultStatus===true){
        ds=1;
      }
      let address = {
        userId : result.userInfo.id,
        whereProvince:that.data.pid,
        whereCity:that.data.cid,
        whereCounty:that.data.aid,
        detailedAddress:e.detail.value.detailedAddress,
        contactName:e.detail.value.contactName,
        contactPhone:e.detail.value.contactPhone,
        tag:e.detail.value.tag,
        defaultStatus:ds,
      }
      console.log(address)
      app.postReq('/api/user/address/add',address,(res)=>{
        console.log(res);
        if(res.code == 200){
          wx.showToast({
            title: '添加成功！',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                var pages = getCurrentPages();
                var beforePage = pages[pages.length - 2];
                beforePage.onLoad();
                wx.navigateBack({
                  delta: 1,
                })
              }, 500);
            }
          })
        }else if(res.code == 206 ){
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  },
 
  getProvince(){ // 获取省
    var that = this;
    let param={
      pId:1,
      type:1
    }
    app.getReq('api/user/queryByPid',param,(res)=>{
      console.log(res)
      var data = res.result
      var provinceList = [...data] // 放在一个数组里面，在数组前边添加一个清空选项
      provinceList.unshift({
        id: "",
        Code: "",
        name: "全部省份",
        ParentId: "",
        Type: "",
      })
      var provinceArr = data.map((item) => { return item.cityName }) // 获取数据里面的value值，就是只用数据的名称用于页面展示 
      provinceArr.unshift("全部省份") // 在页面展示用的也需要添加一个清空项
      that.setData({
        multiArray: [provinceArr, ["全部市"], ["全部区"]], // 更新三维数组 更新后长这样 [['全部省', '北京省',......],["全部市"],["全部区"]]
        provinceList,   // 省级原始数据
        provinceArr,    // 省级所有的名称用于页面展示
       // pCode: provinceList[0].Code // 用于查询收费站点的查询code，添加清空项后不需要该操作，都可
      })
      var defaultId = that.data.provinceList[0].id  // 使用第一项当作参数获取市级数据，添加清空项后不需要该操作，都可
      if (defaultId) {
        that.setData({
          currnetCityQueryId: defaultId  // 保存市的查询id，用于后边的查询市操作
        })
        that.getCity(defaultId)  // 获取市级数据
      }
    })
  },
  getCity(id) { // 获取市级数据
    this.setData({
      currnetCityQueryId: id  // 保存当前选择的市级id
    })
    var that = this;
    console.log(that.data.currnetCityQueryId,id)
    let param={
      pId:that.data.currnetCityQueryId,
      type:2
    }
    app.getReq('api/user/queryByPid',param,(res)=>{
      var data = res.result
      var cityList = [...data]
      cityList.unshift({
        id: "",
        Code: "",
        Name: "全部市",
        ParentId: "",
        Type: "",
      })
      var cityArr = data.map((item) => { return item.cityName })
      cityArr.unshift("全部市")
      that.setData({
        multiArray: [that.data.provinceArr, cityArr, ["全部区"]],  // 更新三维数组 更新后长这样 [['全部省', '北京省',......],["全部市","北京市"],["全部区"]]
        cityList,  // 保存下市级原始数据
        cityArr,  // 市级所有的名称
        cityCode: cityList[0].Code // 用于查询收费站点的查询code，添加清空项后不需要该操作，都可
      })
      var defaultId = that.data.cityList[0].id  // 用第一个获取门店数据，添加清空项后不需要该操作，都可
      if (defaultId) {
        that.setData({
          currnetAreaQueryId: defaultId // 保存区的查询id，用于后边的查询区操作
        })
        that.getArea(defaultId) // 获取区数据
      }
    })
  },
  getArea(id) {
    this.setData({
      currnetAreaQueryId: id // 更新当前选择的市级id
    })
    var that = this;
    let param={
      pId:that.data.currnetAreaQueryId,
      type:3
    }
    app.getReq('api/user/queryByPid',param,(res)=>{
      var data = res.result
      var areaList = [...data]
      areaList.unshift({
        id: "",
        Code: "",
        Name: "全部区",
        ParentId: "",
        Type: "",
      })
      var areaArr = data.map((item) => { return item.cityName })
        areaArr.unshift("全部区")
        that.setData({
          multiArray: [that.data.provinceArr, that.data.cityArr, areaArr],  // 重新赋值三级数组 此时的数组大概是这样 [['全部省', '北京省',......],["全部市","北京市"],["全部区","朝阳区","海淀区"......]]
          areaList,  // 保存区原始数据
          areaArr,    // 保存区名称
          adCode: areaList[0].Code // 用于查询收费站点的查询code
      })
    })
  },
  columnchange(e) {  // 滚动选择器 触发的事件
    // console.log(e)
    var column = e.detail.column  // 当前改变的列
    var data = {
      multiIndex: JSON.parse(JSON.stringify(this.data.multiIndex)),
      multiArray: JSON.parse(JSON.stringify(this.data.multiArray))
    }
    console.log(e.detail.value)
    data.multiIndex[column] = e.detail.value;  // 第几列改变了就是对应multiIndex的第几个，更新它
    switch (column) { // 处理不同的逻辑
      case 0:   // 第一列更改 就是省级的更改
        var currnetCityQueryId = this.data.provinceList[e.detail.value].id
        if (e.detail.value !== 0) {  // 判断当前的value值是不是真正的更新了
          if (this.data.provinceList[e.detail.value].id){ // 当前的市的查询id
            this.getCity(currnetCityQueryId)  // 获取当前市的查询id下面的市级数据
          }
          this.setData({
            pCode: this.data.provinceList[e.detail.value].Code, // 获取当前选择项的站点查询code
            cityCode: "",
            adCode: "",
            pid:this.data.provinceList[e.detail.value].id
          })
        } else {
          this.getProvince() // 重新调用获取省数据，以清空市和区的列表
          this.setData({
            multiArray: [this.data.provinceArr, [], []],
            pCode: this.data.provinceList[e.detail.value].Code, // 获取当前选择项的站点查询code
            cityCode: "",
            adCode: "",
            pid:this.data.provinceList[e.detail.value].id
          })
        }
        data.multiIndex[1] = 0  // 将市默认选择第一个
        break;

      case 1:  // 市发生变化
        var currnetAreaQueryId = this.data.cityList[e.detail.value].id
        if (e.detail.value !== 0) {  // 同样判断
          if (this.data.cityList[e.detail.value].id){
            this.getArea(currnetAreaQueryId)   // 获取区
          }
          this.setData({
            cityCode: this.data.cityList[e.detail.value].Code, // 获取当前选择项的站点查询code
            adCode: "",
            cid:this.data.cityList[e.detail.value].id
          })
        } else {
          this.getCity(this.data.currnetCityQueryId) // 使用当前省列表中获取到的市列表查询id重新调用，以更新（置空）区的列表
          this.setData({
            multiArray: [this.data.provinceArr, [], []],
            cityCode: this.data.cityList[e.detail.value].Code, // 获取当前选择项的站点查询code
            adCode: "",
            cid:this.data.cityList[e.detail.value].id
          })
        }
        data.multiIndex[2] = 0  // 门店默认为第一个
        break;
      case 2:
        this.setData({
          adCode: this.data.areaList[e.detail.value].Code, // 获取当前选择项的站点查询code
          aid:this.data.areaList[e.detail.value].id
        })
    }
    this.setData(data)  // 更新数据
  },
  pickchange(e) {
    this.setData({
      step: 1,  // 有数据时显示当前已选择的省市区
      multiIndex: e.detail.value  // 更新下标字段
    })
  },

  onLoad: function (options) {
    var that = this;
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
    var that=this;
    that.getProvince();
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

  },


 


})
