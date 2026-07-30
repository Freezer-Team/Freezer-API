# FJSE 开发文档

Freezer Java Script Engine（FJSE）是 Freezer 内置的 Rhino JavaScript 运行时。脚本运行在 Freezer 的系统模块环境中，可访问应用状态、冻结服务、事件、反射 Hook、配置和脚本设置页。

> **权限提示**：FJSE 不是沙箱。脚本拥有系统模块权限，`reflection`、`activityManagerService` 和 `network` 可能改变系统行为。只运行可信脚本。

## 1. 快速开始

### 脚本位置与加载

默认脚本目录由 Freezer 配置，通常为：

```text
/data/system_de/0/Freezer/scripts
```

只会自动加载普通文件名以 `.js` 结尾的文件。Freezer 启动时加载脚本；脚本管理器可以导入、删除或重新加载脚本。脚本导入后按文件名复制到上述目录。

### 最小脚本

```js
registerScript({
    name: 'FJSE 示例',
    version: '1.0.0',
    authors: ['作者']
});

on('load', function () {
    log.i('脚本已加载');
});

on('shutdown', function () {
    log.i('脚本即将卸载');
});

on('freeze', function (event) {
    var app = event.getAppRecord();
    if (app != null) log.d('冻结: ' + app.getPackageName());
});
```

`registerScript({...})` 必须在脚本主体执行期间调用，并且 `name` 不能为空；否则脚本会被跳过。`version` 和 `authors` 可选，`authors` 应为数组。

## 2. 运行模型

- Rhino 使用 ES6 语法。
- 事件回调默认同步执行；不要在回调中做长时间阻塞工作。
- `async(fn, ...)` 在后台执行并返回可等待的任务结果；用 `__await(future)` 等待结果。需要影响当前事件结果的逻辑（尤其是 `event.cancel()`）不得放入 `async`。
- 脚本卸载时会调用 `shutdown`，并移除脚本创建的事件监听、设置页和 Hook。
- 不要假设存在 `require` 或 `module`。

## 3. 全局对象与函数

以下名称是脚本可直接使用的公开对象：

| 名称 | 用途 |
| --- | --- |
| `freezerService` | 发送冻结消息、移除冻结消息 |
| `unfreezeService` | 解冻和临时解冻 |
| `log` | `d`、`i`、`w`、`e` 日志 |
| `apps` | 查询应用对象 |
| `processes` | 查询 `ProcessRecordAPI` |
| `reflection` | 查找/调用 Java 类、字段、方法和构造器；创建 Hook |
| `activityManagerService` | 获取 ActivityManager Context |
| `network` | 网络管理服务操作 |
| `systemChecker` | 查询系统类型 |
| `appSettings` | 修改应用配置 |
| `globalSettings` | 修改全局配置 |
| `ui` | 注册脚本设置页和控件 |
| `CakeHooker` | 暴露底层 Hook 类；优先使用 `hooker` |
| `hooker` | `before`、`after`、`replace` 的脚本友好封装 |
| `__scriptTag` | 当前脚本文件名；不要修改 |

### 生命周期和事件

```js
on('load', function () { /* 加载完成 */ });
on('shutdown', function () { /* 卸载前清理 */ });
on('freeze', function (event) { /* 事件对象作为唯一参数 */ });
```

事件名包括：

```text
visible, window, checkState, inputMethod, autoFill, credential,
accessibility, removeNotification, addNotification, updateNotification,
playbackState, playbackActivity, audio, mediaAction, mediaCommand,
binder, signal, packet, intent, bindService, unbindService,
freeze, unfreeze
```

事件对象提供与事件类型对应的属性，例如应用、状态和事件阶段信息。每个事件的完整参数、取值含义和取消行为见 [`events/README.md`](events/README.md)。可取消事件支持：

```js
on('freeze', function (event) {
    if (shouldBlock(event)) event.cancel();
});
```

