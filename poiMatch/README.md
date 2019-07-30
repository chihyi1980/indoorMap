##2017年07月10日重要更新(兼容chrome59)
#### 更新加解密依赖文件(详细见git上当天改动):
###### 1. backend/proxy/ 下添加文件 atlas_crypto.js  原先的是 encryptJSON.js保留未删除(可删除)
###### 2. backend/controller/map.js 下 第13行改成引用atlas_crypto 变成var encryptJson = require('../proxy/atlas_crypto.js').encode; 第933行去除JSON.stringify,变成： var mapData = encryptJson(req, mapArray);
###### 3. frontEnd/public/mapSdk/js/下 atlasSdk.release.js 和 atlasSdk.js, 更换了atlasSdk.release.js里的加解密算法， atlasSdk.js是由 atlasSdk.release.js压缩得到(可用网上的在线压缩)
###### 4. frontEnd/js/exportImage.js 去除旧的加解密算法
####更新 poiMatch时 尽量采用局部文件更新, 如果直接git上代码，则需要检查库文件和config文件，重新配置
#poiMatch
#####部署更改时需要更改如下：
>
* 1.backend/config/config.js : dburl, redirect_prefix
* 2.frontEnd/js/config.js : BASE_URL
* 3.backend/controller/user.js : defaultOptions

> iscan2服务器上特别注意:
 * .backend/controller/user.js  是管登陆验证的,由于iScan2上改成ucloud线上服务器,user.js下代码不兼容线上3.*版本认证模式的mongodb连接,需要在本地mongodb新增iscan2需要的帐户,既可登陆.
 * iScan2上mongodb操作：mongo - use iscan - db.user.insert({name: '名称', password: '32位md5字符串',isAdmin: false, enabled: true})
 * 其他服务器上匹配工具无影响

*demo/ 商场通demo

#部分重要文件说明
### ./backend 后台部分
> ./backend/controller:
* user.js 登录认证部分
* poi.js 匹配工具更新poi部分
* mapEditor.js 地图编辑器部分
* xunxiApi.js 寻息地图SDK调用的API

### ./frontEnd 前端部分
> ./draw 匹配工具画路径的模块
> ./geoMathching 大地图配准部分(整合进来的)
> ./svgEditor 地图编辑部分(整合进来的)
> ./public
* ./attrsConfig  对应新建的商场 mall,building,floor,shop的字段
* ./css 自定义css
* ./mapSdk 匹配工具所用的sdk
> ./html/poiMath.html 匹配工具的html部分
> ./js/* angular前台
* ./controller/map.js 匹配工具的主要js文件
* ./service/index.js angular factory,directive,filter
* ./exportImage.js 导出图片功能模块
* ./navigationPathCutter.js 将所画路径切割成点(整合进来的)
* ./route.js  前端路由
> ./lib 外部引用库

