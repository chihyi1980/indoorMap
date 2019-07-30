# AtlasIscan
##### 环境：
     1.	安装node(v0.10.28)
     (1). curl -O  http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
     (2). tar zxvf node-v0.10.28.tar.gz
     (3). cd node-v0.10.28 && ./configure （如果报错：检查系统环境）
     		a.检查python， python -V
     		b. sudo yum install -y gcc gcc-c++
     (4). ./configure && make && sudo make install

     2.	安装mongodb(2.6.3)
     (1).curl –O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.6.3.tgz
     (2).tar zxvf  mongodb-linux-x86_64-2.6.3.tgz
     (3).目录下启动：
     /usr/local/mongodb/bin/mongod --dbpath=/usr/local/server/mongodb/data --logpath=/usr/local/server/mongodb/logs --logappend  --auth  --port=27017 –fork
     		(注意：有些服务器需要sudo)
     	(4)到/usr/local/bin 创建 mogo 链接文件（软链接 sudo ln –s [source] [dest]）
     --------------------------配置文件启动----------------------------------------------
     	(5) 配置文件（仅供参考）：
             dbpath=/usr/local/include/mongodb/data
             logpath=/usr/local/include/mongodb/logs/mongodb.log
             pidfilepath=/usr/local/include/mongodb/mongodb.pid
             logappend = true
             #bind_ip = 127.0.0.1
             port = 27017
             fork = true
             #auth = true
             noauth = true
             directoryperdb = true
             journal = true
        (6).启动
     		./mongod --config $config_dir(配置文件目录)
     3. 安装nginx(1.0.15)
     	(1). 确保系统安装了gcc-c++、gcc、openssl-devel、pcre-devel和zlib-devel软件
     		sudo yum -y install zlib zlib-devel openssl openssl-devel pcre pcre-devel
     (2). curl -O http://nginx.org/download/nginx-1.0.15.tar.gz
     (3). tar zxvf nginx-1.0.15.tar.gz
     (4) cd nginx-1.0.15.tar.gz && ./configure && make && sudo make Install
     (5).sudo  ./nginx –t （如下输出，表示成功）
     	输出：	nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
     nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
         (6). sudo ln -s /usr/local/nginx/sbin/nginx ./nginx

##### 项目依赖：
        "express": "3.5.0",
        "mongoose": "3.8.12",
        "async": "0.9.0",
        "ejs": "1.0.0",
        "crypto": "0.0.3",
        "csv": "0.3.7",
        "cron": "1.0.1",
        "iconv-lite": "0.4.6",
        "excel-export": "0.4.1",
        "connect-multiparty": "1.2.4",
        "mongodb": "1.4.7",
        "eventproxy": "0.2.6",

##### 项目构成及部分说明：
> 1. 除了frontEnd文件夹，均为后台接口代码，controller/*Min.js,和model/*Min.js请先无视（grunt压缩代码）。
    - (1). controller/tagger.js/exports.multiAddTagger 方法为接受app发送的数据，并入库。
    - (3). controller/analysis.js 主要用来查询analysis表，给前端提供分析数据以供画数据报表。

> 2. 实时计划任务 cron
    - （1） cron/taggerToAnalysis.js 为每天晚上12点半，把最近分析表的前3天的数据分析（历史遗留，未改进）。
    - （2） cron/taggerToTrack.js 把收到的tagger数据实时生成track数据（*非常重要*）。
    - （3） cron/clearTagger5DaysAgo.js 清楚tagger历史数据。
    - cron/ 下其他的文件都是历史遗留，请无视。
> 3. 前台部分frontEnd
    - (1). 入口文件frontEnd/index.html，需要node app.js运行后，才可访问。该html是由后端渲染的res.render('index'),其他html页面都是有angularjs渲染。
    - (2). html/文件下为前端页面，公用部分有：com-footer.html、com-menu.html、com-nav.html和left-menu.html。其中left-menu.html为tagger.html、overview.html和analysis.html共用的左选单部分。
    - (3). controller/indoorMap.js 查询实时的Track数据。对应html/indoorMap.html。
    - (4). controller/analysis.js 查询分析后的数据图表。对应html/analysis.html。
    - (5). controller/overview.js 跨天查询分析后的数据报表。对应html/overview.html。
    - (6). controller/tagger.js 查询扫描到beacon的实时数据。对应html/tagger.html。
    - (7). controller/jobsite.js 工地添加和删除、名称修改、工地csv文件数据上传及匹配。对应html/jobsite.html。
    - (8). controller/beacon.js iscan查询列表展示。 对应html/beacon.html。
    - (9). controller/device.js 用户设备列表查询展示。对应html/device.html。
    - (10). controller/login.js 和controller/user.js 临时的简单系统用户登录。对应html/login.html和html/user.html。
    - (11). config.js 注意本地运行时，将api_prefix，将其值设置为''。
    - (12). service.js 主要提供controller/device.js和controller/beacon.js获取数据。

