var BINDER_TYPE = {
    TRANSACTION: 1,
    REPLY: 2,
    FREE_BUFFER_FULL: 3
};

var PROTO_TYPE = {
    IPV4: 4,
    IPV6: 6
};

var ReKernelXCallback = native.defineInterface(
    "cn.myflv.kernel.ReKernelXCallback",
    function () {
        this.define("binder", "void",
            "int.class", "int.class", "int.class", "int.class",
            "int.class", "int.class", "String.class", "int.class");

        this.define("signal", "void",
            "int.class", "int.class", "int.class",
            "int.class", "int.class");

        this.define("network", "void",
            "int.class", "int.class", "int.class");
    }
);

var ReKernelX = native.define(
    "cn.myflv.kernel.ReKernelX",
    function () {
        this.define("setCallback", "void", "cn.myflv.kernel.ReKernelXCallback.class");
        this.define("connect", "boolean");
        this.define("disconnect", "void");
        this.define("pollEvent", "void");
        this.define("addMonitorNet", "boolean", "int.class");
        this.define("delMonitorNet", "boolean", "int.class");
        this.define("addFreeAsync", "boolean", "String.class", "int.class", "int.class");
        this.define("delFreeAsync", "boolean", "String.class", "int.class");
    }
);

native.loadLibrary("ReKernelX");

var isRunning = false;

var callback = new ReKernelXCallback({
    binder: function (binderType, oneway, fromUid, fromPid, targetUid, targetPid, rpcName, code) {
        var app = apps.getByUid(targetUid);
        if (app == null || (oneway == 1 && binderType != BINDER_TYPE.FREE_BUFFER_FULL))
            return;

        unfreezeService.temporaryUnfreezeIfNeed(app, "ReKernelX-Binder");
    },

    signal: function (signal, killerUid, killerPid, dstUid, dstPid) {
        var process = processes.getProcessRecord(dstUid);
        if (process == null)
            return;

        unfreezeService.thaw(process);
    },

    network: function (proto, targetUid, dataLen) {
        var app = apps.getByUid(targetUid);
        if (app == null)
            return;

        var netReceive = appSettings.getBoolean(app, "netReceiveApps");
        var socket = appSettings.getBoolean(app, "socketApps");
        if (netReceive && socket) {
            unfreezeService.temporaryUnfreezeIfNeed(app, "ReKernelX-Network");
        }
    }
});

ReKernelX.setCallback(callback);

if (ReKernelX.connect()) {
    isRunning = true;
    log.i("ReKernelX 服务已连接");

    async(function () {
        while (isRunning) {
            try {
                ReKernelX.pollEvent();
            } catch (e) {
                log.e("pollEvent 异常: " + e);
                break;
            }
        }
    });
} else {
    log.e("ReKernelX 连接失败");
}

on("freeze", async function (event) {
    if (!isRunning)
        return;

    if (event.getType() != "POST")
        return;

    var app = event.getAppRecord();
    if (app == null)
        return;
    
    var netReceive = appSettings.getBoolean(app, "netReceiveApps");
    var socket = appSettings.getBoolean(app, "socketApps");
    if (netReceive && socket) {
        ReKernelX.addMonitorNet(app.getUid());
    }
});

on("unfreeze", async function (event) {
    if (!isRunning)
        return;

    if (event.getType() != "POST")
        return;

    var app = event.getAppRecord();
    if (app == null)
        return;
        
    ReKernelX.delMonitorNet(app.getUid());
});

on("shutdown", function () {
    log.i("正在卸载 ReKernelX...");
    
    isRunning = false;
    
    try {
        ReKernelX.disconnect();
    } catch (e) {
        log.e("断开连接异常: " + e);
    }
    
    log.i("ReKernelX 已卸载");
});

on("action", function () {
    if (isRunning) {
        log.i("正在卸载 ReKernelX...");
    
        isRunning = false;
    
        try {
            ReKernelX.disconnect();
        } catch (e) {
            log.e("断开连接异常: " + e);
        }
    
        log.i("ReKernelX 已卸载");
    } else {
        ReKernelX.setCallback(callback);

        if (ReKernelX.connect()) {
            isRunning = true;
            log.i("ReKernelX 服务已连接");

            async(function () {
                while (isRunning) {
                    try {
                        ReKernelX.pollEvent();
                    } catch (e) {
                        log.e("pollEvent 异常: " + e);
                        break;
                    }
                }
            });
        } else {
            log.e("ReKernelX 连接失败");
        }
    }
});