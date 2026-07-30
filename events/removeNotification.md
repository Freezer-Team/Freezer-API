# `removeNotification`

系统移除通知时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getRecord()` | 通知对象 | 被移除的通知 |

通知对象支持 `getSbn()` 和 `isMediaNotification()`。

**阶段：** `NONE`  
**可取消：** 是。取消只阻止 Freezer 更新对应应用状态，不会阻止系统移除通知。
