# `intent`

Intent 目标为冻结应用时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | Intent 的目标应用 |

**阶段：** `NONE`  
**取消语义：** 取消状态决定 Freezer 是否临时解冻目标应用：

- `cancel()` / `setCancelled(true)`：限制临时解冻。
- `setCancelled(false)`：允许临时解冻。

这不会取消 Android Intent 本身。
