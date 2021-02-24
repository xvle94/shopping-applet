 var url = 'https://erbu.fyitgroup.net'; // 接口请求地址
 var baseUrl = url +'/shiyue';
// var baseUrl = 'https://erbu.fyitgroup.net'; // 接口请求地址

function getReq(url, data, fun) {
  // wx.showLoading({
  //   title: '加载中',
  // })
  var header = {}
  //除登陆以外的接口调用 将cookie写入缓存中
  var cookie = wx.getStorageSync('cookieKey');
  var result = wx.getStorageSync("result");
  //如果缓存中有数据,那么携带token
  if(result) {
    header = {'X-Access-Token': result.token}
    if (cookie) {
      header = { 'Content-type': 'application/json;charset=UTF-8', cookie };
    }
  }
  wx.request({
    url: baseUrl + url,
    method: 'GET',
    header: header,
    data: data,
    success(res) {
      console.log(res);
      //wx.hideLoading();
      if (res.statusCode == '400') {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
          position: 'top'
        })
      }
      //如果返回500 重新登录
      // if (res.statusCode == '500') {
      //   wx.showToast({
      //     title: '登录状态失效，请重新登录',
      //     icon: 'none'
      //   })
      //   setTimeout(function () {
      //     //跳转登录页面
      //     wx.navigateTo({
      //       url: '/page/login/login',
      //     })
      //   }, 3000)
      // }

      if (res.statusCode == '200') {
        return typeof fun == 'function' && fun(res.data);
      }
      // if (res.statusCode == '408' || res.statusCode == '401') {
      //   wx.showToast({
      //     title: '登录状态失效，请重新登录',
      //     icon: 'none'
      //   })
      //   setTimeout(function () {
      //     //跳转登录页面
      //     wx.navigateTo({
      //       url: '/page/login/login',
      //     })
      //   }, 3000)
      // }
      if (res.statusCode == '404') {
        wx.showToast({
          title: '服务器维护中，请稍后尝试',
          icon: 'none'
        })
      }
    },
    // fail(res) {
    //   console.log(res);
    //   //wx.hideLoading();
    //   wx.showModal({
    //     title: '错误错误',
    //     content: '请求出错，请重试',
    //     showCancel: false
    //   })
    // },
    complete() {
      //wx.hideLoading();
      wx.stopPullDownRefresh();
    },
  })
}
function postReq(url, data, fun) {
  // wx.showLoading({
  //   title: '加载中',
  // })
  var header = {}
  //除登陆以外的接口调用 将cookie写入缓存中
  var cookie = wx.getStorageSync('cookieKey');
  var result = wx.getStorageSync("result");
   //如果缓存中有数据,那么携带token
  if(result) {
    // wx.redirectTo({
    //   url: "/page/login/login"
    // })
    // return false
    header = {'X-Access-Token': result.token}
    if (cookie) {
      header = { 'Content-type': 'application/json;charset=UTF-8', cookie };
    }
  }
  
  wx.request({
    url: baseUrl + url,
    method: 'POST',
    header: header,
    data: data,
    success(res) {
      //wx.hideLoading();
      if (res.statusCode == '400') {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
          position: 'top'
        })
      }
      if (res.statusCode == '500') {
        wx.showToast({
          title: '服务器开小差了，请联系管理员',
          icon: 'none'
        })
      }
      //如果返回500 重新登录
      // if (res.statusCode == '500') {
      //   wx.showToast({
      //     title: '登录状态失效，请重新登录',
      //     icon: 'none'
      //   })
      //   setTimeout(function () {
      //     //跳转登录页面
      //     wx.navigateTo({
      //       url: '/page/login/login',
      //     })
      //   }, 3000)
      // }
      // if (res.statusCode == '408') {
      //   wx.showToast({
      //     title: '登录状态失效，请重新登录',
      //     icon: 'none'
      //   })
      //   setTimeout(function () {
      //     //跳转登录页面
      //     wx.navigateTo({
      //       url: '/page/login/login',
      //     })
      //   }, 3000)
      // }
      if (res.statusCode == '404') {
        wx.showToast({
          title: '服务器维护中，请稍后尝试',
          icon: 'none'
        })
      }
      if (res.statusCode == '200') {

        return typeof fun == 'function' && fun(res.data);
      }
    },
    // fail(res) {
    //   //wx.hideLoading();
    //   wx.showModal({
    //     title: '错误错误',
    //     content: '请求出错，请重试',
    //     showCancel: false
    //   })
    // },
    complete() {
      //wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  })
}
function fileReq(url, file, data, fun){
  wx.showLoading({
    title: '上传中',
  })
  var header = {}
  //除登陆以外的接口调用 将cookie写入缓存中
  var cookie = wx.getStorageSync('cookieKey');
  var result = wx.getStorageSync("result");
  header = {'X-Access-Token': result.token}
  if (cookie) {
    header = { 'Content-type': 'application/json;charset=UTF-8', cookie };
  }
  wx.uploadFile({
//上传服务器的地址
    url: url, 
    filePath: file, //临时路径
    name: 'file',
    header: header,
    formData: data,
    success: function (res) {
      //wx.hideLoading();
      if (res.statusCode == '400') {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
          position: 'top'
        })
      }
      if (res.statusCode == '500') {
        wx.showToast({
          title: '服务器开小差了，请联系管理员',
          icon: 'none'
        })
      }
      if (res.statusCode == '408' || res.statusCode == '401') {
        wx.showToast({
          title: '登录状态失效，请重新登录',
          icon: 'none'
        })
        setTimeout(function () {
          // //跳转登录页面
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
        }, 3000)
      }
      if (res.statusCode == '404') {
        wx.showToast({
          title: '服务器维护中，请稍后尝试',
          icon: 'none'
        })
      }
      if (res.statusCode == '' || res.statusCode == undefined) {
        wx.showToast({
          title: '服务器维护中，请稍后尝试',
          icon: 'none'
        })
      }
      if (res.statusCode == '200') {
        return typeof fun == 'function' && fun(res.data);
      }
    },

    fail: function (err) {
      //wx.hideLoading();
      console.log(err.errMsg);//上传失败
    },
    complete() {
      //wx.hideLoading();
    }
  });
}
function userLogin(url, data, fun) {
  /* wx.showLoading({
   *   title: '加载中',
   * })
   */
  wx.request({
    url: baseUrl + url,
    method: 'POST',
    header: {'Content-type': 'application/json'},
    data: data,
    success(res) {
      /* //wx.hideLoading(); */
      if (res.statusCode == '400') {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
          position: 'top'
        })
      }
      // if (res.statusCode == '500') {
      //   wx.showToast({
      //     title: '服务器开小差了，请联系管理员',
      //     icon: 'none'
      //   })
      // }
      if (res.statusCode == '404') {
        wx.showToast({
          title: '服务器维护中，请稍后尝试',
          icon: 'none'
        })
      }
      if (res.statusCode == '200') {
        //保存用户登录信息
        if(res.data.result) {
          wx.setStorageSync('result', res.data.result);
        }
        //将登陆的cookie写入缓存
        if (res && res.header && res.header['Set-Cookie']) {
          //保存Cookie到Storage
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
        }
        return typeof fun == 'function' && fun(res.data);
      }
    },
    // fail(res) {
    //   /* //wx.hideLoading(); */
    //   wx.showModal({
    //     title: '错误错误',
    //     content: '请求出错，请重试',
    //     showCancel: false
    //   })
    // },
    complete() {
      /* //wx.hideLoading(); */
    }
  })
}


  function authApi(url, data, fun) {
    /* wx.showLoading({
     *   title: '加载中',
     * })
     */
    wx.request({
      url: baseUrl + url,
      method: 'POST',
      header: {'Content-type': 'application/json'},
      data: data,
      success(res) {
        /* //wx.hideLoading(); */
        if (res.statusCode == '400') {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            position: 'top'
          })
        }
        if (res.statusCode == '500') {
          wx.showToast({
            title: '服务器开小差了，请联系管理员',
            icon: 'none'
          })
        }
        if (res.statusCode == '404') {
          wx.showToast({
            title: '服务器维护中，请稍后尝试',
            icon: 'none'
          })
        }
        if (res.statusCode == '200') {
          //保存用户登录信息
          if(res.data.result) {
            wx.setStorageSync('result', res.data.result);
          }
          //将登陆的cookie写入缓存
          if (res && res.header && res.header['Set-Cookie']) {
            //保存Cookie到Storage
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
          }
          return typeof fun == 'function' && fun(res.data);
        }
      },
      fail(res) {
        /* //wx.hideLoading(); */
        wx.showModal({
          title: '错误错误',
          content: '请求出错，请重试',
          showCancel: false
        })
      },
      complete() {
        /* //wx.hideLoading(); */
      }
    })
}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  fileReq: fileReq,
  userLogin: userLogin,
  baseUrl: url,
}
