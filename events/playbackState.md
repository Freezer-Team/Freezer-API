# `playbackState`

媒体会话播放状态变化时触发。

| 方法 | 类型 | 含义 |
| --- | --- | --- |
| `getAppRecord()` | 应用对象 | 媒体会话所属应用 |
| `getTag()` | `String` | 媒体会话标签 |
| `getState()` | `int` | Android PlaybackState 状态值 |
| `getPosition()` | `long` | 播放位置，通常为毫秒；未知时可能是系统的未知位置值 |
| `isPlaying()` | `boolean` | 应用聚合播放状态；`true` 表示仍有播放或缓冲中的会话 |

**阶段：** `NONE`  
**可取消：** 是。取消会阻止播放开始时解冻，或播放停止后安排冻结。
