//作者：不灭的小灯灯
//日期：2017-1-4
//简书：http://www.jianshu.com/users/5e67cac824c1/latest_articles
var app = getApp()
var sectionData = null
var currentSectionIndex = 0
Page({
  data: {
    hidden:true
  },
  onLoad: function () {
    var that = this
    //登陆
    app.getUserInfo(function(userInfo){
      console.log(userInfo)
    })
    //获取分类信息
    wx.request({
        url : 'http://你的服务器地址/news/section',
        data : {},
        success : function(res){
          sectionData = res.data.sections;
          sectionData[0]['active'] = true //默认选中第一个分类
          that.loadArticles(sectionData[0]['section_id'],false)
          that.setData({
              sections : sectionData
          });
        }
    })
  },
  onSectionClicked: function(e){
    var sid = e.currentTarget.dataset.sid;
    //刷新选中状态
    for(var i in sectionData){
      if(sectionData[i]['section_id'] == sid){
        sectionData[i]['active'] = true
        currentSectionIndex = i
      }
      else
        sectionData[i]['active'] = false
    }
    this.setData({
        sections : sectionData
    });
    //加载文章
    if(sectionData[currentSectionIndex]['articles']){
      this.setData({
          articles : sectionData[currentSectionIndex]['articles']
      });
    }else{
      this.loadArticles(sid,false)
    }   
  },
  loadArticles: function(section_id,ifLoadMore){
    var that = this
    this.setData({
      hidden:false
    })
    //获取文章列表
    wx.request({
        url : 'http://你的服务器地址/news/article',
        method: 'POST',
        data : {
          section_id:section_id,
          start_id:ifLoadMore?sectionData[currentSectionIndex]['articles'].length:0,
          limit:10
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          var articleData = res.data.articles;
          if(ifLoadMore){
            //加载更多
            if(articleData){
              sectionData[currentSectionIndex]['articles'] = sectionData[currentSectionIndex]['articles'].concat(articleData)
            }else{
              wx.showToast({
                title: '暂无更多内容',
                icon: 'loading',
                duration: 2000
              })
            }   
          }else{
            sectionData[currentSectionIndex]['articles'] = articleData//刷新
          }
          
          that.setData({
              articles : sectionData[currentSectionIndex]['articles'],
              hidden: true
          });
          wx.stopPullDownRefresh()//结束动画
        }
    })
  },
  onArticleClicked: function(e){
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      url: '/pages/detail/detail?article_id='+aid
    })
  },
  //下拉刷新
  onPullDownRefresh: function(){
    this.loadArticles(sectionData[currentSectionIndex]['section_id'],false)
  },
  //加载更多
  onReachBottom: function () {
    this.loadArticles(sectionData[currentSectionIndex]['section_id'],true)
  }
})
