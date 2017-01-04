//作者：不灭的小灯灯
//日期：2017-1-4
//简书：http://www.jianshu.com/users/5e67cac824c1/latest_articles
var WxParse = require('../../wxParse/wxParse.js');
var Util = require('../../utils/util.js');
var article_id = ''
var myComment = ''
Page({
  data:{},
  onTextChanged: function(e){
    myComment = e.detail.value
  },
  onSendClicked: function(e){
    if(myComment.length<1 || myComment.length>200){
      return
    }
    var that = this
    //发送评论评论 该功能无法使用，仅作保留
    wx.request({
        url : 'http://你的服务器地址/news/comment',
        method: 'POST',
        data : {
          uid:'',
          token:'',
          article_id: article_id,
          content: myComment
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          //评论成功成功
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          //刷新评论
          that.loadComments()
        }
    })
  },
  onLoad:function(options){
    var that = this
    article_id = options.article_id 
    //请求文章详情
    wx.request({
        url : 'http://你的服务器地址/news/detail',
        method: 'POST',
        data : {
          article_id: article_id
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          var _content = res.data.article['content']
          that.setData({
              article: res.data.article
          });
          WxParse.wxParse('content', 'html', _content, that,0);
        }
    })
    this.loadComments()
  },
  loadComments:function(){
    var that = this
    //请求评论
    wx.request({
        url : 'http://你的服务器地址/news/commentList',
        method: 'POST',
        data : {
          article_id: article_id,
          orderType: 0,
          start_id:0,
          limit:100
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          console.log(res)
          var _comments = res.data.comments
          for(var i in _comments){
            _comments[i].time = Util.getTime(_comments[i].time)
          }
          that.setData({
              commentList:_comments
          });
        }
    })
  }
})