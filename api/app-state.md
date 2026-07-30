# AppState API

`app.getState()` 返回应用当前状态对象。先确认 `app` 不为 `null`，再读取状态：

```js
var app = apps.get('com.example.app', 0);
if (app != null) {
    var state = app.getState();
    log.i('可见=' + state.isVisible());
    log.i('窗口=' + state.isWindow());
    log.i('播放状态=' + state.getPlaybackState());
}
```

## 返回值约定

- 布尔状态 getter 返回 `boolean`。
- 播放活动、播放状态和电话状态 getter 返回 `int`。
- 播放位置 getter 返回 `long`。
- 状态 setter 的返回值为 `boolean`：表示这次状态设置是否改变了状态；不要据此推断底层系统操作已经发生。
- 本文没有定义整数状态的枚举值。除非目标 Freezer 版本另有公开说明，不要猜测 `int` 值的含义。

## 播放与音频

| 方法 | 参数 | 返回值 | 含义 |
| --- | --- | --- | --- |
| `setPlaybackActivity(value)` | `int` | `boolean` | 设置播放活动状态。整数值的枚举未在本文定义。 |
| `getPlaybackActivity()` | 无 | `int` | 读取播放活动状态。不要猜测整数值。 |
| `setPlaybackState(value)` | `int` | `boolean` | 设置媒体播放状态。整数值的枚举未在本文定义。 |
| `getPlaybackState()` | 无 | `int` | 读取媒体播放状态。不要猜测整数值。 |
| `setPlaybackPosition(value)` | `long` | `boolean` | 设置媒体播放位置。具体单位和特殊值以目标版本的公开说明为准。 |
| `getPlaybackPosition()` | 无 | `long` | 读取媒体播放位置。不要猜测单位或特殊值。 |
| `setAudio(value)` | `boolean` | `boolean` | 设置应用是否处于音频活动状态。 |
| `isAudio()` | 无 | `boolean` | 是否处于音频活动状态。 |
| `setScreenRecording(value)` | `boolean` | `boolean` | 设置应用是否处于屏幕录制状态。 |
| `isScreenRecording()` | 无 | `boolean` | 是否处于屏幕录制状态。 |

## 前台、窗口与可见性

| 方法 | 参数 | 返回值 | 含义 |
| --- | --- | --- | --- |
| `setForegroundActivities(value)` | `boolean` | `boolean` | 设置是否存在前台 Activity。 |
| `isForegroundActivities()` | 无 | `boolean` | 是否存在前台 Activity。 |
| `setWindow(value)` | `boolean` | `boolean` | 设置是否存在窗口状态。 |
| `isWindow()` | 无 | `boolean` | 是否存在窗口状态。 |
| `setVisible(value)` | `boolean` | `boolean` | 设置应用是否可见。 |
| `isVisible()` | 无 | `boolean` | 应用是否可见。 |
| `setPendingTop(value)` | `boolean` | `boolean` | 设置是否处于 Pending Top 状态。 |
| `isPendingTop()` | 无 | `boolean` | 是否处于 Pending Top 状态。 |

## 通知

| 方法 | 参数 | 返回值 | 含义 |
| --- | --- | --- | --- |
| `setHasOnGoingNotification(value)` | `boolean` | `boolean` | 设置是否存在常驻通知。 |
| `hasOnGoingNotification()` | 无 | `boolean` | 是否存在常驻通知。 |
| `setHasProgressNotification(value)` | `boolean` | `boolean` | 设置是否存在带进度的通知。 |
| `hasProgressNotification()` | 无 | `boolean` | 是否存在带进度的通知。 |
| `addOnGoingNotification(key)` | `String` | 无 | 添加常驻通知标识。 |
| `removeOnGoingNotification(key)` | `String` | 无 | 移除常驻通知标识。 |
| `getOnGoingNotification()` | 无 | `Set<String>` | 获取常驻通知标识集合。 |
| `addProgressNotification(key)` | `String` | 无 | 添加进度通知标识。 |
| `removeProgressNotification(key)` | `String` | 无 | 移除进度通知标识。 |
| `getProgressNotification()` | 无 | `Set<String>` | 获取进度通知标识集合。 |

集合方法使用通知标识字符串。不要修改 getter 返回集合的内容；需要变更时使用对应的 `add` 或 `remove` 方法。

## 定位、录制与系统服务状态

| 方法 | 参数 | 返回值 | 含义 |
| --- | --- | --- | --- |
| `setHighLocation(value)` | `boolean` | `boolean` | 设置是否存在高精度定位状态。 |
| `isHighLocation()` | 无 | `boolean` | 是否存在高精度定位状态。 |
| `setLowLocation(value)` | `boolean` | `boolean` | 设置是否存在低精度定位状态。 |
| `isLowLocation()` | 无 | `boolean` | 是否存在低精度定位状态。 |
| `setRecording(value)` | `boolean` | `boolean` | 设置是否处于录音状态。 |
| `isRecording()` | 无 | `boolean` | 是否处于录音状态。 |
| `setVPN(value)` | `boolean` | `boolean` | 设置是否处于 VPN 状态。 |
| `isVPN()` | 无 | `boolean` | 是否处于 VPN 状态。 |
| `setAccessibility(value)` | `boolean` | `boolean` | 设置是否处于无障碍状态。 |
| `isAccessibility()` | 无 | `boolean` | 是否处于无障碍状态。 |
| `setInput(value)` | `boolean` | `boolean` | 设置是否处于输入法状态。 |
| `isInput()` | 无 | `boolean` | 是否处于输入法状态。 |
| `setCredential(value)` | `boolean` | `boolean` | 设置是否处于凭据服务状态。 |
| `isCredential()` | 无 | `boolean` | 是否处于凭据服务状态。 |
| `setAutofill(value)` | `boolean` | `boolean` | 设置是否处于自动填充状态。 |
| `isAutofill()` | 无 | `boolean` | 是否处于自动填充状态。 |
| `setInFullBackup(value)` | `boolean` | `boolean` | 设置是否处于完整备份状态。 |
| `isInFullBackup()` | 无 | `boolean` | 是否处于完整备份状态。 |
| `setCamera(value)` | `boolean` | `boolean` | 设置是否处于相机使用状态。 |
| `isCamera()` | 无 | `boolean` | 是否处于相机使用状态。 |
| `setPhoneState(value)` | `int` | `boolean` | 设置电话状态。整数值的枚举未在本文定义。 |
| `getPhoneState()` | 无 | `int` | 读取电话状态。不要猜测整数值。 |
