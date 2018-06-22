

$(function () {


  var page = 1;
  var pageSize = 8;

  //1. 渲染搜索的历史记录
  render();



 //用户获取localStory中的lt_history
  function getSearch() {
    // 注意这里弄假数据的时候，lt_history这个名字一定要是要和假数据的key名字一样
    var result = localStorage.getItem('lt_history') || '[]';
    // 这里的空数组必须是一个字符串，因为localStorage要的是字符串，返回的也是字符串
    result = JSON.parse(result);
    return result;
  }

  // 封装一个render函数
  function render() {
    //1. 获取到存储在localStory中的数据 key的名字 lt_history
    var history = getSearch();
     //2. 准备模板，结合数据进行渲染
    $('.lt_history').html( template('tpl', { rows: history }) );
  }






  //2. 清空数据的功能
  //2.1 给清空数据注册点击事件（委托）
  //2.2 删除 lt_history的数据
  //2.3 重新渲染
  $('.lt_history').on('click', '.btn_empty', function () {
    mui.confirm("你确认要清空所有历史记录?", "温馨提示", ['是', '否'], function (e) {

      //通过e.index可以获取到点击的按钮的下标
      if (e.index === 0) {
        //删除数据
        localStorage.removeItem('lt_history');
        // 重新渲染
        render();
      }
    });
   
  });


  // 3. 清楚数据

  $('.lt_history').on('click', '.btn_delete', function () {
    // 获取下标
    var index = $(this).data('index');

    mui.confirm('你确认要删除这条历史记录？', '温馨提示', ['否', '是'], function (e) {

      if (e.index === 1) {
        // 注意这个时候history是个数组所以可以使用slice内置对象。
         // 获取数组
        var history = getSearch();
        //删除数组指定下标
        history.splice(index, 1);
        // 在重新把数组存回去
        localStorage.setItem('lt_history', JSON.stringify(history));
        // JSON.stringify这个是js对象转换成一个json字符串，因为要传回去。

        // 重新渲染
        render();
      }

    });

  });





    $(".lt_search button").on("click", function () {

      var txt = $(".lt_search input").val();
      $(".lt_search input").val('');
      if (txt === "") {
        mui.toast("请输入搜索的内容");
        return;
      }
  
      //获取历史记录
      var history = getSearch();
      //把输入的内容添加到历史记录
  
  
      //如果数组中已经有了这个记录，把这个记录先删除
      var index = history.indexOf(txt);//获取txt在数组中的下标
      if (index > -1) {
        //说明存在
        history.splice(index, 1);//删掉
      }
  
      //如果长度大于等于10，需要把数组的最后一条给删除
      if (history.length >= 10) {
        history.pop();
      }
      history.unshift(txt);
      //重新存回localStory
      localStorage.setItem("lt_history", JSON.stringify(history));
      //重新渲染
      render();
  
  
      //页面需要跳转
      location.href = "searchList.html?key="+txt;
  
    });


  

});