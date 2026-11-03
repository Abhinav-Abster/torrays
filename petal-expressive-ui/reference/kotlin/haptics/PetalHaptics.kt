package com.yourapp.ui.haptics

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback

/**
 * One tiny haptic tick shared by every Petal control (rows, toggle buttons, nav items).
 * Swap the body if your app has its own haptic engine.
 */
@Composable
fun rememberPetalTick(): () -> Unit {
    val haptic = LocalHapticFeedback.current
    return remember(haptic) { { haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove) } }
}
