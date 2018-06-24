
$(function (){


  var page = 1;
  var pageSize = 10;

  var key = getSearchList().key;
  $('.lt_search input').val(key);

  render();





  $('.lt_search button').on('click', function () {

    $('.lt_sort li').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');


    key = $('.lt_search input').val();
    console.log(key);
    render();
  });


  $('.lt_sort li[data-type]').on('click', function () {
    var $this = $(this);
    if (!$this.hasClass('now')) {
      $this.addClass('now').siblings().removeClass('now');
      $('.lt_sort li span').addClass('fa-angle-down').removeClass('fa-angle-up');
    } else {
      $(this).find('span').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    }

    render();
  });











  function getSearchList() {
     //用于获取地址栏中的参数
  //1. 获取到地址栏中的key对应的值，把这个值放到搜索框中
  var search = location.search;
  //console.log(search);
  //2. 地址栏会对中文进行转码
  search = decodeURI(search);

   //3. 去掉?
   search = search.slice(1);
   //4. 变成一个数组
   var arr = search.split('&');
   //console.log(search);
   var obj = {};
   arr.forEach(function (e, i) {
     var k = e.split('=')[0];
     var v = e.split('=')[1];
     obj[k] = v;
   });
   return obj;
  }



 

 
  function render() {

    var obj = {
      proName: key,
      page: page,
      pageSize: pageSize
    }

    var $select = $('.lt_sort li.now');
    if ($select.length > 0) {
      var type = $select.data('type');
      var value = $select.find('span').hasClass('fa-angle-down')? 2:1;
      obj[type] = value;
    }

    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: obj,
      success: function (info) {
        console.log(info);
        setTimeout(function () {
          $('.lt_product').html( template('tpl', info) );
        }, 1000)
        
      }
  });
  }
  


});