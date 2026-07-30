# `mediaCommand`

应用接收到媒体会话命令时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | 接收媒体命令的应用 |
| `getCommand()` | `String` | MediaSession 命令字符串 |

以 `GET_EXTRA_BINDER` 结尾的系统内部命令不会触发此事件。

**阶段：** `NONE`  
**可取消：** 是。取消只阻止 Freezer 临时解冻应用，不会阻止媒体命令本身。
