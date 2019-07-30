/* globals svgEditor */

// override default configuration
svgEditor.setConfig({
    //preventURLContentLoading: true,
    //preventAllURLConfig: true,
    //lockExtensions: true,

    // 扩展列表
    extensions: [
        //'ext-overview_window.js',
        //'ext-markers.js',
        //'ext-connector.js',
        // 滴管工具
        'ext-eyedropper.js',
        // 图形库
        //'ext-shapes.js',
        //'ext-imagelib.js',
        // 网格
        //'ext-grid.js',
        // 多边形工具(五边形only?)
        //'ext-polygon.js',
        // 星形工具
        //'ext-star.js',
        // 画板位置拖放工具
        'ext-panning.js',
        //'ext-storage.js'
    ],
    noDefaultExtensions: true,

    // 初始化页面的保存选项, false = 隐藏
    noStorageOnLoad: false,

    initFill: {
        color: 'ffffff',
        opacity: 0
    },
    // 描边宽度=1
    initStroke: {width: 0.5},
    lang: 'zh-CN',
    allowedOrigins: [window.location.origin], // May be 'null' (as a string) when used as a file:// URL

    // default atlas palette
    initShop: {
        fill: '#f9f3e9',
        stroke: '#e1cdb9',
        stroke_width: '0.2'
    },
    initFloor: {
        fill: '#ffffff',
        stroke: '#a56d57',
        stroke_width: '0.5',
        fill_opacity: '0'
    },
    initDisable: {
        fill: '#edece3',
        stroke: 'none'
    }

}, {
    allowInitialUserOverride: true
});