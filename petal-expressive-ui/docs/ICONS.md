# Petal vector icon pack

`reference/icons/` contains 132 Android vector drawables used across the Petal apps (24dp, `fillColor` driven, tint-friendly).
Copy only what you use into `app/src/main/res/drawable/`.

```kotlin
Icon(painter = painterResource(R.drawable.settings_filled), contentDescription = "Settings")
// inside a shaped badge
PetalShapedIcon(icon = ImageVector.vectorResource(R.drawable.bolt_filled), shape = PetalMaterialShapes.Sunny)
```

Naming: `name_filled` / `name_rounded` (Material Symbols style) and `icon_name` (browser/utility set).

Highlights: `home_filled`, `settings_filled`, `bolt_filled`, `bolt_boost_filled`, `memory_filled`, `mobile_vibrate_filled`,
`mobile_charge_filled`, `battery_android_0..6/full`, `layers_filled`, `night_mode_filled`, `brightness_medium_filled`,
`update_rounded`, `backup_filled`, `restore_page_filled`, `reset_settings_rounded`, `timeline_rounded`, `translate`, `icon_share`,
`icon_download`, `icon_search`, `icon_history`, `icon_bookmark`, `icon_secure`, `icon_fingerprint`, `icon_tab_plus`, `icon_incognito`.

For anything missing, use `androidx.compose.material.icons.rounded.*` (material-icons-extended); the Petal components accept any `ImageVector`.

Brand logos, launcher icons and third-party marks were deliberately excluded from this pack.
