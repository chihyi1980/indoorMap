var models = require('../model');
var Analysis = models.Analysis;
var Track = models.Track;//Tagger = models.Tagger
var Jobsite = models.Jobsite;
var csv = require('csv');
var fs = require('fs');
var iconv = require('iconv-lite');
var nodeExcel = require('excel-export');
var path = require('path');

//获取某一天的analysis数据
exports.getInOneDay = function(req, res){
    var date = req.body.date;
    var id = req.body.id;
    var type = req.body.type;

    var today = new Date().Format('yyyy-MM-dd');
    if(date < today ){
        Analysis.findOneByCompositeIndex(date, id, function(err, ret){
            if(err){
                res.json(500, {message: err.toString()});
            }else{
                res.json(200, ret);
            }
        })
    }else{ // 如果是当天，就去tagger表中实时分析出当天数据// 改为去Track表分析
	var begin = date + ' 00:00:30',// var begin = new Date(date + ' 00:00:30'),
            end = date + ' 23:59:29';// end = new Date(date + ' 23:59:29')
        Jobsite.getAll(null, null,{isDel: false}, function(err, ret){
            if(err){
                res.json(500, {message: err.toString()});
            }
            var jMap = {};
            if(ret){
                ret.forEach(function(item){
                    jMap[item._id] = item.name;
                });

                if(type == 'byUser'){
                    Track.find({userId: id, enterTime:{'$gte': begin, '$lt': end}})
                        .batchSize(500)
                        .exec(function(err, taggers){//Tagger
                        if(err){
                            res.json(500, {message: err.toString()});
                        }else{
                            if(taggers && taggers.length > 0){
                                var data15 = groupByJobsiteId(taggers, 15, jMap);//将查询到的数据处理并按工地分组
                                var data20 = groupByJobsiteId(taggers, 20, jMap);
                                var data30 = groupByJobsiteId(taggers, 30, jMap);
                                var newAnalysis = {
                                    date: date,
                                    record:{
                                        30: data30,
                                        20: data20,
                                        15: data15
                                    },
                                    recordId: id,
                                    type: 'byUser'
                                };
                                res.json(200, newAnalysis);
                            }else{
                                res.json(200, null);
                            }
                        }
                    })
                }else if(type == 'byJobsite'){
                    Track.find({jobsiteId: id, enterTime:{'$gte': begin, '$lt': end}})
                        .batchSize(500)
                        .exec(function(err, taggers){//Tagger
                        if(err){
                            res.json(500, {message: err.toString()});
                        }else{
                            if(taggers && taggers.length > 0){
                                var data15 = groupByUserId(taggers, 15, jMap);//将查询到的数据处理并按用户分组
                                var data20 = groupByUserId(taggers, 20, jMap);
                                var data30 = groupByUserId(taggers, 30, jMap);
                                var newAnalysis = {
                                    date: date,
                                    record:{
                                        30: data30,
                                        20: data20,
                                        15: data15
                                    },
                                    recordId: id,
                                    type: 'byJobsite'
                                };
                                res.json(200, newAnalysis);
                            }else{
                                res.json(200, null);
                            }
                        }
                    })
                }
            }else{
                res.json(200, null);
            }
        });
    }
};

//获取一段时间内的分析数据。由于分析数据要半夜生成，所以数据中不包含当天数据。
exports.getInPeriod = function(req, res){
    var begin = req.body.begin||req.query.begin,
        end = req.body.end||req.query.end,
        id = req.body.id||req.query.id;
    if(begin && end){
        begin = new Date(begin).Format('yyyy-MM-dd');
        end = new Date(end).Format('yyyy-MM-dd');
        Analysis.findSomeInPeriod(id, begin, end, function(err, ret){
            if(err){
                res.json(500, {message: err.toString()});
            }else{
                var result = hoursADay(ret);//根据分析的数据计算出时长
                res.json(200, result);
            }
        })
    }else{
        res.json(500, {message: 'invalid argument'});
    }
};

var hoursADay = function(reconds){
    var data = [],
        six,fifteen,YList, tempList;
    for(var i= 0; i < reconds.length; ++i){
        six = reconds[i].record['20'];
        fifteen = reconds[i].record['15'];
        YList = six.YList || fifteen.YList;
        var record = [],
            tempObj = {};
        for(var k= 0; k < YList.length; ++k) {
            tempList = six.data[YList[k]];
            var value = 0;
            var temp = {};
            for (var j = 0; j < tempList.length; ++j) {
                if (tempList[j].type == 0 || j == 0) {
                    continue;
                } else {
                    value += tempList[j].value - tempList[j - 1].value;
                }
            }
            temp.name = YList[k];
            temp.sum = getTime(value, 'en');
            temp.begin = getTime(tempList[0].value);
            temp.end = getTime(tempList[tempList.length -1].value);
            temp.lat = tempList[0].lat;
            temp.lon = tempList[0].lon;
            record.push(temp);
        }
        tempObj.date = reconds[i].date;
        tempObj.type = reconds[i].type;
        tempObj.record = record;
        tempObj.recordId = reconds[i].recordId;
        data.push(tempObj);
    }
    return data;
};

