package com.yourapp.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Palette
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.Speed
import androidx.compose.material.icons.rounded.Tune
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.unit.dp
import com.yourapp.ui.components.PetalAlertDialog
import com.yourapp.ui.components.PetalBadgeVariant
import com.yourapp.ui.components.PetalButton
import com.yourapp.ui.components.PetalButtonGroupItem
import com.yourapp.ui.components.PetalButtonStyle
import com.yourapp.ui.components.PetalChoiceButtonGroup
import com.yourapp.ui.components.PetalCollapsingTopAppBar
import com.yourapp.ui.components.PetalContainedLoadingIndicator
import com.yourapp.ui.components.PetalFloatingNavBar
import com.yourapp.ui.components.PetalGroupControlRow
import com.yourapp.ui.components.PetalGroupRow
import com.yourapp.ui.components.PetalGroupToggleRow
import com.yourapp.ui.components.PetalNavItem
import com.yourapp.ui.components.PetalSection
import com.yourapp.ui.components.PetalShapedIcon
import com.yourapp.ui.components.PetalSlider
import com.yourapp.ui.components.PetalStandardSlider
import com.yourapp.ui.components.entrance
import com.yourapp.ui.components.rememberPetalHeaderScrollBehavior
import com.yourapp.ui.navigation.PetalStackHost
import com.yourapp.ui.theme.PetalMaterialShapes
import com.yourapp.ui.theme.PetalShapeCatalog

private enum class Dest { HOME, SETTINGS, DETAIL }

/**
 * End-to-end example: a Petal app shell (stack host with predictive back + depth blur, floating nav bar)
 * hosting a showcase screen. Copy the structure, not the content.
 */
@Composable
fun PetalAppShellExample() {
    // Saveable back stack of destination names. HOME is the root; SETTINGS sits on top of it.
    var stack by rememberSaveable { mutableStateOf(listOf(Dest.HOME.name)) }
    val routes = stack.map { Dest.valueOf(it) }
    val top = routes.last()
    fun push(d: Dest) { if (d !in routes) stack = stack + d.name }
    fun pop() { if (stack.size > 1) stack = stack.dropLast(1) }
    fun selectTab(d: Dest) { stack = if (d == Dest.HOME) listOf(Dest.HOME.name) else listOf(Dest.HOME.name, d.name) }

    Box(Modifier.fillMaxSize()) {
        PetalStackHost(
            stack = routes,
            onBack = { pop() },
            predictiveEnabled = true,
            blurEnabled = true,
            modifier = Modifier.fillMaxSize(),
        ) { dest ->
            when (dest) {
                Dest.HOME -> PetalShowcaseScreen(title = "Home", onBack = null, onOpenDetail = { push(Dest.DETAIL) })
                Dest.SETTINGS -> PetalShowcaseScreen(title = "Settings", onBack = null, onOpenDetail = { push(Dest.DETAIL) })
                Dest.DETAIL -> PetalShowcaseScreen(title = "Detail", onBack = { pop() }, onOpenDetail = {})
            }
        }

        // The nav bar lives OUTSIDE the host so it stays put while screens animate.
        if (top == Dest.HOME || top == Dest.SETTINGS) {
            PetalFloatingNavBar(
                items = listOf(
                    PetalNavItem(Dest.HOME, "Home", Icons.Rounded.Home),
                    PetalNavItem(Dest.SETTINGS, "Settings", Icons.Rounded.Settings, selectedRotation = 90f),
                ),
                selected = top,
                onSelect = { selectTab(it) },
                modifier = Modifier.align(Alignment.BottomCenter),
            )
        }
    }
}

