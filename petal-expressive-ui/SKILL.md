---
name: petal-expressive-ui
description: Redesign an Android Jetpack Compose app with the Petal Material 3 Expressive design system - grouped containment, collapsing header, shaped icons, predictive back with depth blur, intro animation, connected toggle buttons, sliders, spring animations, 35+ expressive shapes, floating bottom navbar, contained loading indicator and expressive dialogs. Use whenever the user wants a "Petal-like", "Material 3 Expressive" or "full UI redesign" of a Compose project, or asks for any single piece of that list. ALWAYS start by asking the user which parts of their project to redesign.
---

# Petal Expressive UI

Compose code extracted from the Petal Browser design system and its ports to Switcher 5G and Ever Haptics plus a procedure for
applying it to any Android Compose app. All reference code is in `reference/kotlin/`; vector icons are in `reference/icons/`.

## Rule 0 - ask before you touch anything

Never start redesigning immediately. Run the interview below first. Use a tappable multi-choice question tool
(`ask_user_input_v0`) when it exists, otherwise a short numbered list the user can answer with numbers.

### Step 1 - scan silently (no questions yet)
1. Find the Compose module: `build.gradle(.kts)` with `compose`, the `Activity` that calls `setContent`, the theme file.
2. List screens (`@Composable` functions ending in `Screen`, `Page`, `Route`) and how navigation works (NavHost, enum routes, `AnimatedContent`, custom).
3. Record: Material3 version, Compose BOM, `minSdk`, existing loaders (`CircularProgressIndicator`, `LinearProgressIndicator`), dialogs, sliders, chips, bottom bars, top bars.
4. If the project is NOT Jetpack Compose (XML views), say so, and offer: (a) migrate only the screens they pick, or (b) stop.

### Step 2 - ask which parts to redesign (multi-select)
Question: "Which parts of your project should I redesign with the Petal expressive system?"

| # | Option | What it changes |
|---|--------|-----------------|
| 1 | Containment | Cards/lists become connected groups (28dp outer, 6dp inner corners), section labels, press-squash rows |
| 2 | Header | Top bars become the Petal collapsing header (animated title, tonal-to-filled back button) |
| 3 | Icons | Icon badges in expressive shapes, plus Petal's vector icon pack |
| 4 | Predictive back | Back stack host with live gesture preview, corner clip, parallax and depth blur |
| 5 | Intro animation | Procedural launch animation (glyph stream, Material You glow, brand headline) |
| 6 | Button toggles | Connected toggle button groups replace chips, radios and segmented buttons; pill buttons that morph on press |
| 7 | Sliders | Rolling-cookie Petal slider and a stock-based expressive slider |
| 8 | Animations | Spring motion helpers, staggered entrance, bouncy press states |
| 9 | Shapes | 35 official Material 3 Expressive shapes plus 14 Petal extras, catalog included |
| 10 | Bottom navbar | Floating expressive toolbar nav with morphing selected pill |
| 11 | Loading indicator | Contained morphing loader (indeterminate and determinate); removes every progress bar and spinner |
| 12 | Dialogs and popups | Expressive alert dialog, welcome dialog template, bouncy entrance |
| 13 | Everything | All of the above |

Dependencies between options (apply the closest set, tell the user what you pulled in):
- 1, 3, 6, 11 and 12 need **9 Shapes** (`PetalMaterialShapes`) - always include it.
- 2 needs 1's `rememberPetalHeaderScrollBehavior` (same package) - no extra module.
- 4 and 10 are independent, but 4 changes how screens are stacked, so do it before 10.
- 6, 10 and 1 use `haptics/PetalHaptics.kt`.

### Step 3 - ask scope and details (only the questions that apply)
- Scope: all screens / only the screens I name / only new screens. If they name screens, confirm the list.
- Navigation (only if 4 or 10 chosen): list the routes you found and ask which two are bottom-bar tabs.
- Intro (only if 5): brand name, one-line tagline, up to 8 glyph icons or "pick for me".
- Palette: keep their existing colour scheme (default) or switch to dynamic colour.
- Behaviour that must not change: ask once "Anything I must leave untouched?" (business logic, analytics, ads, custom haptics).

### Step 4 - confirm the plan
Reply with a short plan: modules, screens, files you will add and edit, risks. Wait for "go". Then execute.

## Step 5 - set up the project (once)
Follow `docs/INTEGRATION.md`: dependencies, manifest flag, compiler opt-ins, package rename.
Copy only the reference files the chosen modules need (map below), renaming `com.yourapp` to the real package:

