
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
        console.log(info);
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
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    });
  });




});