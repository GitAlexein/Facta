# taskStore.js

The only thing in Facta that talks to localStorage about tasks.

Loaded by `index.html` and `settings.html` as a plain `<script>`, before `index.js` / `settings.js`, which depend on the global it defines.

---

### Why this is a wrapped object and not six loose functions

Because it is a boundary, not an object for its own sake. Everything that knows tasks live in localStorage,  the key name, the JSON encoding, the field names on a task,  is sealed inside this file. Nothing outside it ever says `localStorage` about a task; it says `taskStore.add(...)`. Move the tasks to IndexedDB or to a server tomorrow and you rewrite this one file and nothing else, because no other file has an opinion about where tasks are kept.

The rest of this app shows what the alternative costs. The settings have no store, so they are read and written straight from raw localStorage in 25 places across `index.js`, `settings.js` and `welcome.js`, and it goes exactly how you would expect:

- `"showGreeting"` is typed out as a string literal 10 times in two files. Mistype one and nothing throws,  `getItem` just returns `null` and the feature quietly misbehaves.
- `"confirmTaskDeletion"` is given its default in `index.js` **and** defaulted again in `settings.js`. Two places that have to agree forever.
- The AerusW check reads `"name"` and compares it with the same copy-pasted expression in both `index.js` and `settings.js`.

None of that can happen to the tasks, and the reason is the wrapper. Group the operations on one piece of state into one object and the state has exactly one door; leave them loose and every caller grows its own key.

Two smaller things the wrapper buys, worth knowing:

- **No global collisions.** The three scripts load as plain `<script>` tags with no modules, so every top-level name lands on `window`. Loose functions would put `add`, `update`, `remove` and `clear` in the global namespace next to `index.js`'s own `toggleTask` and `updateInputShow` ,  `add` and `update` as bare global names are a collision waiting to be written. Inside the object they are namespaced for free.
- **Discoverability.** Type `taskStore.` and the six things you are allowed to do with tasks are listed. That *is* the API; nothing else is.

### Why not an actual class

A class would namespace just as well, but it is a factory: `new TaskStore()` as many times as you want. There is only ever one task list, because there is only one localStorage key behind it, so a constructor is pure liability ,  two objects that look independent while sharing one hidden source of truth.

