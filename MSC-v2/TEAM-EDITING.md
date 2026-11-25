# Editing the team collage

The 20-person layout matches Figma file E0Tt4jHObeBcEhW2xwKv8D, node 1307:57. Its canvas is 1569 × 740 pixels, normalized from Figma page coordinates (231, 9481).

Edit `js/team-data.js` for names, descriptions, locations and geometry. Each member has x/y, width/height, a layer and an optional crop. Higher layer numbers are in front. The configured order matches Figma exactly. Chris (t2) is mirrored.

- Back: t10, t6, t16, t11, t17, t19, t18, t0, t14.
- Middle: t15, t12, t13, t7, t9, t5.
- Front: t1, t3, t8, t4, t2.

Existing portraits in `assets/team/` are used directly, including the updated transparent T3. Each tN.png has a corresponding tNh.png hover image. Both share the same frame, crop and mirror setting.

Unspecified biographies and locations remain blank. Hover, keyboard focus or touch reveals the details panel; other portraits receive the existing 10% white tint. `js/team-masks.js` caches alpha hit areas for all 20 default portraits. The masks match the configured image crop so transparent corners do not block members behind them.

The collage scales to fit smaller screens. Panel name text is 20px and description/location text is 16px.

Current identities: t1 is Ann Marie, t4 is Tina, t16 is Billy and t17 is Benji. Billy and Benji have no biography or location supplied yet.

Denea is t18 and Mat is t19. Their biographies and locations have not been supplied. Active portraits move smoothly upward by 3 screen pixels; they retain their original size and layer. Tooltip placement reserves space for this movement.


The detail panel is 320px wide (constrained on small screens), with compact padding and a 6px gap from the portrait when space permits.


To verify this update after deployment, confirm a 3px hover lift and the latest t9h.png and t11h.png portraits.
