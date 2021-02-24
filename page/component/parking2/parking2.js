// page/component/parking2/parking2.js
const util= require("../../../util/util.js");
const app = getApp()
Page({
  data: {
    //验证查询停车费按钮是否启用
    checkOption: true,
    isKeyboard: !1,
    isNumberKB: !1,
    tapNum: !1,
    disableKey: "1234567890港澳学",
    keyboardNumber: "1234567890ABCDEFGHJKLMNPQRSTUVWXYZ港澳学",
    keyboard1: "京沪粤津冀晋蒙辽吉黑苏浙皖闽赣鲁豫鄂湘桂琼渝川贵云藏陕甘青宁新",
    inputPlates: {
      index0: "沪",
      index1: "",
      index2: "",
      index3: "",
      index4: "",
      index5: "",
      index6: "",
      index7: ""
    },
    inputOnFocusIndex: "",
    flag:true,
    carNum:'',
    tihuoWay:'',
    queryList:[],
    //商场id
    markId: '',
    buttonClicked: false
  },
  onLoad: function () {
    this.setData({
      checkOption: true
    })
  },
  onShow: function () {
    this.setData({
      checkOption: true
    })
    let that = this;
    that.getList();
  },
  //查询所有商场信息
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
      markId: id,
      select: false,
      tihuoWay:name
    })
  },
  getList(){
    var marksInfo =  wx.getStorageSync('marksInfo');
    console.log(marksInfo)
    app.getReq('/api/applet/mark/queryAll','',(res) => {
      console.log(res)
      var that = this;
      that.setData({
        tihuoWay:marksInfo.markName,
        markId: marksInfo.markId,
        queryList:res.result
      })
    })
  },

  //删除最后一项
  truncate:function (arr) {
    var m = [];
    for(var i = 0; i < arr.length - 1; i++){
        m.push(arr[i]);
    }
    return m.join("");
  },
  //查询订单信息
  queryByCarNum:function(){
    //设置查询按钮禁用
    this.setData({
      checkOption: false
    })
    let that = this;
     //读取缓存中的信息
     var result = wx.getStorageSync('result');
     var userId = result.userInfo.id;
     //封装查询参数
     let carNum = that.data.carNum;
     if(that.data.flag && carNum.length>7){
       carNum = that.truncate(carNum);
     }
     var queryData = {
      carNum: carNum,
      userId: userId,
      markId: this.data.markId
     }
     if((that.data.flag && carNum.length==7) || (!that.data.flag && carNum.length==8)){
       that.setData({
        buttonFlg:false
       },()=>{
          app.getReq('/api/park/third/order',queryData,(res)=>{
            
            //如果返回有结果
            if(res.result){
              wx.setStorage({
                key: "parkPayInfo",
                data: res.result
              })
              //将选择的商场id写入缓存中
              wx.setStorage({
                key: "markId",
                data: that.data.markId
              })
              //设置查询按钮启用
              that.setData({
                checkOption: true
              })
              //跳转详情页面
              wx.navigateTo({
                url: '../parkPay/parkPay'
              })
            }else{
              //设置查询按钮启用
              that.setData({
                checkOption: true
              })
              setTimeout(()=>{
                wx.showToast({
                  title: res.message,
                  icon: 'none',
                })
              },500)
            }
          })
       })
     }
  },
  //切换车牌
  changeplate:function(){
    var that = this;
    that.setData({
      flag:false,
    });
    let carNum = that.data.carNum;
    if(carNum.length==8){
      that.setData({
        buttonFlg:false
      })
    }else{
      that.setData({
        buttonFlg:true
      })
    }
  },
  //切换车牌
  changeplate1: function () {
    var that = this;
    that.setData({
      flag: true,
    });
    let carNum = that.data.carNum;
    if(carNum.length>7){
      carNum = that.truncate(carNum);
    }
    if(carNum.length==7){
      that.setData({
        buttonFlg:false
      })
    }
  },
 
  inputClick:function(t){
    var that = this;
    console.log('输入框:', t)
    that.setData({
      inputOnFocusIndex : t.target.dataset.id,
      isKeyboard: !0
    })
    "0" == this.data.inputOnFocusIndex ? that.setData({
      tapNum: !1,
      isNumberKB: !1
    }) : "1" == this.data.inputOnFocusIndex ? that.setData({
      tapNum: !1,
      isNumberKB: !0
    }) : that.setData({
      tapNum: !0,
      isNumberKB: !0
    });
 
  },
 
  //键盘点击事件
  tapKeyboard: function (t) {
    let that = this;
    t.target.dataset.index;
    var a = t.target.dataset.val;
    console.log('键盘:',a)
    switch (this.data.inputOnFocusIndex) {
      case "0":
        this.setData({
          "inputPlates.index0": a,
          inputOnFocusIndex: "1"
        });
        break;
 
      case "1":
        this.setData({
          "inputPlates.index1": a,
          inputOnFocusIndex: "2"
        });
        break;
 
      case "2":
        this.setData({
          "inputPlates.index2": a,
          inputOnFocusIndex: "3"
        });
        break;
 
      case "3":
        this.setData({
          "inputPlates.index3": a,
          inputOnFocusIndex: "4"
        });
        break;
 
      case "4":
        this.setData({
          "inputPlates.index4": a,
          inputOnFocusIndex: "5"
        });
        break;
 
      case "5":
        this.setData({
          "inputPlates.index5": a,
          inputOnFocusIndex: "6"
        });
        break;
 
      case "6":
        this.setData({
          "inputPlates.index6": a,
          inputOnFocusIndex: "7"
        });
        break;
 
      case "7":
        this.setData({
          "inputPlates.index7": this.data.flag?"":a,
          inputOnFocusIndex: "7"
        });
 
    }
    var n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
    console.log('车牌号:',n)
    if(this.data.flag){
      that.setData({
        carNum:n,
        buttonFlg:false
      })
    }else if(!this.data.flag){
      that.setData({
        carNum:n,
        buttonFlg:false
      })
    }
    this.checkedSubmitButtonEnabled();
  },
  //键盘关闭按钮点击事件
  tapSpecBtn: function (t) {
    var a = this, e = t.target.dataset.index;
    if (0 == e) {
      switch (parseInt(this.data.inputOnFocusIndex)) {
        case 0:
          this.setData({
            "inputPlates.index0": "",
            inputOnFocusIndex: "0"
          });
          break;
 
        case 1:
          this.setData({
            "inputPlates.index1": "",
            inputOnFocusIndex: "0"
          });
          break;
 
        case 2:
          this.setData({
            "inputPlates.index2": "",
            inputOnFocusIndex: "1"
          });
          break;
 
        case 3:
          this.setData({
            "inputPlates.index3": "",
            inputOnFocusIndex: "2"
          });
          break;
 
        case 4:
          this.setData({
            "inputPlates.index4": "",
            inputOnFocusIndex: "3"
          });
          break;
 
        case 5:
          this.setData({
            "inputPlates.index5": "",
            inputOnFocusIndex: "4"
          });
          break;
 
        case 6:
          this.setData({
            "inputPlates.index6": "",
            inputOnFocusIndex: "5"
          });
          break;
 
        case 7:
          this.setData({
            "inputPlates.index7": "",
            inputOnFocusIndex: "6"
          });
      }
      var n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
      if(this.data.flag){
        a.setData({
          carNum:n,
          buttonFlg:true
        })
      }else if(!this.data.flag){
        a.setData({
          carNum:n,
          buttonFlg:true
        })
      }
      this.checkedSubmitButtonEnabled();
    } else 1 == e && a.setData({
      isKeyboard: !1,
      isNumberKB: !1,
      inputOnFocusIndex: ""
    });
  },
  //键盘切换
  checkedKeyboard: function () {
    var t = this;
    "0" == this.data.inputOnFocusIndex ? t.setData({
      tapNum: !1,
      isNumberKB: !1
    }) : "1" == this.data.inputOnFocusIndex ? t.setData({
      tapNum: !1,
      isNumberKB: !0
    }) : this.data.inputOnFocusIndex.length > 0 && t.setData({
      tapNum: !0,
      isNumberKB: !0
    });
  },
 
  checkedSubmitButtonEnabled: function () {
    this.checkedKeyboard();
    var t = !0;
    for (var a in this.data.inputPlates) if ("index7" != a && this.data.inputPlates[a].length < 1) {
      t = !1;
      break;
    }
  },
})