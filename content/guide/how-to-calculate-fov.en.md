---
title: "How to Calculate Sim Racing FOV"
description: "The geometry behind sim racing field of view: turn a screen diagonal into width and height, then into the horizontal and vertical angles a racing game asks for."
directAnswer: >-
  Correct sim racing FOV is the angle your screen physically occupies in your
  vision: FOV = 2 × arctan(screen_dimension ÷ 2 ÷ eye_to_screen_distance). Use
  screen height for vertical FOV and screen width for horizontal FOV. Only two
  measurements change the answer — how big the screen is and how far away you
  sit.
updated: "2026-09-10"
order: 1
faq:
  - q: "What is the formula for sim racing FOV?"
    a: "FOV = 2 × arctan(screen_dimension ÷ 2 ÷ distance_from_eyes_to_screen). Substitute screen height to get vertical FOV, screen width to get horizontal FOV. Both dimensions must be the visible panel size, not the diagonal and not the bezel."
  - q: "Does a bigger monitor mean a higher FOV setting?"
    a: "Only if you keep the same seating distance. FOV is set by the ratio of screen size to viewing distance, so a 32-inch screen at 70 cm and a 27-inch screen at 59 cm need almost the same value. Doubling both the screen size and the distance leaves the correct FOV unchanged."
  - q: "Why does correct FOV feel too zoomed in?"
    a: "Because most people are used to a wider-than-correct default. At the mathematically correct value the car occupies the same angle it would through a real windscreen, so the sense of speed drops and the view feels tight. Speed perception returns within a few sessions, and braking points and corner entry become far more repeatable."
  - q: "Does the car or the track change the correct FOV?"
    a: "No. The correct FOV depends only on your screen dimensions and your eye-to-screen distance. It is a property of your physical setup, not of the car, the track, or the game."
---

Field of view is the one graphics setting in a racing sim that has a single
correct answer. It is not a preference and not a performance trade-off — it is a
measurement of your desk.

## What FOV actually means

Your monitor occupies some angle of your vision. Hold a ruler at arm's length
and it covers a small angle; bring it to your nose and it covers a large one.
The screen is no different.

A racing game renders the world through a virtual camera. When you tell the game
its field of view, you are telling it how wide a slice of the world to squeeze
onto your panel. If that slice matches the angle the panel really occupies, the
image comes out life-size: a corner that is 40 metres away looks 40 metres away,
and a car two lengths ahead looks two lengths ahead.

Set the number too high and the game crams a wider slice into the same panel.
Everything shrinks, distances stretch, and the sense of speed goes up because
scenery flies past the edges faster. That last part is why too-wide FOV is so
common and so hard to give up.

## The formula

```
FOV = 2 × arctan( screen_dimension ÷ 2 ÷ eye_to_screen_distance )
```

Feed it screen **height** and you get vertical FOV. Feed it screen **width** and
you get horizontal FOV. Both come out in radians from most calculators, so
multiply by 180 ÷ π to get degrees.

The division by 2 appears twice for the same reason: the formula solves a right
triangle from your eye to the centre of the screen and out to one edge, which
covers half the screen and half the angle. Doubling the result gives the whole
thing.

## Step 1: turn the diagonal into width and height

Monitors are sold by diagonal, but the formula needs width and height. For a
screen with aspect ratio `AR` (16:9 means AR = 16 ÷ 9 ≈ 1.7778):

```
width  = 2.54 × diagonal_inches × AR ÷ √(1 + AR²)
height = width ÷ AR
```

Use the *visible panel* diagonal. Bezels are not screen.

## Step 2: measure the distance properly

The distance the formula wants is from **your eyes** to the screen surface, not
from the back of the seat and not from the edge of the desk. Sit in your normal
driving position, have someone hold a tape measure from the bridge of your nose
to the middle of the panel, and use that.

This is the number people get wrong most often, and it is the number the result
is most sensitive to.

## A worked example

A 32-inch 16:9 monitor with your eyes 70 cm away:

| Step | Value |
| --- | --- |
| Width | 2.54 × 32 × 1.7778 ÷ √(1 + 1.7778²) = **70.84 cm** |
| Height | 70.84 ÷ 1.7778 = **39.85 cm** |
| Vertical FOV | 2 × arctan(19.92 ÷ 70) = **31.8°** |
| Horizontal FOV | 2 × arctan(35.42 ÷ 70) = **53.7°** |

So this setup wants roughly **32° vertical** or **54° horizontal**, depending on
which the game asks for. Note how far that is from the 90°-plus defaults many
sims ship with.

## Why this calculator uses arcsin

If you read the source of the [FOV Calculator](/), you will find it computing
angles as `2 × arcsin( (height ÷ 2) ÷ r )`, where `r` is the straight-line
distance from your eye to the screen edge rather than the perpendicular distance
to the panel.

That is the same answer, not a different one. When your eyes are level with the
centre of the screen, `r = √(d² + (height ÷ 2)²)`, and substituting that into the
arcsin form reduces exactly to the arctan form above. The calculator works in
chord form because it is also drawing the sight lines on a diagram, where the
edge-to-eye distance is the length it already has.

## What does not affect the answer

- **The car you drive.** A formula car and a truck want the same FOV.
- **The track.**
- **Your monitor's resolution.** Resolution decides how sharp the image is, not
  how wide it is. See [pixels per degree](/guide/ppd-and-viewing-distance) for
  what resolution *does* constrain.
- **Your graphics card.**

Only screen size and viewing distance matter. Change either one and you must
recalculate; change neither and the number stays valid forever.

## Where to go next

- Three screens instead of one: [triple monitor FOV](/guide/triple-monitor-fov)
- A curved panel: [curved monitor FOV](/guide/curved-monitor-fov)
- The number your specific game wants: [per-game FOV settings](/guide/game-fov-settings)
