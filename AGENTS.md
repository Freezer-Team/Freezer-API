# FJSE Script Development Skill

## Purpose

Use this guide when creating, reviewing, or modifying scripts for Freezer Java Script Engine（FJSE）.

## Public references

Treat the following public documents as the only source of truth:

- [`FJSE_DEVELOPMENT.md`](FJSE_DEVELOPMENT.md)：FJSE API、运行方式、脚本示例和开发规范。
- [`events/README.md`](events/README.md)：完整事件索引。
- [`events/<eventName>.md`](events/)：每个事件的参数、返回类型、取值含义、阶段和取消行为。
- [`api/app-state.md`](api/app-state.md)：`app.getState()` 返回对象的完整方法、参数和返回值。

Do not assume access to Freezer source code, repository internals, private class names, or unpublished implementation details.

## Workflow

1. Read `FJSE_DEVELOPMENT.md` before writing a script.
2. For every registered event, read its matching file under `events/` before using the event object.
3. Read [`api/app-state.md`](api/app-state.md) before using methods on the object returned by `app.getState()`.
4. Use only APIs and event methods explicitly documented in the public references.
5. If an API, event parameter, or behavior is undocumented, do not guess it. Mark it as unsupported or request documentation.
5. Keep examples compatible with the documented FJSE runtime; do not assume `require` or `module` exists.

## Script requirements

- Save scripts as UTF-8 `.js` files.
- Call `registerScript({...})` with a non-empty `name`.
- Check application, process, notification, and event values for `null` where documented.
- Keep event and Hook callbacks short; use `async` only for work that does not affect the current event decision.
- If an event must be cancelled or its cancellation state changed, call `event.cancel()` / `event.setCancelled(...)` synchronously inside the `on(...)` callback. Never move event cancellation into `async`; it runs after the event dispatcher has continued and is ineffective.
- Release script-owned resources during `shutdown`.
- Use reflection, Hook, network, freezing, and unfreezing APIs only against explicit targets.
- Distinguish `PRE` and `POST` before cancelling staged events.
- Remember that cancelling an event usually changes Freezer's subsequent handling; it does not undo the underlying Android action.

## Event documentation rule

When adding a public event document, create `events/<eventName>.md` and describe:

- When the event occurs.
- Every accessible getter or method.
- Each return type and value meaning.
- Possible `null`, unknown, or sentinel values.
- `NONE`、`PRE`、`POST` stage behavior.
- Whether cancellation is effective and exactly what it changes.
- A minimal JavaScript example when the behavior is not obvious.

Add the event to `events/README.md` and keep the event list in `FJSE_DEVELOPMENT.md` synchronized.

## Review checklist

- [ ] All used globals are documented in `FJSE_DEVELOPMENT.md`.
- [ ] Every event method is documented in its `events/*.md` file.
- [ ] Every used `app.getState()` method is documented in `api/app-state.md`.
- [ ] Nullable and unknown values are handled.
- [ ] Long work does not block event callbacks.
- [ ] `PRE`/`POST` and cancellation semantics are correct.
- [ ] Event cancellation and other current-event decisions are performed synchronously, never inside `async`.
- [ ] No private source path, internal class name, or unpublished implementation detail appears in public output.
