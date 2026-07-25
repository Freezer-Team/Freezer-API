/**
 * 示例脚本，演示如何使用 Freezer 提供的 Hooker API 进行 Hook 操作。
 */

registerScript({
    name: "Example",
    version: "1.0.0",
    authors: ["Freezer Develop Team"]
});

// 脚本被加载后触发
on("load", function() {
    log.i("[Example] 脚本已成功加载！");

    try {
        var ActiveServices = hooker.findClass("com.android.server.am.ActiveServices");

        if (!ActiveServices) {
            log.e("[Example] 未找到 ActiveServices, 放弃 Hook");
            return;
        }

        var bumpMethod = hooker.findMethod(
            ActiveServices, 
            "bumpServiceExecutingLocked", 
            "com.android.server.am.ServiceRecord", 
            "boolean", 
            "java.lang.String", 
            "int", 
            "boolean"
        );

        if (!bumpMethod) {
            log.e("[Example] 未找到 bumpServiceExecutingLocked 方法！");
            return;
        }

        hook.before(bumpMethod, async function(callback) {
            var record = callback.getArgs()[0];
            var package = hooker.getObjectField(record, "packageName");
            var userId = Number(hooker.getObjectField(record, "userId"));
            var app = apps.get(package, userId);
            if (!app)
                return;

            unfreezeService.thaw(app);
        });
    } catch (e) {
        log.e("[Example] 异常: ", e);
    }
});

async function onBeforeThaw(app, temporary) {
    log.i("[DemoScript] beforeThaw 触发，包名: " + app.getPackageName() + ", 是否临时解冻: " + temporary);
    await sleep(7000);
    log.i("[DemoScript] beforeThaw2 触发，包名: " + app.getPackageName() + ", 是否临时解冻: " + temporary);
}

// 当应用被冻结后触发
on("afterFreeze", async function(app, foregroundType) {
    log.i("[DemoScript] afterFreeze 触发，包名: " + app.getPackageName() + ", 前台类型: " + foregroundType);
});

// 当应用即将解冻时触发
on("beforeThaw", function(app, temporary) {
    onBeforeThaw(app, temporary);
});

// 当应用解冻完成后触发
on("afterThaw", function(app, temporary) {
    log.i("[DemoScript] afterThaw 触发，包名: " + app.getPackageName());
});

// 系统热重载时调用，可以在这里做一些资源释放或状态保存
on("shutdown", function() {
    log.i("[DemoScript] 脚本正在卸载...");
});

// 错误忽略配置函数
function isIgnoreError() {
    // 返回 true 表示脚本内部抛出异常时不输出到日志中，返回 false 表示输出异常到日志中。默认返回 false。
    return true;
}

// 应用冻结前检测函数
function allowFrozen(app) {
    // 返回 字符串内容 表示不允许这个应用冻结，返回 null 表示允许这个应用冻结。默认返回 null。
    return null;
}
