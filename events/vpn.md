# `vpn`

应用使用VPN时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | 状态发生变化的应用 |
| `isState()` | `boolean` | `true`：使用VPN；`false`：不再使用VPN |

**阶段：** `NONE`  
**可取消：** 是。取消会阻止 Freezer 随后执行解冻或重新冻结，但不会回滚VPN状态。
