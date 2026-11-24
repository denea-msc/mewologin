# Editing the team collage

The 18-person layout matches Figma file E0Tt4jHObeBcEhW2xwKv8D, node 1307:57. Its canvas is 1546 × 650 pixels, normalized from Figma page coordinates (192, 9489).

Edit `js/team-data.js` for names, descriptions, locations and geometry. Each member has x/y, width/height, a layer and an optional crop. Higher layer numbers are in front. The configured order matches Figma exactly. Chris (t2) is mirrored.

- Back: t10, t4, t12, t17, t6, t16, t14.
- Middle: t13, t8, t15, t9, t5, t7.
- Front: t1, t3, t2, t11, t0.

Existing portraits in `assets/team/` are used directly, including the updated transparent T3. Each tN.png has a corresponding tNh.png hover image. Both share the same frame, crop and mirror setting.

Unspecified biographies and locations remain blank. Hover, keyboard focus or touch reveals the details panel; other portraits receive the existing 10% white tint. `js/team-masks.js` caches alpha hit areas for all 18 default portraits. The masks match the configured image crop so transparent corners do not block members behind them.

The collage scales to fit smaller screens. Panel name text remains 24px and description/location text 18px.

Current identities: t1 is Ann Marie, t4 is Tina, t16 is Billy and t17 is Benji. Billy and Benji have no biography or location supplied yet.
