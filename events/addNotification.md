# `addNotification`

系统新增通知时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getRecord()` | 通知对象 | 新增的通知 |

通知对象支持：

- `getSbn()`：Android `StatusBarNotification` 对象。
- `isMediaNotification()`：是否被识别为媒体通知。

**阶段：** `NONE`  
**可取消：** 是。取消只阻止 Freezer 处理该通知，不会阻止系统显示通知。
