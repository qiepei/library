/**
 * Created by qiepei
 * 列表页面的业务处理
 */
KISSY.add(function(S, PageNav, Juicer, Common, Loading, MockData, Confirm) {
    "use strict";

    var ATTRS = {};
    var prototype ={
        initializer: function() {
            var that = this;

            that.searchAPI = "./actions/getlist";
            that.addAPI = "./actions/addlist";
            that.updateAPI = "./actions/updatelist";

            that.List={
                total:0,
                //当前页码
                curPage:'1',
                //每页显示的个数
                pageSize:'10',
                //临时存储所有list，用于前端分页
                books:[]
            };

            //是否初始化过分页组件
            that.hasPageNav = false;

            //初始化各个组件
            that.componentInit();
            //绑定事件
            that.bindEvent();
        },
        /*
         * 显示一页数据
         * */
        showPage: function(curPage){
            var that = this,
                pageSize = that.List.pageSize,
                total = that.List.total,
                listData = that.List.books;

            //设置当前页码的起止位置
            var start = (curPage - 1) * pageSize;
            var tmpEnd = start + (+pageSize);
            var end = (total - tmpEnd >0) ? tmpEnd : total;

            var showData={
                books:listData.slice(start,end)
            };

            //使用Juicer渲染页面
            var listTpl = $('#J_ListTpl').html();
            var listHtml = Juicer(listTpl, showData);
            $('#listWrapper').html(listHtml);
        },
        /*
         * 渲染列表
         * */
        renderList:function(json){
            var that = this;

            //that.loading.hide();
            //存储列表数据
            that.List.books = json.books;
            that.List.total = json.total;

            //设置总页码
            var totalPageNum = Math.ceil( (json.total)/(that.List.pageSize) );
            //设置页码并展现第一页
            that.initPageNav(totalPageNum);
            that.showPage(1);
        },
        /*
         * 数据获取成功的回调函数
         * */
        successHandler:function(json){
            var that = this;

            //status为0是成功状态,1是失败状态
            if(json.status == 0){
                //通过total来判断是否获取到了data
                if(json.total > 0){
                    $("#errorArea").addClass('hidden');
                    that.renderList(json);
                }else{
                    that._callbackNull("#errorArea");
                }
            }else{
                that._callbackError("#errorArea");
            }
        },
        /*
        * 申请列表数据
        * */
        router: function(){
            var that = this;

            that.fetchList();
        },
         /*
         * 获取订单列表
         * */
        fetchList:function(param){
            var that = this;

            that.loading.show();

            that.loading.hide();
            //that.successHandler.call(that,MockData);

            $.ajax({
                url : that.searchAPI+'?t='+new Date().getTime(),
                data:param,
                success: function(json){

                    that.loading.hide();
                    that.successHandler.call(that,json);

                },
                error: function(xhr, type){
                    that.loading.hide();
                    that._callbackError("#errorArea");
                }
            });
        },
        /*
        * 初始化分页
        * */
        initPageNav:function(totalPageNum){
            var that = this;

            if(that.pageNav){
                that.pageNav.eventDetach();
                that.pageNav  = {};
                $("#pageWrapper").html("");
            }

            that.pageNav = new PageNav({
                'id': '#pageWrapper',
                'index': 1,
                'pageCount': totalPageNum,
                'disableHash': true
            });

            //注册页码事件，获取下一页数据
            that.pageNav.$container.on('P:switchPage', function (e, page) {
                that.List.curPage = page.index;
                that.showPage(that.List.curPage);
            });
        },

        /*
         * 初始化组件
         * */
        componentInit: function () {
            var that = this;

            //初始化loading对象
            that.loading = new Loading();

            juicer.register('changeCode', function (data) {
                return decodeURIComponent(data);
            });

        },
        /*
        * 绑定事件
        * */
        bindEvent: function() {
            var that = this;

            $('#addBook').on('click',function(){
                $(this).hide();
                $("#addForm").show();
            });

            $('#submitAdd').on('click',function(){
                 var name = encodeURIComponent( $('#bookName').val() );
                 var owner = encodeURIComponent( $('#owner').val() );
                 var status = encodeURIComponent( $('#status').val() );
                 var borrower = encodeURIComponent( $('#borrower').val() );
                 var time = encodeURIComponent(new Date().toLocaleString());

                var param = "name="+name+"&owner="+ owner + "&status=" + status+"&borrower="+borrower+"&time="+time;

                $.ajax({
                    url : that.addAPI+'?t='+new Date().getTime(),
                    data:param,
                    success: function(json){

                        that.loading.hide();
                        window.location.reload();
                    },
                    error: function(xhr, type){
                        that.loading.hide();
                        that._callbackError("#errorArea");
                    }
                });
            });

            $('#submitUpdata').on('click',function(){
                var name = encodeURIComponent( $('#bookName').val() );
                var owner = encodeURIComponent( $('#owner').val() );
                var status = encodeURIComponent( $('#status').val() );
                var borrower = encodeURIComponent( $('#borrower').val() );
                var time = encodeURIComponent(new Date().toLocaleString());
                var id = $(this).attr('data-id');

                var param = "_id=" + id + "&name="+name+"&owner="+ owner + "&status=" + status+"&borrower="+borrower+"&time="+time;

                $.ajax({
                    url : that.updateAPI+'?t='+new Date().getTime(),
                    data:param,
                    success: function(json){

                        that.loading.hide();
                        window.location.reload();
                    },
                    error: function(xhr, type){
                        that.loading.hide();
                        that._callbackError("#errorArea");
                    }
                });
            });

            $('#listWrapper').on('click','.edit',function(){
                var list = $(this).parent();
                $('#bookName').val( list.find('.name').html() );
                $('#owner').val( list.find('.owner').html() );
                $('#status').val( list.find('.status').html() );
                $('#borrower').val( list.find('.borrower').html() );

                $('#addBook').hide();
                $("#addForm").show();
                $('#submitAdd').hide();
                $('#submitUpdata').show();
                $('#submitUpdata').attr('data-id',$(this).attr('data-id'));
            });
        }
    };

    return Common.extend(prototype, {ATTRS : ATTRS});
}, {
    requires: [
        '/libs/pagenav',
        '/libs/juicer',
        '/common/common',
        '/libs/loading'
    ]
});
