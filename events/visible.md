# `visible`

应用可见状态发生变化时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | 状态发生变化的应用 |
| `isState()` | `boolean` | `true`：变为可见；`false`：不再可见 |

**阶段：** `NONE`  
**可取消：** 是。取消会阻止 Freezer 随后执行解冻或重新冻结，但不会回滚可见状态。

```js
on('visible', function (event) {
    log.d(event.getAppRecord().getPackageName() + ': ' + event.isState());
});
