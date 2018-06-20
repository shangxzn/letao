

$(function () {

  var page = 1;
  var pageSize = 2;

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
            console.log(type, page);
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
        console.log(info);
        $('.dropdown-menu').html( template('tpl2', info) );
      }
    });
  });


  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    $('.dropdown-text').text(txt);

    var id = $(this).data('id');
    $('[name = "brandId"]').val(id);
  });

});