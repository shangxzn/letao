

$(function () {

  var page = 1;
  var pageSize = 2;
  var imgs = [];// 用来存放图片的数组

  render();

  function render() {
    $.ajax({
      type: 'get',
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        $('tbody').html(template('tpl', info));


        // 初始化分页

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,// 版本号，默认是2
          currentPage: page,// 当前页数
          totalPages: Math.ceil(info.total / info.size),// 总页数
          size: 'small',
          //这个函数的返回值就是按钮的显示的内容
          itemTexts: function (type, page) {
            //console.log(type, page);
            switch (type) {
              case 'first':
                return '首页';
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          // 操作点击时候的title的属性值得
          tooltipTitles: function (type, page) {
            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          useBootstrapTooltip: true,// 背景颜色显示title的
          bootstrapTooltipOptions: {// 这是设置title属性值在上面显示还是下面显示（左右显示）
            placement: 'bottom'
          },
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });

      }
    });
  }


  // 给按钮注册点击事件 显示模态框
  $('.btn_add').on('click', function () {
    $('#addModal').modal('show');

    // 发送ajax请求
    $.ajax({
      type: 'get',
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        //console.log(info);
        $('.dropdown-menu').html(template('tpl2', info));
      }
    });
  });


  // 给所有的动态生成的a注册点击事件 选择二级分类的
  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    $('.dropdown-text').text(txt);

    var id = $(this).data('id');
    $('[name = "brandId"]').val(id);

    //3. 手动校验成功
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    //updateStatus   参数1：要更新的字段
    // 参数2： 未校验的: NOT_VALIDATED/     校验中的: VALIDATING/     校验失败的: INVALID/   校验成功的: VALID。
    // 参数3  可以不传，为null

  });


  // 图片上传功能
  $('#fileupload').fileupload({
    //每张图片上传成功，done就会执行一次
    done: function (e, data) {
      //console.log(data.result);


      if (imgs.length >= 3) {
        return;
      }
      //图片上传成功需要把图片显示出来
      //1. img_box中添加一张img
      //图片上传的结果已经存到数组中

      imgs.push(data.result);

      $('.img_box').append('<img src="' + data.result.picAddr + '" width="100" alt="">');

      if (imgs.length === 3) {
        $("form").data("bootstrapValidator").updateStatus("tips", "VALID");
        // 要更新的字段  所以是tips
      } else {
        $("form").data("bootstrapValidator").updateStatus("tips", "INVALID");
      }
    }
  });


  // 表单校验功能
  $('form').bootstrapValidator({
    excluded: [],// 表示隐藏域可以校验

    //2. 指定校验时的图标显示，
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验字段
    fields: {

      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },

      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品的名称'
          }
        }
      },

      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品的描述'
          }
        }
      },

      num: {
        validators: {
          notEmpty: {
            message: '请输入商品的库存'
          },
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存（1~9999）'
          }
        }
      },

      size: {
        validators: {
          notEmpty: {
            message: '请输入商品的尺码'
          },
          regexp: {
            //不能0开头，不能超过5位数 1-99999 
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的库存（xx-xx）'
          }
        }
      },

      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品的原价'
          }
        }
      },

      price: {
        validators: {
          notEmpty: {
            message: '请输入商品的价格'
          }
        }
      },

      tips: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      },

    }

  });

  //表单校验成功

  $('form').on('success.form.bv', function (e) {
    e.preventDefault();

    // 获取参数
    var param = $("form").serialize();
    param += "&picName1="+imgs[0].picName+"&picAddr1="+imgs[0].picAddr;
    param += "&picName2="+imgs[1].picName+"&picAddr2="+imgs[1].picAddr;
    param += "&picName3="+imgs[2].picName+"&picAddr3="+imgs[2].picAddr;

    //发送ajax请求
    $.ajax({
      type: 'post',
      url: "/product/addProduct",
      data: param,
      success: function (info) {
        if (info.success) {
          // 隐藏模态框
          $('#addModal').modal('hide');

          // //重新渲染
          page = 1;
          render();

          //重置表单
          $("form").data("bootstrapValidator").resetForm(true);

          //把按钮的文字重置
          $('.dropdown-text').text('请选择二级分类');
          $('.img_box img').remove();

          //重置数组
          imgs = [];

          
        }
      }
    });

  });

});