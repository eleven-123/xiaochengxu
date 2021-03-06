// pages/goods/goods.js
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品信息
    basicInfo:{},
    pics:[],
    content:{},
    goodsNum: 1, //商品数量
    
    // 轮播设置
    indicatorDots: true,
    indicatorColor: "#b8f3ee",
    indicatorAactiveColor: "#36B9AF",
    autoplay: true,
    interval: 5000,
    duration: 300,
    
    showDialog:false,
  },
  //预览图片
  previewImage:function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.goodsImgUrls // 需要预览的图片http链接列表  
    })
  },
  // 弹框 -显示
  toggleDialog: function(e){
    var that = this;
    that.setData({
      showDialog:true
    })
  },
  // 弹框 -隐藏
  closeDialog: function(e){
    var that = this;
    that.setData({
      showDialog: false
    })
  },

  //选择数量
  goodAdd:function(e){
    var that = this;
    console.log(that.data)
    var goodCount = that.data.goodsNum + 1;
    that.setData({//商品数量+1
      goodsNum: goodCount
    })
  },
  goodReduce: function (data) {
    var that = this;
    var goodCount = that.data.goodsNum - 1;
    that.setData({//商品数量-1
      goodsNum: goodCount
    })
  },

  /**
 * 加入购物车
 */
  addCart: function () {
    var that = this;
    var thatData = that.data;
    var obj={
      id:thatData.basicInfo.id, //商品id
      name:thatData.basicInfo.name, //商品名称
      price:thatData.basicInfo.originalPrice, //价格
      num:thatData.goodsNum, //商品数量    
      pic:thatData.basicInfo.pic, //商品图片
      stock:thatData.basicInfo.stores, //商品库存
      isChecked:true //商品选中状态
    } 
    // 缓存数组
    var arr = wx.getStorageSync('cart') || [];
    if (arr.length > 0) {
      for (var i in arr) {
        if (arr[i].id == obj.id) {
          arr[i].num += obj.num;
          try{
            wx.setStorageSync('cart',arr)
          }catch(e){
            console.log(e)
          }
          wx.showToast({
            title: '添加成功！',
            duration: 2000,
          })
      
          that.setData({
            showDialog: false
          })
          return;          
        }
      }
      arr.push(obj)
    }else{
      arr.push(obj)
    }
    try{
      wx.setStorageSync('cart',arr)
      wx.showToast({
        title: '添加成功！',
        duration: 2000,
      })  
      that.setData({
        showDialog: false
      })
      return;
    }catch(e){
      console.log(e)
    }
    
  },
  //立即购买
  saveOrder: function () {
    var that=this;
    var thatData = that.data;
    var list = [];
    var obj={
      id:thatData.basicInfo.id, //商品id
      name:thatData.basicInfo.name, //商品名称
      price:thatData.basicInfo.originalPrice.toFixed(2), //价格
      num:thatData.goodsNum, //商品数量    
      pic:thatData.basicInfo.pic, //商品图片
      stock:thatData.basicInfo.stores //商品库存
    }
    console.log(obj);
    list.push(obj)
    wx.setStorageSync('orderCreate',list)
    wx.navigateTo({
      url:'/pages/orderCreate/orderCreate'
    })

    that.setData({
      showDialog: false
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var goodsId = options.id;
    wx.request({
      url: app.apiRoutes.getGoodsDetail,
      header: app.apiHeader,
      data:{
        id:goodsId
      },
      success:function(res){
        var data = res.data.data;
        console.log(data)
        WxParse.wxParse('content', 'html', data.content, that,5);
        that.setData({
          basicInfo:data.basicInfo,
          pics:data.pics,
        })
      }
    })
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