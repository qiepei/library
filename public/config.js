/**
 * http://g.tbcdn.cn/qiepei/library/@@version/config.js
 */
(function(){
    KISSY.config('tag', null); //去除?t时间戳

    // 通过URL注入版本：url?version=0.1.2

	var getVersion = function(){
		var m = window.location.href.match(/[\?&]version=(\d+\.\d+\.\d+)/i);
		if(m && m[1]){
			return m[1];
		} else {
			return '@@version';
		}
	}

	var debug = KISSY.Config.debug;

    if (debug !== true) {
        if (location.host.match(/(waptest\.taobao|wapa.taobao|daily.taobao.net)/)) {
            KISSY.Config.daily = true;
        }
    }
	if (debug) {
		var srcPath = "../../";
		KISSY.config({
			combine:false,
			packages:[
				{
					name:"library",
					path:srcPath,
					charset:"utf-8",
					ignorePackageNameInUri:true,
					debug:true
				}
			]
		});
	} else {
		var srcHost = KISSY.Config.daily ? 
				'g.assets.daily.taobao.net' :
				'g.tbcdn.cn';
        KISSY.config({
			combine:true,
            packages: [
                {
                    name: 'library',
                    // 修改 abc.json 中的 version 字段来生成版本号
                    path: 'http://'+srcHost+'/qiepei/library/' + getVersion(),
                    ignorePackageNameInUri: true
                }
            ]
        });
	}
})();
