# `freeze`

应用冻结前后触发。同一事件名会收到 `PRE` 和 `POST` 两个阶段。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getType()` | `String` | `PRE`：冻结前；`POST`：冻结成功后 |
| `getAppRecord()` | 应用对象 | 将被冻结或已被冻结的应用 |
| `getForegroundType()` | `String` | 前台类型，见下表 |
| `getReason()` | `String` | 触发冻结的原因标识；不是固定枚举，适合作为诊断文本 |

`getForegroundType()` 常见值：

| 值 | 含义 |
| --- | --- |
| `BACKGROUND` | 后台应用 |
| `FOREGROUND` | 前台应用 |
| `SHARE_FOREGROUND` | 与前台应用共享 UID 或前台关系的应用 |

**可取消：** 仅 `PRE` 阶段有效，取消后停止本次冻结。`POST` 阶段操作已经完成。

> **必须同步取消：** `event.cancel()` 必须直接在 `on('freeze', ...)` 回调内调用，不能放进 `async`。事件回调一旦返回，冻结流程就会继续，异步调用 `cancel()` 不再有效。

```js
on('freeze', function (event) {
    if (event.getType() === 'PRE') {
        log.i('准备冻结: ' + event.getAppRecord().getPackageName());
    }
});
```
