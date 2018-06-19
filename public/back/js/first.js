

$(function () {
 
 

  var page = 1;
  var pageSize = 8;
  render();// 这个不能放在最上面，因为预解析的时候，page和pageSize并没有赋值就运行了函数，那data中page=page就没办法执行
  function render() {

    $.ajax({
      type: 'get',
      url: "/category/queryTopCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
       // console.log(info);
        $('tbody').html( template('tpl', info) );

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


  $('.btn_add').on('click', function () {
    $('#addModal').modal('show');
  });

  $('form').bootstrapValidator({
    //指定小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //指定校验的规则
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '一级分类名称不能为空'
          }
        }
      }
    }
  });

  $('form').on('success.form.bv', function (e) {
    e.preventDefault()// 阻止表单提交

    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("form").serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 让模态框隐藏
          $('#addModal').modal('hide');
          //重新渲染第一页，因为添加的数据在最前面
          page = 1;
          render();
          $("form").data("bootstrapValidator").resetForm(true);
        }
      }
    });
  });


});