---
title: "Pixels Per Degree and How Close You Can Sit"
description: "Why sitting closer raises your FOV for free, where pixel density stops you, and how to find the minimum viewing distance your resolution supports."
directAnswer: >-
  Pixels per degree (PPD) measures how many pixels your screen packs into one
  degree of vision, and it falls as you sit closer. A 32-inch 1080p panel gives
  33 PPD at 70 cm; the same panel at 4K gives 66. Around 40 PPD most people stop
  seeing individual pixels, which sets a floor on how close you can usefully sit.
updated: "2026-09-10"
order: 6
faq:
  - q: "What is a good pixels per degree value for sim racing?"
    a: "Around 40 PPD is the practical threshold where individual pixels and jagged edges stop being distracting at normal viewing distance. Below about 30 PPD the image looks visibly coarse. Above 60 PPD you are past the point where extra density is easy to notice, and the pixels are effectively free to spend on sitting closer."
  - q: "How close can I sit to my monitor for sim racing?"
    a: "Close enough that pixel density is still acceptable. A 32-inch 16:9 screen needs about 85 cm at 1080p to hold 40 PPD, about 63 cm at 1440p, and about 42 cm at 4K. Higher resolution directly buys you the ability to sit closer, which raises your correct FOV."
  - q: "Does resolution change my FOV setting?"
    a: "No. FOV depends only on physical screen size and viewing distance, so a 1080p and a 4K panel of the same size at the same distance need identical FOV values. Resolution decides how close you can comfortably sit, and sitting closer is what changes FOV."
  - q: "Is a bigger screen or a closer screen better?"
    a: "Geometrically they are the same thing — both raise the ratio of screen size to distance. Sitting closer is free, so try it first. The limit is pixel density: a bigger screen at the same resolution has larger pixels, so it must be viewed from further away to look equally sharp."
---

Field of view is set by the ratio of screen size to viewing distance, which means
sitting closer is the cheapest FOV upgrade available. Pixels per degree is what
tells you when to stop.

## What PPD measures

PPD is how many screen pixels fall inside one degree of your vision. It combines
the three things that decide perceived sharpness — panel size, resolution and
distance — into one number.

```
pixel_pitch = screen_width ÷ horizontal_resolution
PPD         = 1 ÷ ( 2 × arctan( pixel_pitch ÷ 2 ÷ distance ) )
```

Move closer and each pixel covers more of your vision, so PPD falls. Add
resolution and each pixel gets smaller, so PPD rises.

## What the numbers look like

A 32-inch 16:9 monitor, eyes 70 cm away:

| Resolution | Pixels per degree |
| --- | --- |
| 1920 × 1080 | **33.1** |
| 2560 × 1440 | **44.1** |
| 3840 × 2160 | **66.2** |

Rough interpretation:

- **Below 30** — visibly coarse. Distant cars break up, track edges shimmer.
- **30 to 40** — usable, pixels noticeable if you look for them.
- **40 to 60** — comfortable for most people. Individual pixels stop registering.
- **Above 60** — sharp enough that further density is hard to perceive.

These are perceptual guidelines, not physical constants. Eyesight varies, and
anti-aliasing shifts the threshold.

## Working backwards to a minimum distance

The more useful direction is: given my panel and my tolerance for pixels, how
close can I get?

Holding 40 PPD on that same 32-inch panel:

| Resolution | Minimum distance |
| --- | --- |
| 1920 × 1080 | **84.6 cm** |
| 2560 × 1440 | **63.4 cm** |
| 3840 × 2160 | **42.3 cm** |

This is the concrete argument for resolution in sim racing. Going from 1080p to
4K on a 32-inch screen lets you sit 42 cm closer at the same perceived sharpness,
and that change in distance nearly doubles the field of view the panel occupies.

The [calculator](/) has a minimum-PPD mode that applies this as a floor on the
distance slider, so you cannot accidentally configure a setup that would look
like a mosaic.

## Why this interacts with FOV

The two guides pull in opposite directions:

- **FOV** wants you close. Closer means a larger angle from the same panel.
- **PPD** wants you far. Further means finer apparent detail.

Correct setup means finding where those meet. In practice:

1. Find the closest distance your resolution supports at your PPD tolerance.
2. Sit there.
3. Calculate FOV for *that* distance.

Doing it in this order gets you the widest honest field of view your hardware can
produce. Doing it the other way round — picking a distance by habit and then
calculating FOV — usually leaves angle on the table.

## The GT7 case

Gran Turismo 7's cockpit view is locked to about 55° vertical, which for a
32-inch 16:9 panel means sitting about 38 cm away. At 1080p that distance gives
roughly 18 PPD, which is coarse enough to be genuinely unpleasant.

This is the clearest example of the trade in practice: on a fixed-FOV game,
correct perspective and acceptable sharpness may be mutually exclusive unless the
resolution is high enough. At 4K the same 38 cm is comfortable.

## Where to go next

- The FOV side of the trade: [how FOV is calculated](/guide/how-to-calculate-fov)
- Making one screen work harder: [single monitor FOV](/guide/single-monitor-fov)
- What your game wants: [per-game FOV settings](/guide/game-fov-settings)
