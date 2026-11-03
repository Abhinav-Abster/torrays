# Integration guide

## 1. Dependencies

`gradle/libs.versions.toml` (or directly in `app/build.gradle.kts`):

```toml
[versions]
composeBom = "2026.06.01"
activityCompose = "1.9.3"

[libraries]
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3", version = "1.5.0-alpha17" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-graphics-shapes = { group = "androidx.graphics", name = "graphics-shapes", version = "1.0.1" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
```

```kotlin
dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)          // pinned: expressive APIs
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.graphics.shapes)
    implementation(libs.androidx.activity.compose)
}
```

Requirements: Kotlin 2.0+ with the Compose compiler plugin, `minSdk` 26+ (blur is a no-op below API 31, everything else works),
`compileSdk` 35+.

## 2. Compiler opt-ins

```kotlin
kotlinOptions {            // or kotlin { compilerOptions { ... } }
    jvmTarget = "17"
    freeCompilerArgs += listOf(
        "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
        "-opt-in=androidx.compose.material3.ExperimentalMaterial3ExpressiveApi",
    )
}
```

## 3. Manifest (predictive back)

```xml
<application
    android:enableOnBackInvokedCallback="true" ... >
```

## 4. Package rename

All reference files use `com.yourapp`. Rename after copying:

```bash
grep -rl "com.yourapp" app/src/main/kotlin | xargs sed -i 's/com\.yourapp/com.example.realapp/g'
```

Folder layout inside the app (packages): `ui.theme`, `ui.components`, `ui.navigation`, `ui.intro`, `ui.haptics`, `ui.screens`.

## 5. Theme requirements

- Use `MaterialTheme` with a full `ColorScheme` (all `surfaceContainer*` roles). `dynamicColorScheme` or `lightColorScheme()`/`darkColorScheme()` with M3 defaults both work.
- Window background and `Scaffold(containerColor = MaterialTheme.colorScheme.background)` must match; every Petal screen paints `colorScheme.background`.
- Edge-to-edge (`enableEdgeToEdge()`): the header handles the status bar inset; the floating navbar handles the navigation inset.

## 6. Old component to Petal component

| Existing | Replace with |
|----------|--------------|
| `Card`, `ElevatedCard`, list `Surface` | `PetalGroupItem` / `PetalSection { row { } }` |
| `ListItem` | `PetalGroupRow` |
| `Row` with label + `Switch` | `PetalGroupToggleRow` |
| Label + `Slider`/chips/radios below | `PetalGroupControlRow { control }` |
| `TopAppBar` family | `PetalCollapsingTopAppBar` |
| `FilterChip`, `SegmentedButton`, `RadioButton` groups | `PetalChoiceButtonGroup` |
| `Button`, `OutlinedButton`, `TextButton` | `PetalButton(style = ...)` |
| `Slider` | `PetalSlider` or `PetalStandardSlider` |
| `CircularProgressIndicator`, `LinearProgressIndicator` | `PetalContainedLoadingIndicator` / `PetalLoadingIndicator` |
| `AlertDialog` | `PetalAlertDialog` |
| `NavigationBar` / `BottomAppBar` | `PetalFloatingNavBar` |
| `NavHost` + `AnimatedContent` transitions | `PetalStackHost` |
| `Icon` in a rounded square | `PetalShapedIcon` |

## 7. Wiring `PetalStackHost` (the usual stumbling block)

```kotlin
var stack by rememberSaveable { mutableStateOf(listOf(Route.HOME.name)) }
val routes = stack.map { Route.valueOf(it) }
fun push(r: Route) { if (r !in routes) stack = stack + r.name }
fun pop() { if (stack.size > 1) stack = stack.dropLast(1) }

PetalStackHost(routes, onBack = { pop() }, predictiveEnabled = prefs.predictiveBack, blurEnabled = prefs.depthBlur) { route ->
    when (route) { Route.HOME -> HomeScreen(onOpen = { push(Route.DETAIL) }) ... }
}
```

- Routes must be unique values; a route can appear once in the stack.
- Never add `BackHandler` inside screens that are hosted - the host owns back.
- Screens must be opaque (the host paints `colorScheme.background` behind each) and own their `Scaffold`.
- `WebView`/`AndroidView` screens work but do not blur on every device; keep the depth-blur switch available.
- Navigation-Compose: either keep it for graphs you do not redesign, or switch the redesigned graph to this stack.

## 8. Settings to expose to users

Two booleans, default `true`: **Predictive back animation** and **Depth blur**. Persist with DataStore/SharedPreferences and
pass into `PetalStackHost(predictiveEnabled, blurEnabled)`.

## 9. Known limits

- `material3:1.5.0-alpha17` is a pre-release; pin it. When 1.5 goes stable, bump and recompile.
- Blur needs API 31+; below that the dim layer still works.
- Intro animation is procedural (no assets) and costs about one frame of Canvas work per glyph.
