# Freezer API 使用文档

## 1. 特性概览

- 冻结拦截：脚本可以通过 `event.cancel or event.setCancelled(true)` 阻止指定事件冻结应用。
- 线程池异步：支持 `async function`，每个脚本拥有独立的异步执行线程池。
- 任务等待：支持 `await` 等待另一个 `async function` 的返回值。
- 延时执行：支持 `sleep(milliseconds)`。
- 对象锁：支持 `synchronized(lock) { ... }` 临界区。
- 应用/进程查询：支持访问 Freezer 的应用缓存和进程列表。
- 冻结/解冻控制：支持执行冻结和执行解冻。
- Java 反射和 Hook：支持查找类、方法、字段、构造器和注册 Hook。

## 2. 最小脚本

```js
registerScript({
    name: "Example",
    version: "1.0.0",
    authors: ["Freezer"]
});

on("load", function () {
    log.i("Example loaded");
});
```

### `registerScript(info)`

注册脚本信息。`info` 是对象，可以包含：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `String` | 脚本名称 |
| `version` | `String` | 脚本版本 |
| `authors` | `Array<String>` | 作者列表 |

### `on(eventName, eventHandler)`

注册事件处理函数。事件名不区分大小写，同一事件重复注册时后注册的函数覆盖前一个函数。

支持的事件：

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `load` | 无 | 脚本加载并执行完成后调用 |
| `shutdown` | 无 | 脚本卸载前调用 |

## 3. 异步与并发

### `async function`

`async function` 会在当前脚本的线程池中执行。调用它会立即返回一个任务对象，不会阻塞调用线程。

```js
async function refreshApp(app) {
    sleep(100);
    log.i("refresh: " + app.getPackageName());
    return "done";
}

refreshApp(apps.get("com.example.app", 0));
```

异步函数可以作为事件处理器：

```js
on("visible", async function (event) {
    sleep(200);
    log.i("background work: " + app.getPackageName());
});
```

### `sleep(milliseconds)`

阻塞当前线程指定的毫秒数。建议只在 `async function` 内使用；如果在普通事件函数中使用，会阻塞事件分发线程。

```js
async function delayed() {
    sleep(1000);
    log.i("one second later");
}
```

### `await expression`

等待另一个 `async function` 返回的任务，并取得其返回值：

```js
async function loadValue() {
    sleep(91);
    return 78;
}

async function useValue() {
    var value = await loadValue();
    log.i("value = " + value);
}

useValue();
```

这里的 `await` 是 Freezer JavaScript Engine (FJE) 扩展语法。它主要用于等待 FJE 线程池任务。

### `synchronized(lock) { ... }`

使用同一个锁对象的代码块会串行执行：

```js
var lock = {};
var counter = 0;

async function increase() {
    synchronized(lock) {
        counter++;
    }
}

increase();
increase();
```

锁必须使用稳定的对象引用：

```js
var lock = {};       // 推荐
var badLock = "lock"; // 不推荐作为并发锁
```

底层函数形式也可用：

```js
async(function () {
    log.i("background task");
});

synchronized(lock, function () {
    counter++;
});
```

## 4. 注入的全局对象

### `log`

日志 API：

```js
log.d(message);
log.i(message);
log.w(message);
log.e(message);
```

`log.d`、`log.w`、`log.e` 也支持第二个 `Throwable` 参数。

### `apps`

应用缓存查询：

```js
var app = apps.get("com.example.app", 0);
var appByUid = apps.getByUid(10001);
var apps = apps.getRunningTargets();
```

不存在时返回 `null`。

### `processes`

进程查询：

```js
var process = processes.getProcessRecord("com.example.app:process", 10001);
var processByObject = processes.getProcessRecord(javaObject);
var processByPid = processes.getProcessRecord(1234);
```

不存在时返回 `null`。

### `freezerService`

冻结消息操作：

```js
freezerService.removeAppMessage(app);
freezerService.sendFreezeMessageInstant(app);
freezerService.sendFreezeMessage(app);
freezerService.sendFreezeMessage(app, 5000);
freezerService.sendFreezeMessageIgnoreMessages(app);
freezerService.sendFreezeMessageIgnoreMessages(app, 5000);
```

参数 `app` 必须是 `AppCache` 获取到的App对象。

### `unfreezeService`

解冻操作：

```js
unfreezeService.thaw(app);
unfreezeService.thawWithoutCheck(app);
unfreezeService.thawWithoutRemoveMessage(app);
unfreezeService.temporaryUnfreezeIfNeed(app, "script");
unfreezeService.temporaryUnfreezeIfNeed(app, "script", 5000);
```

### `hooker`

反射和 Hook API：

```js
var clazz = reflection.findClass("android.app.Activity");
var constructor = reflection.findConstructor(clazz);
var method = reflection.findMethod(clazz, "finish");
var methodResult = reflection.callStaticMethod(clazz, "finish");
var field = reflection.findField(clazz, "mField");
var fieldValue = reflection.getStaticObjectField(clazz, "mField");
reflection.setStaticObjectField(clazz, "mField", "REPLACE");
var instance = reflection.newInstance(clazz);
var instanceMethodResult = reflection.callMethod(instance, "finishInternal");
reflection.setObjectField(instance, "mPrivateField", "REPLACE");
var instanceFieldValue = reflection.getObjectField(instance, "mPrivateField");
```

Hook：

```js
var unhook = hooker.before(method, function (callback) {
});

unhook.unhook();

var unhook = hooker.after(method, function (callback) {
});

unhook.unhook();

var unhook = hooker.replace(method, function (callback) {
    return null;
});

unhook.unhook();
```

## 5. 脚本对象

### `AppRecord`

冻结/解冻事件、`whyNotFreeze` 和 `apps` 查询返回此对象：

```js
app.getPackageName();
app.getUserId();
app.getUid();
app.getApplicationInfo();
app.isXposed();
app.isFrozen();
app.isSystem();
app.isTargetApp();
app.getCategory();
```

### `ProcessRecord`

进程查询返回此对象：

```js
process.getPackageName();
process.getProcessName();
process.getProcessNameWithIsolated();
process.getUserId();
process.getUid();
process.getRunningUid();
process.getPid();
process.getAppRecord();
process.getApplicationInfo();
process.isFrozen();
process.isFrozenBinder();
process.isIsolated();
```

## 6. 完整示例

```js
registerScript({
    name: "Musicplayer Guard",
    version: "1.0.0",
    authors: ["Freezer Team"]
});

var lock = {};

on("load", function () {
    log.i("Musicplayer Guard loaded");
});

async function inspect(app) {
    sleep(100);
    synchronized(lock) {
        log.i("inspect " + app.getPackageName());
    }
}

on("freeze", async function (event) {
    await inspect(event.getAppRecord());
});

on("shutdown", function () {
    log.i("Musicplayer Guard unloaded");
});
```

## 7. 注意事项

1. `async` 任务的异常会记录到脚本日志，不能通过原事件调用栈返回。
2. `event.cancel and event.setCancelled` 是同步判定函数，不能写成需要后台等待的异步逻辑。
3. FJE 的 Java 对象和 Freezer API 对象可能不是普通 JavaScript 对象，不要随意复制或序列化。
4. Hook、冻结、解冻 API 会直接影响系统服务，脚本应处理 `null` 返回值并避免长时间阻塞。
5. 脚本卸载时会停止接收新异步任务，并等待已有任务结束；长时间 `sleep` 或死循环会延迟卸载。
