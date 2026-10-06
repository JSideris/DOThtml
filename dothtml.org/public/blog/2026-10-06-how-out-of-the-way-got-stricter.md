---
title: How "out of the way" got stricter
date: 2026-10-06
summary: Three times DOThtml redefined staying out of the way: nested builders, router-as-citizen, signals, and what fail-early means for coding agents.
---

In [Why DOThtml exists](https://dothtml.org/blog/why-dothtml-exists), the claim is simple: a UI engine should leave the host in charge. This post is not another origin story. It is what happened after that rule was already the point. "Out of the way" did not stay fixed. Each time the web asked more of a UI layer, something that once felt optional became the obstacle. Three times the library had to redefine the refusal without abandoning the host. Read this alone if you want; the earlier post is the contract, and this one is how the contract tightened.

## Ceremony was in the way

Early on, the library could build a tree, but the syntax asked you to think bottom-up. Children arrived as callbacks. You nested `function () { return … }` so the next element could exist. The ceremony was small per call and large in aggregate. Attention went to the shape of the call stack instead of the shape of the page. A drop-in that makes you re-learn nesting on every screen is still in the way, even when the runtime is tiny. The host may own the loop, but the author no longer owns the writing.

The fix was not a new slogan. It was a builder that treated nested arguments as children. The hierarchy lived in the expression. You wrote the structure you meant, in the order you meant it, without a salt layer of deferred returns.

```js
// Ceremony: the tree hides inside callbacks.
dot("body").div(function () {
  return dot.h1("Ready.").p("Still wiring the next child…");
});

// Out of the way: children sit where they belong.
dot("body")
  .div(
    dot.h1("Ready."),
    dot.p("The next child is just the next argument.")
  );
```

That is the whole shift. Staying out of the way meant refusing to tax the author for hierarchy. If the syntax fights you, the host is no longer primary in practice, no matter how carefully the marketing avoids the word "framework." One image: nested builder.

## "Just pages" was in the way

Once builders felt natural, the next wall was product-shaped. Real hosts needed shared state, reusable pieces, and more than one screen. The easy answer in that era was to adopt an application framework and let it own routing, data, and the tree. That answer moves the center of gravity. For a game loop, a calculator, or a widget dropped onto someone else's page, it is a rewrite dressed up as a dependency. "Just pages" had become the lie that kept you from shipping the product shape you actually needed.

DOThtml's answer was narrower. Bindings and components arrived as tools for state and reuse. The image that proves the constraint is the router treated as a citizen rather than a takeover. You can navigate between views without handing the library your architecture. Routes describe where UI goes. They do not demand that the library become the app shell, own the boot sequence, or dictate folder religion.

```js
import { dot, Router } from "dothtml";

const routes = [
  { path: "/", component: Home }, // host-owned views
  { path: "/settings", component: Settings },
];

// Mount the router where the host already decided UI lives.
dot("#app").mount(new Router(), { routes });
```

The refused ownership is the point. You get app-shaped behavior when you need it. You do not start by relocating the host into a framework runtime. If "out of the way" only meant "small syntax," multi-screen work would still shove you toward something that owns the tree. Shift two was learning to offer navigation without that trade: the host still picks the mount, and the library still stays a layer instead of a new center. Bindings and components matter; they are not the definition. The definition is that pages became apps, and the library still refused to own the host.

## The fashion gap was in the way

Staying embeddable used to mean carrying old-browser habits and a surface that looked unfinished next to the frameworks people compared you to. Compatibility anxiety and fashion-gap anxiety are different costumes for the same blockage. You cannot modernize the API if every modern move feels like abandoning the host. You cannot look finished if looking finished means importing a second stack for paint, types, or reactivity. The gap was not vanity alone. It was the pressure to choose between current and embeddable, as if those were opposite claims.

The definition change was to take a modern surface and keep it embeddable. The image is signals. The host updates a value directly. The UI follows. There is no virtual-DOM tax between an engine tick and a label on screen. Types are the contract that made that surface sayable without guessing. Style lives in the same box so finishing a screen does not require a second framework for looks. On measured speed, the evidence is one sentence: the library stays small enough and fast enough to sit beside code that already filled the budget.

```js
const open = dot.state(false);

dot("#hud")
  .button({ onClick: () => { open.value = !open.value; } }, "Menu")
  .when(open, dot.div("Paused."));
```

Same HUD as last time. What changed is what it is allowed to cost: modern reactivity and typed contracts without capturing the app, and without sending you elsewhere to paint the last mile. Fashion-gap fear used to argue that embeddable and current could not be the same claim. Shift three is insisting they can, as long as the host remains primary. Signals carry the definition. Types and style-in-the-same-box support it. A bench is evidence, not a second thesis.

## Same rule, new reader

The newest reader is often not a person scrolling docs at leisure. It is a coding agent with training data full of older DOThtml and neighboring frameworks. The constraint did not change. The failure mode did. Quietly accepting a 2019 pattern lets the agent ship something that compiles and behaves wrong. "Out of the way" for that reader means the live API must refuse the obsolete path loudly enough to correct the next turn. Soft compatibility that hides a dead pattern is no longer kindness. It is a trap with a green build.

Fail-early is the image, and the snapshot is the definition of the trap. Prefer the signal itself in a conditional over freezing `.value` into a boolean that never updates. That mistake is silent: green build, dead UI. A factory in the content slot does throw (error 13); the snapshot does not, which is why the preferred path has to be the one you document.

```js
// Silent: condition freezes once. Green build, dead UI.
.when(open.value, dot.div("Paused."));

// Preferred: the signal stays live.
.when(open, dot.div("Paused."));
```

Preferred paths are the ranked defaults that follow from that: what to reach for first when several APIs still exist. Cookbooks are the short recipes that show the live pattern beside the trap. Neither reopens why the library exists. Both exist so the next author, human or agent, meets the current definition of "out of the way" instead of inventing an older one.

The rule was always leave the host in charge. Ceremony, page-shaped ambition, and fashion-gap fear each tried to put something else in charge. Three times the library tightened what refusal means. The work now is keeping that refusal readable to whoever is writing the next line.