function getTime(time, type){
    if(time == 0){
        return '';
    }
    var hour = parseInt(time),
        minute = parseInt((+time - hour) * 60),
        str;
    if(type == 'ch'){
        if(hour > 0){
            if(minute > 0){
                str =  hour + '小时' + minute + '分钟';
            }else{
                str = hour + '小时';
            }
        }else{
            str = minute + '分钟';
        }
    }else{
        minute = JSON.stringify(minute);
        if(minute.length == 1){
            minute = '0' + minute;
        }
        if(hour > 0){
                str =  hour + ':' + minute;
        }else{
            str = '00:' + minute
        }
    }
    return str;
}

//导出csv文件。已经废弃
exports.exportToCsv = function(req, res){
    var data = req.body.data;
    var type = req.body.type;
    var title1 = type == 'jobsite' ? '工人名称' : '工人姓名',
        title2 = type == 'jobsite' ? '工人名单' : '所在工地';

    var result = [['日期', title1,title2,'首次入场时刻','最后离场时刻','工作时长']];

    if(data && data.length > 0) {
        data.forEach(function(item){
            var record = [];
            record[0] = item.date || '-';
            record[1] = item.rId || '-';
            record[2] = item.record[0].name || '-';
            record[3] = item.record[0].begin || '-';
            record[4] = item.record[0].end || '-';
            record[5] = item.record[0].sum || '-';
            result.push(record);
            for(var i = 1; i < item.record.length; i++){
                var tempList = [];
                tempList[0] = '-';
                tempList[1] = '-';
                tempList[2] = item.record[i].name || '-';
                tempList[3] = item.record[i].begin || '-';
                tempList[4] = item.record[i].end || '-';
                tempList[5] = item.record[i].sum || '-';
                result.push(tempList);
            }
        });
        var  dir = './frontEnd/tmp/iscan.csv';
        try{
            csv().from.array(result).to(dir);
            res.json(200, {url: '/analysis/getCsv/iscan.csv'});
        }catch (err){
            res.json(500, {message: err.toString()});
        }
    }
};

exports.getCsv = function(req, res){
    var txt;
    var path = './frontEnd/tmp/iscan.csv';
    var  encode = req.query['encode'] || 'utf-8';
    fs.readFile(path, function(err, data){
        if(err){
            console.error(err)
        }else{
            if(encode == 'utf-8'){
                res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
                res.send(data);
            }else{
                var str = iconv.decode(data, 'utf-8');
                var str2 = iconv.encode(str, 'gb2312');
                res.setHeader('Content-Type', 'text/csv; charset=gb2312');
                res.send(str2);
            }
        }
    });
};

//导出xlsx文件。
exports.exportToXlsx = function(req, res){
    var data = req.body.data;
    var type = req.body.type;
    var title1 = type == 'jobsite' ? '工地名称' : '工人姓名',
        title2 = type == 'jobsite' ? '工人名单' : '所在工地';
    var conf = {};
    conf.cols = [
        {caption: '日期', type:'string'},
        {caption: title1, type:'string'},
        {caption: title2, type:'string'},
        {caption:'首次入场时刻', type:'string'},
        {caption:'最后离场时刻', type:'string'},
        {caption:'工作时长', type:'string'}
    ];
    conf.rows = [];
    if(data && data.length > 0) {
        data.forEach(function(item){
            var record = [];
            record[0] = item.date || '-';
            record[1] = item.rId || '-';
            record[2] = item.record[0].name || '-';
            record[3] = item.record[0].begin || '-';
            record[4] = item.record[0].end || '-';
            record[5] = item.record[0].sum || '-';
            conf.rows.push(record);
            for(var i = 1; i < item.record.length; i++){
                var tempList = [];
                tempList[0] = '-';
                tempList[1] = '-';
                tempList[2] = item.record[i].name || '-';
                tempList[3] = item.record[i].begin || '-';
                tempList[4] = item.record[i].end || '-';
                tempList[5] = item.record[i].sum || '-';
                conf.rows.push(tempList);
            }
        });
        var  dir =  path.join(global.root_dir,'frontEnd/tmp/iscan.xlsx');
        try{
            var result = nodeExcel.execute(conf);
            fs.writeFileSync(dir, result, 'binary');
            res.json(200, {url: '/analysis/getCsv/iscan.xlsx'});
        }catch (err){
            res.json(500, {message: err.toString()});
        }
    }
};