@Composable
fun PetalShowcaseScreen(title: String, onBack: (() -> Unit)?, onOpenDetail: () -> Unit) {
    val scrollBehavior = rememberPetalHeaderScrollBehavior()
    var showDialog by remember { mutableStateOf(false) }
    var mode by remember { mutableStateOf("Balanced") }
    var haptics by remember { mutableStateOf(true) }
    var volume by remember { mutableFloatStateOf(0.6f) }
    var speed by remember { mutableFloatStateOf(0.4f) }

    if (showDialog) {
        PetalAlertDialog(
            onDismissRequest = { showDialog = false },
            title = "Expressive dialog",
            message = "32dp container, shaped icon badge and pill buttons that morph on press.",
            icon = Icons.Rounded.Palette,
            confirmText = "Nice",
            onConfirm = { showDialog = false },
            dismissText = "Cancel",
        )
    }

    Scaffold(
        modifier = Modifier.fillMaxSize().nestedScroll(scrollBehavior.nestedScrollConnection),
        containerColor = MaterialTheme.colorScheme.background,
        topBar = { PetalCollapsingTopAppBar(title = title, scrollBehavior = scrollBehavior, onNavigateBack = onBack) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp)
                .padding(bottom = 110.dp),
            verticalArrangement = Arrangement.spacedBy(22.dp),
        ) {
            PetalSection(title = "Containment", modifier = Modifier.entrance(0)) {
                row { pos ->
                    PetalGroupToggleRow(
                        icon = Icons.Rounded.Tune, title = "Haptics", subtitle = "Toggle row with check thumb",
                        checked = haptics, onCheckedChange = { haptics = it }, position = pos,
                        badgeShape = PetalMaterialShapes.Cookie6Sided,
                    )
                }
                row { pos ->
                    PetalGroupRow(
                        icon = Icons.Rounded.Speed, title = "Open detail", subtitle = "Pushes a screen: try the back swipe",
                        position = pos, onClick = onOpenDetail, badgeShape = PetalMaterialShapes.Sunny,
                        variant = PetalBadgeVariant.SECONDARY,
                    )
                }
                row { pos ->
                    PetalGroupControlRow(
                        icon = Icons.Rounded.Palette, title = "Mode", position = pos,
                        badgeShape = PetalMaterialShapes.Clover4Leaf, variant = PetalBadgeVariant.TERTIARY,
                    ) {
                        PetalChoiceButtonGroup(
                            options = listOf("Quiet", "Balanced", "Loud").map { PetalButtonGroupItem(it, it) },
                            selected = mode,
                            onSelect = { mode = it },
                        )
                    }
                }
            }

            PetalSection(title = "Sliders", modifier = Modifier.entrance(1)) {
                row { pos ->
                    PetalGroupControlRow(icon = Icons.Rounded.Tune, title = "Rolling cookie slider", position = pos) {
                        PetalSlider(value = volume, onValueChange = { volume = it }, modifier = Modifier.fillMaxWidth())
                    }
                }
                row { pos ->
                    PetalGroupControlRow(icon = Icons.Rounded.Speed, title = "Standard expressive slider", position = pos, badgeShape = PetalMaterialShapes.Flower) {
                        PetalStandardSlider(value = speed, onValueChange = { speed = it }, steps = 9, modifier = Modifier.fillMaxWidth())
                    }
                }
            }

            PetalSection(title = "Buttons and loading", modifier = Modifier.entrance(2)) {
                row { pos ->
                    PetalGroupControlRow(icon = Icons.Rounded.Palette, title = "Pill buttons", position = pos) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                            PetalButton(onClick = { showDialog = true }) { Text("Filled") }
                            PetalButton(onClick = {}, style = PetalButtonStyle.TONAL) { Text("Tonal") }
                            PetalButton(onClick = {}, style = PetalButtonStyle.OUTLINED) { Text("Outline") }
                            PetalContainedLoadingIndicator(size = 44.dp)
                        }
                    }
                }
            }

            PetalSection(title = "35 Material 3 Expressive shapes", modifier = Modifier.entrance(3)) {
                row { pos ->
                    com.yourapp.ui.components.PetalGroupItem(position = pos) {
                        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            PetalShapeCatalog.Official35.chunked(6).forEach { chunk ->
                                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                    chunk.forEach { (_, shape) ->
                                        PetalShapedIcon(icon = Icons.Rounded.Palette, shape = shape, size = 44.dp, iconSize = 20.dp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
