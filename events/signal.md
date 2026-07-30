# `signal`

目标进程收到 Unix 信号时触发。事件来源不提供某项值时可能返回 `-1`。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getSignal()` | `int` | Unix 信号编号 |
| `getKillerUid()` | `int` | 信号发送方 UID |
| `getKillerPid()` | `int` | 信号发送方 PID |
| `getTargetPid()` | `int` | 目标 PID |
| `getTargetUid()` | `int` | 目标 UID |

**阶段：** `NONE`  
**可取消：** 是。取消只阻止 Freezer 因信号解冻目标，不会阻止信号本身。
