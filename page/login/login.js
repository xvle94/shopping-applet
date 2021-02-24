// page/login/login.js
const util= require("../../util/util.js");
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginTitle: '微信授权登录',
    userPhone: '手机号授权',
    //默认微信授权展示
    titleShow: true,
    //手机号授权隐藏
    phoneShow: false,
    lee: false,
    authData: [],
    sysUserInfo: [],
    nickName: "",
    avatarUrl: "",
    loginStatus:false,
    buttonClicked: false
  },
  //获取用户微信信息
  onGotUserInfo: function(e) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    util.buttonClicked(this);

    if (e.detail.errMsg === "getUserInfo:ok") {
      wx.setStorage({
        key: "userinfo",
        data: e.detail.userInfo
      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      //将用户信息缓存到app.js
      app.globalData.userInfo = e.detail.userInfo;
      //进行登录验证
      wx.login({
        async success(wr) {
          //如果有code
          if(wr.code){
            //获取缓存中,是否含有推广参数
            var source = '';
            //获取用户id
            var extendId=  wx.getStorageSync('extendId');
            //如果有数据赋值推广参数
            if(extendId){
              source = extendId;
            }
            //封装参数，掉接口进行登录或注册
            let weChatData = {
              code: wr.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl,
              type: 0,
              source: source
            }
            that.setData({
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl,
            })
             //获取用户信息
            app.userLogin("/sys/applet/login", weChatData, (res) => {
              wx.showToast({ icon: 'none', title: '请继续进行手机号授权', })
              console.log(res)
              if(res.code == 200) {
                wx.hideLoading();
                //用户登录成功,验证有没有绑定手机号
                var userInfo = res.result.userInfo;
                that.sysUserInfo = userInfo;
                //缓存用户信息
                  wx.setStorage({
                    key: "sysUserInfo",
                    data: that.sysUserInfo
                  })
                //微信授权信息
                that.authData = res.result.resultMap;
                //如果没有绑定手机号,引导绑定
                if(!userInfo.phone){
                    //微信授权隐藏 手机号展示
                    that.setData({
                      titleShow: false,
                      phoneShow: true,
                      lee: true
                    })
                }else{
                  //登录成功 跳转首页
                  wx.switchTab({
                    url: '/page/component/index'
                  })
                }
              }else{
                //微信授权隐藏 手机号展示
                that.setData({
                  titleShow: true,
                  phoneShow: false,
                  lee: false
                })
                //登录出错了
                wx.showToast({ icon: 'none', title: '登录失败，请重新尝试', })
                wx.hideLoading();
              }
            } )
          }
          
        
        }
      })
     
    }else{
      wx.hideLoading();
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回',
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            wx.switchTab({
              url: '/page/component/user/user'
            })
          }
        }
      });
    }

  },
  //获取手机号
  getPhoneNumber: function(e) {
    //如果用户拒绝授权
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({ icon: 'none', title: '您点击了拒绝授权，部分功能无法使用!', })
    }else{
      var that = this;
      that.data.lee
      if (that.data.lee == false) {
        that.setData({
          titleShow: true,
          phoneShow: false,
          lee: false
        });
        wx.showToast({
          icon: "none",
          title: '请先点击获取用户信息',
        })
        return
      } else {
        //获取手机号
        wx.checkSession({
          success: function(res) {
            var ency = e.detail.encryptedData;
            var iv = e.detail.iv;
            var weChatData = {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              nickName: that.nickName,
              avatarUrl: that.avatarUrl,
              openId: that.authData.openId,
              sessionKey: that.authData.session_key,
            }
             //获取用户手机号
             app.postReq("/api/wechart/phone", weChatData, (res) => {
              if(res.code == 200 && res.result != null) {
                //调用接口保存用户手机号
                var phoneNumber = res.result.phoneNumber;
                app.postReq("/api/user/edit", {"id": that.sysUserInfo.id, "phone": phoneNumber},(res) => {
                  if(res.code == 200) {
                      //登录成功 跳转首页
                      wx.switchTab({
                        url: '/page/component/index'
                      })
                  }
                })
                
              }else{
                //微信授权隐藏 手机号展示
                that.setData({
                  titleShow: true,
                  phoneShow: false,
                  lee: false
                })
                //登录出错了
                wx.showToast({ icon: 'none', title: '授权失败，请重新尝试', })
              }
            } )
          }
        })
      }
    }
   
  },
  cancelLogin(){
    wx.switchTab({
      url: '/page/component/index'
    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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