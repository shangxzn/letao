
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
        $('tbody').html( template('tpl', info) );
      }
    });
  }



});