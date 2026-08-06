# `checkNotificationState`

Freezer 判断通知状态时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | 正在检查的应用 |
| `getNotification()` | 通知对象 | 检测的通知 |
| `isMedia()` | `boolean` | 是否为媒体通知 |
| `getFlags()` | `Set<String>` | 通知flags |
| `setResult()` | `int` | 设置通知类别, 默认为-1, -1 为让Freezer检测通知类别, 0 为拦截此通知, 1 为常驻通知, 2 为有进度条的常驻通知,  |

**阶段：** `NONE`  
**可取消：** 否。可通过`setResult(0)`阻止 Freezer 处理该通知。
