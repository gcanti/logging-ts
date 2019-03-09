---
title: Console.ts
nav_order: 1
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [console (function)](#console-function)

---

# console (function)

Returns a `Logger` that logs records to the console

**Signature**

```ts
export const console = <A>(f: (a: A) => string): Logger<URI, A> => new Logger(a => ...
```
