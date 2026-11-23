# Editing the team collage

The 16-person layout matches Figma file E0Tt4jHObeBcEhW2xwKv8D, node 1307:57. Its canvas is 1569 × 577 pixels, normalized from Figma page coordinates (185, 9542).

Edit `js/team-data.js` for names, descriptions, locations and geometry. Each member has x/y, width/height, a layer and an optional crop. Higher layer numbers are in front. The configured order matches Figma exactly. Chris (t2) is mirrored.

- Back: t6, t10, t14, t8, t7.
- Middle: t13, t12, t15, t9, t5, t4.
- Front: t1, t3, t2, t11, t0.

Existing portraits in `assets/team/` are used directly, including the updated transparent T3. Each tN.png has a corresponding tNh.png hover image. Both share the same frame, crop and mirror setting.

Unspecified biographies and locations remain blank. Hover, keyboard focus or touch reveals the details panel; other portraits receive the existing 10% white tint. `js/team-masks.js` caches alpha hit areas for all 16 default portraits. The masks match the configured image crop so transparent corners do not block members behind them.

The collage scales to fit smaller screens. Panel name text remains 24px and description/location text 18px.
