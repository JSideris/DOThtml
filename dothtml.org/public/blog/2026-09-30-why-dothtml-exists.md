---
title: Why DOThtml exists
date: 2026-09-30
summary: A UI engine for hosts that already own the app — from a multiplayer shooter HUD to preferred reactive paths today.
---

saucers.space was already a game before it needed a UI library. Top-down multiplayer space shooter, heavy physics — the whole thing ran as one minified, obfuscated JavaScript file. The loop owned the frame. Menus and HUD still had to appear somehow. Dropping Angular or React on top would have meant rewriting the game around those frameworks. I needed a tiny drop-in for GUI and menus that left the engine where it was.

```js
    10|dot("body").h1("Ready.");
```

That is the whole contract in one line: build UI in JavaScript, attach it where you want, keep going.

DOThtml is a UI engine, not an application framework. The app — game, widget, dashboard, whatever already exists — stays primary. Quality means two things at once: stay out of the way of that app, and still keep up with what "UI" is allowed to mean as the web moves.

What we refuse to own: your architecture, your render loop, your build religion, your folder layout. You can paint a menu over an existing canvas app. You can mount one widget on a page that was never meant to be a SPA. You do not start by moving the center of gravity into our runtime.

That also means who it is not for. If you want a batteries-included app factory that owns routing, data fetching, and project structure from day one, use something that sells that. If markup-as-source-of-truth is the point — compiler as the gate — this will feel wrong on purpose. If you need a huge plugin ecosystem before you ship a first screen, look elsewhere. DOThtml is for when the host already exists, or when you want the host to stay yours.
    20|
Signals exist for one reason: the host stays in charge. Update a value directly; the UI follows. No virtual-DOM tax between your engine tick and a label on screen, and the library stays small enough to embed next to code that already filled the budget.

Today the preferred path looks like this — still a drop-in, already reactive:

```js
import { dot } from "dothtml";

const open = dot.state(false);

    30|dot("#hud")
  .button({ onClick: () => { open.value = !open.value; } }, "Menu")
  .when(open, dot.div("Paused — settings go here."));
```

Still a HUD on a host. The loop never moved.

Install with `npm i dothtml`, or scaffold with `npm init dothtml`. Docs: [Quick Start](https://dothtml.org/docs/quick-start.md).

We also write so a coding agent does not invent 2019 DOThtml — more on that next.
    40|
