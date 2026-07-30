# `checkState`

Freezer 检查应用是否具有活动状态时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | 正在检查的应用 |
| `hasState()` | `boolean` | 检查得到的原始活动状态；不是 `getHasState()` |

**阶段：** `NONE`  
**取消语义：** 此事件使用取消状态作为最终检查结果：

- `cancel()` 或 `setCancelled(true)`：最终结果为有活动状态。
- `setCancelled(false)`：最终结果为无活动状态。
