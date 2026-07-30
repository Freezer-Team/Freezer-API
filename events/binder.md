# `binder`

检测到目标进程的 Binder 通信时触发。不同系统或事件来源可能用 `-1` 表示未知值。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getBinderType()` | `int` | `-1` 未知；`0` 事务调用；`1` 事务回复；`2` 异步 Binder 空闲缓冲区耗尽 |
| `isOneway()` | `boolean` | 是否为异步 one-way 调用 |
| `getFromPid()` | `int` | 调用方 PID；未知时为 `-1` |
| `getFromUid()` | `int` | 调用方 UID；未知时为 `-1` |
| `getTargetPid()` | `int` | 目标进程 PID |
| `getTargetUid()` | `int` | 目标应用 UID |
| `getRpc()` | `String` 或 `null` | Binder 接口/RPC 名称 |
| `getCode()` | `int` | Binder transaction code；未知时为 `-1` |

**阶段：** `NONE`  
**可取消：** 是。取消只阻止 Freezer 解冻处理，不会取消 Binder 事务。