只有事件本身支持取消时，`cancel()` 才会改变系统行为；不要默认所有事件都可取消。

### 内置函数

```js
async function future(value) {
    return value * 2;
};

var result = await future(21); // 42

sleep(100);
synchronized(function () {
    // 使用脚本级锁
});
synchronized(lockObject, function () {
    // 使用对象身份锁
});

load('helper.js'); // 相对当前脚本目录解析
```

`load()` 只读取并执行文件，不提供模块隔离。`async` 返回的 Future 在脚本销毁时可能无法提交；`__await` 被中断时返回 `null`。

## 4. 应用与进程 API

### 应用查询

```js
var app = apps.get('com.example.app', 0);
var byUid = apps.getByUid(10000);
var targets = apps.getRunningTargets();
```

应用常用属性：

```text
getPackageName()       getUserId()          getUid()
getApplicationInfo()   isXposed()           isFrozen()
isSystem()             getState()           isTargetApp()
getCategory()          getProcesses()
```

应用状态对象通过 `app.getState()` 获取，完整方法、参数和返回值见 [`api/app-state.md`](api/app-state.md)。例如：

```js
var app = apps.get('com.example.app', 0);
if (app != null) {
    var state = app.getState();
    log.i('可见=' + state.isVisible());
    log.i('窗口=' + state.isWindow());
    log.i('播放状态=' + state.getPlaybackState());
}
```

### 进程查询

```js
var process = processes.getProcessRecord('com.example.app', 10000);
var byPid = processes.getProcessRecord(1234);
var byObject = processes.getProcessRecord(systemProcessObject);
```

`ProcessRecordAPI` 常用 getter：

```text
getPackageName()              getProcessName()
getProcessNameWithIsolated()  getUserId()
getUid()                      getRunningUid()
getPid()                      isFrozen()
isFrozenBinder()              isIsolated()
getAppRecord()                getApplicationInfo()
```

查询不到对象时返回 `null`。调用服务前应先做空值检查。

## 5. 冻结、解冻和配置

```js
if (app != null) {
    freezerService.sendFreezeMessage(app);
    freezerService.sendFreezeMessage(app, 5000); // 间隔，毫秒
    freezerService.sendFreezeMessageInstant(app);
    freezerService.removeAppMessage(app);

    unfreezeService.thaw(app);
    unfreezeService.thawWithoutCheck(app);
    unfreezeService.thawQuiet(app);
    unfreezeService.temporaryUnfreezeIfNeed(app, '脚本操作', 3000);
}
```

应用配置：

```js
appSettings.set(app, 'someFlag', true);
appSettings.set(app, 'someNumber', 1);

globalSettings.set('someFlag', true);
globalSettings.set('someNumber', 1);
globalSettings.set('someLong', 1);
globalSettings.set('someText', 'value', true);
```

设置方法的返回值是底层设置操作的 `boolean` 结果。参数名和值的合法性由对应设置实现决定。

`network.destroyApp(app)`、`activityManagerService.getContext()` 和 `systemChecker.getSystemType()` 也属于高权限系统操作，调用前确认目标和失败行为。

## 6. 反射与 Hook

查找 Java 类时，传入完整类名字符串：

```js
var clazz = reflection.findClass('android.app.ActivityManager');
var method = reflection.findMethod(clazz, 'someMethod', 'java.lang.String');
var field = reflection.findField(clazz, 'someField');
var object = reflection.newInstance(clazz, arg1, arg2);
```

可用操作包括：

```text
findClass
callMethod / callStaticMethod
getObjectField / getStaticObjectField
setObjectField / setStaticObjectField
findMethod / findField / findConstructor
newInstance
hookBefore / hookAfter / hook
unhookAll
```

优先使用封装后的 `hooker`：

```js
var target = reflection.findMethod(clazz, 'target', 'java.lang.String');
var hook = hooker.before(target, function (callback) {
    log.d('调用前');
});

// 需要提前移除时：
hook.unhook();
```