```bash
grep -rl "com.yourapp" app/src/main/kotlin | xargs sed -i 's/com\.yourapp/com.realpackage/g'
```

| Module | Files to copy |
|--------|---------------|
| Shapes (always) | `theme/PetalMaterialShapes.kt`, `theme/PetalShapeCatalog.kt` |
| Haptics shim | `haptics/PetalHaptics.kt` |
| Containment + icon badges | `containment/PetalGroups.kt` |
| Header | `header/PetalHeader.kt` |
| Predictive back | `navigation/PetalStackHost.kt` |
| Bottom navbar | `navigation/PetalFloatingNavBar.kt` |
| Intro animation | `intro/PetalIntroAnimation.kt` |
| Toggles and buttons | `controls/PetalChoiceButtonGroup.kt`, `controls/PetalButtons.kt` |
| Sliders | `controls/PetalSlider.kt`, `controls/PetalStandardSlider.kt` |
| Animations | `motion/PetalMotion.kt` |
| Loader | `loading/PetalLoading.kt` |
| Dialogs | `dialogs/PetalDialogs.kt`, optionally `examples/WelcomeDialogExample.kt` |
| Icons | `reference/icons/*.xml` into `res/drawable/` (only the ones used; see `docs/ICONS.md`) |

`examples/PetalShowcase.kt` shows every piece wired together; use it as the wiring reference and delete it afterwards.

## Module recipes

### 1. Containment
- Replace each `Card`/`ElevatedCard`/`Surface` list with `PetalSection(title) { row { pos -> ... } }`.
- Inside, use `PetalGroupRow` (icon, title, subtitle, chevron), `PetalGroupToggleRow` (switch with check thumb),
  `PetalGroupControlRow` (header plus any control below: toggle group, slider, buttons), or `PetalGroupItem(position)` for custom content.
- Corner positions are automatic: first row top-large, last bottom-large, middle 6dp. A one-row group is fully rounded.
- Use `petalGroupColor()` for the surface colour (light themes: surfaceContainerLow, dark: surfaceContainerHigh). In dialogs/sheets whose container is already `surfaceContainerHigh`, pass `color = surfaceContainerHighest`.
- Remove manual `HorizontalDivider`s between rows - the 3dp gap is the separator.
- Disabled rows: `alpha(0.38f)` and pass `onClick = null`.

### 2. Header
- In every screen's `Scaffold`: `val scrollBehavior = rememberPetalHeaderScrollBehavior()`, add `.nestedScroll(scrollBehavior.nestedScrollConnection)` to the Scaffold, and use
  `topBar = { PetalCollapsingTopAppBar(title, scrollBehavior, onNavigateBack = onBack /* null on root screens */, actions = {...}) }`.
- Replace `TopAppBar`, `CenterAlignedTopAppBar`, `LargeTopAppBar`, `MediumTopAppBar`. Move any title subtitle into the content as a bodyLarge line.
- Content must scroll (LazyColumn or `verticalScroll`) or the header cannot collapse.

### 3. Icons
- Icon badges: `PetalShapedIcon(icon, shape = PetalMaterialShapes.Cookie6Sided, variant = PetalBadgeVariant.PRIMARY)`.
- Give every list row a different shape (cycle `Cookie6Sided, Sunny, Clover4Leaf, Flower, Cookie9Sided, Pentagon, Cookie12Sided, Gem`); keep a feature's shape stable.
- Tinted feature icons (custom colours): copy the `featureShape(color)` idea - map a colour hash to a shape so it is stable.
- Vector pack: `painterResource(R.drawable.settings_filled)`. See `docs/ICONS.md`.

### 4. Predictive back
- Needs `android:enableOnBackInvokedCallback="true"` on `<application>` and `activity-compose` 1.8+.
- Model navigation as a back stack of unique route values (enum names are ideal), saved with `rememberSaveable { mutableStateOf(listOf(ROOT.name)) }`.
- Wrap the screen switch in `PetalStackHost(stack, onBack = ::pop, predictiveEnabled, blurEnabled) { route -> ... }`.
- Delete every `BackHandler` that only pops a screen and every old `AnimatedContent`/`NavHost` transition. All screens in the stack stay composed (state survives).
- Tabs: root tab = `[HOME]`, second tab = `[HOME, SETTINGS]`; switching tabs replaces the stack.
- Add two user settings (default on): "Predictive back animation" and "Depth blur", and pass them to the host.
- Keep the bottom navbar OUTSIDE the host.
- Works with Navigation-Compose only if you map `NavBackStackEntry`s to the stack; otherwise switch that graph to the enum stack for the chosen screens.

