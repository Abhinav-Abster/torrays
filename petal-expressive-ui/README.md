# Petal Expressive UI Skill

AI skill + Jetpack Compose reference code for a Petal-style Material 3 Expressive redesign.

```
SKILL.md                 the skill (start here; it interviews the user first)
LICENSE.md               commercial licence template
NOTICE.md                third-party notices
PRODUCT_DESCRIPTION.md   marketing copy for the store listing
docs/INTEGRATION.md      dependencies, opt-ins, manifest, migration table, wiring
docs/ICONS.md            how to use the 132 vector icons
reference/kotlin/        theme, containment, header, navigation, intro, controls, motion, loading, dialogs, haptics, examples
reference/icons/         132 vector drawables
```

Use: put the folder where your assistant loads skills (for example `.claude/skills/petal-expressive-ui/`) and ask it to
"redesign my app with Petal Expressive UI". The skill asks what to redesign before changing anything.
Reference code uses the placeholder package `com.yourapp`; the skill renames it.
