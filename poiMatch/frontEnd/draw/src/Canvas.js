/**
 * Created by zhaop on 2015/3/30.
 */

window.AtlasDraw = window.AtlasDraw || {};

(function(global){

    var Canvas = function(canvas, initData, lineColor){
        var  self = this;
        self.__drawCtx = canvas;
        self.setContext();
        global.lineColor = lineColor || '#270AD1';
        global.pathId = +initData.nextId || 0;
        global.localData = initData.data || {};
        global.__drawZoom = initData.initScale || 1;
        if(JSON.stringify(global.localData) == '{}') global.pathId = 0;
        for(var i in global.localData){
            var d = global.utils.getPathD(global.localData[i]);
            global.utils._draw(d, i);
        }
    };

    var p = Canvas.prototype;

    p.setContext = function(){
        global.__drawCtx = this.__drawCtx;
    };

    p.getContext = function(){
      return this.__drawCtx;
    };

    global.Canvas = Canvas;

})(window.AtlasDraw);