Hook 自动按脚本文件名归属，脚本卸载时统一解除。Hook 回调应快速返回，不要保存失效的 Java 对象；反射失败要捕获并记录原因。

## 7. 设置页 UI

```js
ui.registerPage('FJSE 示例', function (page) {
    page.addSwitch('启用', '是否启用示例逻辑', true, function (value, packageName) {
        log.i('启用=' + value + ', package=' + packageName);
    });

    page.addDropdown('模式', ['安全', '激进'], 0, function (value, packageName) {
        log.i('模式=' + value);
    });

    page.addSlider('延迟', 0, 1000, 10, 100, function (value, packageName) {
        log.i('延迟=' + value);
    });

    page.addText('这是说明文字');
});
```

也可以指定应用包名：

```js
ui.registerPage('com.example.app', '应用设置', function (page) {
    page.addText('仅显示在目标应用设置中');
});
```

- `addSwitch(title, summary?, defaultValue, callback)` 回调参数为 `(boolean, packageName)`。
- `addDropdown(title, summary?, items, defaultIndex, callback)` 回调参数为 `(int, packageName)`。
- `addSlider(title, min, max, increment?, defaultValue, callback)` 回调参数为 `(double, packageName)`。
- `addText(text, callback?)` 的回调参数为 `(reason, packageName)`。
- UI 模块按脚本隔离；脚本卸载时自动清理。

## 8. 语法与调试

FJSE 支持现代 JavaScript 语法，并提供部分可选的简化写法。发布脚本时建议优先使用标准 JavaScript，以便在不同版本间迁移。

常见日志：

- 加载失败：确认文件名为 `.js`、编码为 UTF-8，并确认 `registerScript` 提供非空名称。
- 查询失败：检查目标包名、用户 ID、进程 PID 和返回值是否为 `null`。
- 事件未触发：检查事件名称、脚本是否已重新加载，以及回调是否抛出异常。
- Hook 或系统操作失败：检查目标和参数类型，并缩小操作范围。
- 设置页不显示：确认页面名称和回调有效，并将控件创建代码放在页面回调中。

错误信息通常会包含脚本文件名和行号；请据此定位问题。
## 9. 开发清单

新增脚本：

- [ ] 使用 UTF-8、`.js` 扩展名。
- [ ] 首先注册非空脚本名。
- [ ] 对 `apps`、`processes` 和事件对象做空值/字段检查。
- [ ] 长任务使用 `async`，并在 `shutdown` 中停止自有资源。
- [ ] 在 `shutdown` 中解除手动保存的 Hook 或计时器。
- [ ] 只在确认目标后调用反射和系统服务。

## 10. 常见问题

### 脚本没有加载

确认文件扩展名为 `.js`、文件编码为 UTF-8，并且脚本调用了 `registerScript` 且提供非空的 `name`。修改文件后重新加载脚本。

### 查询结果为空

应用或进程可能不存在、尚未运行，或用户 ID 不正确。使用服务前始终检查返回值是否为 `null`。

### 事件没有触发

检查事件名称拼写和大小写，并确认脚本已经重新加载。事件回调只会收到一个事件对象；可用的属性取决于具体事件类型。

### Hook 或系统操作失败

确认目标类、方法、字段和参数类型正确。反射、Hook、网络管理和冻结操作具有较高权限，只针对明确目标使用，并在回调中记录失败原因。

### 设置页没有显示

确认 `ui.registerPage` 的页面名称和回调有效，并将控件创建代码放在页面回调内部。脚本卸载后，相关页面会被自动移除。

## 11. 版本兼容提示

本文档描述当前公开的 FJSE API。Freezer 更新后，个别事件属性或系统相关行为可能发生变化；发布脚本前请在目标 Freezer 版本和目标 Android 系统上验证加载、事件、设置页以及卸载流程。
