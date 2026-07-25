# Hooker Callback

```JavaScript
var unhook = hooker.before(method, function (callback) {
});

var unhook = hooker.after(method, function (callback) {
});

var unhook = hooker.replace(method, function (callback) {
    return null;
});
```
hooker.before 使用 ICallback.Before

hooker.after 使用 ICallback.After

hooker.replace 使用 ICallback.Replacement

所有方法均可调用
