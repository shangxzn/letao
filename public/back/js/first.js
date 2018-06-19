

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
        console.log(info);
      }
    });

  }


});