exports.getXlsx = function(req, res){
    var dir =  path.join(global.root_dir,'frontEnd/tmp/iscan.xlsx');
    fs.readFile(dir, function(err, data){
        if(err){
            console.error(err)
        }else{
            res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=UTF-8');
            res.send(data);
        }
    });
};

//将taggers按照工地分组。ms：minuteSpace，间隔时间，单位（分钟）
function groupByJobsiteId(taggers, ms, jMap){
    taggers = JSON.parse(JSON.stringify(taggers));
    var second = 60 * 1000;//写错了变量名，表示一分钟
    var proxy = {},
        jobs = [],
        res = {},
        list,
        tempDate;
    for(var i=0; i< taggers.length; ++i){
        var index = jMap[taggers[i].jobsiteId].replace(/\./g,'_');//json的key不能含有字符‘.’
        if(proxy[index] == undefined){
            proxy[index] = [];
            jobs.push(index);
        }
        tempDate = new Date(taggers[i].enterTime);
        taggers[i].time = new Date(taggers[i].enterTime).getTime();
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
        taggers[i].jobsite = jMap[taggers[i].jobsiteId];
        //delete taggers[i].enterTime;
        proxy[index].push(taggers[i]);
    }
    jobs = jobs.sort(function(a,b){
        return a > b;
    });
    res.YList = jobs;
    res.data = {};
    for(var i in proxy){
        list = proxy[i];
        if(res.data[i] == undefined){
            res.data[i] = [];
        }
        list[0].type = 0;
        res.data[i].push(list[0]);
        for(var j = 1; j < list.length; ++j) {
            if(list[j].time - list[j-1].time > ms * second){
                var item1 = JSON.parse(JSON.stringify(list[j-1]));
                var item2 = JSON.parse(JSON.stringify(list[j]));
                tempDate = new Date(item1.time + 0.5 * second);
                item1.type = 1 ;
                item1.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
                item1.time = tempDate.getTime();
                item2.type = 0;
                res.data[i].push(item1);
                res.data[i].push(item2);
            }
        }
        if(res.data[i].length % 2  == 1){
            var temp = JSON.parse(JSON.stringify(list[list.length - 1]));
            tempDate = new Date(temp.time + 0.5 * second);
            temp.type = 1;
            temp.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
            temp.time = tempDate.getTime();
            res.data[i].push(temp);
        }
    }
    return res;
}

//将taggers按用户分组。ms：minuteSpace，间隔时间，单位（分组）
function groupByUserId(taggers, ms, jMap){
    taggers = JSON.parse(JSON.stringify(taggers));
    var second = 60 * 1000;
    var proxy = {},
        users = [],
        res = {},
        list,
        tempDate;
    for(var i=0; i< taggers.length; ++i){
        var index = taggers[i].userId.replace(/\./g,'_');//json的key不能含有字符‘.’
        if(proxy[index] == undefined){
            proxy[index] = [];
            users.push(index);
        }
        tempDate = new Date(taggers[i].enterTime);
        taggers[i].time = new Date(taggers[i].enterTime).getTime();
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
        taggers[i].jobsite = jMap[taggers[i].jobsiteId];
        delete taggers[i].enterTime;
        proxy[index].push(taggers[i]);
    }
    users = users.sort(function(a,b){
        return a > b;
    });
    res.YList = users;
    res.data = {};
    for(var i in proxy){
        list = proxy[i];
        if(res.data[i] == undefined){
            res.data[i] = [];
        }
        list[0].type = 0;
        res.data[i].push(list[0]);
        for(var j = 1; j < list.length; ++j) {
            if(list[j].time - list[j-1].time > ms * second){
                var item1 = JSON.parse(JSON.stringify(list[j-1]));
                var item2 = JSON.parse(JSON.stringify(list[j]));
                tempDate = new Date(item1.time + 0.5 * second);
                item1.type = 1 ;
                item1.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
                item1.time = tempDate.getTime();
                item2.type = 0;
                res.data[i].push(item1);
                res.data[i].push(item2);
            }
        }
        if(res.data[i].length % 2  == 1){
            var temp = JSON.parse(JSON.stringify(list[list.length - 1]));
            tempDate = new Date(temp.time + 0.5 * second);
            temp.type = 1;
            temp.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
            temp.time = tempDate.getTime();
            res.data[i].push(temp);
        }
    }
    return res;
}

//db.tagger.remove({userId:'13700000012',enterTime: {$gt: ISODate('2015-03-06 06:46:22.000Z')}})

