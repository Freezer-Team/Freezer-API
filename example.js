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
        var ActiveServices = reflection.findClass("com.android.server.am.ActiveServices");

        if (!ActiveServices) {
            log.e("[Example] 未找到 ActiveServices, 放弃 Hook");
            return;
        }

        var bumpMethod = reflection.findMethod(
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

        hooker.before(bumpMethod, async function(callback) {
            var record = callback.getArgs()[0];
            var package = reflection.getObjectField(record, "packageName");
            var userId = Number(reflection.getObjectField(record, "userId"));
            var app = apps.get(package, userId);
            if (!app)
                return;

            unfreezeService.thaw(app);
        });
    } catch (e) {
        log.e("[Example] 异常: ", e);
    }
});

// 当应用被冻结后触发
on("freeze", async function(event) {
    if (event.getType() == "POST")
        log.i("[DemoScript] freeze 触发，包名: " + event.getAppRecord().getPackageName() + ", 前台类型: " + event.getForegroundType());
});

// 当应用即将解冻时触发
on("unfreeze", function(event) {
    if (event.getType() == "PRE")
        log.i("[DemoScript] unfreeze 触发，包名: " + event.getAppRecord().getPackageName());
});

// 系统热重载时调用，可以在这里做一些资源释放或状态保存
on("shutdown", function() {
    log.i("[DemoScript] 脚本正在卸载...");
});
