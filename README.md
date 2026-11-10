# FOV Calculator - Display Field of View Calculator

<img width="1378" alt="demo image" src="https://github.com/nicholasxuu/fov-calculator/assets/676478/5c5a9764-631d-4a04-b639-5de7441e8c94">

A free, comprehensive FOV (Field of View) calculator for sim racing enthusiasts. Calculate optimal viewing angles for single monitor, triple monitor, curved, and flat screen setups.

## Features

- 📐 **Accurate FOV Calculation** - Calculate horizontal and vertical field of view
- 🖥️ **Multiple Monitor Support** - Single and triple monitor configurations
- 🌀 **Curved Monitor Support** - Support for various curvature radii (800R to 3800R)
- 🎮 **50+ Racing Games** - Pre-configured FOV settings for popular racing sims
- 📊 **Visual Preview** - See your setup visually with top and side views
- ⚙️ **Customizable** - Custom aspect ratios, screen sizes, and viewing distances

Help you visually see the FOV and room needed for your single monitor or triple monitor configuration.

## Reference

Inspired by [AndyF's fovcalc project](https://andyf.me/fovcalc.html).

Added triple screen surround and curved monitor support.

## For Developers

First, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000/fov-calculator](http://localhost:3000/fov-calculator) with your browser to see the result.

## Toy upload package

This branch contains the Chinese calculator only. Guides, language selection,
sharing and image export buttons are removed. The top toolbar space is retained.

```bash
pnpm run package:html
```

Upload `build/fov-calculator-toy.zip`. Its root contains `index.html`,
`_next/` (JavaScript and CSS), and `assets/` (canvas images).
Keep these files together when extracting or uploading; `index.html` loads
its resources relative to its own directory, including on Toy preview URLs.
The interactive calculator requires JavaScript. Opening only the HTML source
will not show the calculator because it renders in the browser.

The package command builds, checks asset paths for subdirectory hosting, and
checks ZIP integrity. It requires the `zip` and `unzip` command-line tools.
