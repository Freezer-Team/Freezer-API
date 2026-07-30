# `updateNotification`

系统更新通知时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getOldRecord()` | 通知对象或 `null` | 更新前的通知；旧记录无效时可能为 `null` |
| `getNewRecord()` | 通知对象 | 更新后的通知 |

通知对象支持 `getSbn()` 和 `isMediaNotification()`。

**阶段：** `NONE`  
**可取消：** 是。取消只阻止 Freezer 处理更新，不会阻止系统替换通知。
