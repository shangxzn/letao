

//每个页面一加载，就需要发送一个ajax请求，判断当前用户是否登录
//如果当前用户没有登录，需要跳转登录页面
//如果是login页面，是不需要判断有没有登录

//如果不是login页面，需要先发送ajax请求，判断用户是否登录了
// 也可以吧文件名称改成admin，因为在后台那边已经弄好了，所提也可以判断用户是否登录，这个的话发送ajax请求就不会闪，直接到登录页。
if(location.href.indexOf("login.html") == -1) {
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    success: function(info) {
      if(info.error) {
        location.href = "login.html";
      }
    }
  });
}



// 配置关闭了禁闭环
// NProgress.configure({ showSpinner: false });

$(document).ajaxStart(function () {
  NProgress.start();
});

$(document).ajaxStop(function () {
  setInterval(function () {
    NProgress.done();
  }, 500);
});


// 切换菜单项，点击出现一级二级菜单，prev找上一个兄弟然后在找next下一兄弟，切换显示与隐藏
$(".child").prev().on("click", function(){
  $(this).next().slideToggle();
});

// 点击右边右上角小图标，切换now这个类，lt_aside这个切换now这个类，整个左边区域隐藏，lt_main这个盒子动画移动lt_aside这个盒子宽度的180px
$('.icon_menu').on('click', function () {
  $('.lt_main').toggleClass('now');
  $('.lt_aside').toggleClass('now');
});


/* 
  退出功能
    1. 点击退出按钮 
    2. 显示退出的模态框
    3. 点击退出模态框中确认按钮，退出即可。需要发送ajax请求，告诉服务端，需要退出
*/
$('.icon_logout').on('click', function () {
// 注意：modal是bootstrap里模态框提供的方法，目的是为了让模态框显示
  $('#logoutModal').modal('show');

});


$(".btn_logout").on("click", function() {
  //退出
  //跳转登录页 q q
  
  $.ajax({
    type:'get',
    url: '/employee/employeeLogout',
    success: function(info) {
      //console.log(info);
      if(info.success) {
        location.href = "login.html";
      }
    }
  });

});

