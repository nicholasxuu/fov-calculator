---
title: "Single Monitor FOV for Sim Racing"
description: "Getting field of view right on one screen: the numbers a typical monitor needs, why they feel too narrow at first, and the compromises worth making."
directAnswer: >-
  On a single monitor, correct FOV is usually far lower than the game's default:
  a 32-inch 16:9 panel at 70 cm needs about 32° vertical or 54° horizontal, and a
  27-inch at 60 cm needs about 31° or 53°. Sitting closer is the only way to
  raise the correct value without buying a bigger screen.
updated: "2026-09-10"
order: 2
faq:
  - q: "What FOV should I use on a single 27-inch monitor?"
    a: "At a typical 60 cm viewing distance a 27-inch 16:9 monitor needs about 31° vertical or 53° horizontal. Move to 70 cm and it drops to roughly 27° vertical. The exact number depends on your measured eye-to-screen distance, so measure rather than copy someone else's setting."
  - q: "Is correct FOV worth it on a single screen?"
    a: "Yes, for consistency. Correct FOV makes distances on screen match distances in the world, so a braking marker looks the same size every lap and your reference points stop shifting. The cost is that you see less to the sides, which on one monitor is a real loss you have to accept."
  - q: "Can I use a slightly wider FOV than the calculated value?"
    a: "Many single-monitor drivers do, and it is a legitimate trade. Going wider buys peripheral awareness at the cost of scale accuracy. Widen deliberately by a known amount from the correct value rather than guessing from scratch, so you always know how far from honest you are."
  - q: "Should I sit closer to my monitor for sim racing?"
    a: "Sitting closer raises your correct FOV and gives you more usable angle from the same panel, which is the cheapest possible upgrade. The limit is pixel density: get close enough and you start seeing individual pixels. See the pixels-per-degree guide for where that limit falls."
---

One monitor is where most people start, and where correct FOV is hardest to
accept — because on a single screen, being honest about perspective genuinely
costs you vision.

## The numbers for common setups

Every row assumes 16:9 and eyes measured to the centre of the panel:

| Screen | Distance | Vertical FOV | Horizontal FOV |
| --- | --- | --- | --- |
| 27" | 60 cm | **31.3°** | **53.0°** |
| 32" | 70 cm | **31.8°** | **53.7°** |
| 34" 21:9 | 70 cm | **27.3°** | **59.1°** |

Two things stand out.

First, these are small numbers. Racing sims frequently default to horizontal
values north of 90°, which is roughly double what a desk setup justifies.

Second, the 27-inch and the 32-inch rows are nearly identical. FOV depends on the
*ratio* of screen size to distance, so a smaller screen at a proportionally
closer distance is the same thing geometrically. If you cannot afford a bigger
monitor, moving it closer is free and does the same job.

## Why it feels wrong at first

Switching to correct FOV on a single screen produces two immediate reactions:

**"I can't see anything."** True, and unavoidable. A 32-inch panel at 70 cm
occupies 54° of your vision. Correct FOV means the game shows you 54° of world.
Your mirrors, your apex, and the car alongside all have to fit in that.

**"It feels slow."** Also true, and this one fades. Perceived speed comes largely
from scenery moving through your peripheral vision. Narrow the view and less
scenery sweeps past, so 200 km/h stops feeling like 200 km/h. After a handful of
sessions your brain recalibrates and you stop noticing.

What you get back is worth more than either: braking points that work, corner
entry that is repeatable, and a car that feels the same size lap after lap.

## The honest compromise

Correct FOV is a physical fact, but nothing forces you to use it. On one screen
there is a real argument for going wider — you are trading scale accuracy for
awareness of cars beside you, and on a single panel that awareness is otherwise
almost nonexistent.

If you do widen, do it on purpose:

1. Calculate the correct value first.
2. Widen from there in small, recorded steps.
3. Stop as soon as you have enough side vision to race cleanly.

The difference between this and guessing is that you always know how far from
correct you are, and you can go back.

## Getting more from one screen

In order of cost:

- **Sit closer.** Free, and the single most effective change. Watch pixel
  density — see [pixels per degree](/guide/ppd-and-viewing-distance).
- **Mount the screen properly.** Centre of the panel roughly at eye level, panel
  square to your face. A tilted or offset screen breaks the geometry the
  calculator assumes.
- **Go ultrawide.** A 21:9 panel buys horizontal angle without changing vertical.
  Note the 34-inch 21:9 row above: more horizontal FOV than the 32-inch, less
  vertical.
- **Go curved.** Modest gains on a single panel — see
  [curved monitor FOV](/guide/curved-monitor-fov).
- **Go triple.** The real answer if you want wide vision and correct scale
  together: [triple monitor FOV](/guide/triple-monitor-fov).

## Where to go next

- The formula behind the table: [how FOV is calculated](/guide/how-to-calculate-fov)
- What to type into your game: [per-game FOV settings](/guide/game-fov-settings)
