# FJSE 事件参考

每个事件回调只接收一个 `event` 对象：

```js
on('事件名', function (event) {
    // 使用下表所列方法读取参数
});
```

所有事件都可调用：

| 方法 | 返回值 | 作用 |
| --- | --- | --- |
| `getType()` | `String` | 事件阶段：`NONE`、`PRE` 或 `POST` |
| `isCancelled()` | `boolean` | 当前取消状态 |
| `cancel()` | 无 | 将事件标记为取消 |
| `setCancelled(value)` | 无 | 显式设置取消状态 |

> **取消事件必须同步处理：** 如果需要调用 `event.cancel()` 或 `event.setCancelled(...)`，必须直接在 `on(...)` 回调中完成。不要把判断或取消操作放进 `async`，因为原同步回调返回后 Freezer 会立即继续处理；异步任务稍后修改事件已经来不及。
>
> `cancel()` 只改变 Freezer 对事件的后续处理，一般不会撤销已经发生的 Android 系统行为。具体语义见各事件文档。

## 应用状态

- [`visible`](visible.md)
- [`window`](window.md)
- [`checkState`](checkState.md)
- [`inputMethod`](inputMethod.md)
- [`autoFill`](autoFill.md)
- [`credential`](credential.md)
- [`accessibility`](accessibility.md)

## 通知

- [`addNotification`](addNotification.md)
- [`removeNotification`](removeNotification.md)
- [`updateNotification`](updateNotification.md)

## 媒体与音频

- [`playbackState`](playbackState.md)
- [`playbackActivity`](playbackActivity.md)
- [`audio`](audio.md)
- [`mediaAction`](mediaAction.md)
- [`mediaCommand`](mediaCommand.md)

## 系统通信

- [`binder`](binder.md)
- [`signal`](signal.md)
- [`packet`](packet.md)
- [`intent`](intent.md)
- [`bindService`](bindService.md)
- [`unbindService`](unbindService.md)

## 冻结与解冻

- [`freeze`](freeze.md)
- [`unfreeze`](unfreeze.md)
