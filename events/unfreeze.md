# `unfreeze`

应用解冻前后触发。同一事件名会收到 `PRE` 和 `POST` 两个阶段。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getType()` | `String` | `PRE`：解冻前；`POST`：解冻成功后 |
| `getAppRecord()` | 应用对象 | 将被解冻或已被解冻的应用 |
| `getReason()` | `String` | 触发解冻的原因标识；不是固定枚举，适合作为诊断文本 |

**可取消：** 仅 `PRE` 阶段有效，取消后停止本次解冻。`POST` 阶段操作已经完成。

> **必须同步取消：** `event.cancel()` 必须直接在 `on('unfreeze', ...)` 回调内调用，不能放进 `async`。事件回调一旦返回，解冻流程就会继续，异步调用 `cancel()` 不再有效。

```js
on('unfreeze', function (event) {
    if (event.getType() === 'PRE') {
        log.i('阻止解冻: ' + event.getAppRecord().getPackageName());
        event.cancel();
    }
});
```

错误示例：

```js
on('unfreeze', function (event) {
    async(function () {
        event.cancel(); // 无效：同步事件回调已经返回
    });
});

on('unfreeze', async function (event) {
    event.cancel(); // 无效：同步事件回调已经返回
});
```
