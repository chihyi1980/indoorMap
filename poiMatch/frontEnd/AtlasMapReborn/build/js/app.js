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
;/*
 AngularJS v1.2.6
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(Y,O,r){'use strict';function s(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.6/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function ob(b){if(null==b||ya(b))return!1;var a=
b.length;return 1===b.nodeType&&a?!0:E(b)||I(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(J(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(ob(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Nb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Nc(b,
a,c){for(var d=Nb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Ob(b){return function(a,c){b(c,a)}}function Xa(){for(var b=ia.length,a;b;){b--;a=ia[b].charCodeAt(0);if(57==a)return ia[b]="A",ia.join("");if(90==a)ia[b]="0";else return ia[b]=String.fromCharCode(a+1),ia.join("")}ia.unshift("0");return ia.join("")}function Pb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function x(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Pb(b,a);return b}function P(b){return parseInt(b,
10)}function Qb(b,a){return x(new (x(function(){},{prototype:b})),a)}function y(){}function za(b){return b}function Z(b){return function(){return b}}function D(b){return"undefined"===typeof b}function v(b){return"undefined"!==typeof b}function V(b){return null!=b&&"object"===typeof b}function E(b){return"string"===typeof b}function pb(b){return"number"===typeof b}function Ja(b){return"[object Date]"===Ya.call(b)}function I(b){return"[object Array]"===Ya.call(b)}function J(b){return"function"===typeof b}
function Za(b){return"[object RegExp]"===Ya.call(b)}function ya(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Oc(b){return!(!b||!(b.nodeName||b.on&&b.find))}function Pc(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function $a(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ka(b,a){var c=$a(b,a);0<=c&&b.splice(c,1);return a}function ea(b,a){if(ya(b)||b&&b.$evalAsync&&b.$watch)throw La("cpws");if(a){if(b===
a)throw La("cpi");if(I(b))for(var c=a.length=0;c<b.length;c++)a.push(ea(b[c]));else{c=a.$$hashKey;q(a,function(b,c){delete a[c]});for(var d in b)a[d]=ea(b[d]);Pb(a,c)}}else(a=b)&&(I(b)?a=ea(b,[]):Ja(b)?a=new Date(b.getTime()):Za(b)?a=RegExp(b.source):V(b)&&(a=ea(b,{})));return a}function Rb(b,a){a=a||{};for(var c in b)b.hasOwnProperty(c)&&("$"!==c.charAt(0)&&"$"!==c.charAt(1))&&(a[c]=b[c]);return a}function ta(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,
d;if(c==typeof a&&"object"==c)if(I(b)){if(!I(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ta(b[d],a[d]))return!1;return!0}}else{if(Ja(b))return Ja(a)&&b.getTime()==a.getTime();if(Za(b)&&Za(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||ya(b)||ya(a)||I(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!J(b[d])){if(!ta(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==r&&!J(a[d]))return!1;return!0}return!1}
function Sb(){return O.securityPolicy&&O.securityPolicy.isActive||O.querySelector&&!(!O.querySelector("[ng-csp]")&&!O.querySelector("[data-ng-csp]"))}function qb(b,a){var c=2<arguments.length?ua.call(arguments,2):[];return!J(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(ua.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Qc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=r:ya(a)?c="$WINDOW":
a&&O===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function oa(b,a){return"undefined"===typeof b?r:JSON.stringify(b,Qc,a?"  ":null)}function Tb(b){return E(b)?JSON.parse(b):b}function Ma(b){b&&0!==b.length?(b=C(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function fa(b){b=u(b).clone();try{b.empty()}catch(a){}var c=u("<div>").append(b).html();try{return 3===b[0].nodeType?C(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+
C(b)})}catch(d){return C(c)}}function Ub(b){try{return decodeURIComponent(b)}catch(a){}}function Vb(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=Ub(c[0]),v(d)&&(b=v(c[1])?Ub(c[1]):!0,a[d]?I(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Wb(b){var a=[];q(b,function(b,d){I(b)?q(b,function(b){a.push(va(d,!0)+(!0===b?"":"="+va(b,!0)))}):a.push(va(d,!0)+(!0===b?"":"="+va(b,!0)))});return a.length?a.join("&"):""}function rb(b){return va(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,
"=").replace(/%2B/gi,"+")}function va(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Rc(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(O.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+a+"\\:"),c),q(b.querySelectorAll("["+
a+"]"),c))});q(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function Xb(b,a){var c=function(){b=u(b);if(b.injector()){var c=b[0]===O?"document":fa(b);throw La("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=Yb(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",function(a,b,c,d,e){a.$apply(function(){b.data("$injector",
d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(Y&&!d.test(Y.name))return c();Y.name=Y.name.replace(d,"");Na.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function ab(b,a){a=a||"_";return b.replace(Sc,function(b,d){return(d?a:"")+b.toLowerCase()})}function sb(b,a,c){if(!b)throw La("areq",a||"?",c||"required");return b}function Oa(b,a,c){c&&I(b)&&(b=b[b.length-1]);sb(J(b),a,"not a function, got "+(b&&"object"==typeof b?b.constructor.name||"Object":typeof b));return b}function wa(b,
a){if("hasOwnProperty"===b)throw La("badname",a);}function tb(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&J(b)?qb(e,b):b}function ub(b){var a=b[0];b=b[b.length-1];if(a===b)return u(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return u(c)}function Tc(b){var a=s("$injector"),c=s("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||s;return b.module||(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===
e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],m=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide","constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider",
"register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:m,run:function(a){d.push(a);return this}};f&&m(f);return n}())}}())}function Pa(b){return b.replace(Uc,function(a,b,d,e){return e?d.toUpperCase():d}).replace(Vc,"Moz$1")}function vb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],l=a,k,m,n,p,t,w;if(!d||null!=b)for(;e.length;)for(k=e.shift(),m=0,n=k.length;m<n;m++)for(p=u(k[m]),l?p.triggerHandler("$destroy"):l=!l,t=0,p=(w=p.children()).length;t<
p;t++)e.push(Aa(w[t]));return g.apply(this,arguments)}var g=Aa.fn[b],g=g.$original||g;e.$original=g;Aa.fn[b]=e}function N(b){if(b instanceof N)return b;if(!(this instanceof N)){if(E(b)&&"<"!=b.charAt(0))throw wb("nosel");return new N(b)}if(E(b)){var a=O.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);xb(this,a.childNodes);u(O.createDocumentFragment()).append(this)}else xb(this,b)}function yb(b){return b.cloneNode(!0)}function Ba(b){Zb(b);var a=0;for(b=b.childNodes||
[];a<b.length;a++)Ba(b[a])}function $b(b,a,c,d){if(v(d))throw wb("offargs");var e=ja(b,"events");ja(b,"handle")&&(D(a)?q(e,function(a,c){zb(b,c,a);delete e[c]}):q(a.split(" "),function(a){D(c)?(zb(b,a,e[a]),delete e[a]):Ka(e[a]||[],c)}))}function Zb(b,a){var c=b[bb],d=Qa[c];d&&(a?delete Qa[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),$b(b)),delete Qa[c],b[bb]=r))}function ja(b,a,c){var d=b[bb],d=Qa[d||-1];if(v(c))d||(b[bb]=d=++Wc,d=Qa[d]={}),d[a]=c;else return d&&d[a]}function ac(b,
a,c){var d=ja(b,"data"),e=v(c),g=!e&&v(a),f=g&&!V(a);d||f||ja(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];x(d,a)}else return d}function Ab(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function Bb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",aa((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+aa(a)+" "," ")))})}function Cb(b,a){if(a&&b.setAttribute){var c=(" "+
(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=aa(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",aa(c))}}function xb(b,a){if(a){a=a.nodeName||!v(a.length)||ya(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function bc(b,a){return cb(b,"$"+(a||"ngController")+"Controller")}function cb(b,a,c){b=u(b);9==b[0].nodeType&&(b=b.find("html"));for(a=I(a)?a:[a];b.length;){for(var d=0,e=a.length;d<e;d++)if((c=b.data(a[d]))!==r)return c;b=b.parent()}}
function cc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ba(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function dc(b,a){var c=db[a.toLowerCase()];return c&&ec[b.nodeName]&&c}function Xc(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||O);if(D(c.defaultPrevented)){var g=c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};
c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=Rb(a[e||c.type]||[]);q(f,function(a){a.call(b,c)});8>=L?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ca(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===r&&(c=b.$$hashKey=Xa()):c=b;return a+":"+c}function Ra(b){q(b,
this.put,this)}function fc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(Yc,""),c=c.match(Zc),q(c[1].split($c),function(b){b.replace(ad,function(b,c,d){a.push(d)})})),b.$inject=a):I(b)?(c=b.length-1,Oa(b[c],"fn"),a=b.slice(0,c)):Oa(b,"fn",!0);return a}function Yb(b){function a(a){return function(b,c){if(V(b))q(b,Ob(a));else return a(b,c)}}function c(a,b){wa(a,"service");if(J(b)||I(b))b=n.instantiate(b);if(!b.$get)throw Sa("pget",a);return m[a+h]=b}function d(a,
b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,h;q(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(E(a))for(c=Ta(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,g=0,h=d.length;g<h;g++){var f=d[g],l=n.get(f[0]);l[f[1]].apply(l,f[2])}else J(a)?b.push(n.invoke(a)):I(a)?b.push(n.invoke(a)):Oa(a,"module")}catch(m){throw I(a)&&(a=a[a.length-1]),m.message&&(m.stack&&-1==m.stack.indexOf(m.message))&&(m=m.message+"\n"+m.stack),Sa("modulerr",a,m.stack||m.message||m);}}});return b}function g(a,
b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Sa("cdep",l.join(" <- "));return a[d]}try{return l.unshift(d),a[d]=f,a[d]=b(d)}finally{l.shift()}}function d(a,b,e){var g=[],h=fc(a),f,k,l;k=0;for(f=h.length;k<f;k++){l=h[k];if("string"!==typeof l)throw Sa("itkn",l);g.push(e&&e.hasOwnProperty(l)?e[l]:c(l))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(I(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return V(e)||J(e)?
e:c},get:c,annotate:fc,has:function(b){return m.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var f={},h="Provider",l=[],k=new Ra,m={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,Z(b))}),constant:a(function(a,b){wa(a,"constant");m[a]=b;p[a]=b}),decorator:function(a,b){var c=n.get(a+h),d=c.$get;c.$get=function(){var a=t.invoke(d,c);return t.invoke(b,null,{$delegate:a})}}}},n=m.$injector=g(m,
function(){throw Sa("unpr",l.join(" <- "));}),p={},t=p.$injector=g(p,function(a){a=n.get(a+h);return t.invoke(a.$get,a)});q(e(b),function(a){t.invoke(a||y)});return t}function bd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==C(a.nodeName)||(b=a)});return b}function g(){var b=c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():
"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(g)});return g}]}function cd(b,a,c,d){function e(a){try{a.apply(null,ua.call(arguments,1))}finally{if(w--,0===w)for(;A.length;)try{A.pop()()}catch(b){c.error(b)}}}function g(a,b){(function T(){q(F,function(a){a()});H=b(T,a)})()}function f(){B=null;S!=h.url()&&(S=h.url(),q($,function(a){a(h.url())}))}var h=this,l=a[0],k=b.location,m=b.history,n=b.setTimeout,p=b.clearTimeout,t=
{};h.isMock=!1;var w=0,A=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){w++};h.notifyWhenNoOutstandingRequests=function(a){q(F,function(a){a()});0===w?a():A.push(a)};var F=[],H;h.addPollFn=function(a){D(H)&&g(100,n);F.push(a);return a};var S=k.href,z=a.find("base"),B=null;h.url=function(a,c){k!==b.location&&(k=b.location);if(a){if(S!=a)return S=a,d.history?c?m.replaceState(null,"",a):(m.pushState(null,"",a),z.attr("href",z.attr("href"))):(B=a,c?k.replace(a):k.href=a),
h}else return B||k.href.replace(/%27/g,"'")};var $=[],M=!1;h.onUrlChange=function(a){if(!M){if(d.history)u(b).on("popstate",f);if(d.hashchange)u(b).on("hashchange",f);else h.addPollFn(f);M=!0}$.push(a);return a};h.baseHref=function(){var a=z.attr("href");return a?a.replace(/^https?\:\/\/[^\/]*/,""):""};var W={},ka="",Q=h.baseHref();h.cookies=function(a,b){var d,e,g,h;if(a)b===r?l.cookie=escape(a)+"=;path="+Q+";expires=Thu, 01 Jan 1970 00:00:00 GMT":E(b)&&(d=(l.cookie=escape(a)+"="+escape(b)+";path="+
Q).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(l.cookie!==ka)for(ka=l.cookie,d=ka.split("; "),W={},g=0;g<d.length;g++)e=d[g],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),W[a]===r&&(W[a]=unescape(e.substring(h+1))));return W}};h.defer=function(a,b){var c;w++;c=n(function(){delete t[c];e(a)},b||0);t[c]=!0;return c};h.defer.cancel=function(a){return t[a]?(delete t[a],p(a),e(y),!0):!1}}function dd(){this.$get=
["$window","$log","$sniffer","$document",function(b,a,c,d){return new cd(b,d,a,c)}]}function ed(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw s("$cacheFactory")("iid",b);var f=0,h=x({},d,{id:b}),l={},k=d&&d.capacity||Number.MAX_VALUE,m={},n=null,p=null;return a[b]={put:function(a,b){var c=m[a]||(m[a]={key:a});e(c);if(!D(b))return a in l||f++,l[a]=b,f>k&&this.remove(p.key),
b},get:function(a){var b=m[a];if(b)return e(b),l[a]},remove:function(a){var b=m[a];b&&(b==n&&(n=b.p),b==p&&(p=b.n),g(b.n,b.p),delete m[a],delete l[a],f--)},removeAll:function(){l={};f=0;m={};n=p=null},destroy:function(){m=h=l=null;delete a[b]},info:function(){return x({},h,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function fd(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function hc(b,a){var c=
{},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,g=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function l(a,e){wa(a,"directive");E(a)?(sb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);J(f)?f={compile:Z(f)}:!f.compile&&f.link&&(f.compile=Z(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||f.controller&&f.name;
f.restrict=f.restrict||"A";e.push(f)}catch(l){d(l)}});return e}])),c[a].push(e)):q(a,Ob(l));return this};this.aHrefSanitizationWhitelist=function(b){return v(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return v(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate",
"$$sanitizeUri",function(a,b,m,n,p,t,w,A,F,H,S,z){function B(a,b,c,d,e){a instanceof u||(a=u(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=u(b).wrap("<span></span>").parent()[0])});var g=M(a,b,a,c,d,e);$(a,"ng-scope");return function(b,c,d){sb(b,"scope");var e=c?Da.clone.call(a):a;q(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var f=e.length;d<f;d++){var k=e[d].nodeType;1!==k&&9!==k||e.eq(d).data("$scope",b)}c&&c(e,b);g&&g(b,e,e);return e}}function $(a,b){try{a.addClass(b)}catch(c){}}
function M(a,b,c,d,e,g){function f(a,c,d,e){var g,l,m,p,n,t,w;g=c.length;var K=Array(g);for(n=0;n<g;n++)K[n]=c[n];w=n=0;for(t=k.length;n<t;w++)l=K[w],c=k[n++],g=k[n++],m=u(l),c?(c.scope?(p=a.$new(),m.data("$scope",p)):p=a,(m=c.transclude)||!e&&b?c(g,p,l,d,W(a,m||b)):c(g,p,l,d,e)):g&&g(a,l.childNodes,r,e)}for(var k=[],l,m,p,n,t=0;t<a.length;t++)l=new Db,m=ka(a[t],[],l,0===t?d:r,e),(g=m.length?ga(m,a[t],l,b,c,null,[],[],g):null)&&g.scope&&$(u(a[t]),"ng-scope"),l=g&&g.terminal||!(p=a[t].childNodes)||
!p.length?null:M(p,g?g.transclude:b),k.push(g,l),n=n||g||l,g=null;return n?f:null}function W(a,b){return function(c,d,e){var g=!1;c||(c=a.$new(),g=c.$$transcluded=!0);d=b(c,d,e);if(g)d.on("$destroy",qb(c,c.$destroy));return d}}function ka(a,b,c,d,f){var k=c.$attr,l;switch(a.nodeType){case 1:T(b,la(Ea(a).toLowerCase()),"E",d,f);var m,p,n;l=a.attributes;for(var t=0,w=l&&l.length;t<w;t++){var A=!1,B=!1;m=l[t];if(!L||8<=L||m.specified){p=m.name;n=la(p);U.test(n)&&(p=ab(n.substr(6),"-"));var S=n.replace(/(Start|End)$/,
"");n===S+"Start"&&(A=p,B=p.substr(0,p.length-5)+"end",p=p.substr(0,p.length-6));n=la(p.toLowerCase());k[n]=p;c[n]=m=aa(m.value);dc(a,n)&&(c[n]=!0);P(a,b,m,n);T(b,n,"A",d,f,A,B)}}a=a.className;if(E(a)&&""!==a)for(;l=g.exec(a);)n=la(l[2]),T(b,n,"C",d,f)&&(c[n]=aa(l[3])),a=a.substr(l.index+l[0].length);break;case 3:s(b,a.nodeValue);break;case 8:try{if(l=e.exec(a.nodeValue))n=la(l[1]),T(b,n,"M",d,f)&&(c[n]=aa(l[2]))}catch(W){}}b.sort(D);return b}function Q(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ha("uterdir",
b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return u(d)}function R(a,b,c){return function(d,e,g,f,l){e=Q(e[0],b,c);return a(d,e,g,f,l)}}function ga(a,c,d,e,g,f,l,p,n){function A(a,b,c,d){if(a){c&&(a=R(a,c,d));a.require=G.require;if(z===G||G.$$isolateScope)a=ic(a,{isolateScope:!0});l.push(a)}if(b){c&&(b=R(b,c,d));b.require=G.require;if(z===G||G.$$isolateScope)b=ic(b,{isolateScope:!0});p.push(b)}}function S(a,b,c){var d,e="data",
g=!1;if(E(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),g=g||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||b[e]("$"+a+"Controller");if(!d&&!g)throw ha("ctreq",a,ba);}else I(a)&&(d=[],q(a,function(a){d.push(S(a,b,c))}));return d}function W(a,e,g,f,n){function A(a,b){var c;2>arguments.length&&(b=a,a=r);D&&(c=eb);return n(a,b,c)}var K,B,F,M,R,Q,eb={},s;K=c===g?d:Rb(d,new Db(u(g),d.$attr));B=K.$$element;if(z){var ka=/^\s*([@=&])(\??)\s*(\w*)\s*$/;f=u(g);Q=e.$new(!0);ga&&
ga===z.$$originalDirective?f.data("$isolateScope",Q):f.data("$isolateScopeNoTemplate",Q);$(f,"ng-isolate-scope");q(z.scope,function(a,c){var d=a.match(ka)||[],g=d[3]||c,f="?"==d[2],d=d[1],l,m,n,p;Q.$$isolateBindings[c]=d+g;switch(d){case "@":K.$observe(g,function(a){Q[c]=a});K.$$observers[g].$$scope=e;K[g]&&(Q[c]=b(K[g])(e));break;case "=":if(f&&!K[g])break;m=t(K[g]);p=m.literal?ta:function(a,b){return a===b};n=m.assign||function(){l=Q[c]=m(e);throw ha("nonassign",K[g],z.name);};l=Q[c]=m(e);Q.$watch(function(){var a=
m(e);p(a,Q[c])||(p(a,l)?n(e,a=Q[c]):Q[c]=a);return l=a},null,m.literal);break;case "&":m=t(K[g]);Q[c]=function(a){return m(e,a)};break;default:throw ha("iscp",z.name,c,a);}})}s=n&&A;H&&q(H,function(a){var b={$scope:a===z||a.$$isolateScope?Q:e,$element:B,$attrs:K,$transclude:s},c;R=a.controller;"@"==R&&(R=K[a.name]);c=w(R,b);eb[a.name]=c;D||B.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});f=0;for(F=l.length;f<F;f++)try{M=l[f],M(M.isolateScope?Q:e,B,K,M.require&&S(M.require,
B,eb),s)}catch(T){m(T,fa(B))}f=e;z&&(z.template||null===z.templateUrl)&&(f=Q);a&&a(f,g.childNodes,r,n);for(f=p.length-1;0<=f;f--)try{M=p[f],M(M.isolateScope?Q:e,B,K,M.require&&S(M.require,B,eb),s)}catch(G){m(G,fa(B))}}n=n||{};var F=-Number.MAX_VALUE,M,H=n.controllerDirectives,z=n.newIsolateScopeDirective,ga=n.templateDirective;n=n.nonTlbTranscludeDirective;for(var T=!1,D=!1,x=d.$$element=u(c),G,ba,s,N=e,ma,L=0,Fa=a.length;L<Fa;L++){G=a[L];var P=G.$$start,U=G.$$end;P&&(x=Q(c,P,U));s=r;if(F>G.priority)break;
if(s=G.scope)M=M||G,G.templateUrl||(C("new/isolated scope",z,G,x),V(s)&&(z=G));ba=G.name;!G.templateUrl&&G.controller&&(s=G.controller,H=H||{},C("'"+ba+"' controller",H[ba],G,x),H[ba]=G);if(s=G.transclude)T=!0,G.$$tlb||(C("transclusion",n,G,x),n=G),"element"==s?(D=!0,F=G.priority,s=Q(c,P,U),x=d.$$element=u(O.createComment(" "+ba+": "+d[ba]+" ")),c=x[0],fb(g,u(ua.call(s,0)),c),N=B(s,e,F,f&&f.name,{nonTlbTranscludeDirective:n})):(s=u(yb(c)).contents(),x.empty(),N=B(s,e));if(G.template)if(C("template",
ga,G,x),ga=G,s=J(G.template)?G.template(x,d):G.template,s=X(s),G.replace){f=G;s=u("<div>"+aa(s)+"</div>").contents();c=s[0];if(1!=s.length||1!==c.nodeType)throw ha("tplrt",ba,"");fb(g,x,c);Fa={$attr:{}};s=ka(c,[],Fa);var Y=a.splice(L+1,a.length-(L+1));z&&gc(s);a=a.concat(s).concat(Y);v(d,Fa);Fa=a.length}else x.html(s);if(G.templateUrl)C("template",ga,G,x),ga=G,G.replace&&(f=G),W=y(a.splice(L,a.length-L),x,d,g,N,l,p,{controllerDirectives:H,newIsolateScopeDirective:z,templateDirective:ga,nonTlbTranscludeDirective:n}),
Fa=a.length;else if(G.compile)try{ma=G.compile(x,d,N),J(ma)?A(null,ma,P,U):ma&&A(ma.pre,ma.post,P,U)}catch(Z){m(Z,fa(x))}G.terminal&&(W.terminal=!0,F=Math.max(F,G.priority))}W.scope=M&&!0===M.scope;W.transclude=T&&N;return W}function gc(a){for(var b=0,c=a.length;b<c;b++)a[b]=Qb(a[b],{$$isolateScope:!0})}function T(b,e,g,f,k,p,n){if(e===k)return null;k=null;if(c.hasOwnProperty(e)){var t;e=a.get(e+d);for(var w=0,A=e.length;w<A;w++)try{t=e[w],(f===r||f>t.priority)&&-1!=t.restrict.indexOf(g)&&(p&&(t=
Qb(t,{$$start:p,$$end:n})),b.push(t),k=t)}catch(B){m(B)}}return k}function v(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?($(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function y(a,b,c,d,e,g,f,l){var k=[],m,t,w=b[0],A=a.shift(),
B=x({},A,{templateUrl:null,transclude:null,replace:null,$$originalDirective:A}),S=J(A.templateUrl)?A.templateUrl(b,c):A.templateUrl;b.empty();n.get(H.getTrustedResourceUrl(S),{cache:p}).success(function(p){var n,F;p=X(p);if(A.replace){p=u("<div>"+aa(p)+"</div>").contents();n=p[0];if(1!=p.length||1!==n.nodeType)throw ha("tplrt",A.name,S);p={$attr:{}};fb(d,b,n);var $=ka(n,[],p);V(A.scope)&&gc($);a=$.concat(a);v(c,p)}else n=w,b.html(p);a.unshift(B);m=ga(a,n,c,e,b,A,g,f,l);q(d,function(a,c){a==n&&(d[c]=
b[0])});for(t=M(b[0].childNodes,e);k.length;){p=k.shift();F=k.shift();var z=k.shift(),H=k.shift(),$=b[0];F!==w&&($=yb(n),fb(z,u(F),$));F=m.transclude?W(p,m.transclude):H;m(t,p,$,d,F)}k=null}).error(function(a,b,c,d){throw ha("tpload",d.url);});return function(a,b,c,d,e){k?(k.push(b),k.push(c),k.push(d),k.push(e)):m(t,b,c,d,e)}}function D(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function C(a,b,c,d){if(b)throw ha("multidir",b.name,c.name,a,fa(d));
}function s(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:Z(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);$(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function N(a,b){if("srcdoc"==b)return H.HTML;var c=Ea(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return H.RESOURCE_URL}function P(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===Ea(a))throw ha("selmulti",fa(a));c.push({priority:100,compile:function(){return{pre:function(c,
d,l){d=l.$$observers||(l.$$observers={});if(f.test(e))throw ha("nodomevents");if(g=b(l[e],!0,N(a,e)))l[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(l.$$observers&&l.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===e&&a!=b?l.$updateClass(a,b):l.$set(e,a)})}}}})}}function fb(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,l;if(a)for(f=0,l=a.length;f<l;f++)if(a[f]==d){a[f++]=c;l=f+e-1;for(var k=a.length;f<k;f++,l++)l<k?a[f]=a[l]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=O.createDocumentFragment();
a.appendChild(d);c[u.expando]=d[u.expando];d=1;for(e=b.length;d<e;d++)g=b[d],u(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function ic(a,b){return x(function(){return a.apply(null,arguments)},a,b)}var Db=function(a,b){this.$$element=a;this.$attr=b||{}};Db.prototype={$normalize:la,$addClass:function(a){a&&0<a.length&&S.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&S.removeClass(this.$$element,a)},$updateClass:function(a,b){this.$removeClass(jc(b,a));this.$addClass(jc(a,
b))},$set:function(a,b,c,d){var e=dc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=ab(a,"-"));e=Ea(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=z(b,"src"===a);!1!==c&&(null===b||b===r?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){m(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);
A.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var ba=b.startSymbol(),ma=b.endSymbol(),X="{{"==ba||"}}"==ma?za:function(a){return a.replace(/\{\{/g,ba).replace(/}}/g,ma)},U=/^ngAttr[A-Z]/;return B}]}function la(b){return Pa(b.replace(gd,""))}function jc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],h=0;h<e.length;h++)if(f==e[h])continue a;c+=(0<c.length?" ":"")+f}return c}function hd(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,
d){wa(a,"controller");V(a)?x(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,h,l;E(e)&&(f=e.match(a),h=f[1],l=f[3],e=b.hasOwnProperty(h)?b[h]:tb(g.$scope,h,!0)||tb(d,h,!0),Oa(e,h,!0));f=c.instantiate(e,g);if(l){if(!g||"object"!=typeof g.$scope)throw s("$controller")("noscp",h||e.name,l);g.$scope[l]=f}return f}}]}function id(){this.$get=["$window",function(b){return u(b.document)}]}function jd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,
arguments)}}]}function kc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=C(aa(b.substr(0,e)));d=aa(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function lc(b){var a=V(b)?b:r;return function(c){a||(a=kc(b));return c?a[C(c)]||null:a}}function mc(b,a,c){if(J(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function kd(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){E(d)&&
(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Tb(d)));return d}],transformRequest:[function(a){return V(a)&&"[object File]"!==Ya.call(a)?oa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:d,put:d,patch:d},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,p){function t(a){function c(a){var b=x({},a,{data:mc(a.data,
a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:n.reject(b)}var d={transformRequest:e.transformRequest,transformResponse:e.transformResponse},g=function(a){function b(a){var c;q(a,function(b,d){J(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=x({},a.headers),g,f,c=x({},c.common,c[C(a.method)]);b(c);b(d);a:for(g in c){a=C(g);for(f in d)if(C(f)===a)continue a;d[g]=c[g]}return d}(a);x(d,a);d.headers=g;d.method=Ga(d.method);(a=Eb(d.url)?b.cookies()[d.xsrfCookieName||
e.xsrfCookieName]:r)&&(g[d.xsrfHeaderName||e.xsrfHeaderName]=a);var f=[function(a){g=a.headers;var b=mc(a.data,lc(g),a.transformRequest);D(a.data)&&q(g,function(a,b){"content-type"===C(b)&&delete g[b]});D(a.withCredentials)&&!D(e.withCredentials)&&(a.withCredentials=e.withCredentials);return w(a,b,g).then(c,c)},r],h=n.when(d);for(q(H,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();
var k=f.shift(),h=h.then(a,k)}h.success=function(a){h.then(function(b){a(b.data,b.status,b.headers,d)});return h};h.error=function(a){h.then(null,function(b){a(b.data,b.status,b.headers,d)});return h};return h}function w(b,c,g){function f(a,b,c){q&&(200<=a&&300>a?q.put(r,[a,b,kc(c)]):q.remove(r));l(b,a,c);d.$$phase||d.$apply()}function l(a,c,d){c=Math.max(c,0);(200<=c&&300>c?p.resolve:p.reject)({data:a,status:c,headers:lc(d),config:b})}function k(){var a=$a(t.pendingRequests,b);-1!==a&&t.pendingRequests.splice(a,
1)}var p=n.defer(),w=p.promise,q,H,r=A(b.url,b.params);t.pendingRequests.push(b);w.then(k,k);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(q=V(b.cache)?b.cache:V(e.cache)?e.cache:F);if(q)if(H=q.get(r),v(H)){if(H.then)return H.then(k,k),H;I(H)?l(H[1],H[0],ea(H[2])):l(H,200,{})}else q.put(r,w);D(H)&&a(b.method,r,c,f,g,b.timeout,b.withCredentials,b.responseType);return w}function A(a,b){if(!b)return a;var c=[];Nc(b,function(a,b){null===a||D(a)||(I(a)||(a=[a]),q(a,function(a){V(a)&&(a=oa(a));
c.push(va(b)+"="+va(a))}))});return a+(-1==a.indexOf("?")?"?":"&")+c.join("&")}var F=c("$http"),H=[];q(g,function(a){H.unshift(E(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=E(a)?p.get(a):p.invoke(a);H.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});t.pendingRequests=[];(function(a){q(arguments,function(a){t[a]=function(b,c){return t(x(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){t[a]=
function(b,c,d){return t(x(d||{},{method:a,url:b,data:c}))}})})("post","put");t.defaults=e;return t}]}function ld(){this.$get=["$browser","$window","$document",function(b,a,c){return md(b,nd,b.defer,a.angular.callbacks,c[0])}]}function md(b,a,c,d,e){function g(a,b){var c=e.createElement("script"),d=function(){c.onreadystatechange=c.onload=c.onerror=null;e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;L&&8>=L?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:
c.onload=c.onerror=function(){d()};e.body.appendChild(c);return d}var f=-1;return function(e,l,k,m,n,p,t,w){function A(){H=f;z&&z();B&&B.abort()}function F(a,d,e,g){var f=pa(l).protocol;r&&c.cancel(r);z=B=null;d="file"==f&&0===d?e?200:404:d;a(1223==d?204:d,e,g);b.$$completeOutstandingRequest(y)}var H;b.$$incOutstandingRequestCount();l=l||b.url();if("jsonp"==C(e)){var S="_"+(d.counter++).toString(36);d[S]=function(a){d[S].data=a};var z=g(l.replace("JSON_CALLBACK","angular.callbacks."+S),function(){d[S].data?
F(m,200,d[S].data):F(m,H||-2);delete d[S]})}else{var B=new a;B.open(e,l,!0);q(n,function(a,b){v(a)&&B.setRequestHeader(b,a)});B.onreadystatechange=function(){if(4==B.readyState){var a=null,b=null;H!==f&&(a=B.getAllResponseHeaders(),b=B.responseType?B.response:B.responseText);F(m,H||B.status,b,a)}};t&&(B.withCredentials=!0);w&&(B.responseType=w);B.send(k||null)}if(0<p)var r=c(A,p);else p&&p.then&&p.then(A)}}function od(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=
function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,k,m){for(var n,p,t=0,w=[],A=g.length,F=!1,q=[];t<A;)-1!=(n=g.indexOf(b,t))&&-1!=(p=g.indexOf(a,n+f))?(t!=n&&w.push(g.substring(t,n)),w.push(t=c(F=g.substring(n+f,p))),t.exp=F,t=p+h,F=!0):(t!=A&&w.push(g.substring(t)),t=A);(A=w.length)||(w.push(""),A=1);if(m&&1<w.length)throw nc("noconcat",g);if(!k||F)return q.length=A,t=function(a){try{for(var b=0,c=A,f;b<c;b++)"function"==typeof(f=w[b])&&
(f=f(a),f=m?e.getTrusted(m,f):e.valueOf(f),null===f||D(f)?f="":"string"!=typeof f&&(f=oa(f))),q[b]=f;return q.join("")}catch(h){a=nc("interr",g,h.toString()),d(a)}},t.exp=g,t.parts=w,t}var f=b.length,h=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function pd(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,f,h,l){var k=a.setInterval,m=a.clearInterval,n=c.defer(),p=n.promise,t=0,w=v(l)&&!l;h=v(h)?h:0;p.then(null,null,d);p.$$intervalId=
k(function(){n.notify(t++);0<h&&t>=h&&(n.resolve(t),m(p.$$intervalId),delete e[p.$$intervalId]);w||b.$apply()},f);e[p.$$intervalId]=n;return p}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function qd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,
lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",
fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function oc(b){b=b.split("/");for(var a=b.length;a--;)b[a]=rb(b[a]);return b.join("/")}function pc(b,a,c){b=pa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=P(b.port)||rd[b.protocol]||null}function qc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=pa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?
b.pathname.substring(1):b.pathname);a.$$search=Vb(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function na(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Ua(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Fb(b){return b.substr(0,Ua(b).lastIndexOf("/")+1)}function rc(b,a){this.$$html5=!0;a=a||"";var c=Fb(b);pc(b,this,b);this.$$parse=function(a){var e=na(c,a);if(!E(e))throw Gb("ipthprfx",a,c);qc(e,this,b);this.$$path||
(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Wb(this.$$search),b=this.$$hash?"#"+rb(this.$$hash):"";this.$$url=oc(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=na(b,d))!==r)return d=e,(e=na(a,e))!==r?c+(na("/",e)||e):b+d;if((e=na(c,d))!==r)return c+e;if(c==d+"/")return c}}function Hb(b,a){var c=Fb(b);pc(b,this,b);this.$$parse=function(d){var e=na(b,d)||na(c,d),e="#"==e.charAt(0)?na(a,e):this.$$html5?e:"";if(!E(e))throw Gb("ihshprfx",
d,a);qc(e,this,b);d=this.$$path;var g=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Wb(this.$$search),e=this.$$hash?"#"+rb(this.$$hash):"";this.$$url=oc(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Ua(b)==Ua(a))return a}}function sc(b,a){this.$$html5=!0;Hb.apply(this,arguments);var c=Fb(b);this.$$rewrite=function(d){var e;if(b==Ua(d))return d;
if(e=na(c,d))return b+a+e;if(c===d+"/")return c}}function gb(b){return function(){return this[b]}}function tc(b,a){return function(c){if(D(c))return this[b];this[b]=a(c);this.$$compose();return this}}function sd(){var b="",a=!1;this.hashPrefix=function(a){return v(a)?(b=a,this):b};this.html5Mode=function(b){return v(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,l=d.baseHref(),
k=d.url();a?(l=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(l||"/"),e=e.history?rc:sc):(l=Ua(k),e=Hb);h=new e(l,"#"+b);h.$$parse(h.$$rewrite(k));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=u(a.target);"a"!==C(b[0].nodeName);)if(b[0]===g[0]||!(b=b.parent())[0])return;var e=b.prop("href");V(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=pa(e.animVal).href);var f=h.$$rewrite(e);e&&(!b.attr("target")&&f&&!a.isDefaultPrevented())&&(a.preventDefault(),f!=d.url()&&
(h.$$parse(f),c.$apply(),Y.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$broadcast("$locationChangeStart",a,h.absUrl()).defaultPrevented?d.url(h.absUrl()):(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);f(b)}),c.$$phase||c.$digest()))});var m=0;c.$watch(function(){var a=d.url(),b=h.$$replace;m&&a==h.absUrl()||(m++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):
(d.url(h.absUrl(),b),f(a))}));h.$$replace=!1;return m});return h}]}function td(){var b=!0,a=this;this.debugEnabled=function(a){return v(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||y;a=!1;try{a=!!e.apply}catch(l){}return a?function(){var a=[];q(arguments,
function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function ca(b,a){if("constructor"===b)throw xa("isecfld",a);return b}function Va(b,a){if(b){if(b.constructor===b)throw xa("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw xa("isecwindow",a);if(b.children&&(b.nodeName||b.on&&b.find))throw xa("isecdom",
a);}return b}function hb(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=ca(a.shift(),d);var h=b[g];h||(h={},b[g]=h);b=h;b.then&&e.unwrapPromises&&(qa(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===r&&(b.$$v={}),b=b.$$v)}g=ca(a.shift(),d);return b[g]=c}function uc(b,a,c,d,e,g,f){ca(b,g);ca(a,g);ca(c,g);ca(d,g);ca(e,g);return f.unwrapPromises?function(f,l){var k=l&&l.hasOwnProperty(b)?l:f,m;if(null==k)return k;(k=k[b])&&k.then&&(qa(g),"$$v"in k||(m=k,m.$$v=r,m.then(function(a){m.$$v=
a})),k=k.$$v);if(null==k)return a?r:k;(k=k[a])&&k.then&&(qa(g),"$$v"in k||(m=k,m.$$v=r,m.then(function(a){m.$$v=a})),k=k.$$v);if(null==k)return c?r:k;(k=k[c])&&k.then&&(qa(g),"$$v"in k||(m=k,m.$$v=r,m.then(function(a){m.$$v=a})),k=k.$$v);if(null==k)return d?r:k;(k=k[d])&&k.then&&(qa(g),"$$v"in k||(m=k,m.$$v=r,m.then(function(a){m.$$v=a})),k=k.$$v);if(null==k)return e?r:k;(k=k[e])&&k.then&&(qa(g),"$$v"in k||(m=k,m.$$v=r,m.then(function(a){m.$$v=a})),k=k.$$v);return k}:function(g,f){var k=f&&f.hasOwnProperty(b)?
f:g;if(null==k)return k;k=k[b];if(null==k)return a?r:k;k=k[a];if(null==k)return c?r:k;k=k[c];if(null==k)return d?r:k;k=k[d];return null==k?e?r:k:k=k[e]}}function ud(b,a){ca(b,a);return function(a,d){return null==a?r:(d&&d.hasOwnProperty(b)?d:a)[b]}}function vd(b,a,c){ca(b,c);ca(a,c);return function(c,e){if(null==c)return r;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?r:c[a]}}function vc(b,a,c){if(Ib.hasOwnProperty(b))return Ib[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||
2!==e)if(a.csp)g=6>e?uc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,h;do h=uc(d[f++],d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=r,b=h;while(f<e);return h};else{var f="var p;\n";q(d,function(b,d){ca(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});
var f=f+"return s;",h=new Function("s","k","pw",f);h.toString=Z(f);g=a.unwrapPromises?function(a,b){return h(a,b,qa)}:h}else g=vd(d[0],d[1],c);else g=ud(d[0],c);"hasOwnProperty"!==b&&(Ib[b]=g);return g}function wd(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return v(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return v(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",
function(c,d,e){a.csp=d.csp;qa=function(b){a.logPromiseWarnings&&!wc.hasOwnProperty(b)&&(wc[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Jb(a);e=(new Wa(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return y}}}]}function xd(){this.$get=["$rootScope","$exceptionHandler",
function(b,a){return yd(function(a){b.$evalAsync(a)},a)}]}function yd(b,a){function c(a){return a}function d(a){return f(a)}var e=function(){var h=[],l,k;return k={resolve:function(a){if(h){var c=h;h=r;l=g(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],l.then(a[0],a[1],a[2])})}},reject:function(a){k.resolve(f(a))},notify:function(a){if(h){var c=h;h.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,f){var k=e(),w=function(d){try{k.resolve((J(b)?
b:c)(d))}catch(e){k.reject(e),a(e)}},A=function(b){try{k.resolve((J(g)?g:d)(b))}catch(c){k.reject(c),a(c)}},F=function(b){try{k.notify((J(f)?f:c)(b))}catch(d){a(d)}};h?h.push([w,A,F]):l.then(w,A,F);return k.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,g){var f=null;try{f=(a||c)()}catch(h){return b(h,!1)}return f&&J(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):
b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&J(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(c){return{then:function(g,f){var m=e();b(function(){try{m.resolve((J(f)?f:d)(c))}catch(b){m.reject(b),a(b)}});return m.promise}}};return{defer:e,reject:f,when:function(h,l,k,m){var n=e(),p,t=function(b){try{return(J(l)?l:c)(b)}catch(d){return a(d),f(d)}},w=function(b){try{return(J(k)?k:d)(b)}catch(c){return a(c),
f(c)}},A=function(b){try{return(J(m)?m:c)(b)}catch(d){a(d)}};b(function(){g(h).then(function(a){p||(p=!0,n.resolve(g(a).then(t,w,A)))},function(a){p||(p=!0,n.resolve(w(a)))},function(a){p||n.notify(A(a))})});return n.promise},all:function(a){var b=e(),c=0,d=I(a)?[]:{};q(a,function(a,e){c++;g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function zd(){var b=10,a=s("$rootScope"),c=null;this.digestTtl=
function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,g,f){function h(){this.$id=Xa();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$isolateBindings={}}function l(b){if(n.$$phase)throw a("inprog",n.$$phase);n.$$phase=b}function k(a,b){var c=
g(a);Oa(c,b);return c}function m(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=Xa());a["this"]=a;a.$$listeners={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,
b,d){var e=k(a,"watch"),g=this.$$watchers,f={fn:b,last:m,get:e,exp:a,eq:!!d};c=null;if(!J(b)){var h=k(b||y,"listener");f.fn=function(a,b,c){h(c)}}if("string"==typeof a&&e.constant){var l=f.fn;f.fn=function(a,b,c){l.call(this,a,b,c);Ka(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Ka(g,f)}},$watchCollection:function(a,b){var c=this,d,e,f=0,h=g(a),l=[],k={},m=0;return this.$watch(function(){e=h(c);var a,b;if(V(e))if(ob(e))for(d!==l&&(d=l,m=d.length=0,f++),a=e.length,m!==a&&(f++,d.length=
m=a),b=0;b<a;b++)d[b]!==e[b]&&(f++,d[b]=e[b]);else{d!==k&&(d=k={},m=0,f++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,d.hasOwnProperty(b)?d[b]!==e[b]&&(f++,d[b]=e[b]):(m++,d[b]=e[b],f++));if(m>a)for(b in f++,d)d.hasOwnProperty(b)&&!e.hasOwnProperty(b)&&(m--,delete d[b])}else d!==e&&(d=e,f++);return f},function(){b(e,d,c)})},$digest:function(){var d,f,g,h,k=this.$$asyncQueue,q=this.$$postDigestQueue,r,z,B=b,s,M=[],W,u,v;l("$digest");c=null;do{z=!1;for(s=this;k.length;){try{v=k.shift(),v.scope.$eval(v.expression)}catch(R){n.$$phase=
null,e(R)}c=null}a:do{if(h=s.$$watchers)for(r=h.length;r--;)try{if(d=h[r])if((f=d.get(s))!==(g=d.last)&&!(d.eq?ta(f,g):"number"==typeof f&&"number"==typeof g&&isNaN(f)&&isNaN(g)))z=!0,c=d,d.last=d.eq?ea(f):f,d.fn(f,g===m?f:g,s),5>B&&(W=4-B,M[W]||(M[W]=[]),u=J(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,u+="; newVal: "+oa(f)+"; oldVal: "+oa(g),M[W].push(u));else if(d===c){z=!1;break a}}catch(x){n.$$phase=null,e(x)}if(!(h=s.$$childHead||s!==this&&s.$$nextSibling))for(;s!==this&&!(h=s.$$nextSibling);)s=
s.$parent}while(s=h);if(z&&!B--)throw n.$$phase=null,a("infdig",b,oa(M));}while(z||k.length);for(n.$$phase=null;q.length;)try{q.shift()()}catch(D){e(D)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==n&&(a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=
this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null)}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){n.$$phase||n.$$asyncQueue.length||f.defer(function(){n.$$asyncQueue.length&&n.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return l("$apply"),this.$eval(a)}catch(b){e(b)}finally{n.$$phase=null;try{n.$digest()}catch(c){throw e(c),
c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);return function(){c[$a(c,b)]=null}},$emit:function(a,b){var c=[],d,f=this,g=!1,h={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},l=[h].concat(ua.call(arguments,1)),k,m;do{d=f.$$listeners[a]||c;h.currentScope=f;k=0;for(m=d.length;k<m;k++)if(d[k])try{d[k].apply(null,l)}catch(n){e(n)}else d.splice(k,1),k--,m--;if(g)break;f=f.$parent}while(f);
return h},$broadcast:function(a,b){var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(ua.call(arguments,1)),h,k;do{c=d;f.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,g)}catch(l){e(l)}else d.splice(h,1),h--,k--;if(!(d=c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}while(c=d);return f}};var n=new h;return n}]}function Ad(){var b=/^\s*(https?|ftp|mailto|tel|file):/,
a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return v(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return v(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!L||8<=L)if(g=pa(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Bd(b){if("self"===b)return b;if(E(b)){if(-1<b.indexOf("***"))throw ra("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*",
"[^:/.?&;]*");return RegExp("^"+b+"$")}if(Za(b))return RegExp("^"+b.source+"$");throw ra("imatcher");}function xc(b){var a=[];v(b)&&q(b,function(b){a.push(Bd(b))});return a}function Cd(){this.SCE_CONTEXTS=da;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=xc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=xc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=
new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw ra("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var g=d(),f={};f[da.HTML]=d(g);f[da.CSS]=d(g);f[da.URL]=d(g);f[da.JS]=d(g);f[da.RESOURCE_URL]=d(f[da.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw ra("icontext",a,b);if(null===b||b===r||""===b)return b;if("string"!==typeof b)throw ra("itype",
a);return new c(b)},getTrusted:function(c,d){if(null===d||d===r||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===da.RESOURCE_URL){var g=pa(d.toString()),m,n,p=!1;m=0;for(n=b.length;m<n;m++)if("self"===b[m]?Eb(g):b[m].exec(g.href)){p=!0;break}if(p)for(m=0,n=a.length;m<n;m++)if("self"===a[m]?Eb(g):a[m].exec(g.href)){p=!1;break}if(p)return d;throw ra("insecurl",d.toString());}if(c===da.HTML)return e(d);throw ra("unsafe");},valueOf:function(a){return a instanceof
g?a.$$unwrapTrustedValue():a}}}]}function Dd(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw ra("iequirks");var e=ea(da);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=za);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,
d(a,c))}};var g=e.parseAs,f=e.getTrusted,h=e.trustAs;q(da,function(a,b){var c=C(b);e[Pa("parse_as_"+c)]=function(b){return g(a,b)};e[Pa("get_trusted_"+c)]=function(b){return f(a,b)};e[Pa("trust_as_"+c)]=function(b){return h(a,b)}});return e}]}function Ed(){this.$get=["$window","$document",function(b,a){var c={},d=P((/android (\d+)/.exec(C((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),g=a[0]||{},f=g.documentMode,h,l=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=g.body&&g.body.style,
m=!1,n=!1;if(k){for(var p in k)if(m=l.exec(p)){h=m[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in k&&"webkit");m=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in k);!d||m&&n||(m=E(g.body.style.webkitTransition),n=E(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<f),hasEvent:function(a){if("input"==a&&9==L)return!1;if(D(c[a])){var b=g.createElement("div");c[a]="on"+
a in b}return c[a]},csp:Sb(),vendorPrefix:h,transitions:m,animations:n,android:d,msie:L,msieDocumentMode:f}}]}function Fd(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,l){var k=c.defer(),m=k.promise,n=v(l)&&!l;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete g[m.$$timeoutId]}n||b.$apply()},h);m.$$timeoutId=h;g[h]=k;return m}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),
delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function pa(b,a){var c=b;L&&(X.setAttribute("href",c),c=X.href);X.setAttribute("href",c);return{href:X.href,protocol:X.protocol?X.protocol.replace(/:$/,""):"",host:X.host,search:X.search?X.search.replace(/^\?/,""):"",hash:X.hash?X.hash.replace(/^#/,""):"",hostname:X.hostname,port:X.port,pathname:"/"===X.pathname.charAt(0)?X.pathname:"/"+X.pathname}}function Eb(b){b=E(b)?pa(b):b;return b.protocol===yc.protocol&&b.host===yc.host}
function Gd(){this.$get=Z(Y)}function zc(b){function a(d,e){if(V(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Ac);a("date",Bc);a("filter",Hd);a("json",Id);a("limitTo",Jd);a("lowercase",Kd);a("number",Cc);a("orderBy",Dc);a("uppercase",Ld)}function Hd(){return function(b,a,c){if(!I(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;
return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Na.equals(a,b)}:function(a,b){b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;
return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)"$"==f?function(){if(a[f]){var b=f;e.push(function(c){return g(c,a[b])})}}():function(){if("undefined"!=typeof a[f]){var b=f;e.push(function(c){return g(tb(c,b),a[b])})}}();break;case "function":e.push(a);break;default:return b}for(var d=[],h=0;h<b.length;h++){var l=b[h];e.check(l)&&d.push(l)}return d}}function Ac(b){var a=b.NUMBER_FORMATS;return function(b,d){D(d)&&(d=a.CURRENCY_SYM);
return Ec(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Cc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Ec(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Ec(b,a,c,d,e){if(isNaN(b)||!isFinite(b))return"";var g=0>b;b=Math.abs(b);var f=b+"",h="",l=[],k=!1;if(-1!==f.indexOf("e")){var m=f.match(/([\d\.]+)e(-?)(\d+)/);m&&"-"==m[2]&&m[3]>e+1?f="0":(h=f,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{f=(f.split(Fc)[1]||"").length;D(e)&&(e=Math.min(Math.max(a.minFrac,
f),a.maxFrac));f=Math.pow(10,e);b=Math.round(b*f)/f;b=(""+b).split(Fc);f=b[0];b=b[1]||"";var m=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(m=f.length-n,k=0;k<m;k++)0===(m-k)%p&&0!==k&&(h+=c),h+=f.charAt(k);for(k=m;k<f.length;k++)0===(f.length-k)%n&&0!==k&&(h+=c),h+=f.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}l.push(g?a.negPre:a.posPre);l.push(h);l.push(g?a.negSuf:a.posSuf);return l.join("")}function Kb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=
b.substr(b.length-a));return d+b}function U(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Kb(e,a,d)}}function ib(b,a){return function(c,d){var e=c["get"+b](),g=Ga(a?"SHORT"+b:b);return d[g][e]}}function Bc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var g=0,f=0,h=b[8]?a.setUTCFullYear:a.setFullYear,l=b[8]?a.setUTCHours:a.setHours;b[9]&&(g=P(b[9]+b[10]),f=P(b[9]+b[11]));h.call(a,P(b[1]),P(b[2])-1,P(b[3]));g=P(b[4]||0)-g;f=P(b[5]||0)-f;h=
P(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));l.call(a,g,f,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var g="",f=[],h,l;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;E(c)&&(c=Md.test(c)?P(c):a(c));pb(c)&&(c=new Date(c));if(!Ja(c))return c;for(;e;)(l=Nd.exec(e))?(f=f.concat(ua.call(l,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){h=Od[a];g+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,
"").replace(/''/g,"'")});return g}}function Id(){return function(b){return oa(b,!0)}}function Jd(){return function(b,a){if(!I(b)&&!E(b))return b;a=P(a);if(E(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Dc(b){return function(a,c,d){function e(a,b){return Ma(b)?function(b,c){return a(c,b)}:a}if(!I(a)||!c)return a;c=I(c)?c:[c];c=Pc(c,function(a){var c=
!1,d=a||za;if(E(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),g=typeof c,f=typeof e;g==f?("string"==g&&(c=c.toLowerCase(),e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=g<f?-1:1;return c},c)});for(var g=[],f=0;f<a.length;f++)g.push(a[f]);return g.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function sa(b){J(b)&&(b={link:b});b.restrict=b.restrict||"AC";return Z(b)}function Gc(b,
a){function c(a,c){c=c?"-"+ab(c,"-"):"";b.removeClass((a?jb:kb)+c).addClass((a?kb:jb)+c)}var d=this,e=b.parent().controller("form")||lb,g=0,f=d.$error={},h=[];d.$name=a.name||a.ngForm;d.$dirty=!1;d.$pristine=!0;d.$valid=!0;d.$invalid=!1;e.$addControl(d);b.addClass(Ha);c(!0);d.$addControl=function(a){wa(a.$name,"input");h.push(a);a.$name&&(d[a.$name]=a)};d.$removeControl=function(a){a.$name&&d[a.$name]===a&&delete d[a.$name];q(f,function(b,c){d.$setValidity(c,!0,a)});Ka(h,a)};d.$setValidity=function(a,
b,h){var n=f[a];if(b)n&&(Ka(n,h),n.length||(g--,g||(c(b),d.$valid=!0,d.$invalid=!1),f[a]=!1,c(!0,a),e.$setValidity(a,!0,d)));else{g||c(b);if(n){if(-1!=$a(n,h))return}else f[a]=n=[],g++,c(!1,a),e.$setValidity(a,!1,d);n.push(h);d.$valid=!1;d.$invalid=!0}};d.$setDirty=function(){b.removeClass(Ha).addClass(mb);d.$dirty=!0;d.$pristine=!1;e.$setDirty()};d.$setPristine=function(){b.removeClass(mb).addClass(Ha);d.$dirty=!1;d.$pristine=!0;q(h,function(a){a.$setPristine()})}}function nb(b,a,c,d,e,g){if(!e.android){var f=
!1;a.on("compositionstart",function(a){f=!0});a.on("compositionend",function(){f=!1})}var h=function(){if(!f){var e=a.val();Ma(c.ngTrim||"T")&&(e=aa(e));d.$viewValue!==e&&b.$apply(function(){d.$setViewValue(e)})}};if(e.hasEvent("input"))a.on("input",h);else{var l,k=function(){l||(l=g.defer(function(){h();l=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||k()});if(e.hasEvent("paste"))a.on("paste cut",k)}a.on("change",h);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?
"":d.$viewValue)};var m=c.ngPattern,n=function(a,b){if(d.$isEmpty(b)||a.test(b))return d.$setValidity("pattern",!0),b;d.$setValidity("pattern",!1);return r};m&&((e=m.match(/^\/(.*)\/([gim]*)$/))?(m=RegExp(e[1],e[2]),e=function(a){return n(m,a)}):e=function(c){var d=b.$eval(m);if(!d||!d.test)throw s("ngPattern")("noregexp",m,d,fa(a));return n(d,c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var p=P(c.ngMinlength);e=function(a){if(!d.$isEmpty(a)&&a.length<p)return d.$setValidity("minlength",
!1),r;d.$setValidity("minlength",!0);return a};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var t=P(c.ngMaxlength);e=function(a){if(!d.$isEmpty(a)&&a.length>t)return d.$setValidity("maxlength",!1),r;d.$setValidity("maxlength",!0);return a};d.$parsers.push(e);d.$formatters.push(e)}}function Lb(b,a){b="ngClass"+b;return function(){return{restrict:"AC",link:function(c,d,e){function g(b){if(!0===a||c.$index%2===a){var d=f(b||"");h?ta(b,h)||e.$updateClass(d,f(h)):e.$addClass(d)}h=ea(b)}function f(a){if(I(a))return a.join(" ");
if(V(a)){var b=[];q(a,function(a,c){a&&b.push(c)});return b.join(" ")}return a}var h;c.$watch(e[b],g,!0);e.$observe("class",function(a){g(c.$eval(e[b]))});"ngClass"!==b&&c.$watch("$index",function(d,g){var h=d&1;if(h!==g&1){var n=f(c.$eval(e[b]));h===a?e.$addClass(n):e.$removeClass(n)}})}}}}var C=function(b){return E(b)?b.toLowerCase():b},Ga=function(b){return E(b)?b.toUpperCase():b},L,u,Aa,ua=[].slice,Pd=[].push,Ya=Object.prototype.toString,La=s("ng"),Na=Y.angular||(Y.angular={}),Ta,Ea,ia=["0","0",
"0"];L=P((/msie (\d+)/.exec(C(navigator.userAgent))||[])[1]);isNaN(L)&&(L=P((/trident\/.*; rv:(\d+)/.exec(C(navigator.userAgent))||[])[1]));y.$inject=[];za.$inject=[];var aa=function(){return String.prototype.trim?function(b){return E(b)?b.trim():b}:function(b){return E(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Ea=9>L?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ga(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};
var Sc=/[A-Z]/g,Qd={full:"1.2.6",major:1,minor:2,dot:6,codeName:"taco-salsafication"},Qa=N.cache={},bb=N.expando="ng-"+(new Date).getTime(),Wc=1,Hc=Y.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},zb=Y.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)},Uc=/([\:\-\_]+(.))/g,Vc=/^moz([A-Z])/,wb=s("jqLite"),Da=N.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=
!1;"complete"===O.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),N(Y).on("load",a))},toString:function(){var b=[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?u(this[b]):u(this[this.length+b])},length:0,push:Pd,sort:[].sort,splice:[].splice},db={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){db[C(b)]=b});var ec={};q("input select option textarea button form details".split(" "),function(b){ec[Ga(b)]=!0});q({data:ac,
inheritedData:cb,scope:function(b){return u(b).data("$scope")||cb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return u(b).data("$isolateScope")||u(b).data("$isolateScopeNoTemplate")},controller:bc,injector:function(b){return cb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Ab,css:function(b,a,c){a=Pa(a);if(v(c))b.style[a]=c;else{var d;8>=L&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=L&&(d=""===d?r:d);return d}},attr:function(b,
a,c){var d=C(a);if(db[d])if(v(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||y).specified?d:r;else if(v(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?r:b},prop:function(b,a,c){if(v(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(D(d))return e?b[e]:"";b[e]=d}var a=[];9>L?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,
a){if(D(a)){if("SELECT"===Ea(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(D(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ba(d[c]);b.innerHTML=a},empty:cc},function(b,a){N.prototype[a]=function(a,d){var e,g;if(b!==cc&&(2==b.length&&b!==Ab&&b!==bc?a:d)===r){if(V(a)){for(e=0;e<this.length;e++)if(b===ac)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;
g=e===r?Math.min(this.length,1):this.length;for(var f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});q({removeData:Zb,dealoc:Ba,on:function a(c,d,e,g){if(v(g))throw wb("onargs");var f=ja(c,"events"),h=ja(c,"handle");f||ja(c,"events",f={});h||ja(c,"handle",h=Xc(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==d||"mouseleave"==d){var m=O.body.contains||O.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:
a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||m(this,c))||h(a,d)})}else Hc(c,d,h),f[d]=[];g=f[d]}g.push(e)})},off:$b,one:function(a,c,d){a=u(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,
e=a.parentNode;Ba(a);q(new N(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.childNodes||[]},append:function(a,c){q(new N(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new N(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=u(c)[0];var d=a.parentNode;d&&
d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ba(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new N(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:Cb,removeClass:Bb,toggleClass:function(a,c,d){D(d)&&(d=!Ab(a,c));(d?Cb:Bb)(a,c)},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},
find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:yb,triggerHandler:function(a,c,d){c=(ja(a,"events")||{})[c];d=d||[];var e=[{preventDefault:y,stopPropagation:y}];q(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){N.prototype[c]=function(c,e,g){for(var f,h=0;h<this.length;h++)D(f)?(f=a(this[h],c,e,g),v(f)&&(f=u(f))):xb(f,a(this[h],c,e,g));return v(f)?f:this};N.prototype.bind=N.prototype.on;N.prototype.unbind=N.prototype.off});Ra.prototype={put:function(a,c){this[Ca(a)]=
c},get:function(a){return this[Ca(a)]},remove:function(a){var c=this[a=Ca(a)];delete this[a];return c}};var Zc=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,$c=/,/,ad=/^\s*(_?)(\S+?)\1\s*$/,Yc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Sa=s("$injector"),Rd=s("$animate"),Sd=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Rd("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=
a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout",function(a){return{enter:function(d,e,g,f){g?g.after(d):(e&&e[0]||(e=g.parent()),e.append(d));f&&a(f,0,!1)},leave:function(d,e){d.remove();e&&a(e,0,!1)},move:function(a,c,g,f){this.enter(a,c,g,f)},addClass:function(d,e,g){e=E(e)?e:I(e)?e.join(" "):"";q(d,function(a){Cb(a,e)});g&&a(g,0,!1)},removeClass:function(d,e,g){e=E(e)?e:I(e)?e.join(" "):"";q(d,function(a){Bb(a,e)});g&&a(g,0,!1)},enabled:y}}]}],ha=s("$compile");
hc.$inject=["$provide","$$sanitizeUriProvider"];var gd=/^(x[\:\-_]|data[\:\-_])/i,nd=Y.XMLHttpRequest||function(){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(c){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(d){}throw s("$httpBackend")("noxhr");},nc=s("$interpolate"),Td=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,rd={http:80,https:443,ftp:21},Gb=s("$location");sc.prototype=Hb.prototype=rc.prototype={$$html5:!1,$$replace:!1,absUrl:gb("$$absUrl"),
url:function(a,c){if(D(a))return this.$$url;var d=Td.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:gb("$$protocol"),host:gb("$$host"),port:gb("$$port"),path:tc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(E(a))this.$$search=Vb(a);else if(V(a))this.$$search=a;else throw Gb("isrcharg");break;default:D(c)||null===c?delete this.$$search[a]:
this.$$search[a]=c}this.$$compose();return this},hash:tc("$$hash",za),replace:function(){this.$$replace=!0;return this}};var xa=s("$parse"),wc={},qa,Ia={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:y,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return v(d)?v(e)?d+e:d:v(e)?e:r},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(v(d)?d:0)-(v(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,
e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":y,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,
c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Ud={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Jb=function(a){this.options=a};Jb.prototype={constructor:Jb,lex:function(a){this.text=a;this.index=0;this.ch=r;this.lastCh=":";this.tokens=[];var c;for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||
this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{var d=this.ch+this.peek(),
e=d+this.peek(2),g=Ia[this.ch],f=Ia[d],h=Ia[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):f?(this.tokens.push({index:this.index,text:d,fn:f}),this.index+=2):g?(this.tokens.push({index:this.index,text:this.ch,fn:g,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=
a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=v(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw xa("lexerr",a,c,this.text);
},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=C(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,json:!0,fn:function(){return a}})},
readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;this.index++}if(e)for(g=this.index;g<this.text.length;){h=this.text.charAt(g);if("("===h){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(h))g++;else break}d={index:d,text:c};if(Ia.hasOwnProperty(c))d.fn=Ia[c],d.json=Ia[c];else{var l=vc(c,this.options,this.text);d.fn=
x(function(a,c){return l(a,c)},{assign:function(d,e){return hb(d,c,e,a.text,a.options)}})}this.tokens.push(d);f&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+1,text:f,json:!1}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=
4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Ud[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}d+=f}this.index++}this.throwError("Unterminated quote",c)}};var Wa=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};Wa.ZERO=function(){return 0};Wa.prototype={constructor:Wa,parse:function(a,c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,this.functionCall=
this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||
this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw xa("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw xa("ueoe",this.text);return this.tokens[0]},peek:function(a,
c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return x(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return x(function(e,g){return a(e,
g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return x(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,
c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=function(a,e,h){h=[h];for(var l=0;l<d.length;l++)h.push(d[l](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",
d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());
return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,
c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(Wa.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=vc(d,this.options,this.text);return x(function(c,d,h){return e(h||a(c,d),d)},{assign:function(e,f,h){return hb(a(e,h),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return x(function(e,
g){var f=a(e,g),h=d(e,g),l;if(!f)return r;(f=Va(f[h],c.text))&&(f.then&&c.options.unwrapPromises)&&(l=f,"$$v"in f||(l.$$v=r,l.then(function(a){l.$$v=a})),f=f.$$v);return f},{assign:function(e,g,f){var h=d(e,f);return Va(a(e,f),c.text)[h]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var h=[],l=c?c(g,f):g,k=0;k<d.length;k++)h.push(d[k](g,f));k=a(g,f,l)||y;Va(l,e.text);
Va(k,e.text);h=k.apply?k.apply(l,h):k(h[0],h[1],h[2],h[3],h[4]);return Va(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return x(function(c,d){for(var f=[],h=0;h<a.length;h++)f.push(a[h](c,d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();
a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return x(function(c,d){for(var e={},l=0;l<a.length;l++){var k=a[l];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Ib={},ra=s("$sce"),da={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},X=O.createElement("a"),yc=pa(Y.location.href,!0);zc.$inject=["$provide"];Ac.$inject=["$locale"];Cc.$inject=["$locale"];var Fc=".",Od={yyyy:U("FullYear",4),yy:U("FullYear",2,0,!0),y:U("FullYear",1),
MMMM:ib("Month"),MMM:ib("Month",!0),MM:U("Month",2,1),M:U("Month",1,1),dd:U("Date",2),d:U("Date",1),HH:U("Hours",2),H:U("Hours",1),hh:U("Hours",2,-12),h:U("Hours",1,-12),mm:U("Minutes",2),m:U("Minutes",1),ss:U("Seconds",2),s:U("Seconds",1),sss:U("Milliseconds",3),EEEE:ib("Day"),EEE:ib("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Kb(Math[0<a?"floor":"ceil"](a/60),2)+Kb(Math.abs(a%60),2))}},Nd=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
Md=/^\-?\d+$/;Bc.$inject=["$locale"];var Kd=Z(C),Ld=Z(Ga);Dc.$inject=["$parse"];var Vd=Z({restrict:"E",compile:function(a,c){8>=L&&(c.href||c.name||c.$set("href",""),a.append(O.createComment("IE fix")));if(!c.href&&!c.name)return function(a,c){c.on("click",function(a){c.attr("href")||a.preventDefault()})}}}),Mb={};q(db,function(a,c){if("multiple"!=a){var d=la("ng-"+c);Mb[d]=function(){return{priority:100,compile:function(){return function(a,g,f){a.$watch(f[d],function(a){f.$set(c,!!a)})}}}}}});q(["src",
"srcset","href"],function(a){var c=la("ng-"+a);Mb[c]=function(){return{priority:99,link:function(d,e,g){g.$observe(c,function(c){c&&(g.$set(a,c),L&&e.prop(a,g[a]))})}}}});var lb={$addControl:y,$removeControl:y,$setValidity:y,$setDirty:y,$setPristine:y};Gc.$inject=["$element","$attrs","$scope"];var Ic=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Gc,compile:function(){return{pre:function(a,e,g,f){if(!g.action){var h=function(a){a.preventDefault?a.preventDefault():
a.returnValue=!1};Hc(e[0],"submit",h);e.on("$destroy",function(){c(function(){zb(e[0],"submit",h)},0,!1)})}var l=e.parent().controller("form"),k=g.name||g.ngForm;k&&hb(a,k,f,k);if(l)e.on("$destroy",function(){l.$removeControl(f);k&&hb(a,k,r,k);x(f,lb)})}}}}}]},Wd=Ic(),Xd=Ic(!0),Yd=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,Zd=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,$d=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Jc={text:nb,number:function(a,c,d,e,g,
f){nb(a,c,d,e,g,f);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||$d.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return r});e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);if(!e.$isEmpty(a)&&a<c)return e.$setValidity("min",!1),r;e.$setValidity("min",!0);return a},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);if(!e.$isEmpty(a)&&a>c)return e.$setValidity("max",
!1),r;e.$setValidity("max",!0);return a},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){if(e.$isEmpty(a)||pb(a))return e.$setValidity("number",!0),a;e.$setValidity("number",!1);return r})},url:function(a,c,d,e,g,f){nb(a,c,d,e,g,f);a=function(a){if(e.$isEmpty(a)||Yd.test(a))return e.$setValidity("url",!0),a;e.$setValidity("url",!1);return r};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,f){nb(a,c,d,e,g,f);a=function(a){if(e.$isEmpty(a)||Zd.test(a))return e.$setValidity("email",
!0),a;e.$setValidity("email",!1);return r};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){D(d.name)&&c.attr("name",Xa());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;E(g)||(g=!0);E(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=
e.$viewValue};e.$isEmpty=function(a){return a!==g};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:y,button:y,submit:y,reset:y},Kc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,g,f){f&&(Jc[C(g.type)]||Jc.text)(d,e,g,f,c,a)}}}],kb="ng-valid",jb="ng-invalid",Ha="ng-pristine",mb="ng-dirty",ae=["$scope","$exceptionHandler","$attrs","$element","$parse",function(a,c,d,e,g){function f(a,c){c=c?"-"+ab(c,"-"):
"";e.removeClass((a?jb:kb)+c).addClass((a?kb:jb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var h=g(d.ngModel),l=h.assign;if(!l)throw s("ngModel")("nonassign",d.ngModel,fa(e));this.$render=y;this.$isEmpty=function(a){return D(a)||""===a||null===a||a!==a};var k=e.inheritedData("$formController")||lb,m=0,n=this.$error={};e.addClass(Ha);f(!0);this.$setValidity=
function(a,c){n[a]!==!c&&(c?(n[a]&&m--,m||(f(!0),this.$valid=!0,this.$invalid=!1)):(f(!1),this.$invalid=!0,this.$valid=!1,m++),n[a]=!c,f(c,a),k.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;e.removeClass(mb).addClass(Ha)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,e.removeClass(Ha).addClass(mb),k.$setDirty());q(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,l(a,d),q(this.$viewChangeListeners,
function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=h(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=c,p.$render())}return c})}],be=function(){return{require:["ngModel","^?form"],controller:ae,link:function(a,c,d,e){var g=e[0],f=e[1]||lb;f.$addControl(g);a.$on("$destroy",function(){f.$removeControl(g)})}}},ce=Z({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),
Lc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},de=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!D(a)){var c=[];a&&q(a.split(g),function(a){a&&
c.push(aa(a))});return c}});e.$formatters.push(function(a){return I(a)?a.join(", "):r});e.$isEmpty=function(a){return!a||!a.length}}}},ee=/^(true|false|\d+)$/,fe=function(){return{priority:100,compile:function(a,c){return ee.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",a)})}}}},ge=sa(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==r?"":a)})}),he=["$interpolate",
function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],ie=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);d.$watch(function(){return(f(d)||"").toString()},function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],je=Lb("",!0),ke=Lb("Odd",0),le=Lb("Even",1),me=sa({compile:function(a,c){c.$set("ngCloak",r);a.removeClass("ng-cloak")}}),
ne=[function(){return{scope:!0,controller:"@",priority:500}}],Mc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=la("ng-"+a);Mc[c]=["$parse",function(d){return{compile:function(e,g){var f=d(g[c]);return function(c,d,e){d.on(C(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});var oe=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",
$$tlb:!0,link:function(c,d,e,g,f){var h,l;c.$watch(e.ngIf,function(g){Ma(g)?l||(l=c.$new(),f(l,function(c){c[c.length++]=O.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(l&&(l.$destroy(),l=null),h&&(a.leave(ub(h.clone)),h=null))})}}}],pe=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,g){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Na.noop,compile:function(f,h){var l=h.ngInclude||h.src,k=h.onload||"",m=
h.autoscroll;return function(f,h,q,r,A){var s=0,u,x,z=function(){u&&(u.$destroy(),u=null);x&&(e.leave(x),x=null)};f.$watch(g.parseAsResourceUrl(l),function(g){var l=function(){!v(m)||m&&!f.$eval(m)||d()},q=++s;g?(a.get(g,{cache:c}).success(function(a){if(q===s){var c=f.$new();r.template=a;a=A(c,function(a){z();e.enter(a,null,h,l)});u=c;x=a;u.$emit("$includeContentLoaded");f.$eval(k)}}).error(function(){q===s&&z()}),f.$emit("$includeContentRequested")):(z(),r.template=null)})}}}}],qe=["$compile",function(a){return{restrict:"ECA",
priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],re=sa({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),se=sa({terminal:!0,priority:1E3}),te=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,g,f){var h=f.count,l=f.$attr.when&&g.attr(f.$attr.when),k=f.offset||0,m=e.$eval(l)||{},n={},p=c.startSymbol(),t=c.endSymbol(),r=/^when(Minus)?(.+)$/;q(f,function(a,c){r.test(c)&&(m[C(c.replace("when",
"").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(m,function(a,e){n[e]=c(a.replace(d,p+h+"-"+k+t))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in m||(c=a.pluralCat(c-k));return n[c](e,g,!0)},function(a){g.text(a)})}}}],ue=["$parse","$animate",function(a,c){var d=s("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,g,f,h,l){var k=f.ngRepeat,m=k.match(/^\s*(.+)\s+in\s+([\r\n\s\S]*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),n,p,t,r,s,x,v={$id:Ca};
if(!m)throw d("iexp",k);f=m[1];h=m[2];(m=m[4])?(n=a(m),p=function(a,c,d){x&&(v[x]=a);v[s]=c;v.$index=d;return n(e,v)}):(t=function(a,c){return Ca(c)},r=function(a){return a});m=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!m)throw d("iidexp",f);s=m[3]||m[1];x=m[2];var D={};e.$watchCollection(h,function(a){var f,h,m=g[0],n,v={},H,R,E,y,T,C,I=[];if(ob(a))T=a,n=p||t;else{n=p||r;T=[];for(E in a)a.hasOwnProperty(E)&&"$"!=E.charAt(0)&&T.push(E);T.sort()}H=T.length;h=I.length=T.length;for(f=
0;f<h;f++)if(E=a===T?f:T[f],y=a[E],y=n(E,y,f),wa(y,"`track by` id"),D.hasOwnProperty(y))C=D[y],delete D[y],v[y]=C,I[f]=C;else{if(v.hasOwnProperty(y))throw q(I,function(a){a&&a.scope&&(D[a.id]=a)}),d("dupes",k,y);I[f]={id:y};v[y]=!1}for(E in D)D.hasOwnProperty(E)&&(C=D[E],f=ub(C.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=!0}),C.scope.$destroy());f=0;for(h=T.length;f<h;f++){E=a===T?f:T[f];y=a[E];C=I[f];I[f-1]&&(m=I[f-1].clone[I[f-1].clone.length-1]);if(C.scope){R=C.scope;n=m;do n=n.nextSibling;
while(n&&n.$$NG_REMOVED);C.clone[0]!=n&&c.move(ub(C.clone),null,u(m));m=C.clone[C.clone.length-1]}else R=e.$new();R[s]=y;x&&(R[x]=E);R.$index=f;R.$first=0===f;R.$last=f===H-1;R.$middle=!(R.$first||R.$last);R.$odd=!(R.$even=0===(f&1));C.scope||l(R,function(a){a[a.length++]=O.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,u(m));m=a;C.scope=R;C.clone=a;v[C.id]=C})}D=v})}}}],ve=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Ma(c)?"removeClass":"addClass"](d,"ng-hide")})}}],
we=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Ma(c)?"addClass":"removeClass"](d,"ng-hide")})}}],xe=sa(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),ye=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,g){var f,h,l=[];c.$watch(e.ngSwitch||e.on,function(d){for(var m=0,n=l.length;m<n;m++)l[m].$destroy(),a.leave(h[m]);h=[];
l=[];if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();l.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],ze=sa({transclude:"element",priority:800,require:"^ngSwitch",compile:function(a,c){return function(a,e,g,f,h){f.cases["!"+c.ngSwitchWhen]=f.cases["!"+c.ngSwitchWhen]||[];f.cases["!"+c.ngSwitchWhen].push({transclude:h,element:e})}}}),Ae=sa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,
g){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:g,element:c})}}),Be=sa({controller:["$element","$transclude",function(a,c){if(!c)throw s("ngTransclude")("orphan",fa(a));this.$transclude=c}],link:function(a,c,d,e){e.$transclude(function(a){c.empty();c.append(a)})}}),Ce=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],De=s("ngOptions"),Ee=Z({terminal:!0}),Fe=["$compile","$parse",function(a,c){var d=
/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,e={$setViewValue:y};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var l=this,k={},m=e,n;l.databound=d.ngModel;l.init=function(a,c,d){m=a;n=d};l.addOption=function(c){wa(c,'"option value"');k[c]=!0;m.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};l.removeOption=function(a){this.hasOption(a)&&
(delete k[a],m.$viewValue==a&&this.renderUnknownOption(a))};l.renderUnknownOption=function(c){c="? "+Ca(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};l.hasOption=function(a){return k.hasOwnProperty(a)};c.$on("$destroy",function(){l.renderUnknownOption=y})}],link:function(e,f,h,l){function k(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(y.parent()&&y.remove(),c.val(a),""===a&&x.prop("selected",!0)):D(a)&&x?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){y.parent()&&
y.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;d.$render=function(){var a=new Ra(d.$viewValue);q(c.find("option"),function(c){c.selected=v(a.get(c.value))})};a.$watch(function(){ta(e,d.$viewValue)||(e=ea(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,r,s,w;s=g.$modelValue;w=x(e)||[];var B=n?Nb(w):w,D,K,z;K=
{};r=!1;var F,J;if(t)if(u&&I(s))for(r=new Ra([]),z=0;z<s.length;z++)K[m]=s[z],r.put(u(e,K),s[z]);else r=new Ra(s);for(z=0;D=B.length,z<D;z++){k=z;if(n){k=B[z];if("$"===k.charAt(0))continue;K[n]=k}K[m]=w[k];d=p(e,K)||"";(k=a[d])||(k=a[d]=[],c.push(d));t?d=v(r.remove(u?u(e,K):q(e,K))):(u?(d={},d[m]=s,d=u(e,d)===u(e,K)):d=s===q(e,K),r=r||d);F=l(e,K);F=v(F)?F:"";k.push({id:u?u(e,K):n?B[z]:z,label:F,selected:d})}t||(A||null===s?a[""].unshift({id:"",label:"",selected:!r}):r||a[""].unshift({id:"?",label:"",
selected:!0}));K=0;for(B=c.length;K<B;K++){d=c[K];k=a[d];y.length<=K?(s={element:E.clone().attr("label",d),label:k.label},w=[s],y.push(w),f.append(s.element)):(w=y[K],s=w[0],s.label!=d&&s.element.attr("label",s.label=d));F=null;z=0;for(D=k.length;z<D;z++)r=k[z],(d=w[z+1])?(F=d.element,d.label!==r.label&&F.text(d.label=r.label),d.id!==r.id&&F.val(d.id=r.id),F[0].selected!==r.selected&&F.prop("selected",d.selected=r.selected)):(""===r.id&&A?J=A:(J=C.clone()).val(r.id).attr("selected",r.selected).text(r.label),
w.push({element:J,label:r.label,id:r.id,selected:r.selected}),F?F.after(J):s.element.append(J),F=J);for(z++;w.length>z;)w.pop().element.remove()}for(;y.length>K;)y.pop()[0].element.remove()}var k;if(!(k=s.match(d)))throw De("iexp",s,fa(f));var l=c(k[2]||k[1]),m=k[4]||k[6],n=k[5],p=c(k[3]||""),q=c(k[2]?k[1]:m),x=c(k[7]),u=k[8]?c(k[8]):null,y=[[{element:f,label:""}]];A&&(a(A)(e),A.removeClass("ng-scope"),A.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=x(e)||[],d={},h,k,l,
p,s,w,v;if(t)for(k=[],p=0,w=y.length;p<w;p++)for(a=y[p],l=1,s=a.length;l<s;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(u)for(v=0;v<c.length&&(d[m]=c[v],u(e,d)!=h);v++);else d[m]=c[h];k.push(q(e,d))}}else if(h=f.val(),"?"==h)k=r;else if(""===h)k=null;else if(u)for(v=0;v<c.length;v++){if(d[m]=c[v],u(e,d)==h){k=q(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=q(e,d);g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(l[1]){var p=l[0];l=l[1];var t=h.multiple,s=h.ngOptions,A=!1,x,C=u(O.createElement("option")),
E=u(O.createElement("optgroup")),y=C.clone();h=0;for(var B=f.children(),J=B.length;h<J;h++)if(""===B[h].value){x=A=B.eq(h);break}p.init(l,A,y);t&&(l.$isEmpty=function(a){return!a||0===a.length});s?n(e,f,l):t?m(e,f,l):k(e,f,l,p)}}}}],Ge=["$interpolate",function(a){var c={addOption:y,removeOption:y};return{restrict:"E",priority:100,compile:function(d,e){if(D(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),m=k.data("$selectController")||k.parent().data("$selectController");
m&&m.databound?d.prop("selected",!1):m=c;g?a.$watch(g,function(a,c){e.$set("value",a);a!==c&&m.removeOption(c);m.addOption(a)}):m.addOption(e.value);d.on("$destroy",function(){m.removeOption(e.value)})}}}}],He=Z({restrict:"E",terminal:!0});(Aa=Y.jQuery)?(u=Aa,x(Aa.fn,{scope:Da.scope,isolateScope:Da.isolateScope,controller:Da.controller,injector:Da.injector,inheritedData:Da.inheritedData}),vb("remove",!0,!0,!1),vb("empty",!1,!1,!1),vb("html",!1,!1,!0)):u=N;Na.element=u;(function(a){x(a,{bootstrap:Xb,
copy:ea,extend:x,equals:ta,element:u,forEach:q,injector:Yb,noop:y,bind:qb,toJson:oa,fromJson:Tb,identity:za,isUndefined:D,isDefined:v,isString:E,isFunction:J,isObject:V,isNumber:pb,isElement:Oc,isArray:I,version:Qd,isDate:Ja,lowercase:C,uppercase:Ga,callbacks:{counter:0},$$minErr:s,$$csp:Sb});Ta=Tc(Y);try{Ta("ngLocale")}catch(c){Ta("ngLocale",[]).provider("$locale",qd)}Ta("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Ad});a.provider("$compile",hc).directive({a:Vd,input:Kc,textarea:Kc,
form:Wd,script:Ce,select:Fe,style:He,option:Ge,ngBind:ge,ngBindHtml:ie,ngBindTemplate:he,ngClass:je,ngClassEven:le,ngClassOdd:ke,ngCloak:me,ngController:ne,ngForm:Xd,ngHide:we,ngIf:oe,ngInclude:pe,ngInit:re,ngNonBindable:se,ngPluralize:te,ngRepeat:ue,ngShow:ve,ngStyle:xe,ngSwitch:ye,ngSwitchWhen:ze,ngSwitchDefault:Ae,ngOptions:Ee,ngTransclude:Be,ngModel:be,ngList:de,ngChange:ce,required:Lc,ngRequired:Lc,ngValue:fe}).directive({ngInclude:qe}).directive(Mb).directive(Mc);a.provider({$anchorScroll:bd,
$animate:Sd,$browser:dd,$cacheFactory:ed,$controller:hd,$document:id,$exceptionHandler:jd,$filter:zc,$interpolate:od,$interval:pd,$http:kd,$httpBackend:ld,$location:sd,$log:td,$parse:wd,$rootScope:zd,$q:xd,$sce:Dd,$sceDelegate:Cd,$sniffer:Ed,$templateCache:fd,$timeout:Fd,$window:Gd})}])})(Na);u(O).ready(function(){Rc(O,Xb)})})(window,document);!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
//# sourceMappingURL=angular.min.js.map
;/*
 AngularJS v1.2.6
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(h,e,A){'use strict';function u(w,q,k){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,c,b,f,n){function y(){l&&(l.$destroy(),l=null);g&&(k.leave(g),g=null)}function v(){var b=w.current&&w.current.locals;if(b&&b.$template){var b=a.$new(),f=w.current;g=n(b,function(d){k.enter(d,null,g||c,function(){!e.isDefined(t)||t&&!a.$eval(t)||q()});y()});l=f.scope=b;l.$emit("$viewContentLoaded");l.$eval(h)}else y()}var l,g,t=b.autoscroll,h=b.onload||"";a.$on("$routeChangeSuccess",
v);v()}}}function z(e,h,k){return{restrict:"ECA",priority:-400,link:function(a,c){var b=k.current,f=b.locals;c.html(f.$template);var n=e(c.contents());b.controller&&(f.$scope=a,f=h(b.controller,f),b.controllerAs&&(a[b.controllerAs]=f),c.data("$ngControllerController",f),c.children().data("$ngControllerController",f));n(a)}}}h=e.module("ngRoute",["ng"]).provider("$route",function(){function h(a,c){return e.extend(new (e.extend(function(){},{prototype:a})),c)}function q(a,e){var b=e.caseInsensitiveMatch,
f={originalPath:a,regexp:a},h=f.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?|\*])?/g,function(a,e,b,c){a="?"===c?c:null;c="*"===c?c:null;h.push({name:b,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(c&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");f.regexp=RegExp("^"+a+"$",b?"i":"");return f}var k={};this.when=function(a,c){k[a]=e.extend({reloadOnSearch:!0},c,a&&q(a,c));if(a){var b="/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";k[b]=e.extend({redirectTo:a},
q(b,c))}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache","$sce",function(a,c,b,f,n,q,v,l){function g(){var d=t(),m=r.current;if(d&&m&&d.$$route===m.$$route&&e.equals(d.pathParams,m.pathParams)&&!d.reloadOnSearch&&!x)m.params=d.params,e.copy(m.params,b),a.$broadcast("$routeUpdate",m);else if(d||m)x=!1,a.$broadcast("$routeChangeStart",d,m),(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?
c.path(u(d.redirectTo,d.params)).search(d.params).replace():c.url(d.redirectTo(d.pathParams,c.path(),c.search())).replace()),f.when(d).then(function(){if(d){var a=e.extend({},d.resolve),c,b;e.forEach(a,function(d,c){a[c]=e.isString(d)?n.get(d):n.invoke(d)});e.isDefined(c=d.template)?e.isFunction(c)&&(c=c(d.params)):e.isDefined(b=d.templateUrl)&&(e.isFunction(b)&&(b=b(d.params)),b=l.getTrustedResourceUrl(b),e.isDefined(b)&&(d.loadedTemplateUrl=b,c=q.get(b,{cache:v}).then(function(a){return a.data})));
e.isDefined(c)&&(a.$template=c);return f.all(a)}}).then(function(c){d==r.current&&(d&&(d.locals=c,e.copy(d.params,b)),a.$broadcast("$routeChangeSuccess",d,m))},function(c){d==r.current&&a.$broadcast("$routeChangeError",d,m,c)})}function t(){var a,b;e.forEach(k,function(f,k){var p;if(p=!b){var s=c.path();p=f.keys;var l={};if(f.regexp)if(s=f.regexp.exec(s)){for(var g=1,q=s.length;g<q;++g){var n=p[g-1],r="string"==typeof s[g]?decodeURIComponent(s[g]):s[g];n&&r&&(l[n.name]=r)}p=l}else p=null;else p=null;
p=a=p}p&&(b=h(f,{params:e.extend({},c.search(),a),pathParams:a}),b.$$route=f)});return b||k[null]&&h(k[null],{params:{},pathParams:{}})}function u(a,c){var b=[];e.forEach((a||"").split(":"),function(a,d){if(0===d)b.push(a);else{var e=a.match(/(\w+)(.*)/),f=e[1];b.push(c[f]);b.push(e[2]||"");delete c[f]}});return b.join("")}var x=!1,r={routes:k,reload:function(){x=!0;a.$evalAsync(g)}};a.$on("$locationChangeSuccess",g);return r}]});h.provider("$routeParams",function(){this.$get=function(){return{}}});
h.directive("ngView",u);h.directive("ngView",z);u.$inject=["$route","$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map
;/*
 AngularJS v1.2.6
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(y,v,z){'use strict';function t(g,a,b){q.directive(g,["$parse","$swipe",function(l,n){var r=75,h=0.3,d=30;return function(p,m,k){function e(e){if(!u)return!1;var c=Math.abs(e.y-u.y);e=(e.x-u.x)*a;return f&&c<r&&0<e&&e>d&&c/e<h}var c=l(k[g]),u,f;n.bind(m,{start:function(e,c){u=e;f=!0},cancel:function(e){f=!1},end:function(a,f){e(a)&&p.$apply(function(){m.triggerHandler(b);c(p,{$event:f})})}})}}])}var q=v.module("ngTouch",[]);q.factory("$swipe",[function(){function g(a){var b=a.touches&&a.touches.length?
a.touches:[a];a=a.changedTouches&&a.changedTouches[0]||a.originalEvent&&a.originalEvent.changedTouches&&a.originalEvent.changedTouches[0]||b[0].originalEvent||b[0];return{x:a.clientX,y:a.clientY}}return{bind:function(a,b){var l,n,r,h,d=!1;a.on("touchstart mousedown",function(a){r=g(a);d=!0;n=l=0;h=r;b.start&&b.start(r,a)});a.on("touchcancel",function(a){d=!1;b.cancel&&b.cancel(a)});a.on("touchmove mousemove",function(a){if(d&&r){var m=g(a);l+=Math.abs(m.x-h.x);n+=Math.abs(m.y-h.y);h=m;10>l&&10>n||
(n>l?(d=!1,b.cancel&&b.cancel(a)):(a.preventDefault(),b.move&&b.move(m,a)))}});a.on("touchend mouseup",function(a){d&&(d=!1,b.end&&b.end(g(a),a))})}}}]);q.config(["$provide",function(g){g.decorator("ngClickDirective",["$delegate",function(a){a.shift();return a}])}]);q.directive("ngClick",["$parse","$timeout","$rootElement",function(g,a,b){function l(a,c,b){for(var f=0;f<a.length;f+=2)if(Math.abs(a[f]-c)<d&&Math.abs(a[f+1]-b)<d)return a.splice(f,f+2),!0;return!1}function n(a){if(!(Date.now()-m>h)){var c=
a.touches&&a.touches.length?a.touches:[a],b=c[0].clientX,c=c[0].clientY;1>b&&1>c||l(k,b,c)||(a.stopPropagation(),a.preventDefault(),a.target&&a.target.blur())}}function r(b){b=b.touches&&b.touches.length?b.touches:[b];var c=b[0].clientX,d=b[0].clientY;k.push(c,d);a(function(){for(var a=0;a<k.length;a+=2)if(k[a]==c&&k[a+1]==d){k.splice(a,a+2);break}},h,!1)}var h=2500,d=25,p="ng-click-active",m,k;return function(a,c,d){function f(){q=!1;c.removeClass(p)}var h=g(d.ngClick),q=!1,s,t,w,x;c.on("touchstart",
function(a){q=!0;s=a.target?a.target:a.srcElement;3==s.nodeType&&(s=s.parentNode);c.addClass(p);t=Date.now();a=a.touches&&a.touches.length?a.touches:[a];a=a[0].originalEvent||a[0];w=a.clientX;x=a.clientY});c.on("touchmove",function(a){f()});c.on("touchcancel",function(a){f()});c.on("touchend",function(a){var h=Date.now()-t,e=a.changedTouches&&a.changedTouches.length?a.changedTouches:a.touches&&a.touches.length?a.touches:[a],g=e[0].originalEvent||e[0],e=g.clientX,g=g.clientY,p=Math.sqrt(Math.pow(e-
w,2)+Math.pow(g-x,2));q&&(750>h&&12>p)&&(k||(b[0].addEventListener("click",n,!0),b[0].addEventListener("touchstart",r,!0),k=[]),m=Date.now(),l(k,e,g),s&&s.blur(),v.isDefined(d.disabled)&&!1!==d.disabled||c.triggerHandler("click",[a]));f()});c.onclick=function(a){};c.on("click",function(b,c){a.$apply(function(){h(a,{$event:c||b})})});c.on("mousedown",function(a){c.addClass(p)});c.on("mousemove mouseup",function(a){c.removeClass(p)})}}]);t("ngSwipeLeft",-1,"swipeleft");t("ngSwipeRight",1,"swiperight")})(window,
window.angular);;'use strict';

angular.module('geolocation',[]).constant('geolocation_msgs', {
        'errors.location.unsupportedBrowser':'Browser does not support location services',
        'errors.location.permissionDenied':'You have rejected access to your location',
        'errors.location.positionUnavailable':'Unable to determine your location',
        'errors.location.timeout':'Service timeout has been reached'
});

angular.module('geolocation')
  .factory('geolocation', ['$q','$rootScope','$window','geolocation_msgs',function ($q,$rootScope,$window,geolocation_msgs) {
    return {
      getLocation: function (opts) {
        var deferred = $q.defer();
        if ($window.navigator && $window.navigator.geolocation) {
          $window.navigator.geolocation.getCurrentPosition(function(position){
            $rootScope.$apply(function(){deferred.resolve(position);});
          }, function(error) {
            switch (error.code) {
              case 1:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.permissionDenied']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.permissionDenied']);
                });
                break;
              case 2:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.positionUnavailable']);
                });
                break;
              case 3:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.timeout']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.timeout']);
                });
                break;
            }
          }, opts);
        }
        else
        {
          $rootScope.$broadcast('error',geolocation_msgs['errors.location.unsupportedBrowser']);
          $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);});
        }
        return deferred.promise;
      }
    };
}]);
;angular.module('atlas', [
  'ngRoute',
  'chieffancypants.loadingBar',
  'ngTouch',
  'geolocation'
]);;'use strict';
angular.module('atlas')
    .constant('DEFAULT_CITY_ID', 1)
    .constant('IMAGE_PREFIX', 'http://7xnjcb.com1.z0.glb.clouddn.com/')
    .constant('API_PREFIX', (navigator.userAgent.indexOf("MSIE") > -1 ? window.location.pathname.split( '/' )[0] : window.location.origin))
    // .constant('API_PREFIX', 'http://ap.atlasyun.com')
    .run(['$rootScope', 'cfpLoadingBar', '$location', 'geolocation', 'Localstorage', '$route', 'global',
        function($rootScope, cfpLoadingBar, $location, geolocation, Localstorage, $route, global) {
            $rootScope.$on('$routeChangeStart', function() {
                cfpLoadingBar.start();
            });
            $rootScope.$on('$routeChangeError', function() {
                $location.path('/');
                cfpLoadingBar.complete();
            });

            $rootScope.$on('$viewContentLoaded', function() {
                cfpLoadingBar.complete();
            });
            $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute) {
                $rootScope.title = $route.current.title;
            });

            //get gps location
            geolocation.getLocation()
                .then(function(data) {
                    if (data) {
                        Localstorage.setGPS(data.coords.latitude, data.coords.longitude);
                    }
                })
                .finally(function(data) {
                    if (data) {
                        Localstorage.setGPS(data.coords.latitude, data.coords.longitude);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    ]);;'use strict';

angular.module('atlas')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/home/:cityid', {
          templateUrl: 'partials/home.html',
          controller: 'homeCtrl',
          title: '商场通',
          resolve: {
            malls: ['Malls', '$route',
              function(Malls, $route) {
                var cityid = $route.current.params.cityid;
                return Malls.fetch(cityid);
              }
            ],
            wxCollect :['WxCollect', '$route',
              function(WxCollect, $route){
                var uid = $route.current.params.uid;
                return WxCollect.fetch(uid);
              }
            ]
          }
        })
        .when('/building/:cityid/:bid', {
          templateUrl: 'partials/building.html',
          controller: 'buildingCtrl',
          resolve: {
            building: ['Building', '$route',
              function(Building, $route) {
                var cityid = $route.current.params.cityid;
                var bid = $route.current.params.bid;
                return Building.fetch(bid,cityid);
              }
            ]
          }
        })
        .when('/shop/:cityid/:sid', {
          templateUrl: 'partials/shop.html',
          controller: 'shopCtrl',
          resolve: {
            shop: ['Shop', '$route',
              function(Shop, $route) {
                var cityid = $route.current.params.cityid;
                var sid = $route.current.params.sid;
                return Shop.fetch(sid,cityid);
              }
            ]
          }
        })
        .when('/search/:cityid/:keyword/:p?', {
          templateUrl: 'partials/search.html',
          controller: 'searchCtrl',
          resolve: {
            searchAll: ['Search', '$route',
              function(Search, $route) {
                var keyword = encodeURIComponent($route.current.params.keyword);
                var page = $route.current.params.p;
                var cityid = $route.current.params.cityid;
                return Search.searchAll(keyword, page, cityid);
              }
            ],
            searchNext: ['Search', '$route',
              function(Search, $route) {
                var keyword = encodeURIComponent($route.current.params.keyword);
                var page = $route.current.params.p;
                var cityid = $route.current.params.cityid;
                return Search.searchNext(keyword, page, cityid);
              }
            ]
          }
        })
        .when('/hotkey/:keyword', {
          templateUrl: 'partials/hotkey.html',
          controller: 'hotkeyCtrl',
          resolve: {
            searchHotkey: ['Hotkey', '$route',
              function(Hotkey, $route) {
                var keyword = $route.current.params.keyword;
                return Hotkey.searchHotkey(keyword);
              }
            ]
          }
        })
        .when('/brand/:cityid/:keyword', {
          templateUrl: 'partials/brand.html',
          controller: 'brandCtrl',
          resolve: {
            searchBrand: ['Brand', '$route',
              function(Brand, $route) {
                var keyword = $route.current.params.keyword;
                var cityid = $route.current.params.cityid;
                return Brand.searchBrand(keyword, cityid);
              }
            ]
          }
        })
        .when('/searchinmall/:cityid/:mallId/:keyword', {
          templateUrl: 'partials/searchinmall.html',
          controller: 'searchInMallCtrl',
          resolve: {
            searchMall: ['Searchinmall', '$route',
              function(Searchinmall, $route) {
                var keyword = $route.current.params.keyword;
                var mallId = $route.current.params.mallId;
                var cityid = $route.current.params.cityid;
                return Searchinmall.searchMall(mallId, keyword, cityid);
              }
            ]
          }
        })
        .when('/map/:parentId?/:floorId?/:shopId?', {
          templateUrl: 'partials/newMap.html',
          controller: 'newMapCtrl',
          resolve: {
            mapBuilding: ['MapOfBuilding', '$route',
              function(MapOfBuilding, $route) {
                var buildingId = $route.current.params.parentId.split('&')[1];
                return MapOfBuilding.mapBuilding(buildingId);
              }
            ],
            shopsOfMall: ['MapOfBuilding', '$route', function(MapOfBuilding, $route) {
              var mallId = $route.current.params.parentId.split('&')[0];
              return MapOfBuilding.shopsOfMall(mallId);
            }]
          }
        })
        .when('/malltag/:cityid/:buildingid/:keyword', {
          templateUrl: 'partials/malltag.html',
          controller: 'mallTagCtrl',
          resolve: {
            mallProd: ['Prods', '$route',
              function(Prods, $route) {
                var cityid = $route.current.params.cityid;
                var buildingid = $route.current.params.buildingid;
                var keyword = $route.current.params.keyword;
                return Prods.fetch(buildingid, keyword, cityid);
              }
            ]
          }
        })
        .when('/coupon', {
          templateUrl: 'partials/coupon.html',
          controller: 'couponCtrl'
        })
        .when('/mycollect', {
          templateUrl: 'partials/mycollect.html',
          controller: 'mycollectCtrl'
        })
        .when('/go', {
          templateUrl: 'partials/go.html',
          controller: 'goCtrl'
        })
        .when('/category/:bid/:cityid', {
          templateUrl: 'partials/category.html',
          controller: 'categoryCtr',
          resolve: {
            building: ['Building', '$route',
              function(Building, $route) {
                var cityid = $route.current.params.cityid;
                var bid = $route.current.params.bid;
                return Building.fetch(bid,cityid);
              }
            ]
          }
        })
        .when('/outdoormap', {
          templateUrl: 'partials/outdoormap.html',
          controller: 'outdoormapCtrl'
        })
        .when('/submit', {
          templateUrl: 'partials/submit.html',
          controller: 'submitCtrl'
        })
        .otherwise({
          redirectTo: '/home/53d5e4c85620fa7f111a3f67'
        });
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('homeCtrl', ['$scope', 'API_PREFIX', 'wxCollect', '$http', '$timeout', 'CityList', 'IMAGE_PREFIX', '$routeParams', 'Hotkey', 'malls', 'Search', 'Localstorage', '$location', '$filter', 'Brand', 'Districts', '$window', '$anchorScroll', 'Subway', '$route','global',
    function($scope, API_PREFIX, wxCollect, $http, $timeout, CityList, IMAGE_PREFIX, $routeParams, Hotkey, malls, Search, Localstorage, $location, $filter, Brand, Districts, $window, $anchorScroll, Subway, $route,global) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.showiconnotice = false;
      var gps = $filter('gps');
      for (var i in malls) {
        malls[i].location = gps(malls[i].loc);
      }

      $scope.cityId = $route.current.params.cityid;

      $scope.toogleLikeBuilding = function(building) {

        if ($route.current.params.uid) {
          if (building.likeImg === './img/icon-heart-whitebuilding.png') {
            var data = {
              poi_id: building.poi_id,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid + '/' + building.poi_id,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };
        } else {
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };

          var storeBuilding = {};
          storeBuilding.id = building.poi_id;
          storeBuilding.ch_name = building.ch_name;
          storeBuilding.img = building.buildings[0].pics[0].key;
          storeBuilding.cityid = $route.current.params.cityid;
          Localstorage.toogleLikeBuilding(storeBuilding);
        }
      };

      $scope.toogleLikeBuildingLike = function(building) {
        if ($route.current.params.uid) {
          if (building.likeImg === './img/icon-heart-whitebuilding.png') {
            var data = {
              poi_id: building.poi_id,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid + '/' + building.poi_id,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };
          for (var i = $scope.likeMalls.length - 1; i >= 0; i--) {
            if ($scope.likeMalls[i].poi_id === building.poi_id) {
              if ($scope.likeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.likeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.likeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            }
          };
        } else {
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };
          for (var i = $scope.likeMalls.length - 1; i >= 0; i--) {
            if ($scope.likeMalls[i].poi_id === building.poi_id) {
              if ($scope.likeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.likeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.likeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            }
          };
        };

        var storeBuilding = {};
        storeBuilding.id = building.poi_id;
        storeBuilding.ch_name = building.ch_name;
        storeBuilding.img = building.buildings[0].pics[0].key;
        storeBuilding.cityid = $route.current.params.cityid;
        Localstorage.toogleLikeBuilding(storeBuilding);
      };

      //排序算法
      function sortMall(mallArr) {
        if (!mallArr.length) {
          return [];
        }
        for (var i in mallArr) {
          //不需要排序的情况
          if (!mallArr[i].location || mallArr[i].location === '--') {
            return mallArr;
          }
          mallArr = mallArr.sort(function(a, b) {
            return a.location * 1 - b.location * 1;
          });
          return mallArr;
        }
      }

      $scope.likeShop = Localstorage.getLike().shops;
      $scope.likeBuilding = Localstorage.getLike().buildings;
      // console.log($scope.likeShop);
      // console.log($scope.likeBuilding);
      if (isEmpty($scope.likeBuilding)) {
        $scope.IsLikeBuildingEmpty = true;
      } else {
        $scope.IsLikeBuildingEmpty = false;
      }
      if (isEmpty($scope.likeShop)) {
        $scope.IsLikeShopEmpty = true;
      } else {
        $scope.IsLikeShopEmpty = false;
      }

      $scope.homesearchgomap = function(mallid, buildingid, floorid, shopid) {
        $location.path('/map/' + mallid + '&' + buildingid + '/' + floorid + '/' + shopid);
      }
      $scope.homesearchgoshop = function(shopid) {
        $location.path('/shop/' + $scope.cityId + '/' + shopid);
      }

      // console.log(wxCollect)
      function getMallIds(malls){
        var likeBd = {};
        malls.forEach(function(mall){
          likeBd[mall.poi_id] = mall;
        });
        return likeBd;
      }

      function getSortMall(malls, Localstorage) {
        var likeBd;
        if (!wxCollect) {
          likeBd = Localstorage.getLike().buildings;
        } else {
          likeBd = getMallIds(wxCollect.data.malls);
        }
        // console.log(Localstorage.getLike().buildings)
        // console.log(likeBd)
         
          var unSortMalls = malls,
          likeMalls = [],
          unLikeMalls = [],
          sortedMall;

        if (!Object.keys(likeBd).length) {
          return {
            likeMalls: sortMall(likeMalls),
            unLikeMalls: sortMall(malls),
            sortedMall: sortMall(malls)
          };
        }

        for (var i in unSortMalls) {
          if (unSortMalls[i].poi_id in likeBd) {
            likeMalls.push(unSortMalls[i]);
          } else {
            unLikeMalls.push(unSortMalls[i]);
          }
        }

        if (!likeMalls.length || !unLikeMalls.length) {
          return {
            likeMalls: sortMall(likeMalls),
            unLikeMalls: sortMall(unLikeMalls),
            sortedMall: sortMall(malls)
          };
        }

        likeMalls = sortMall(likeMalls);
        unLikeMalls = sortMall(unLikeMalls);
        sortedMall = likeMalls.concat(unLikeMalls);
        return {
          likeMalls: likeMalls,
          unLikeMalls: unLikeMalls,
          sortedMall: sortedMall
        };
      }

      Hotkey.fetch().then(function(hotkey) {
        $scope.hotkey = hotkey.data.keys;
        // console.log($scope.hotkey);
      });

      Brand.fetch().then(function(brand) {
        $scope.brand = brand.data;
        // console.log($scope.brand);
      });

      // console.log($scope.WxCollect.malls);

      Subway.fetch($scope.cityId).then(function(subway) {
        $scope.subway = subway.data;
        for (i in $scope.subway) {
          $scope.subway[i].num = $scope.subway[i]._id.replace(/[^0-9]/ig, "");
        }
        // console.log($scope.subway);

        function sortSubway(mallArr) {
          if (!mallArr.length) {
            return [];
          }
          for (var i in mallArr) {
            mallArr = mallArr.sort(function(a, b) {
              return a.num - b.num;
            });
            return mallArr;
          }
        }
        for (var i in $scope.subway) {
          var sortedShop;
          $scope.sortedShop = sortSubway($scope.subway);
        }
      });

      $scope.showMore = false;
      var sortMall = getSortMall(malls, Localstorage);
      $scope.likeMalls = sortMall.likeMalls;
      $scope.unLikeMalls = sortMall.unLikeMalls;
      $scope.unLikeMalls.forEach(function(unLikeMall) {
        unLikeMall.likeImg = './img/icon-heart-whitebuilding.png';
      });

      $scope.likeMalls.forEach(function(likeMall) {
        likeMall.likeImg = './img/icon-heart-redbuilding.png';
      });
      $scope.gotoMall = function(poi_id) {
        hashmall(poi_id);
        $timeout(function() {
          document.getElementById("content").scrollTop = document.getElementById("content").scrollTop - 50;
        }, 500);
      }

      function hashmall(poi_id) {
        var old = $location.hash();
        $location.hash(poi_id);

        $anchorScroll();
        $location.hash(old);
        for (var i in $scope.unLikeMalls) {
          if ($scope.unLikeMalls[i].poi_id === poi_id) {
            $scope.unLikeMalls[i].isOpen = true;
          };
        }
        snapper.close();
      }
      // console.log($scope.unLikeMalls);

      $scope.sortedMall = sortMall.sortedMall;

      $scope.homeLeftPath = '/partials/slider/home-profile.html';
      $scope.enterCollect = function() {
        $scope.like = Localstorage.getLike();
        // console.log($scope.like);
      };
      $scope.showHistory = false;
      $scope.search = function(kword) {
        var keyword = kword;
        if (keyword) {
          // var searchhis = Localstorage.getSearchHis();
          // searchhis.push(keyword);
          // searchhis = searchhis.slice(-10);
          // Localstorage.setSearchHis(searchhis);
          $location.path('/search/' + $scope.cityId + '/' + keyword + '/1');
        }
      };
      $scope.entersearch = function(event, keyword) {
        if (event.keyCode === 13) {
          $scope.search(keyword.toLowerCase());
        }
      }
      $scope.loadMore = function() {
        // console.log(1);
      };

      $scope.showcollect = true;
      $scope.toggleCollect = function() {
        $scope.showcollect = !$scope.showcollect;
        $scope.like = Localstorage.getLike();
        $scope.likeLength = {};
        $scope.likeLength.buildings = Object.keys($scope.like.buildings).length;
        $scope.likeLength.shops = Object.keys($scope.like.shops).length;
      };

      $scope.removeSerachHis = function() {
        Localstorage.removeSearchHis();
        $scope.showSeachHis = [];
      };

      $scope.showSeachHis = Localstorage.getSearchHis().reverse();

      for (var i in $scope.likeMalls) {
        $scope.likeMalls[i].isOpen = false;
      }
      $scope.changelikeCardOpen = function(index) {
        $scope.likeMalls[index].isOpen = !$scope.likeMalls[index].isOpen;
      };

      for (var i in $scope.unLikeMalls) {
        $scope.unLikeMalls[i].isOpen = false;
      }

      $scope.changeCardOpen = function(index) {
        $scope.unLikeMalls[index].isOpen = !$scope.unLikeMalls[index].isOpen;
      };

      for (var i in $scope.brand) {
        $scope.brand[i].isOpen = false;
      }
      $scope.changeOpen = function(index) {
        $scope.brand[index].isOpen = !$scope.brand[index].isOpen;
      };

      for (var i in $scope.subway) {
        $scope.subway[i].isOpen = false;
      }
      $scope.changeSubOpen = function(index) {
        $scope.subway[index].isOpen = !$scope.subway[index].isOpen;
      };

      for (var i in $scope.districts) {
        $scope.districts[i].isOpen = false;
      }
      $scope.changeDisOpen = function(index) {
        $scope.districts[index].isOpen = !$scope.districts[index].isOpen;
      };

      $scope.changeTag = function(tag) {
        $scope.tag = tag;
      }

      $scope.searchBuildings = malls;
      $scope.searchShops = [];
      $scope.tag = 'mall';

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        document.getElementById("right-drawer").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通");
        CityList.fetch().then(function(citylist) {
          $scope.citylist = citylist.data;
          // console.log($scope.citylist);
          for (var i in $scope.citylist) {
            // console.log($scope.citylist[i]._id);
            if ($scope.citylist[i]._id === $scope.cityId) {
              $scope.CityName = $scope.citylist[i].name;
              // console.log($scope.CityName);
            }
          }
        });
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        document.getElementById("right-drawer").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        document.getElementById("right-drawer").style.height = allheight + "px";
      });
      angular.element(document).ready(function() {
        var mallid = $route.current.params.mallid;
        hashmall(mallid);
      });

      var addEvent = function addEvent(element, eventName, func) {
        if (element.addEventListener) {
          return element.addEventListener(eventName, func, false);
        } else if (element.attachEvent) {
          return element.attachEvent("on" + eventName, func);
        }
      };
      var snapper = new Snap({
        element: document.getElementById('map-body'),
        maxPosition: 265,
        minPosition: -265,
        disable: 'left'
      });
      addEvent(document.getElementById('showRightPush'), 'click', function() {
        if (snapper.state().state == "right") {
          snapper.close();
        } else {
          snapper.open('right');
        }
      });

      function isEmpty(obj) {
        for (var name in obj) {
          return false;
        }
        return true;
      };
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('buildingCtrl', ['$scope', 'global', 'API_PREFIX', '$http', '$route', '$location', '$filter', 'building', 'Localstorage', '$window', '$timeout',
    function($scope, global , API_PREFIX, $http, $route, $location, $filter, building, Localstorage, $window, $timeout) {
      
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      $scope.swipegoback = function() {
        history.go(-1);
      };

      var catebpid;
      var searchhis;
      $scope.searchhis = Localstorage.getSearchHis();
      console.log($scope.searchhis);
      $scope.showHis = false;
      $scope.showHisGo = false;

      $scope.cityId = $route.current.params.cityid;

      $scope.searchmall = function(kword) {
        var keyword = encodeURIComponent(kword);
        var mallid = $scope.catebpid;
        console.log(keyword)
        if (keyword) {
          var searchhis = Localstorage.getSearchHis();
          searchhis.push(keyword);
          searchhis = searchhis.slice(-7);
          Localstorage.setSearchHis(searchhis);
          $location.path('/searchinmall/' + $scope.cityId + '/' + mallid + '/' + keyword);
        }
      };
      $scope.entersearch = function(event, keyword) {
        if (event.keyCode === 13) {
          var searchhis = Localstorage.getSearchHis();
          searchhis.push(keyword);
          searchhis = searchhis.slice(-7);
          Localstorage.setSearchHis(searchhis);
          $scope.searchmall(keyword.toLowerCase());
        }
      }
      $scope.catebpid = building.poi_id;
      $scope.ngBlurHis = function() {
        $timeout(function() {
          $scope.showHis = false;
        }, 100);
      }

      var gps = $filter('gps');
      for (var i in building) {
        building.location = gps(building.loc);
      }

      $scope.building = building;
      $scope.floors = building.buildings[0].floors;
      console.log($scope.building);
      $scope.showNotice = false;

      function showNotice(content) {
        $scope.noticeContent = content;
        $scope.showNotice = true;
        $timeout(function() {
          $scope.showNotice = false;
        }, 1000);
      }
      if (building.buildings[0].pics.length != 0) {
        var storeBuilding = {};
        storeBuilding.id = building.poi_id;
        storeBuilding.ch_name = building.ch_name;
        storeBuilding.img = building.buildings[0].pics[0].key;
        $scope.isLike = Localstorage.isLikeBuilding(storeBuilding);
      } else {
        var storeBuilding = {};
        storeBuilding.id = building.poi_id;
        storeBuilding.ch_name = building.ch_name;
        storeBuilding.img = './img/1.jpg';
        $scope.isLike = Localstorage.isLikeBuilding(storeBuilding);
      }


      $scope.toogleLikeBuilding = function(building) {
        if (global.uid) {
          $scope.isLike = !$scope.isLike;
          if ($scope.isLike === true) {
            var data = {
              poi_id: $route.current.params.bid,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/malls/' + global.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/malls/' + global.uid + '/' + $route.current.params.bid,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
          console.log($scope.isLike);
        } else {
          $scope.isLike = !$scope.isLike;
          var storeBuilding = {};
          storeBuilding.id = building.poi_id;
          storeBuilding.cityid = $route.current.params.cityid;
          storeBuilding.ch_name = building.ch_name;
          storeBuilding.img = building.buildings[0].pics[0].key;
          Localstorage.toogleLikeBuilding(storeBuilding);
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
        }


        // $scope.isLike = !$scope.isLike;
        // var storeBuilding = {};
        // storeBuilding.id = building.poi_id;
        // storeBuilding.ch_name = building.ch_name;
        // storeBuilding.img = building.buildings[0].pics[0].key;
        // Localstorage.toogleLikeBuilding(storeBuilding);
        // var content;
        // if ($scope.isLike) {
        //   content = "收藏成功";
        // } else {
        //   content = "取消收藏";
        // };
        // showNotice(content);
      };

      $scope.Gohistoryback = function() {
        $window.history.back();
      };

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.building.ch_name;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('shopCtrl', ['$scope', 'global', 'API_PREFIX', 'WxCollect', 'shop', 'Shop', 'Localstorage', '$timeout', '$http', '$route', '$location', '$window',
    function($scope, global, API_PREFIX, WxCollect, shop, Shop, Localstorage, $timeout, $http, $route, $location, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.shop = shop;
      $scope.cityId = $route.current.params.cityid;
      console.log(shop);

      var storeShop = {};
      storeShop.id = $scope.shop.poi_id;
      storeShop.ch_name = $scope.shop.ch_name;
      storeShop.cityid = $route.current.params.cityid;
      storeShop.buildingname = $scope.shop.building.ch_name;
      storeShop.floorname = $scope.shop.floor.ch_name;
      storeShop.mallid = $scope.shop.mall.poi_id;
      storeShop.buildingid = $scope.shop.building.poi_id;
      storeShop.floorid = $scope.shop.floor.poi_id;
      if ($scope.shop.logo) {
        var storeShop = {};
        storeShop.id = $scope.shop.poi_id;
        storeShop.ch_name = $scope.shop.ch_name;
        storeShop.cityid = $route.current.params.cityid;
        storeShop.buildingname = $scope.shop.building.ch_name;
        storeShop.floorname = $scope.shop.floor.ch_name;
        storeShop.mallid = $scope.shop.mall.poi_id;
        storeShop.buildingid = $scope.shop.building.poi_id;
        storeShop.floorid = $scope.shop.floor.poi_id;
        storeShop.img = $scope.shop.logo.key;
      } else {
        var storeShop = {};
        storeShop.id = $scope.shop.poi_id;
        storeShop.ch_name = $scope.shop.ch_name;
        storeShop.cityid = $route.current.params.cityid;
        storeShop.buildingname = $scope.shop.building.ch_name;
        storeShop.floorname = $scope.shop.floor.ch_name;
        storeShop.mallid = $scope.shop.mall.poi_id;
        storeShop.buildingid = $scope.shop.building.poi_id;
        storeShop.floorid = $scope.shop.floor.poi_id;
        storeShop.img = '';
      }

      console.log($scope.isLike)
      $scope.showNotice = false;

      function showNotice(content) {
        $scope.noticeContent = content;
        $scope.showNotice = true;
        $timeout(function() {
          $scope.showNotice = false;
        }, 1000);
      }

      if (global.uid) {
        $http({
          method: 'GET',
          url: API_PREFIX + '/api_test/favorite/' + global.uid
        }).success(function(data) {
          $scope.wxcollect = data;
          console.log($scope.wxcollect.shops)

          function findwxshop(storeshop) {
            var isLike = false;
            for (var i in storeshop) {
              if ($scope.shop.poi_id === storeshop[i].poi_id) {
                isLike = true;
              }
            }
            return isLike;
          }
          $scope.isLike = Localstorage.isLikeShop(storeShop) || findwxshop($scope.wxcollect.shops);
        });
      } else {
        $scope.isLike = Localstorage.isLikeShop(storeShop);
      }


      $scope.toogleLike = function(shop) {
        if (global.uid) {
          $scope.isLike = !$scope.isLike;
          if ($scope.isLike === true) {
            var data = {
              poi_id: $route.current.params.sid,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/shops/' + global.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/shops/' + global.uid + '/' + $route.current.params.sid,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
          console.log($scope.isLike);
        } else {
          $scope.isLike = !$scope.isLike;
          var storeShop = {};
          storeShop.id = shop.poi_id;
          storeShop.ch_name = shop.ch_name;
          storeShop.img = $scope.shop.logo.key;
          storeShop.cityid = $route.current.params.cityid;
          storeShop.buildingname = shop.building.ch_name;
          storeShop.floorname = shop.floor.ch_name;
          storeShop.mallid = shop.mall.poi_id;
          storeShop.buildingid = shop.building.poi_id;
          storeShop.floorid = shop.floor.poi_id;
          Localstorage.toogleLikeShop(storeShop);
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
        }
      };
      console.log(encodeURIComponent("http://dpurl.cn/p/ie-qVhFlVm"));
      console.log(decodeURIComponent(encodeURIComponent("http://dpurl.cn/p/ie-qVhFlVm")));
      $scope.showcoupon = false;

      $scope.encodeURIComponent = function(val) {
        return encodeURIComponent(val);
      };
      var nullnick = function(nickname) {
        if (nickname) {
          return nickname;
        } else {
          return '匿名用户';
        }
      }
      $scope.postcomment = function(spid) {
        if ($scope.userComment) {
          $http({
              method: 'POST',
              url: API_PREFIX + '/api/comment/' + $scope.cityId,
              data: $.param({
                poi_id: spid,
                user_nickname: nullnick($scope.userNickname),
                text_excerpt: $scope.userComment,
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .success(function(data) {
              Shop.fetch($route.current.params.sid).then(function(data) {
                $scope.shop.comments = data.comments;
              });
              $scope.userComment = '';
              $scope.userNickname = '';
            });
        } else {}
      };
      $scope.showMarquee = false;
      var shopNavWidth = document.getElementById("shop_nav").offsetWidth * 0.8;
      var shopHWidth = document.getElementById("shop_h1").offsetWidth;

      $scope.showconsole = function() {
        console.log($('.comment-inpost-nickname').val())
      }
      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("shop-allcontainer").style.height = allheight + "px";
        document.getElementById("shop-body-con").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.shop.building.ch_name + $scope.shop.ch_name;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("shop-allcontainer").style.height = allheight + "px";
        document.getElementById("shop-body-con").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("shop-allcontainer").style.height = allheight + "px";
        document.getElementById("shop-body-con").style.height = allheight + "px";
      });
    }
  ]);;'use strict';

angular
	.module('atlas')
	.controller('collectCtr', ['$scope', 'Localstorage', '$window',
		function($scope, Localstorage, $window) {
			$scope.like = Localstorage.getLike();
			
			$scope.$on('$viewContentLoaded', function() {
				var allheight = document.body.offsetHeight;
				document.getElementById("content").style.height = allheight + "px";
				$window.document.title = "我的收藏";
			});
			$scope.$watch('$viewContentLoaded', function() {
				var allheight = document.body.offsetHeight;
				document.getElementById("content").style.height = allheight + "px";
			});
			window.addEventListener("resize", function() {
				var allheight = document.body.offsetHeight;
				document.getElementById("content").style.height = allheight + "px";
			});
		}
	]);;'use strict';

angular
  .module('atlas')
  .controller('searchCtrl', ['$scope', 'global','Localstorage', 'searchNext', 'searchAll', '$route', '$sce', '$filter', '$window',
    function($scope, global, Localstorage, searchNext, searchAll, $route, $sce, $filter, $window) {

      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      $scope.swipegoback = function() {
        history.go(-1);
      };
      $scope.cityId = $route.current.params.cityid;
      $scope.kword = decodeURIComponent($route.current.params.keyword);
      $scope.pagedown = parseInt($route.current.params.p) + 1;
      $scope.pageup = parseInt($route.current.params.p) - 1;

      $scope.searchAll = searchAll.data;
      $scope.searchNext = searchNext.data;
      // console.log($scope.searchAll.shops)
      // console.log($scope.searchNext.shops)

      $scope.pagination_down = true;
      $scope.pagination_up = true;
      if ($scope.pageup < 1) {
        $scope.pagination_up = false;
      }
      console.log($scope.searchNext.shops.length == 0);
      if ($scope.searchNext.shops.length == 0) {
        $scope.pagination_down = false;
      }

      var gps = $filter('gps');
      for (var i in $scope.searchAll.shops) {
        $scope.searchAll.shops[i].location = gps($scope.searchAll.shops[i].loc);
        console.log($scope.searchAll.shops[i].location)
      }
      for (var i in $scope.searchAll.malls) {
        $scope.searchAll.malls[i].location = gps($scope.searchAll.malls[i].loc);
        console.log($scope.searchAll.malls[i].location)
      }
      sortSearchshop($scope.searchAll.shops);
      sortSearchshop($scope.searchAll.malls);

      function sortSearchshop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          //不需要排序的情况
          if (!shopArr[i].location || shopArr[i].location === '--') {
            return shopArr;
          }
          shopArr = shopArr.sort(function(a, b) {
            return a.location * 1 - b.location * 1;
          });
          return shopArr;
        }
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.kword;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });

      function sortShop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          shopArr = shopArr.sort(function(a, b) {
            return b.hasCoupon * 1 - a.hasCoupon * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.searchAll.shops) {
        var shops = $scope.searchAll.shops;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }

      function isEmpty(obj) {
        for (var name in obj) {
          return false;
        }
        return true;
      };
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('hotkeyCtrl', ['$scope', 'global', 'Localstorage', 'searchHotkey', '$route', 'Hotkey', '$window',
    function($scope, global, Localstorage, searchHotkey, $route, Hotkey, $window) {
      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
        $scope.tabType = type;
      };

      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.swipegoback = function() {
        history.go(-1);
      };
      $scope.searchHotkey = searchHotkey.data;

      console.log($scope.searchHotkey);
      $scope.kword = $route.current.params.keyword;
      $scope.hPoi_id = $route.current.params.pid;

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通")+ " " + $route.current.params.keyword;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });

      function sortShop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          shopArr = shopArr.sort(function(a, b) {
            return b.hasCoupon * 1 - a.hasCoupon * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.searchHotkey) {
        var shops = $scope.searchHotkey;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('brandCtrl', ['$scope', 'global', 'Localstorage', 'searchBrand', '$route', '$filter', '$window',
    function($scope, global, Localstorage, searchBrand, $route, $filter, $window) {
      $scope.swipegoback = function() {
        history.go(-1);
      };
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      // console.log(searchBrand);
      $scope.searchBrand = searchBrand.data;
      $scope.kword = $route.current.params.keyword;
      $scope.bname = $route.current.params.name;
      $scope.cityId = $route.current.params.cityid;

      var gps = $filter('gps');
      for (var i in $scope.searchBrand) {
        $scope.searchBrand[i].location = gps($scope.searchBrand[i].loc);
      }

      function sortBrandshop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          //不需要排序的情况
          if (!shopArr[i].location || shopArr[i].location === '--') {
            return mallArr;
          }
          shopArr = shopArr.sort(function(a, b) {
            return a.location * 1 - b.location * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.searchBrand) {
        var shops = $scope.searchBrand;
        var sortedShop;
        $scope.sortedShop = sortBrandshop(shops);
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title =  ($scope.htmlTitle || "商场通") + " " + $scope.bname;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('searchInMallCtrl', ['$scope', 'global', 'searchMall', '$route', '$window',
    function($scope, global, searchMall, $route, $window) {

      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      $scope.swipegoback = function() {
        history.go(-1);
      };
      $scope.cityId = $route.current.params.cityid;
      $scope.searchMall = searchMall.data;
      $scope.kword = $route.current.params.keyword;
      $scope.mpoiid = $route.current.params.mallId;

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.kword;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });

      function sortShop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          shopArr = shopArr.sort(function(a, b) {
            return b.hasCoupon * 1 - a.hasCoupon * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.searchMall) {
        var shops = $scope.searchMall;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('couponCtrl', ['$scope', 'global', '$route', '$sce', '$location', '$window',
    function($scope, global, $route, $sce, $location, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.couponUrl = $sce.trustAsResourceUrl($route.current.params.url);
      $scope.couponShopname = $route.current.params.shopname;

      var mallid = $route.current.params.mallid;
      var buildingid = $route.current.params.buildingid;
      var floorid = $route.current.params.floorid;
      var shopid = $route.current.params.shopid;
      var mallname = $route.current.params.mallname;

      var couponindoormap = '/newMap/indoorMap.html?' + mallid + '&' + buildingid + '/' + floorid + '/' + shopid + '?mallname=' + mallname;
      $scope.couponindoormap = couponindoormap;
      console.log(couponindoormap);

      $scope.$on('$viewContentLoaded', function() {
        var allheight = window.screen.availHeight;
        document.getElementById("couponiframe").style.height = allheight + "px";

        var url = location.href;
        console.log(url);
        if (!$route.current.params.reflash) {
          url = location.href + '&reflash=1';
          console.log(url)
          window.location.href = url;
          location.reload();
        }
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("couponiframe").style.height = allheight + "px";
        $window.document.title = ($sope.htmlTitle || "商场通") + " " + $route.current.params.mallname + $route.current.params.shopname + " 团购";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("couponiframe").style.height = allheight + "px";
      });
    }
  ]);;;'use strict';

angular
  .module('atlas')
  .controller('outdoormapCtrl', ['$scope', '$window',
    function($scope, $window) {
      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
          $scope.tabType = type;
        }
        // 步行路线


    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('categoryCtr', ['$scope', 'global', '$timeout', 'Localstorage', '$route', 'building', '$location', '$window',
    function($scope, global, $timeout, Localstorage, $route, building, $location, $window) {
      $scope.building = building;
      // console.log('------------')
      // console.log(building)
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      // console.log(like);
      $scope.cityId = $route.current.params.cityid;
      var catebpid;
      var searchhis;
      $scope.searchhis = Localstorage.getSearchHis();
      // console.log($scope.searchhis);
      $scope.showHis = false;
      $scope.searchmall = function(kword) {
        var keyword = encodeURIComponent(kword);
        var mallid = $scope.catebpid;
        // console.log(keyword)
        if (keyword) {
          var searchhis = Localstorage.getSearchHis();
          searchhis.push(keyword);
          searchhis = searchhis.slice(-7);
          Localstorage.setSearchHis(searchhis);
          $location.path('/searchinmall/' + $scope.cityId + '/' + mallid + '/' + keyword);
        }
      };
      $scope.entersearch = function(event, keyword) {
        if (event.keyCode === 13) {
          $scope.searchmall(keyword.toLowerCase());
          if (keyword) {
            var searchhis = Localstorage.getSearchHis();
            searchhis.push(keyword);
            searchhis = searchhis.slice(-7);
            Localstorage.setSearchHis(searchhis);
            $location.path('/searchinmall/' + mallid + '/' + keyword);
          }
        }
      }
      $scope.catebpid = $route.current.params.bid;
      $scope.cityId = $route.current.params.cityid;
      $scope.ngBlurHis = function() {
        $timeout(function() {
          $scope.showHis = false;
        }, 100);
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.building.ch_name + " 商户分类";
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('eatCtrl', ['$scope', 'global', 'searchHotkey', '$route','$window',
    function($scope, global, searchHotkey, $route, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $window.document.title = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
        $scope.tabType = type;
      };
      console.log(searchHotkey);
      $scope.searchHotkey = searchHotkey.data;
      $scope.kword = $route.current.params.keyword;
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('submitCtrl', ['$scope', 'global', 'Localstorage', '$route', '$http', '$timeout',
    function($scope, global, Localstorage, $route, $http, $timeout) {
      $scope.postcomment = function() {

        $scope.thisuid = null;
        if (!global.uid) {
          global.uid = $route.current.params.uid;
          $scope.thisuid = global.uid;
        };
        var spid = $route.current.params.sid;
        var cityId = $route.current.params.cityid;
        console.log(spid);
        $scope.showNotice = false;

        function showNotice(content) {
          $scope.noticeContent = content;
          $scope.showNotice = true;
          $timeout(function() {
            $scope.showNotice = false;
          }, 1000);
        }
        if ($scope.userComment) {
          $http({
              method: 'POST',
              url: 'http://ap.atlasyun.com/api_test/comment/' + cityId,
              data: serializeData({
                poi_id: spid,
                user_nickname: '匿名用户',
                text_excerpt: $scope.userComment,
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .success(function(data) {
              window.parent.location.href = '#/shop/' + cityId + '/' + spid;
              var content = "发布成功";
              showNotice(content);
            });
        } else {}
      };

      function serializeData(data) {
        if (!angular.isObject(data)) {
          return ((data == null) ? "" : data.toString());
        }

        var buffer = [];

        for (var name in data) {
          if (!data.hasOwnProperty(name)) {
            continue;
          }

          var value = data[name];

          buffer.push(
            encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
          );
        }

        var source = buffer.join("&").replace(/%20/g, "+");
        return (source);
      }
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('mallTagCtrl', ['$scope', 'global', 'Localstorage', '$route', 'mallProd', '$location', '$window',
    function($scope, global, Localstorage, $route, mallProd, $location, $window) {

      $scope.kword = $route.current.params.keyword;
      $scope.bpid = $route.current.params.buildingid;
      $scope.cityId = $route.current.params.cityid;
      console.log($scope.bpid)

      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
        $scope.tabType = type;
      };
      $scope.mallprod = mallProd;
      console.log($scope.mallprod)
      $scope.goShop = function(poiid) {
        $location.path('/shop/' + $scope.cityId + '/' + poiid);
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.mallprod[0].building.ch_name;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });

      $scope.ItHasCoupon = true;
      for(var i in $scope.malltag){
        if($scope.malltag[i].coupons.length > 0){
          $scope.ItHasCoupon = false;
        }
      }

      function sortShop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          shopArr = shopArr.sort(function(a, b) {
            return b.hasCoupon * 1 - a.hasCoupon * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.mallprod) {
        var shops = $scope.mallprod;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('mycollectCtrl', ['$scope', 'global', 'API_PREFIX', '$http', 'IMAGE_PREFIX', '$routeParams', 'Search', 'Localstorage', '$location', '$filter', 'Brand', 'Districts', '$window', '$anchorScroll', 'Subway', '$route',
    function($scope, global, API_PREFIX, $http, IMAGE_PREFIX, $routeParams, Search, Localstorage, $location, $filter, Brand, Districts, $window, $anchorScroll, Subway, $route) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };

        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      $scope.showiconnotice = false;
      $scope.likeShop = Localstorage.getLike().shops;
      $scope.likeBuilding = Localstorage.getLike().buildings;
      console.log($scope.likeShop)
      console.log($scope.likeBuilding)
      $scope.isShopNull = isNullObj($scope.likeShop);
      $scope.isBuildingNull = isNullObj($scope.likeBuilding);

      function isNullObj(obj) {
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            return false;
          }
        }
        return true;
      }

      $scope.uid = global.uid;

      if (global.uid) {
        console.log(1)
        $http({
          method: 'GET',
          url: API_PREFIX + '/api_test/favorite/' + global.uid
        }).success(function(data) {
          $scope.wxcollect = data;
          console.log($scope.wxcollect)
          $scope.likeWxShop = $scope.wxcollect.shops;
          $scope.likeWxBuilding = $scope.wxcollect.malls;
        });
      }


      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = "我的收藏";
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
    }
  ]);;'use strict';

angular
  .module('atlas')
  .controller('goCtrl', ['$scope', 'global', '$route', '$sce', '$window',
    function($scope, global, $route, $sce, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      var goloc = $route.current.params.goloc;
      var golat = $route.current.params.golat;
      var gomallname = $route.current.params.gomallname;
      $scope.gomallname = $route.current.params.gomallname;
      var goiframeurl = 'http://mo.amap.com/?q=' + golat + ',' + goloc + '&name=' + gomallname + '&dev=0';
      $scope.goiframeurl = $sce.trustAsResourceUrl(goiframeurl);
      console.log(goiframeurl);

      $scope.$on('$viewContentLoaded', function() {
        var allheight = window.screen.availHeight;
        document.getElementById("goiframe").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通")+ " " + $route.current.params.gomallname + " 室外地图";
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = window.screen.availHeight;
        document.getElementById("goiframe").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("goiframe").style.height = allheight + "px";
      });
    }
  ]);;'use strict';

angular.module('atlas')
  .factory('Malls', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', '$location', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, $location, API_PREFIX) {
      return {
        fetch: function(cityid) {
          console.log($location)
          console.log(window.location)

          var deferred = $q.defer();
          var url = API_PREFIX + '/api_test/malls/' + cityid;
          // var url = 'http://ap.atlasyun.com/api/malls/' + DEFAULT_CITY_ID;
          console.log(url)
          $http.get(url, {
            cache: true
          }).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);;'use strict';

angular.module('atlas')
  .factory('Building', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(bpid,cityid) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/mall/pid/' + bpid + '/' + DEFAULT_CITY_ID;
          var url = API_PREFIX + '/api_test/mall/pid/' + bpid + '/' + cityid;
          $http.get(url, {
            cache: true
          }).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);;'use strict';

angular.module('atlas')
    .factory('Search', ['$http', '$q', 'DEFAULT_CITY_ID', 'API_PREFIX',
        function($http, $q, DEFAULT_CITY_ID, API_PREFIX) {
            return {
                searchAll: function(keyword, page, cityid) {
                    // var url = 'http://ap.atlasyun.com:3002/api/search/sh?keywords=' + keyword + '&callback=JSON_CALLBACK';
                    var url = API_PREFIX + '/api_test/search/' + cityid + '?keywords=' + keyword + '&p=' + page + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                },
                searchNext: function(keyword, page, cityid) {
                    page++;
                    console.log(page);
                    var url = API_PREFIX + '/api_test/search/' + cityid + '?keywords=' + keyword + '&p=' + page + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
  .factory('Shop', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(spid,cityid) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/shop/pid/' + spid + '/' + DEFAULT_CITY_ID;
          var url = API_PREFIX + '/api_test/shop/pid/' + spid + '/' + cityid;
          console.log(url);
          $http.get(url).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);;'use strict';

angular.module('atlas')
    .factory('Localstorage', [
        function() {
            return {
                getLike: function() {
                    var like = localStorage.getItem('like');
                    if (!like) {
                        like = {};
                        like.buildings = {};
                        like.shops = {};
                        this.setLike(like);
                        return like;
                    }
                    return JSON.parse(like);
                },
                setLike: function(like) {
                    like = JSON.stringify(like);
                    localStorage.setItem('like', like);
                },
                toogleLikeBuilding: function(storebuilding) {
                    var like = this.getLike();
                    var buildings = like.buildings;
                    var isLike = this.isLikeBuilding(storebuilding, like);
                    if (isLike) {
                        //delete
                        delete buildings[storebuilding.id]
                    } else {
                        //add
                        buildings[storebuilding.id] = storebuilding;
                    }
                    this.setLike(like);
                },
                isLikeBuilding: function(storebuilding, like) {
                    var isLike = false;
                    if (!like) {
                        like = this.getLike();
                    }
                    var buildings = like.buildings;
                    angular.forEach(buildings, function(building) {
                        if (building.id === storebuilding.id) {
                            isLike = true;
                        }
                    });
                    console.log(isLike);
                    return isLike;
                },
                isLikeShop: function(storeshop, like) {
                    var isLike = false;
                    if (!like) {
                        like = this.getLike();
                    }
                    var shops = like.shops;
                    angular.forEach(shops, function(shop) {
                        if (shop.id === storeshop.id) {
                            isLike = true;
                        }
                    });
                    return isLike;
                },
                toogleLikeShop: function(storeshop) {
                    var like = this.getLike();
                    var shops = like.shops;
                    var isLike = this.isLikeShop(storeshop, like);
                    if (isLike) {
                        //delete
                        delete shops[storeshop.id]
                    } else {
                        //add
                        shops[storeshop.id] = storeshop;
                    }
                    this.setLike(like);
                },
                setGPS: function(lat, lon) {
                    var gps = {};
                    gps.lat = lat;
                    gps.lon = lon;
                    gps = JSON.stringify(gps);
                    localStorage.setItem('gps', gps);
                },
                getGPS: function() {
                    var gps = localStorage.getItem('gps');
                    if (!gps) {
                        gps = {};
                        gps.lat = 0;
                        gps.lon = 0;
                        gps = JSON.stringify(gps);
                        localStorage.setItem('gps', gps);
                    }
                    return JSON.parse(gps);
                },
                setSearchHis: function(searchhis) {
                    function unique(arr) {
                        for (var i = 0; i < arr.length; i++)
                            for (var j = i + 1; j < arr.length; j++)
                                if (arr[i] === arr[j]) {
                                    arr.splice(j, 1);
                                    j--;
                                }
                        return arr;
                    }
                    searchhis = unique(searchhis).join(',');
                    localStorage.setItem('searchhis', searchhis);
                },
                getSearchHis: function() {
                    var searchhis = localStorage.getItem('searchhis');
                    if (!searchhis) {
                        searchhis = '';
                        localStorage.setItem('searchhis', '');
                    }
                    return searchhis.split(',');
                },
                removeSearchHis: function() {
                    localStorage.removeItem('searchhis');
                    return;
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
  .factory('Hotkey', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        fetch: function() {
          // var url = 'http://ap.atlasyun.com/api/hotkeys?callback=JSON_CALLBACK';
          // var url = API_PREFIX + '/api_test/hotkeys?callback=JSON_CALLBACK';
          // return $http.jsonp(url).success(function(data) {
          //   return data;
          // });
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/hotkeys/search?key=' + keyword + '&callback=JSON_CALLBACK';
          var url = API_PREFIX + '/api_test/hotkeys?callback=JSON_CALLBACK';
          return $http.jsonp(url).then(function(data) {
            return data;
          });
        },
        searchHotkey: function(keyword) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/hotkeys/search?key=' + keyword + '&callback=JSON_CALLBACK';
          var url = API_PREFIX + '/api_test/hotkeys/search?key=' + keyword + '&callback=JSON_CALLBACK';
          return $http.jsonp(url).then(function(data) {
            return data;
          });

          // $http.get(url, {cache: true}).success(function(data) {
          //     deferred.resolve(data);
          // });
          // return deferred.promise;
        }
      };
    }
  ]);;'use strict';

angular.module('atlas')
    .factory('Brand', ['$http', 'API_PREFIX', '$q',
        function($http, API_PREFIX, $q) {
            return {
                fetch: function() {
                    var url = API_PREFIX + '/api_test/brands?callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                },
                searchBrand: function(keyword, cityid) {
                    var url = API_PREFIX + '/api_test/brands/search/' + cityid + '?bid=' + keyword + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
    .factory('Searchinmall', ['$http', 'DEFAULT_CITY_ID', '$location', 'API_PREFIX',
        function($http, DEFAULT_CITY_ID, $location, API_PREFIX) {
            return {
                searchMall: function(mallId, keyword, cityid) {
                    var url = API_PREFIX + '/api_test/shops/mid/' + mallId + '/' + cityid + '?name=' + keyword + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).then(function(data) {
                        console.log(data.data);
                        return data;
                    });
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
  .factory('cache', function($cacheFactory) {
    var cache = $cacheFactory('cahce');

    return {

      /**
       * This will handle caching individual resource records
       * @param  CacheId string where we expect this to be stored in the cache
       * @param  Resource resource The resource object that we want to get
       * @param  Object param An object of params to pass to resource.get
       * @param  Function callback
       * @return resource object
       */
      get: function(cacheId) {
        var result = cache.get(cacheId);

        // See if we had a valid record from cache

        if (result) {
          console.log("cache hit: " + cacheId);
          return result;
        } else {
          return null;
        }

      },
      put: function(cacheId, data) {
        //        var hanckedData = {};
        //        hanckedData.data = data;
        cache.put(cacheId, data);
      }
    }
  });;'use strict';

angular.module('atlas')
    .factory('Districts', ['$http', '$q', 'cache', 'API_PREFIX',
        function($http, $q, cache, API_PREFIX) {
            return {
                fetch: function(cityid) {
                    // var url = 'http://ap.atlasyun.com/api/malls/group/districts?callback=JSON_CALLBACK';
                    // var url = API_PREFIX + '/api_test/malls/group/districts?callback=JSON_CALLBACK';
                    // return $http.jsonp(url).success(function(data) {
                    //     return data;
                    // });
                    var deferred = $q.defer();
                    var url = API_PREFIX + '/api_test/malls/group/districts?callback=JSON_CALLBACK';
                    $http.get(url, {
                        cache: true
                    }).success(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
            };
        }
    ]);;'use strict';

angular.module('atlas')
    .factory('MapOfBuilding', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {
            return {
                mapBuilding: function(buildingId) {
                    // var url = 'http://ap.atlasyun.com:3001/map/building/getSimple?id=' + buildingId + '&callback=JSON_CALLBACK';
                    var url = API_PREFIX.replace(/\/$/, '') + ':3001/map/building/getSimple?id=' + buildingId + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).then(function(ret) {
                        if (ret.data.result == 'succeed') {
                            return ret.data.data;
                        }
                    });
                },
                shopsOfMall: function(mallId) {
                    var cache;
                    try {
                        cache = JSON.parse(localStorage.getItem('shopsOfMall' + mallId));
                    } catch (e) {
                        cache = null
                    }
                    if (cache) {
                        return cache;
                    }
                    // var url = 'http://ap.atlasyun.com:3002/api/shops/mid/' + mallId +'/sh?callback=JSON_CALLBACK';
                    var url = API_PREFIX.replace(/\/$/, '') + ':3002/api/shops/mid/' + mallId + '/sh?callback=JSON_CALLBACK';
                    return $http.jsonp(url).then(function(ret) {
                        localStorage.setItem('shopsOfMall' + mallId, JSON.stringify(ret.data));
                        return ret.data;
                    });
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
  .factory('Malltag', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(bpid, keyword, cityid) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com:3002/api/shops/mid/' + bpid + '/sh?tags=' + keyword +  '&callback=JSON_CALLBACK';
          var url = API_PREFIX + '/api_test/shops/mid/' + bpid + '/' + cityid + '?tags=' + keyword + '&callback=JSON_CALLBACK';
          $http.jsonp(url).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);;'use strict';

angular.module('atlas')
  .factory('Subway', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        fetch: function(cityid) {
          var url = API_PREFIX + '/api_test/malls/group/subway/' + cityid + '?callback=JSON_CALLBACK';
          return $http.jsonp(url).success(function(data) {
            return data;
          });
        },
      };
    }
  ]);;'use strict';

angular.module('atlas')
  .factory('Prods', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(bpid, keyword, cityid) {
          var deferred = $q.defer();
          var url = API_PREFIX + '/api_test/shops/mid/' + bpid + '/' + cityid + '?prods=' + keyword + '&callback=JSON_CALLBACK';
          $http.jsonp(url).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);;'use strict';

angular.module('atlas')
    .factory('CityList', ['$http', 'API_PREFIX', '$q',
        function($http, API_PREFIX, $q) {
            return {
                fetch: function() {
                    // var url = API_PREFIX + '/api_test/city/list?callback=JSON_CALLBACK'
                    // return $http.jsonp(url).success(function(data) {
                    //     return data;
                    // });
                    var deferred = $q.defer();
                    var url = API_PREFIX + '/api_test/city/list?callback=JSON_CALLBACK';
                    $http.get(url, {
                        cache: true
                    }).success(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
    .factory('WxCollect', ['$http', 'API_PREFIX', '$q',
        function($http, API_PREFIX, $q) {
            return {
                fetch: function(openid) {
                    if (!!openid) {
                        var url = API_PREFIX + '/api_test/favorite/'+ openid +'?callback=JSON_CALLBACK';
                        return $http.jsonp(url).success(function(data) {
                            return data;
                        });
                    } else {
                        return undefined;
                    }
                    
                }
            };
        }
    ]);;'use strict';

angular.module('atlas')
  .factory('global', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        uid : null
      }
  }
  ]);;'use strict';

angular.module('atlas')
  .filter('gps', ['Localstorage', function(Localstorage) {
    var EARTH_RADIUS = 6378137.0; //单位M
    var PI = Math.PI;

    function getRad(d) {
      return d * PI / 180.0;
    }

    /**
     * caculate the great circle distance
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = getRad(lat1);
      var radLat2 = getRad(lat2);

      var a = radLat1 - radLat2;
      var b = getRad(lng1) - getRad(lng2);

      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000.0;

      return s;
    }

    return function(targetgps) {
      if (!targetgps) {
        return '--';
      }
      var gps = Localstorage.getGPS();
      if (gps.lat === 0) {
        return '--';
      }

      var distance = getGreatCircleDistance(targetgps.coordinates[1], targetgps.coordinates[0], gps.lat, gps.lon);
      return parseInt(distance).toFixed(0)
    };
  }]);;'use strict';

angular.module('atlas')
    .filter('img', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(url) {
            if (url) {
                return IMAGE_PREFIX + url + '?imageView/2/w/480';
            } else {
                return './img/1.jpg';
            }
        };
    }]);;'use strict';

angular.module('atlas')
    .filter('logo', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(url) {
            if (url) {
                return IMAGE_PREFIX + url + '?imageView/2/w/100/h/100';
            } else {
                return './img/shop.png';
            }
        };
    }]);;'use strict';

angular.module('atlas')
	.filter('random', ['Localstorage', function(Localstorage) {
		return function(randomcolor) {
			var ncolor = Math.floor(Math.random() * randomcolor.length + 1) - 1;
			return randomcolor[ncolor];
		};
	}]);;'use strict';

angular.module('atlas')
    .filter('floorname', ['Localstorage', function(Localstorage) {
        return function(floor) {
            if (floor.match(/B/) || floor.match(/b/)) {
                var num = floor.replace(/[^0-9]/ig, "");
                return "负" + num + "楼";
            } else if (floor.match(/L/) || floor.match(/l/)) {
                var num = floor.replace(/[^0-9]/ig, "");
                return num + "楼";
            }
            return floor.replace('f', '楼').replace('F', '楼');
        };
    }]);;'use strict';

angular.module('atlas')
    .filter('hasCoupon', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(shops) {
            // console.log(shops)
            for (var i in shops) {
                if (shops[i].hasCoupon == true) {
                    // shops[i].push(-1);
                    // return 1;
                    console.log(1)
                        // shops.unshift(shops[i]);
                }
            };


            return shops;
        };
    }]);;'use strict';

angular.module('atlas')
    .filter('commenttype', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(type) {
            switch (type) {
                case 1:
                    return '大众点评';
                case 2:
                    return '美团';
                case 3:
                    return '糯米';
                case 4:
                    return 'Atlas';
            }
        };
    }]);;'use strict';

angular.module('atlas')
	.filter('commenttime', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
		return function(time) {
			return time.substr(0, 10);
		};
	}]);;'use strict';

angular.module('atlas')
	.filter('couponimg', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
		return function(type) {
			if (type == '大众点评') {
				return './img/logo-dzdp.png';
			} else return './img/default-couponlogo.png';
		};
	}]);;'use strict';

angular.module('atlas')
    .filter('prodname', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(prod) {
            switch (prod) {
                case 0:
                    return '吃';
                case 1:
                    return '喝';
                case 2:
                    return '玩';
                case 3:
                    return '家用百货';
                case 4:
                    return '生活服务';
                case 5:
                    return '食品';
                case 6:
                    return '儿童用品';
                case 7:
                    return '服装饰品';
                case 8:
                    return '男装';
                case 9:
                    return '女装';
                case 10:
                    return '运动休闲';
                case 11:
                    return '箱包皮具';
                case 12:
                    return '化妆品';
                case 13:
                    return '电器';
                case 14:
                    return '数码产品';
                case 15:
                    return '家具';
                case 16:
                    return '文化办公';
                case 17:
                    return '金银珠宝';
                case 18:
                    return '钟表眼镜';
                case 19:
                    return '会议';
                case 20:
                    return '促销特卖';
                case 21:
                    return '其它';
            }
        };
    }]);;'use strict';

angular.module('atlas')
    .filter('prodicon', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(prod) {
            switch (prod) {
                case 0:
                    return './img/食品.png';
                case 1:
                    return './img/drink.png';
                case 2:
                    return './img/play.png';
                case 3:
                    return './img/家用百货.png';
                case 4:
                    return './img/生活服务.png';
                case 5:
                    return './img/food.png';
                case 6:
                    return './img/儿童.png';
                case 7:
                    return './img/shoulian.png';
                case 8:
                    return './img/男装.png';
                case 9:
                    return './img/女装.png';
                case 10:
                    return './img/运动.png';
                case 11:
                    return './img/箱包.png';
                case 12:
                    return './img/化妆品.png';
                case 13:
                    return './img/电器.png';
                case 14:
                    return './img/数码.png';
                case 15:
                    return './img/家具.png';
                case 16:
                    return './img/办公.png';
                case 17:
                    return './img/饰品.png';
                case 18:
                    return './img/手表.png';
                case 19:
                    return './img/会议.png';
                case 20:
                    return './img/优惠.png';
                case 21:
                    return './img/其他.png';
            }
        };
    }]);;'use strict';

angular.module('atlas')
    .filter('cityName', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(cityid) {
            if (cityid == '54a0c5430a2313755106951c') {
                return '北京';
            } else {
                return '上海';
            }
        };
    }]);;angular.module('atlas').directive(
  'imageLazySrc',
  function($document, $window) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attributes) {

        function isInView() {
          var clientHeight = $document[0].documentElement.clientHeight,
            clientWidth = $document[0].documentElement.clientWidth,
            imageRect = $element[0].getBoundingClientRect();
          if (
            (imageRect.top >= 0 && imageRect.bottom <= clientHeight) &&
            (imageRect.left >= 0 && imageRect.right <= clientWidth)
          ) {
            $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)

            removeEventListeners();
          }
        }

        function removeEventListeners() {
          document.getElementById('content').removeEventListener('scroll', isInView);
        }

        document.getElementById('content').addEventListener('scroll', isInView);

        $element.on('$destroy', function() {
          removeEventListeners();
        });
        isInView();

      }
    };
  }
);;/*
 * Snap.js
 *
 * Copyright 2013, Jacob Kelley - http://jakiestfu.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/jakiestfu/Snap.js/
 * Version: 1.9.2
 */
 (function(c,b){var a=a||function(k){var f={element:null,dragger:null,disable:"none",addBodyClasses:true,hyperextensible:true,resistance:0.5,flickThreshold:50,transitionSpeed:0.3,easing:"ease",maxPosition:266,minPosition:-266,tapToClose:true,touchToDrag:true,slideIntent:40,minDragDistance:5},e={simpleStates:{opening:null,towards:null,hyperExtending:null,halfway:null,flick:null,translation:{absolute:0,relative:0,sinceDirectionChange:0,percentage:0}}},h={},d={hasTouch:(b.ontouchstart===null),eventType:function(m){var l={down:(d.hasTouch?"touchstart":"mousedown"),move:(d.hasTouch?"touchmove":"mousemove"),up:(d.hasTouch?"touchend":"mouseup"),out:(d.hasTouch?"touchcancel":"mouseout")};return l[m]},page:function(l,m){return(d.hasTouch&&m.touches.length&&m.touches[0])?m.touches[0]["page"+l]:m["page"+l]},klass:{has:function(m,l){return(m.className).indexOf(l)!==-1},add:function(m,l){if(!d.klass.has(m,l)&&f.addBodyClasses){m.className+=" "+l}},remove:function(m,l){if(f.addBodyClasses){m.className=(m.className).replace(l,"").replace(/^\s+|\s+$/g,"")}}},dispatchEvent:function(l){if(typeof h[l]==="function"){return h[l].call()}},vendor:function(){var m=b.createElement("div"),n="webkit Moz O ms".split(" "),l;for(l in n){if(typeof m.style[n[l]+"Transition"]!=="undefined"){return n[l]}}},transitionCallback:function(){return(e.vendor==="Moz"||e.vendor==="ms")?"transitionend":e.vendor+"TransitionEnd"},canTransform:function(){return typeof f.element.style[e.vendor+"Transform"]!=="undefined"},deepExtend:function(l,n){var m;for(m in n){if(n[m]&&n[m].constructor&&n[m].constructor===Object){l[m]=l[m]||{};d.deepExtend(l[m],n[m])}else{l[m]=n[m]}}return l},angleOfDrag:function(l,o){var n,m;m=Math.atan2(-(e.startDragY-o),(e.startDragX-l));if(m<0){m+=2*Math.PI}n=Math.floor(m*(180/Math.PI)-180);if(n<0&&n>-180){n=360-Math.abs(n)}return Math.abs(n)},events:{addEvent:function g(m,l,n){if(m.addEventListener){return m.addEventListener(l,n,false)}else{if(m.attachEvent){return m.attachEvent("on"+l,n)}}},removeEvent:function g(m,l,n){if(m.addEventListener){return m.removeEventListener(l,n,false)}else{if(m.attachEvent){return m.detachEvent("on"+l,n)}}},prevent:function(l){if(l.preventDefault){l.preventDefault()}else{l.returnValue=false}}},parentUntil:function(n,l){var m=typeof l==="string";while(n.parentNode){if(m&&n.getAttribute&&n.getAttribute(l)){return n}else{if(!m&&n===l){return n}}n=n.parentNode}return null}},i={translate:{get:{matrix:function(n){if(!d.canTransform()){return parseInt(f.element.style.left,10)}else{var m=c.getComputedStyle(f.element)[e.vendor+"Transform"].match(/\((.*)\)/),l=8;if(m){m=m[1].split(",");if(m.length===16){n+=l}return parseInt(m[n],10)}return 0}}},easeCallback:function(){f.element.style[e.vendor+"Transition"]="";e.translation=i.translate.get.matrix(4);e.easing=false;clearInterval(e.animatingInterval);if(e.easingTo===0){d.klass.remove(b.body,"snapjs-right");d.klass.remove(b.body,"snapjs-left")}d.dispatchEvent("animated");d.events.removeEvent(f.element,d.transitionCallback(),i.translate.easeCallback)},easeTo:function(l){if(!d.canTransform()){e.translation=l;i.translate.x(l)}else{e.easing=true;e.easingTo=l;f.element.style[e.vendor+"Transition"]="all "+f.transitionSpeed+"s "+f.easing;e.animatingInterval=setInterval(function(){d.dispatchEvent("animating")},1);d.events.addEvent(f.element,d.transitionCallback(),i.translate.easeCallback);i.translate.x(l)}if(l===0){f.element.style[e.vendor+"Transform"]=""}},x:function(m){if((f.disable==="left"&&m>0)||(f.disable==="right"&&m<0)){return}if(!f.hyperextensible){if(m===f.maxPosition||m>f.maxPosition){m=f.maxPosition}else{if(m===f.minPosition||m<f.minPosition){m=f.minPosition}}}m=parseInt(m,10);if(isNaN(m)){m=0}if(d.canTransform()){var l="translate3d("+m+"px, 0,0)";f.element.style[e.vendor+"Transform"]=l}else{f.element.style.width=(c.innerWidth||b.documentElement.clientWidth)+"px";f.element.style.left=m+"px";f.element.style.right=""}}},drag:{listen:function(){e.translation=0;e.easing=false;d.events.addEvent(f.element,d.eventType("down"),i.drag.startDrag);d.events.addEvent(f.element,d.eventType("move"),i.drag.dragging);d.events.addEvent(f.element,d.eventType("up"),i.drag.endDrag)},stopListening:function(){d.events.removeEvent(f.element,d.eventType("down"),i.drag.startDrag);d.events.removeEvent(f.element,d.eventType("move"),i.drag.dragging);d.events.removeEvent(f.element,d.eventType("up"),i.drag.endDrag)},startDrag:function(n){var m=n.target?n.target:n.srcElement,l=d.parentUntil(m,"data-snap-ignore");if(l){d.dispatchEvent("ignore");return}if(f.dragger){var o=d.parentUntil(m,f.dragger);if(!o&&(e.translation!==f.minPosition&&e.translation!==f.maxPosition)){return}}d.dispatchEvent("start");f.element.style[e.vendor+"Transition"]="";e.isDragging=true;e.hasIntent=null;e.intentChecked=false;e.startDragX=d.page("X",n);e.startDragY=d.page("Y",n);e.dragWatchers={current:0,last:0,hold:0,state:""};e.simpleStates={opening:null,towards:null,hyperExtending:null,halfway:null,flick:null,translation:{absolute:0,relative:0,sinceDirectionChange:0,percentage:0}}},dragging:function(s){if(e.isDragging&&f.touchToDrag){var v=d.page("X",s),u=d.page("Y",s),t=e.translation,o=i.translate.get.matrix(4),n=v-e.startDragX,p=o>0,q=n,w;if((e.intentChecked&&!e.hasIntent)){return}if(f.addBodyClasses){if((o)>0){d.klass.add(b.body,"snapjs-left");d.klass.remove(b.body,"snapjs-right")}else{if((o)<0){d.klass.add(b.body,"snapjs-right");d.klass.remove(b.body,"snapjs-left")}}}if(e.hasIntent===false||e.hasIntent===null){var m=d.angleOfDrag(v,u),l=(m>=0&&m<=f.slideIntent)||(m<=360&&m>(360-f.slideIntent)),r=(m>=180&&m<=(180+f.slideIntent))||(m<=180&&m>=(180-f.slideIntent));if(!r&&!l){e.hasIntent=false}else{e.hasIntent=true}e.intentChecked=true}if((f.minDragDistance>=Math.abs(v-e.startDragX))||(e.hasIntent===false)){return}d.events.prevent(s);d.dispatchEvent("drag");e.dragWatchers.current=v;if(e.dragWatchers.last>v){if(e.dragWatchers.state!=="left"){e.dragWatchers.state="left";e.dragWatchers.hold=v}e.dragWatchers.last=v}else{if(e.dragWatchers.last<v){if(e.dragWatchers.state!=="right"){e.dragWatchers.state="right";e.dragWatchers.hold=v}e.dragWatchers.last=v}}if(p){if(f.maxPosition<o){w=(o-f.maxPosition)*f.resistance;q=n-w}e.simpleStates={opening:"left",towards:e.dragWatchers.state,hyperExtending:f.maxPosition<o,halfway:o>(f.maxPosition/2),flick:Math.abs(e.dragWatchers.current-e.dragWatchers.hold)>f.flickThreshold,translation:{absolute:o,relative:n,sinceDirectionChange:(e.dragWatchers.current-e.dragWatchers.hold),percentage:(o/f.maxPosition)*100}}}else{if(f.minPosition>o){w=(o-f.minPosition)*f.resistance;q=n-w}e.simpleStates={opening:"right",towards:e.dragWatchers.state,hyperExtending:f.minPosition>o,halfway:o<(f.minPosition/2),flick:Math.abs(e.dragWatchers.current-e.dragWatchers.hold)>f.flickThreshold,translation:{absolute:o,relative:n,sinceDirectionChange:(e.dragWatchers.current-e.dragWatchers.hold),percentage:(o/f.minPosition)*100}}}i.translate.x(q+t)}},endDrag:function(m){if(e.isDragging){d.dispatchEvent("end");var l=i.translate.get.matrix(4);if(e.dragWatchers.current===0&&l!==0&&f.tapToClose){d.dispatchEvent("close");d.events.prevent(m);i.translate.easeTo(0);e.isDragging=false;e.startDragX=0;return}if(e.simpleStates.opening==="left"){if((e.simpleStates.halfway||e.simpleStates.hyperExtending||e.simpleStates.flick)){if(e.simpleStates.flick&&e.simpleStates.towards==="left"){i.translate.easeTo(0)}else{if((e.simpleStates.flick&&e.simpleStates.towards==="right")||(e.simpleStates.halfway||e.simpleStates.hyperExtending)){i.translate.easeTo(f.maxPosition)}}}else{i.translate.easeTo(0)}}else{if(e.simpleStates.opening==="right"){if((e.simpleStates.halfway||e.simpleStates.hyperExtending||e.simpleStates.flick)){if(e.simpleStates.flick&&e.simpleStates.towards==="right"){i.translate.easeTo(0)}else{if((e.simpleStates.flick&&e.simpleStates.towards==="left")||(e.simpleStates.halfway||e.simpleStates.hyperExtending)){i.translate.easeTo(f.minPosition)}}}else{i.translate.easeTo(0)}}}e.isDragging=false;e.startDragX=d.page("X",m)}}}},j=function(l){if(l.element){d.deepExtend(f,l);e.vendor=d.vendor();i.drag.listen()}};this.open=function(l){d.dispatchEvent("open");d.klass.remove(b.body,"snapjs-expand-left");d.klass.remove(b.body,"snapjs-expand-right");if(l==="left"){e.simpleStates.opening="left";e.simpleStates.towards="right";d.klass.add(b.body,"snapjs-left");d.klass.remove(b.body,"snapjs-right");i.translate.easeTo(f.maxPosition)}else{if(l==="right"){e.simpleStates.opening="right";e.simpleStates.towards="left";d.klass.remove(b.body,"snapjs-left");d.klass.add(b.body,"snapjs-right");i.translate.easeTo(f.minPosition)}}};this.close=function(){d.dispatchEvent("close");i.translate.easeTo(0)};this.expand=function(l){var m=c.innerWidth||b.documentElement.clientWidth;if(l==="left"){d.dispatchEvent("expandLeft");d.klass.add(b.body,"snapjs-expand-left");d.klass.remove(b.body,"snapjs-expand-right")}else{d.dispatchEvent("expandRight");d.klass.add(b.body,"snapjs-expand-right");d.klass.remove(b.body,"snapjs-expand-left");m*=-1}i.translate.easeTo(m)};this.on=function(l,m){h[l]=m;return this};this.off=function(l){if(h[l]){h[l]=false}};this.enable=function(){d.dispatchEvent("enable");i.drag.listen()};this.disable=function(){d.dispatchEvent("disable");i.drag.stopListening()};this.settings=function(l){d.deepExtend(f,l)};this.state=function(){var l,m=i.translate.get.matrix(4);if(m===f.maxPosition){l="left"}else{if(m===f.minPosition){l="right"}else{l="closed"}}return{state:l,info:e.simpleStates}};j(k)};if((typeof module!=="undefined")&&module.exports){module.exports=a}if(typeof ender==="undefined"){this.Snap=a}if((typeof define==="function")&&define.amd){define("snap",[],function(){return a})}}).call(this,window,document);;/*! 
 * angular-loading-bar v0.4.3
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2014 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","cfpLoadingBar",function(b,c,d,e,f){function g(){d.cancel(i),f.complete(),k=0,j=0}function h(b){var d,e=a.defaults;if("GET"!==b.method||b.cache===!1)return b.cached=!1,!1;d=b.cache===!0&&void 0===e.cache?c.get("$http"):void 0!==e.cache?e.cache:b.cache;var f=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&f!==b.cached?b.cached:(b.cached=f,f)}var i,j=0,k=0,l=f.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||h(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===j&&(i=d(function(){f.start()},l)),j++,f.set(k/j)),a},response:function(a){return a.config.ignoreLoadingBar||h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),a},responseError:function(a){return a.config.ignoreLoadingBar||h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),b.reject(a)}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.$get=["$document","$timeout","$animate","$rootScope",function(a,b,c,d){function e(){var e=a.find(l);b.cancel(k),p||(d.$broadcast("cfpLoadingBar:started"),p=!0,s&&c.enter(m,e),r&&c.enter(o,e),f(t))}function f(a){if(p){var c=100*a+"%";n.css("width",c),q=a,b.cancel(j),j=b(function(){g()},250)}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return q}function i(){d.$broadcast("cfpLoadingBar:completed"),f(1),k=b(function(){c.leave(m,function(){q=0,p=!1}),c.leave(o)},500)}var j,k,l=this.parentSelector,m=angular.element('<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>'),n=m.find("div").eq(0),o=angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>'),p=!1,q=0,r=this.includeSpinner,s=this.includeBar,t=this.startSize;return{start:e,set:f,status:h,inc:g,complete:i,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();