### 5. Intro animation
- Show once per process: `if (!PetalIntroState.hasShownThisSession) PetalIntroAnimation(brandName, tagline, onComplete = { showIntro = false })` above the app shell, or as a first route.
- Keep it under ~2 seconds, respect reduced-motion (skip when `Settings.Global.ANIMATOR_DURATION_SCALE == 0f`).

### 6. Button toggles and buttons
- Pick-one UI (chips, radios, segmented buttons, dropdowns with <=6 options) becomes `PetalChoiceButtonGroup(options = listOf(PetalButtonGroupItem(value, label, icon)), selected, onSelect)`.
- More than four options or long labels scroll horizontally automatically.
- Replace `Button`, `OutlinedButton`, `TextButton`, `FilledTonalButton` with `PetalButton(onClick, style = FILLED|TONAL|OUTLINED|TEXT, height = 48.dp)`. Custom colours: `colors = ButtonDefaults.buttonColors(...)` (FILLED/TONAL only).
- Boolean choices stay switches (`PetalGroupToggleRow`).

### 7. Sliders
- `PetalSlider` = Petal's signature thick pill track with a rolling cookie thumb (no steps, no custom colours).
- `PetalStandardSlider` = stock M3 expressive slider with `steps`, `colors`, `enabled` - use when ticks are needed.
- Keep the app's existing value-change haptics; show the live value in a pill (`Surface(shape = CircleShape, color = primaryContainer)`).

### 8. Animations
- `Modifier.entrance(index)` gives staggered spring rise-in. Use on top-level sections only (index 0 to ~8).
- Press feedback is built into rows, buttons and nav items; do not add `Modifier.clickable` scale hacks.
- Use springs, not tweens, for state changes: `spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMedium)`.

### 9. Shapes
- `PetalMaterialShapes.X.toShape()` gives a Compose `Shape`; `.polygon` exposes the `RoundedPolygon` for `Morph` animations. `PetalShapeCatalog.Official35` lists the 35 standard shapes, `Extras` the 14 Petal additions, `All` both.
- Use for icon badges, avatars, swatches, empty states, selection morphs (circle to cookie when selected).

### 10. Bottom navbar
- `PetalFloatingNavBar(items = listOf(PetalNavItem(key, label, icon, selectedRotation)), selected, onSelect)`.
- Two to four items. The bar handles the navigation-bar inset; give screens `padding(bottom = 96.dp + navBarInset)` so content clears it.
- Hide it on pushed screens: render only when the top of the stack is a tab.

### 11. Contained loading indicator
- Remove **every** `CircularProgressIndicator`, `LinearProgressIndicator`, custom progress bars and spinners.
- Indeterminate: `PetalContainedLoadingIndicator(size = 56.dp)`. Determinate (downloads): `PetalContainedLoadingIndicator(progress = { p })`.
- Inside buttons or tinted surfaces: `PetalLoadingIndicator(size = 24.dp)` (no container). In headers: `PetalLoadingBadge(visible = busy)`.
- Full-screen loads: centre a 72dp contained indicator.

### 12. Dialogs and popups
- `AlertDialog` becomes `PetalAlertDialog(title, message, icon, confirmText, onConfirm, dismissText, destructive)`.
- Custom dialogs: 32-36dp rounded `Surface(color = surfaceContainerHigh)` inside `Dialog`, bouncy `scaleIn` entrance, `PetalButton`s.
- Replace `Toast` for important events with a dialog or a snackbar styled with `RoundedCornerShape(20.dp)`.

## Step 6 - verify
1. `./gradlew :app:compileDebugKotlin` (or `assembleDebug`); fix errors before reporting.
2. Grep for leftovers: `CircularProgressIndicator|LinearProgressIndicator|TopAppBar(|AlertDialog(|FilterChip|SegmentedButton|RadioButton(|BackHandler`.
3. Check each redesigned screen in light, dark and (if used) AMOLED; check 1.3x font scale and a small phone.
4. Predictive back: Developer options > "Predictive back animations" on (Android 13) or default (14+); swipe from both edges, cancel mid-swipe, and commit.
5. Report: what changed, files added, anything skipped and why.

## Hard rules
- Do not change business logic, data layer, permissions or analytics. UI layer only.
- Keep user-visible strings; only add new strings for new settings (use string resources if the project does).
- Do not invent APIs. This code targets Compose BOM 2026.06.01 with `material3:1.5.0-alpha17`; if the project is older, bump it (INTEGRATION.md) or tell the user what cannot be used.
- Stay incremental: one module at a time, compile between modules.
- Never leave the same screen half old, half new: finish a screen completely (header, containment, controls, loaders) before the next.
