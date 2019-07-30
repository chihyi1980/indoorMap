/*
 导航路径切割 / 交点计算
 */

// var segments = [
// 	[189.5, 157.1, 206.3, 153.4],
// 	[206.3, 153.4, 217.4, 182.4],
// 	[198.4, 150.6, 200.1, 168.2]
// ];

/*
var segments = [
    [196.8, 156.5, 209, 145.6],
    [209, 145.6, 233.6, 146.4]
];

countIntersections(segments);
*/

/*
 交点计算
 参数segments: [[x1,y1,x2,y2], [...]]
 返回计算后的线段[[x1,y1,x2,y2], [...]]
 */
function countIntersections(segments) {

    var bks = 0;

    if(!segments || segments.length === 0) return;

    segments = segments.map(function(s) {
        var p1 = [s[0], s[1]];
        var p2 = [s[2], s[3]];
        return {
            start: p1,
            end: p2,
            breaks: []
        }
    });

    var x1 = [],
        y1 = [],
        x2 = [],
        y2 = [],
        a  = [],
        b  = [],
        c  = [],
        n  = segments.length;

    // 求系数
    for(var i=0; i<n; i++) {

        var s = segments[i];

        x1[i] = s.start[0];
        y1[i] = s.start[1];
        x2[i] = s.end[0];
        y2[i] = s.end[1];

        if(x1[i] == x2[i]) {
            a[i] = 1;
            b[i] = 0;
            c[i] = -x1[i];
        } else {
            a[i] = (y2[i] - y1[i]) / (x1[i] - x2[i]);
            b[i] = 1;
            c[i] = (x1[i] * y2[i] - x2[i] * y1[i]) / (x2[i] - x1[i]);
        }
    }

    // 求交点
    for(var i=0; i<n; i++) {

        for(var j=i+1; j<n; ++j) {

            var c1 = segments[i];
            var c2 = segments[j];

            // 如果有共同端点
            if(onEnd(c1, c2)) continue;

            // 如果斜率相同
            if(a[i] * b[j] - a[j] * b[i] == 0) continue;

            // 计算交点
            var rx = (b[i] * c[j] - b[j] * c[i]) / (a[i] * b[j] - a[j] * b[i]);
            var ry = (c[i] * a[j] - c[j] * a[i]) / (a[i] * b[j] - a[j] * b[i]);

            // 系数a=0或者b=0时, 要修正online的精度判定
            if(a[i] === 0) ry = y1[i];
            if(a[j] === 0) ry = y1[j];
            if(b[i] === 0) rx = x1[i];
            if(b[j] === 0) rx = x1[j];

            // 若交点在线段上
            if(online(rx, x1[i], x2[i]) && online(rx, x1[j], x2[j])
                && online(ry, y1[i], y2[i]) && online(ry, y1[j], y2[j])) {

                // 精度调和
                rx = formatFloat(rx, 1);
                ry = formatFloat(ry, 1);

                var fixedBreadPoint = [rx, ry];

                // console.log("c%d与c%d的交点: (%s, %s)", i, j, rx, ry);

                bks++;

                c1.breaks.push([rx, ry]);
                c2.breaks.push([rx, ry]);

            }
            // else {
            //     console.log('交点不在线段上');
            // }
        }
    }

    // 将线段上的点按坐标排序
    var sortedSegments = segments.map(function(s) {
        var newseg = [s.start];
        s.breaks.forEach(function(b){
            newseg.push(b);
        })
        newseg.push(s.end);
        return newseg.sort(sortBySequence);
    })

    // 路径裁切
    var segmentsP2P = [];
    for(var s in sortedSegments) {
        var seg = sortedSegments[s];
        var sl = seg.length;
        var index_ = 0;
        while(index_ < sl-1){
            segmentsP2P.push([seg[index_][0], seg[index_][1],
                seg[index_+1][0], seg[index_+1][1]]);
            index_++;
        }
    }

    //console.log(segmentsP2P);
    // console.log("交点一共有: %s个", bks);

    return segmentsP2P;
}

// 精度修正
function formatFloat(d, digital) {
    var m = Math.pow(10, digital);
    return parseInt(d * m, 10) / m;
}

// 断点排序
// p = [x, y], 以x -> +, y -> +
function sortBySequence(p1, p2) {
    if(p1[0] - p2[0] == 0) return (p1[1] - p2[1]);
    return p1[0] - p2[0];
}

// 计算两点间距
function disof2Points(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]))
}

// 交点是否在线段坐标范围内
// 使用绝对点的原因是考虑到一条线段的一个端点是另外一条线段的中间点
function online(u, v, w) {
    var max = v > w ? v : w;
    var min = v < w ? v : w;
    return (u <= max && u >= min);
}
// 是端点
function onEnd(c1, c2) {
    var x1 = c1.start[0], y1 = c1.start[1], x2 = c1.end[0], y2 = c1.end[1];
    var m1 = c2.start[0], n1 = c2.start[1], m2 = c2.end[0], n2 = c2.end[1];
    return ((x1 == m1 && y1 == n1) || (x1 == m2 && y1 == n2) || (x2 == m1 && y2 == n1) || (x2 == m2 && y2 == n2));
}