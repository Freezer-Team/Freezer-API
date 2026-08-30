on('load', function () {
    log.i('模块已加载');
});

on('shutdown', function () {
    log.i('模块即将关闭');
});

on('action', function () {
    log.i('用户执行操作');
});

on('freeze', function (event) {
    var app = event.getAppRecord();
    if (app != null) log.d('冻结: ' + app.getPackageName());
});