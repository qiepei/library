/**
 * Created by qiepei.qp
 * 通用的功能
 */
KISSY.add(function(S, Base) {
    var REFRESH_BUTTON = '<div class="refresh-button" onclick="window.location.reload();">刷新</div>';

    var Common = Base.extend({
        /*
        * 展示错误信息
        * */
        showError: function(container, error) {
            var that = this;
            var html = '<div class="common-error-status">' + error + '</div>';
            container = $(container || '#bodyCont');
            container.html(html);
            container.removeClass('hidden');
        },
        /*
        * 空值的处理
        * */
        _callbackNull:function(wrapper){
            var that = this;

            //that.loading.hide();
            $("#listWrapper").html("");
            $("#pageWrapper").html("");
            that.showError(wrapper,'抱歉，未查询到相关信息');
        },
        /*
        * 网络异常的处理
        * */
        _callbackError:function(wrapper){
            var that = this;
            //that.loading.hide();
            $("#listWrapper").html("");
            $("#pageWrapper").html("");
            that.showError(wrapper,'网络开小差，再刷新看看' + REFRESH_BUTTON);
        },
        /*
         * 未登录的处理
         * */
        _callbackNoLogin:function(wrapper){
            var that = this;
            //that.loading.hide();
            $("#listWrapper").html("");
            $("#pageWrapper").html("");
            that.showError(wrapper,'亲，你还没有登录哦~');
        },
        /*
        * 显示tip
        * */
        showTip:function(wrapper,tip){
            $(wrapper).html(tip);

            window.setTimeout(function(){
                $(wrapper).html("");
            },3000);
        },
        /*
         * 获取地址栏携带的参数
         * */
        getParam: function (key) {
            var query = window.location.search.substr(1);
            var query_arr = query.split("&");
            var query_obj = {};
            for (var i = 0, len = query_arr.length; i < len; i++) {
                var item = query_arr[i].split("=");
                query_obj[ item[0] ] = item[1];
            }
            return query_obj[key] || "";
        }

    }, {
        ATTRS: {}
    });

    return Common;

}, {
    requires: [
        'base'
    ]
});
