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
hooker.before 使用BeforeHookCallback
hooker.after 使用AfterHookCallback
hooker.replace ReplacementHookCallback

所有方法均可调用
