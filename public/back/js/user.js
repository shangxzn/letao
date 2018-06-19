
$(function () {

  var page = 1;
  var pageSize = 5;

  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        $('tbody').html(template('tpl', info));

        // 初始化分页  使用bootstrapPaginator实现分页效果
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3必须指定
          currentPage: page, //设置当前页
          totalPages: Math.ceil(info.total / info.size),//设置总页数,应该计算出来
          size: 'small',//指定控件的大小
          onPageClicked: function (a, b, c, p) {//点击页码的时候会触发
            console.log(p);//p就是点击的页码

            page = p; //获取到点击的页码，赋值给page, 重新render
            render();// 重新渲染一下
          }
        })
      }
    });
  }


  // 显示模态框  注册委托事件给tbody注册委托事件，让btn执行
  $('tbody').on('click', '.btn', function () {
    //显示模态框
    $("#userModal").modal("show");

    var id = $(this).parent().data("id");// parent()这是找父元素的

    //取决于点的是启用按钮还是禁用按钮
    var isDelete = $(this).hasClass('btn-success') ? 1 : 0;

    // 注册之前要接触之前注册的事件
    $(".btn_update").off().on("click", function () {
      //发送ajax请求
      $.ajax({
        type: 'post',
        url: '/user/updateUser',
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (info) {
          if (info.success) {
            //关闭模态框
            $("#userModal").modal('hide');
            //重新渲染
            render();
          }
        }
      });
    });


  });

});