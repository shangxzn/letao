
$(function () {

  var page = 1;
  var pageSize = 5;

  render();

  function render() {
    $.ajax({
      type: 'get',
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        $('tbody').html(template('tpl', info));

        // 初始化一个分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: 'small',
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });
      }
    });
  }


  //添加二级分类
  $(".btn_add").on("click", function () {
    $("#addModal").modal("show");

    //发送ajax请求，获取所有的一级分类的数据
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        //console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    });
  });


  // 这里，插件自带btn-default 这个类就可以点击不需要注册
  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    $('.dropdown-text').text(txt);// 这个就是a里面的值，赋值给到按钮dropdown-text里

    var id = $(this).data('id');
    //获取到id，设置给categoryId这个隐藏域，因为后端要这个id如果没有这个ID就没办法返回数据
    // 为什么要存这个id 是因为后端要这个id  也可以理解为因为要禁用还是启用都需要这个id来跟后端交互的
    // 固定的，后端要这个id，没有为什么，因为要禁用还是启用都需要这个id来跟后端交互的，我们要跟后台交互必须得存这个id

    $("[name='categoryId']").val(id);



    //让隐藏的categoryIde的校验通过
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });


  //图片上传功能,获取上传后的结果
  $("#fileupload").fileupload({

    //返回的结果的类型是json
    dataType: 'json',

    //e :事件对象
    //data: 上传后的结果
    done: function (e, data) { // 图片上传后的回调函数
      //获取到地址后，需要干什么？？？？
      console.log(data.result.picAddr);

      //修改img_box下的img的src，这个地址传给img是用来显示图片的
      $('.img_box img').attr('src', data.result.picAddr);
      //给brandLogo赋值， 需要把这个地址传到后台去，后台把这个地址和图片存起来
      $('[name="brandLogo"]').val(data.result.picAddr);

      //让brandLogo校验通过
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });



  // 表单校验
  $('form').bootstrapValidator({
    excluded: [],// 指定不校验的类型，给个空数组表示都校验例如：隐藏域
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },


    // 指定校验的字段
    fields: {
      // 校验品牌名称
      categoryId: {
        validators: {
          // 不能为空
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          // 不能为空
          notEmpty: {
            message: '请输入二级分类名称'
          }
        }
      },
      brandLogo: {
        validators: {
          // 不能为空
          notEmpty: {
            message: '请上传二级分类的图片'
          }
        }
      }

    }




  });



  //给表单注册校验成功的事件，阻止表单的提交，使用ajax提交
  // success.form.bv这个是表单校验成功后注册的事件，是插件提供的，只有表单校验才能注册的事件

  $('form').on('success.form.bv', function (e) {
    e.preventDefault();

    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $("form").serialize(),
      success: function (info) {
        if (info.success) {
          //隐藏模态框
          $("#addModal").modal("hide");

          // 重新渲染第一页
          page = 1;
          render();

          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          $('.dropdown-text').text('请选择一级分类');
          $('.img_box img').attr('src', 'images/none.png');
        }
      }
    });
  });



});