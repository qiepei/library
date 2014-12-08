KISSY.add(function(S, PageNav) {

    function PageNav(element , options) {
        if(!element) return;  //required
        if(!options && typeof element == 'object'){
            options = element;
            element = options.id;
            if(!element) return;
        }
        var $container = $(element);
        if(!$container.length){
            throw new Error('dom not find');
        }
        this.$container = $container;
        this.init(options || {});
    }
    PageNav.prototype = {
        init : function (options) {
            var defaultOptions = {
                'index' : 1,
                'pageCount' : null,		//没总页数，表示翻页才能确定是否存在下一页
                'preFix' : '!page/',	//单页面单控件显示'Z'
                'objId' : 'Z',			//hash格式
                'disableHash' : null	//hash不变功能支持
            };
            $.extend(this , defaultOptions , options);
            if(!this.pageCount) this.disableHash = true; //总页数未知，则不支持hash
            this.oldIndex = -1;         //避免部分android机器select相同选择也会触发change事件

            var preFix = this.preFix,
                length = preFix.length;
            if(preFix.charAt(length - 1) != '/') this.preFix += '/';
            if(isNaN(this.index)) this.index = 1;
            if (this.pageCount && this.index > this.pageCount) this.index = this.pageCount;
            if(this.index <= 0) this.index = 1;

            this.createDom();
            this.eventAttach();
            !this.disableHash && this.parseHash();
            this.renderPage();
        },
        setIndex : function (pageIndex) {
            var _self = this;
            if(!_self.$select) return;  //总页数未知不执行
            pageIndex = Number(pageIndex);
            if (isNaN(pageIndex)) {
                pageIndex = 1;
            }
            if (pageIndex > _self.pageCount) {
                pageIndex = _self.pageCount;
            }
            if (pageIndex <= 0) {
                pageIndex = 1;
            }
            _self.index = pageIndex;
            _self.renderPage();
        },
        setCount : function(pageCount){  //粗暴方法，使用后总页数和当前页数一致
            if(!pageCount) return;
            this.pageCount = this.index = pageCount;
            this.renderPage();
        },
        setMyCount : function(pageCount){  //使用后设置总页数，当前页数置为1
            if(!pageCount) return;
            this.pageCount =  pageCount;
            this.index = 1;
            this.renderPage();
        },
        parseHash : function () {
            //获取hash(一个页面多个分页控件)
            var _self = this,
                hashValue = location.hash,
                currHash = hashValue.substr(hashValue.lastIndexOf('/') + 1),
                hashArr = [],
                index = 0,
                mixArr = [];

            hashArr = currHash.split('-');

            for (var i = 0; i < hashArr.length; i++) {
                mixArr = hashArr[i].split('');
                var objId = mixArr.shift();
                if (objId == this.objId) {
                    index = Number(mixArr.join(''));
                    if (isNaN(index) || index <= 0) {
                        _self.index = 1;
                    }
                    if (index > _self.pageCount) {
                        _self.index = _self.pageCount;
                    }

                    _self.index = index;
                }
            }
        },
        setContainer : function (containerId) {
            this.$container = $(containerId);
        },
        getObjId : function () {
            return this.objId;
        },
        pContainer : function () {
            return this.$container;
        },
        changeHash : function () {
            var _self = this,
                hashVal = location.hash;
            if (hashVal == '') {
                location.hash = _self.preFix + '-' + _self.objId + _self.index;
            }
            else {
                var begin = hashVal.lastIndexOf(_self.objId),
                    end = begin;
                if (begin == -1) {
                    location.hash += '-' + _self.objId + _self.index;
                }
                else {
                    while (true) {
                        end++;
                        if (hashVal[end] == '-' || !hashVal[end]) break;
                    }
                    hashVal = hashVal.replace(hashVal.substring(begin, end), _self.objId + _self.index);
                    location.hash = hashVal;
                }
            }
        },
        createDom:function () {
            var _self = this,
                $container = _self.$container,
                count = _self.pageCount,
                arrow = count && '<i class="aw a-u"></i>' || '',
                selecte = count && '<select class="c-p-select"></select>' || '',
                htmlArr = [
                    '<section class="c-p-con">',
                    '<a class="c-btn c-btn-aw c-p-pre"><span>&lt;</span></a>',
                    '<div class="c-p-cur c-btn"><span>',
                    '<div class="c-p-arrow">',
                    '<span></span>',
                    arrow,
                    '</div>',
                    selecte,
                    '</span></div>',
                    '<a class="c-btn c-btn-awr c-p-next"><span>&gt;</span></a>',
                    '</section>'
                ];
            $container.html(htmlArr.join(''));
            if(!count) return;  //总页数未知则不支持跳页
            selecte = _self.$select || (_self.$select = $container.find('select'));
            //selecte.empty();
            htmlArr = new Array(count);
            for (var index = 1; index <= count; index++) {
                htmlArr[index - 1] = '<option>第' + index + '页</option>';
            }
            selecte.append(htmlArr.join(''));
        },
        renderPage : function(param){
            var _self = this,
                $container = _self.$container,
                $select = _self.$select,
                pageCount = _self.pageCount,
                _index = _self.index,
                $lastPage = $('.c-p-pre', $container),
                $nextPage = $('.c-p-next', $container);
            if(pageCount){
                if (pageCount <= 1) {
                    $lastPage.addClass('c-btn-off');
                    $nextPage.addClass('c-btn-off');
                    _self.pageCount = 1;
                }
                else {
                    if (_index == 1) {
                        $lastPage.addClass('c-btn-off');
                        if (pageCount > 1) {
                            $nextPage.removeClass('c-btn-off');
                        }
                    }
                    else if (_index == pageCount) {
                        $nextPage.addClass('c-btn-off');
                        if (pageCount > 1) {
                            $lastPage.removeClass('c-btn-off');
                        }
                    }
                    else {
                        if (_index > 1 && _index < pageCount) {
                            $lastPage.removeClass('c-btn-off');
                            $nextPage.removeClass('c-btn-off');
                        }
                    }
                }
                $select && ($select.get(0).selectedIndex = _index - 1)
            }
            else{
                if(param == 'end'){  //翻到底则不走这个逻辑了
                    _index--;
                    $nextPage.addClass('c-btn-off');
                    _self.pageCount = _self.index = _index;
                }
                if(_index <= 1) $lastPage.addClass('c-btn-off');
                else $lastPage.removeClass('c-btn-off');
            }
            var pageText = _index + '/' + pageCount;
            if(!$select) pageText = '第 '+_index+' 页';
            $('.c-p-arrow span', $container).text(pageText);

        },
        eventDetach : function(){
            var _self = this,
                $container = _self.$container,
                $select = _self.$select;
            $select && $select.off();
            $container.off('click');
            //$container = null;
            _self.$select = null;
            _self.$arrow = null;
        },
        eventAttach : function(){
            var _self = this,
                $container = _self.$container,
                $select = _self.$select,
                $arrow = _self.$arrow || (_self.$arrow = $('.c-p-arrow i'));
            commonFunc = function (e) {
                _self.triggerEvent(e);
            };
            if($select){
                $select.on({
                    /*'mousedown' : function(e){
                     $arrow.addClass('a-d');
                     },
                     'blur' : function(e){
                     $arrow.removeClass('a-d');
                     },*/
                    'change' : commonFunc
                });
            }
            $container.on('click', '.c-p-pre' , commonFunc);
            $container.on('click' , '.c-p-next' , commonFunc);
        },
        triggerEvent : function(e){
            e.preventDefault();
            var _self = this,
                current = e.currentTarget,
                $current = $(current),
                tagName = current.tagName.toLowerCase(),
                _index = _self.index,
                param = {};
            if(tagName == 'a'){
                if($current.hasClass('c-btn-off')) return;
                var typebtn = '';
                if($current.hasClass('c-p-pre')){
                    //_self.index--;
                    _index--;
                    typebtn = 'pre';
                }
                else if($current.hasClass('c-p-next')){
                    //_self.index++;
                    _index++;
                    typebtn = 'next';
                }
            }
            else if(tagName == 'select'){
                //_self.index = $current.get(0).selectedIndex + 1;
                _index = current.selectedIndex + 1;
                if (_self.oldIndex == _index) return;
                //_self.$arrow.removeClass('a-u');
                typebtn = 'select';
            }
            _self.index = _index;
            param = {
                index : _index,
                type : typebtn
            }
            if(_self.$select){
                _self.renderPage();
            }
            else{//总页数未知，需请求后执行回调
                param.callback = function(param){
                    _self.renderPage(param);
                }
            }
            //console.log(_self.index);
            if (!_self.disableHash) {
                _self.changeHash();
            }
            else {
                _self.$container.trigger('P:switchPage', param);
            }
            _self.oldIndex = _index;
        }
    }

    return PageNav;

});