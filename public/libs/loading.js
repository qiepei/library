KISSY.add(function(S){

    var doc = window.document,
        id, ids = [], wrap, item;

    var LoadingClass = function() {
        this.initialize.apply(this, arguments);
    };

    LoadingClass.prototype = {

        initialize: function() {
            var that = this;
            that.loadingInit();
        },

        loadingInit: function() {
            //避免重复初始化
            if($('div.loading').length) return;
            wrap = document.createElement('div');
            wrap.className = 'loading';
            wrap.style.cssText = [
                'display: none', 
                'background: transparent', 
                'position: absolute',
                'width: 100%', 
                'height: 100%', 
                'left: 0', 
                'top: 0',
                'overflow: hidden', 
                'z-index: 99999'
            ].join(';');
            item = document.createElement('div');
            item.style.cssText = [
                'position:absolute',
                'width: 100px',
                'height: 90px',
                'line-height: 100px',
                'color: #2b577a',
                'text-align: center',
                'font-size: 11px',
                'left: 50%',
                'top: 50%',
                'margin-left: -50px',
                'margin-top: -45px',
                'border-radius: 13px'
            ].join(';');
            wrap.appendChild(item);
            doc.body.appendChild(wrap);
        },

        _showLoading: function(text) {
            if (text) {
                item.innerHTML = text;

                if (wrap.style.display !== 'block') {
                    wrap.style.display = 'block';
                }
            }

            var now = (new Date()).getTime();
            ids.push(now);
            return now;
        },

        show: function(text) {
            text = text || '<div class="trip-loading"></div><div class="trip-loading-text">正在加载...</div>';
            this._showLoading(text);
        },

        hide: function(_id) {
            if (_id) {
                ids.splice(ids.indexOf(_id), 1);
            } else {
                ids = [];
            }

            if (ids.length === 0) {
                item.innerHTML = '';
                wrap.style.display = 'none';
            }
        }
    };

    return LoadingClass;

});
