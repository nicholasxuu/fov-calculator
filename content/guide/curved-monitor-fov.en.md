---
title: "Curved Monitor FOV for Sim Racing"
description: "What 800R, 1000R and 1800R actually mean, how curvature changes the field of view your screen occupies, and how much difference it really makes."
directAnswer: >-
  Curvature raises horizontal FOV slightly because a curved panel wraps its edges
  closer to your eyes. A 34-inch 21:9 screen at 70 cm spans 59.1° flat, 61.9° at
  1800R and 64.5° at 800R — a few degrees, not a transformation. Vertical FOV is
  completely unaffected by curvature.
updated: "2026-09-10"
order: 4
faq:
  - q: "What does 1000R mean on a monitor?"
    a: "The R number is the radius of the circle the panel is a slice of, in millimetres. A 1000R screen curves along a circle of 1000 mm radius, so it is fully wrapped when viewed from 1 metre away. Lower R means a tighter curve: 800R is more curved than 1800R."
  - q: "Does a curved monitor change my FOV setting?"
    a: "Slightly, and only horizontally. A curved panel pulls its edges forward toward you, so the same panel spans a few degrees more than its flat equivalent — roughly 3° to 5° on a 34-inch ultrawide at desk distance. Vertical FOV does not change at all, because the curve runs left to right."
  - q: "Should I sit at the curvature radius of my monitor?"
    a: "It is the ideal, because at that distance every point on the panel is the same distance from your eyes and the whole screen is in focus and undistorted at once. In practice an 800R screen would need you at 80 cm and a 1800R at 1.8 m, so most people sit closer than ideal on aggressive curves and further than ideal on gentle ones."
  - q: "Is a curved monitor better for sim racing?"
    a: "Mildly, for comfort rather than for FOV. The extra field of view is only a few degrees. The real benefit is that the edges of a wide panel face you instead of angling away, which reduces the apparent stretching at the far edges of an ultrawide."
---

Curved monitors are marketed on immersion, and it is easy to assume the curve
buys a lot of extra field of view. It buys some. Here is exactly how much.

## What the R number means

The R value is a **radius in millimetres**. Your panel is a slice cut from a
circle of that radius:

- **800R** — a circle of 800 mm radius. Aggressively curved.
- **1000R** — often described as matching the curvature of human vision.
- **1800R**, **2300R**, **3800R** — progressively gentler.

Lower R is more curved. The number is also the distance at which the screen wraps
you perfectly: at exactly 800 mm from an 800R panel, every pixel on it is
equidistant from your eye.

## How curvature changes the geometry

Take a flat panel and bend it toward you. Two things happen at once:

1. **The edges come closer.** The panel's centre stays put, the edges swing
   forward. Closer edges subtend a wider angle, which raises horizontal FOV.
2. **The straight-line width shrinks.** Bending an arc reduces the distance
   between its endpoints. This works against the first effect.

The first effect wins, but not by as much as the marketing implies, because the
second partly cancels it.

Given a flat width `W` and radius `R`, the arc spans `W ÷ R` radians, and:

```
chord_width = 2 × R × sin(arc ÷ 2)
depth       = R − R × cos(arc ÷ 2)
```

The calculator then measures horizontal FOV from your eye to the chord's
endpoints, `depth` centimetres nearer than the panel centre.

## The actual numbers

A 34-inch 21:9 panel with your eyes 70 cm from the centre of the screen:

| Curvature | Chord width | Depth | Arc | Horizontal FOV |
| --- | --- | --- | --- | --- |
| Flat | 79.38 cm | 0 cm | 0° | **59.1°** |
| 3800R | 79.23 cm | 2.07 cm | 12.0° | **60.5°** |
| 2300R | 78.98 cm | 3.42 cm | 19.8° | **61.3°** |
| 1800R | 78.74 cm | 4.36 cm | 25.3° | **61.9°** |
| 1500R | 78.45 cm | 5.22 cm | 30.3° | **62.4°** |
| 1000R | 77.31 cm | 7.77 cm | 45.5° | **63.7°** |
| 800R | 76.16 cm | 9.64 cm | 56.8° | **64.5°** |

Vertical FOV is **27.3°** on every row. The curve runs left to right, so it
cannot affect the vertical angle.

The whole range from flat to aggressively curved is **5.4°** of horizontal FOV.
For comparison, changing your seating distance by 10 cm on the same screen moves
horizontal FOV by roughly 7°. Curvature matters less than where you sit.

## So is curvature worth it?

For field of view alone, no — the gain is real but small, and you can get more by
moving your chair.

For everything else, it is a reasonable comfort upgrade. On a wide flat panel the
far edges angle away from you, which stretches the image there and makes the
extremes harder to read at a glance. A curve points those edges back at your face
and largely removes that.

If you are buying specifically for sim racing and choosing between a curved
ultrawide and three flat panels, the triple rig wins on field of view by a wide
margin — see [triple monitor FOV](/guide/triple-monitor-fov).

## Entering curvature in the calculator

Pick your panel's R value from the presets, or use the custom field for anything
unusual. The [calculator](/?s=34&a=21:9&c=100&d=70&t=0) draws the arc to scale in
the top-down view, so you can confirm the wrap looks like your desk before
trusting the number.

## Where to go next

- The base formula: [how FOV is calculated](/guide/how-to-calculate-fov)
- Three curved panels: [triple monitor FOV](/guide/triple-monitor-fov)
- What to type into your game: [per-game FOV settings](/guide/game-fov-settings)
