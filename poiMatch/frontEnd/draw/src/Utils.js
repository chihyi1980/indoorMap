/**
 * Created by zhaop on 2015/3/30.
 */
window.AtlasDraw = window.AtlasDraw || {};

(function(global){
    global.graphTypes = {
        polyLine: 'polyLine'
    };
    global.directives = {
        moveTo : 'M',
        lineTo : 'L',
        horizontal : 'H',
        vertical : 'V',
        curve : 'S',
        arc : 'A',
        close: 'Z'
    };
    global.drawStatus = {
        click: 'click',
        dblclick: 'dblclick',
        move: 'move'
    };

    global.utils = {
        setDirective: function(type){
            if(global.directives[type]){
                global.__curDirective = global.directives[type];
            }else{
                console.error('Invalid directive "' + type + '".');
            }
        },
        setDrawStatus: function(status){
            if(global.drawStatus[status]){
                global.__curDrawStatus = global.drawStatus[status];
            }else{
                console.error('Invalid status "' + status + '".');
            }
        },
        setDrawZoom: function(zoom){
            global.__drawZoom = zoom;
        },
        catchPointsToVertexes: function( points , isClose ){
            var directives = global.directives;
            isClose = !!isClose;
            if(points instanceof Array){
                var res = points;
                if(isClose) {
                    var close = {
                        directive: directives.close,
                        point: ['', '']
                    };
                    res.push(close);
                }
                    return res;
            }else{
                return [];
            }
        },
        pathConvert:function(directive, point){
            if(typeof directive == 'string' && point instanceof Array){
                return directive + point.join(' ');
            }else{
                console.error('Invalid arguments in function "utils.pathConvert".');
                return '';
            }
        },
        getPathD : function(vertexes){
            //console.log(JSON.stringify(vertexes))
            if(!(vertexes instanceof Array)){
                return console.error('Argument need a array in function "utils.getPathD".');
            }
            var self = this,
                d = [],
                directive,point;
            for(var i=0, len=vertexes.length; i< len; ++i){
                var item = vertexes[i];
                directive = item.directive;
                point = item.point;
                if(i > 0){
                    var lastPoint = vertexes[i - 1].point;
                    if(Math.abs(lastPoint[0] - point[0]) < 2 && Math.abs(lastPoint[1] - point[1]) < 2){
                        var temp = point.concat([]);
                        temp[0] += 1;
                        d.push(self.pathConvert(directive, temp));
                        temp[1] += 1;
                        d.push(self.pathConvert(directive, temp));
                        temp[0] -= 1;
                        d.push(self.pathConvert(directive, temp));
                    }
                }
                d.push(self.pathConvert(directive, point));
            }
            return self.pathConvert('', d);
        },
        draw : function(d){
            var self = this,
                path;
            if(!d){
                return console.log('Attribute "d" is null.')
            }
            if(!self.__tempPathDom){
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                self.__tempPathDom = path;
                global.__drawCtx.appendChild(path);
            }else{
                path = self.__tempPathDom
            }
            var zoom = global.__drawZoom || 1;
            var pathId = 'path_' + global.pathId;
            path.setAttribute('d', d);
            path.setAttribute('id', pathId);
            path.style['fill'] = '#FFFFFF';
            path.style['stroke'] = global.lineColor;
            path.style['strokeWidth'] = 2 / zoom;
            path.style['fillOpacity'] = 0;
        },
        overCurPath: function(pathVertexes){
            global.localData['path_' + global.pathId] = pathVertexes;
            this.__tempPathDom = null;
            pathVertexes = null;
            ++global.pathId;
            console.log('over')
        },
        _draw: function(d, pathId){
            var zoom = global.__drawZoom || 1;
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            global.__drawCtx.appendChild(path);
            path.setAttribute('d', d);
            path.setAttribute('id', pathId);
            path.style['fill'] = '#FFFFFF';
            path.style['stroke'] = global.lineColor;
            path.style['strokeWidth'] = 2 / zoom;
            path.style['fillOpacity'] = 0;
            return path;
        },
        drawControlCircle: function(point, circleId){
            var zoom = global.__drawZoom || 1;
            var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            global.__drawCtx.appendChild(circle);
            circle.setAttribute('id', circleId)
            circle.setAttribute('cx', point[0]);
            circle.setAttribute('cy', point[1]);
            circle.setAttribute('r', 4 / zoom);
            circle.setAttribute('class', 'path-control');
            circle.style['fill'] = '#F5F5F5';
            circle.style['stroke'] = '#000000';
            circle.style['strokeWidth'] = 1 / zoom;
            return circle;
        }
    }

})(window.AtlasDraw);