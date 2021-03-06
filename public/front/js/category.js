
$(function () {

  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    success: function (info) {
      //console.log(info);
      $('.category_left ul').html(template('tpl', info));

      //获取到一级分类之后，渲染了第一个一级分类对应的二级分类
      renderSecond(info.rows[0].id);
    }
  });



  //点击一级分类，动态渲染二级分类

  $('.category_left').on('click', 'li', function () {

    $(this).addClass('now').siblings().removeClass('now');

    //2. 渲染了指定的二级分类
    var id = $(this).data("id");
    renderSecond(id);

    //3. 让右边的滚动容器滚到0，0的位置
    mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0, 0, 1000);//100毫秒滚动到顶


  });




  function renderSecond(id) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      success: function (info) {
        //console.log(info);
        $('.category_right ul').html(template('secondTpl', info));
      }
    });
  }



});