> **This is the hinge for [issue #44](https://github.com/GitAlexein/Facta/issues/44) (multiple lists).**

This is an IIFE instead: a function defined and called in one expression. The `(() => { ... })()` shape is the tell, the trailing `()` being the call, and what lands in `taskStore` is not the function but the object it **returns**. That also makes privacy free. `KEY`, `load` and `save` are declared inside the function, so they exist only inside it ,  there is no `taskStore.KEY` and no `taskStore.save(["garbage"])` from outside. A class needs `#private` fields to match that, and with no build step the simpler construct wins.

### How it works

There is no task list held in memory. localStorage is the single source of truth and every public method follows the same three beats:

```
load()  ->  change the plain array  ->  save()
```

`load` parses the JSON string out of localStorage into a real array; `save` serialises an array back into a string. Between those two calls the tasks are ordinary JavaScript objects, so the methods use ordinary array operations,  `push`, `find`, `findIndex`, `splice`,  and nothing clever is required.

The cost is that every call re-reads and re-parses the whole list, so a render that calls `getAll()` twice parses the JSON twice. The benefit is that the store cannot go stale: there is no cached copy that could drift out of sync with what is actually on disk. At the size of a personal task list that trade is the right way round.

### Why the methods are written the way they are

The returned object uses method shorthand,  `add(text) { ... }` rather than `add: (text) => { ... }`. It is the standard way to write a method on an object literal and it reads as a list of operations, which is what this is.

`load` and `save` above it are arrow functions assigned to a `const` instead. That difference is deliberate and it marks the boundary: arrow consts are the private helpers, shorthand methods are the public surface. You can tell which is which at a glance, without reading the return statement.

The return values are consistent on purpose, so callers never have to guess: `add` gives back the task it created, `toggle` and `update` give back the task they touched or `null` if the id matched nothing, `remove` gives back `true` or `false`, `getAll` gives the array, `clear` gives nothing. Every method that takes an id can be handed one that no longer exists,  a stale button in a tab left open, say,  and none of them throw for it.

### Why const and not let

`const` means the binding cannot be reassigned. It does not mean the value is frozen: `const tasks = load()` still allows `tasks.push(task)`, because that mutates the array rather than pointing `tasks` at a different array. Almost nothing in this file is ever reassigned, so almost everything is `const`.

The payoff is that `const` is information. When you read `const tasks = load()` you know, without scanning the rest of the function, that `tasks` refers to that same array all the way to the closing brace. `let` would force you to check. Using `let` everywhere,  as `index.js` does,  throws that signal away and makes an accidental reassignment a silent bug instead of a `TypeError`.

Rule of thumb: `const` by default, `let` only where a reassignment is actually needed (a loop counter, an accumulator). There is no such place here.

`var` appears nowhere. It is function-scoped rather than block-scoped and it hoists, which is a decades-old source of confusion with no upside today.

---

## API reference

Six methods. Everything else in this file is private and unreachable.

### The task object

| Field | Type | Notes |
| --- | --- | --- |
| `id` | Number | `Date.now()` at creation. The identity for `toggle` / `update` / `remove`, and the DOM id suffix in `index.js` (`text-${id}`, `input-${id}`). |
| `text` | String | The task body, already trimmed. |
| `done` | Boolean | `false` at creation. |
| `createdAt` | String | ISO 8601 timestamp. Written once, never updated,  there is no `updatedAt` field. |

### `getAll() -> Array<Task>`

Every task, in insertion order. Returns `[]` when the key is missing or holds unparseable JSON.

The array is a **fresh parse on every call**, not a shared reference. Mutating what you get back changes nothing on disk, and two calls return two unrelated arrays. To persist a change, go through the methods below.

### `add(text) -> Task`

Appends a new task and returns the object it created, so the caller can use the generated id without re-reading the list.

`text` is trimmed before storing. It is **not** validated: `add("")` writes a task with empty text quite happily. Rejecting blanks is currently the caller's job and lives in `index.js`,  see `finalizeTask`.

The id is `Date.now()`, so two tasks created inside the same millisecond get the same id, and every method below would then act on whichever one comes first in the array. Not reachable by typing; very reachable by a loop.

### `toggle(id) -> Task | null`

Flips `done` on the task with that id and saves. Returns the task, or `null` if no task matched,  in which case nothing is written.

The id is matched with `===`, so it must be a Number. A numeric string like `"1760"` will not match and the call becomes a silent no-op returning `null`.

### `update(id, text) -> Task | null`

Replaces the text of the task with that id and saves. Returns the task, or `null` if no task matched, writing nothing in that case.

`text` is trimmed. As with `add`, an empty string is accepted and will blank the task; `index.js` is what refuses it. `done` and `createdAt` are untouched.

### `remove(id) -> Boolean`

Deletes the task with that id. Returns `true` if one was deleted, `false` if the id matched nothing,  nothing is written on `false`.

Note this one returns a Boolean rather than the task, so a deleted task is not recoverable from the return value. There is no undo.

### `clear() -> undefined`

Empties the list. Writes an empty array rather than removing the key, so the key continues to exist and `getAll()` keeps returning `[]` as normal.

Irreversible, and it does not ask. The confirmation lives at the call site in `settings.js`.
---

### Known weaknesses

Not bugs that have bitten yet, but the things to fix first:

1. **`load()` does not validate shape.** The `catch` only covers malformed JSON. If the key ever holds valid JSON that is not an array,  `"5"`, `{"a":1}`,  the parse succeeds, `|| []` does not fire, and the next `.push`/`.find` throws. One `Array.isArray` guard.
2. **`id: Date.now()` collides.** See `add` above. `crypto.randomUUID()` fixes it.
3. **`save()` can throw and nobody catches it.** Quota exceeded, or Safari private mode: the write fails and the UI still shows the task as saved.
4. **The store trusts its callers on empty text.** Validation is duplicated at each call site in `index.js` instead of living here once.
