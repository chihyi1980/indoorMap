/**
 * Created by zhaop on 2015/4/16.
 */
window.onload = function(){
    var webArgs = (function(){
        var curWwwPath = window.document.location.href;
        var argsStr = curWwwPath.split('?')[1];
        if(!argsStr){
            return {};
        }else{
            var argsArr = argsStr.split('&'),
                res = {};
            if(argsArr.length == 1){
                var temp = argsArr[0].split('=');
                if(temp.length == 2){
                    res[temp[0]] = temp[1];
                }
            }else{
                for (var i=0; i < argsArr.length; ++i){
                    var temp = argsArr[i].split('=');
                    if(temp.length == 2){
                        res[temp[0]] = temp[1];
                    }
                }
            }
            return res;
        }
    })();
    if(webArgs.logo){
        if(webArgs.logo.toLowerCase() == 'gmega'){
            localStorage.setItem('sctReferrer', 'gmega_' + new Date().toLocaleDateString());
            document.getElementsByTagName('title')[0].innerHTML = 'GMEGA商场地图';
        }else if(webArgs.logo.toLowerCase() == 'sct'){
            localStorage.removeItem('sctReferrer');
            document.getElementsByTagName('title')[0].innerHTML = '商场通';
        }
    }else{
        localStorage.removeItem('sctReferrer');
    }
    if(localStorage.getItem('sctReferrer')){
        try{
            var refer = localStorage.getItem('sctReferrer').split('_');
            if(refer[1] !== new Date().toLocaleDateString()) {
                localStorage.removeItem('sctReferrer');
            }
        }catch(e){}
    }
};
