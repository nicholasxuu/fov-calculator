---
title: "FOV Settings for Every Racing Game"
description: "What each racing sim actually asks for in its FOV field — degrees, radians, a multiplier or a slider notch — and the exact conversion from your calculated angle."
directAnswer: >-
  Racing sims do not agree on what a FOV field means. iRacing and Automobilista 2
  want horizontal degrees, Assetto Corsa and rFactor 2 want vertical degrees,
  the F1 games want an offset from a 77° baseline, GTR 2 wants a multiplier, and
  Dirt Rally wants a slider notch. Convert your calculated angle before typing it
  in.
updated: "2026-09-10"
order: 5
faq:
  - q: "Does iRacing use horizontal or vertical FOV?"
    a: "iRacing's FOV field is horizontal, in degrees. Enter the horizontal angle your setup produces. Assetto Corsa, Assetto Corsa Competizione and rFactor 2 use vertical degrees instead, so the same physical setup needs a visibly different number in those games."
  - q: "Why does the F1 game FOV setting go negative?"
    a: "The Codemasters F1 titles express FOV as an offset from a built-in baseline of roughly 77° horizontal, not as an absolute angle. A typical desk setup is narrower than that baseline, so the offset comes out negative. F1 2016-2018 clamps this to -1 to +1, F1 2019-2020 to -10 to +10, and F1 2021 onward to -20 to +20."
  - q: "What FOV should I use in Assetto Corsa?"
    a: "Assetto Corsa's FOV field is vertical degrees. A 32-inch 16:9 monitor at 70 cm produces a vertical angle of about 31.8°, so that is what goes in the field. Assetto Corsa Competizione and Assetto Corsa EVO use the same vertical convention."
  - q: "How does Gran Turismo 7 FOV work?"
    a: "GT7's cockpit view has a fixed vertical field of view of about 55° that you cannot change in game. The only way to make it correct is to change your seating distance so your screen actually spans 55° vertically, which for a 32-inch 16:9 panel means sitting about 38 cm away. The calculator's GT7 mode solves for that distance."
---

Every sim asks for field of view, and almost none of them ask for it the same
way. This page lists what each game's FOV field actually means and gives the
exact conversion.

The calculator currently covers **{{GAME_COUNT}} games**.

## The four conventions

**Horizontal degrees.** The angle from the left edge of your view to the right.
Used by iRacing, Project Cars, Automobilista 2, RaceRoom, Euro Truck Simulator.

**Vertical degrees.** The angle from the top of your view to the bottom. Used by
Assetto Corsa, ACC, rFactor 2, Le Mans Ultimate, EA Sports WRC, Forza.

**Offset from a baseline.** The Codemasters F1 games do not take an angle at all.
They take a correction applied to a built-in default of roughly 77° horizontal,
scaled differently in each generation.

**Multipliers and notches.** GTR 2 and Race 07 take a multiplier around 1.0.
Dirt Rally takes a slider position, not an angle.

Mixing these up is the single most common FOV mistake. Entering a horizontal
value of 54 into a game expecting vertical gives you a wildly zoomed-out view,
and it looks plausible enough that people race on it for months.

## The full reference table

The **value** column below is worked for one concrete setup: a **32-inch 16:9
monitor, single screen, eyes 70 cm away**, which produces a horizontal FOV of
**53.7°** and a vertical FOV of **31.8°**.

For your own setup, run the [calculator](/) and substitute your two angles into
the formula column.

{{GAME_TABLE:53.68:31.78}}

## Notes on the awkward ones

### The F1 games

The baseline is 77°, and the offset is halved before scaling. Because a normal
desk setup is narrower than 77°, the result is almost always negative — a
negative F1 FOV number is expected, not a mistake.

The clamps bite. A 32-inch at 70 cm wants -12 in F1 2021, comfortably inside that
generation's -20 to +20 range. The same setup in F1 2016-2018 wants -0.58 against a range of
only -1 to +1, so that generation has barely enough travel to reach a correct
desk FOV, and a triple rig can run out of range entirely.

### Gran Turismo 7

GT7's cockpit camera is locked to roughly **55° vertical**. There is no setting
to change it. The only remaining variable is you.

To make GT7 geometrically correct you move your seat until your screen genuinely
spans 55° vertically. For a 32-inch 16:9 panel that is about **38 cm** from your
eyes; for a 27-inch, about **32 cm**. Both are very close. The calculator's GT7
mode solves this backwards — it holds vertical FOV at 55° and reports the
distance you would need.

Whether you want to sit that close is a separate question. See
[pixels per degree](/guide/ppd-and-viewing-distance).

### Dirt Rally 1 and 2

The Dirt Rally FOV control is a slider with fixed notches covering roughly 30° to
70° of vertical FOV in 5° steps. The calculator returns the notch index, not an
angle. If your correct vertical FOV falls between notches you have to pick a side;
rounding down keeps the image closer to life-size.

### Richard Burns Rally

RBR takes its value in **radians**, and the calculator supplies the vertical
angle converted to radians. Four decimal places matter here — the field is
sensitive and small changes are visible.

### GTR 2 and Race 07

Both take a multiplier around 1.0 rather than an angle, derived by dividing the
vertical FOV by 58. GTR 2 clamps to 0.5-1.5 and Race 07 to 0.4-1.5. A typical
desk setup lands near the bottom of both ranges.

## If your game is not listed

Find out which convention it uses, then apply your calculated angle directly:

- If the field is labelled in degrees and a default around 90 looks normal, it is
  probably horizontal.
- If the default is around 55-60, it is probably vertical.
- If changing it by 1 makes a huge difference, it is probably a multiplier or an
  offset, not an angle.

## Where to go next

- The angles this page converts: [how FOV is calculated](/guide/how-to-calculate-fov)
- Triple rigs produce much larger horizontal angles: [triple monitor FOV](/guide/triple-monitor-fov)
- How close you can sit: [pixels per degree](/guide/ppd-and-viewing-distance)
