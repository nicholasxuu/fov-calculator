---
title: "Triple Monitor FOV for Sim Racing"
description: "How triple screen angle changes your field of view, what total width the setup needs, and why a triple rig gives you wide vision without cheating the perspective."
directAnswer: >-
  With triple monitors your horizontal FOV comes from all three panels together,
  so it grows with the side screen angle: three 32-inch 16:9 screens at 70 cm
  span about 154° at a 45° side angle and about 166° at 60°. Vertical FOV is
  unchanged by the side screens — it still comes from one panel's height.
updated: "2026-09-10"
order: 3
faq:
  - q: "What angle should triple monitors be set to?"
    a: "The physically honest angle is the one that puts every part of every panel at roughly the same distance from your eyes, which for common desk distances lands between 45° and 60° from the plane of the centre screen. Measure the angle you actually built, enter it in the calculator, and use the FOV it returns — a guessed angle produces a wrong FOV even when the formula is right."
  - q: "Does adding side monitors change my vertical FOV?"
    a: "No. Vertical FOV comes from the height of a single panel and your viewing distance. Side screens extend your view sideways only, so the vertical number for a triple setup is identical to the single-monitor number for the same panel at the same distance."
  - q: "Do I enter the width of one monitor or all three?"
    a: "Enter one monitor's size and the angle between panels. The calculator derives the combined span itself, because the side screens are rotated toward you rather than lying flat, and their contribution depends on that rotation."
  - q: "Is triple monitor better than one ultrawide for sim racing?"
    a: "For peripheral vision, yes — three panels wrap around you and an ultrawide stays flat, so a triple rig reaches horizontal angles a single flat panel cannot without severe edge distortion. An ultrawide is simpler to set up and has no bezels. Both use the same underlying formula."
---

A triple screen rig is the most common serious sim racing display setup, and it
is also where FOV maths stops being a single right triangle.

## Why triples need different maths

With one flat monitor everything sits in a single plane, so the horizontal angle
is one arctangent. Angle the two side panels toward you and that stops being
true: the outer edges of the side screens move both sideways **and forward**,
closer to your face. The calculator has to solve for where those far corners
actually end up in space.

The consequence is that horizontal FOV on a triple rig is very sensitive to the
side screen angle, in a way that surprises people the first time they measure it.

## How the side angle is defined

The angle in the calculator is measured **from the plane of the centre screen**:

- **0°** — all three panels flat in one line, like a very wide single monitor.
- **45–60°** — the normal range for a desk-mounted or rig-mounted triple setup.
- **90°** — the side panels face straight inward at you, forming a U.

For a side panel of width `w` rotated by angle `θ`, the panel's far edge moves
`w × sin(θ)` forward toward you and `w × cos(θ)` further out to the side. The
total span across all three screens is:

```
total_width = w + 2 × w × cos(θ)
```

## What the angle does to your FOV

Three 32-inch 16:9 panels, eyes 70 cm from the centre screen:

| Side angle | Horizontal FOV |
| --- | --- |
| 45° | **153.8°** |
| 50° | **158.0°** |
| 60° | **166.1°** |
| 75° | **176.6°** |

Vertical FOV stays at **31.8°** across every row, because it depends only on one
panel's height and your distance. This is worth internalising: on a triple rig,
the side angle is a horizontal-only control.

Notice how quickly the horizontal number climbs. Going from 45° to 60° adds more
than 12° of view. If you guess your rig's angle instead of measuring it, your FOV
will be wrong by more than most people's entire tuning range.

## Measuring the angle you actually have

Two practical methods:

1. **Tape measure.** Measure the distance between the two outer front corners of
   your side panels, and the perpendicular distance from that line to the centre
   screen. A little trigonometry — or the calculator's own diagram — gets you
   the angle.
2. **Match the diagram.** Open the [calculator](/?t=1&s=32&d=70), set your screen
   size and distance, and adjust the angle slider until the top-down view matches
   what your desk looks like from above. This is less precise but catches gross
   errors fast.

## The payoff

The reason triples are worth the money is not that they let you use a wider FOV
setting. It is that they let you have wide vision *and* correct perspective at
the same time.

On a single monitor, wide vision and correct scale are in direct conflict: the
only way to see more is to squeeze more into the same panel, which shrinks
everything. Add side screens and the extra view arrives on extra physical
panels, occupying real extra angle. You see the apex you are turning toward
without the car in front shrinking to a dot.

## Common triple setup mistakes

- **Panels angled by eye, FOV calculated from a guess.** By far the most common,
  and worth more than a dozen setup tweaks put together.
- **Measuring distance to the side screens instead of the centre.** The
  calculator wants the distance to the centre panel.
- **Forgetting bezel correction.** FOV and bezel correction are separate
  settings. FOV controls how much world is drawn; bezel correction accounts for
  the world hidden behind the plastic frames. Getting FOV right does not fix
  misaligned bezels, and vice versa.
- **Different panel models across the three positions.** Mixed sizes or mixed
  panel heights break the geometry the calculator assumes.

## Where to go next

- The underlying geometry: [how FOV is calculated](/guide/how-to-calculate-fov)
- Curved panels in a triple rig: [curved monitor FOV](/guide/curved-monitor-fov)
- The number your game wants: [per-game FOV settings](/guide/game-fov-settings)
