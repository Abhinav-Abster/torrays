package com.yourapp.ui.theme

/**
 * Catalog of every shape in [PetalMaterialShapes].
 *
 * [Official35] is the complete Material 3 Expressive `MaterialShapes` set (35 shapes).
 * [Extras] are 14 additional Petal shapes. [All] is both (49).
 */
object PetalShapeCatalog {
    val Official35: List<Pair<String, ExpressiveShapeHolder>> = listOf(
        "Circle" to PetalMaterialShapes.Circle,
        "Square" to PetalMaterialShapes.Square,
        "Slanted" to PetalMaterialShapes.Slanted,
        "Arch" to PetalMaterialShapes.Arch,
        "Fan" to PetalMaterialShapes.Fan,
        "Arrow" to PetalMaterialShapes.Arrow,
        "SemiCircle" to PetalMaterialShapes.SemiCircle,
        "Oval" to PetalMaterialShapes.Oval,
        "Pill" to PetalMaterialShapes.Pill,
        "Triangle" to PetalMaterialShapes.Triangle,
        "Diamond" to PetalMaterialShapes.Diamond,
        "ClamShell" to PetalMaterialShapes.ClamShell,
        "Pentagon" to PetalMaterialShapes.Pentagon,
        "Gem" to PetalMaterialShapes.Gem,
        "VerySunny" to PetalMaterialShapes.VerySunny,
        "Sunny" to PetalMaterialShapes.Sunny,
        "Cookie4Sided" to PetalMaterialShapes.Cookie4Sided,
        "Cookie6Sided" to PetalMaterialShapes.Cookie6Sided,
        "Cookie7Sided" to PetalMaterialShapes.Cookie7Sided,
        "Cookie9Sided" to PetalMaterialShapes.Cookie9Sided,
        "Cookie12Sided" to PetalMaterialShapes.Cookie12Sided,
        "Ghostish" to PetalMaterialShapes.Ghostish,
        "Clover4Leaf" to PetalMaterialShapes.Clover4Leaf,
        "Clover8Leaf" to PetalMaterialShapes.Clover8Leaf,
        "Burst" to PetalMaterialShapes.Burst,
        "SoftBurst" to PetalMaterialShapes.SoftBurst,
        "Boom" to PetalMaterialShapes.Boom,
        "SoftBoom" to PetalMaterialShapes.SoftBoom,
        "Flower" to PetalMaterialShapes.Flower,
        "Puffy" to PetalMaterialShapes.Puffy,
        "PuffyDiamond" to PetalMaterialShapes.PuffyDiamond,
        "PixelCircle" to PetalMaterialShapes.PixelCircle,
        "PixelTriangle" to PetalMaterialShapes.PixelTriangle,
        "Bun" to PetalMaterialShapes.Bun,
        "Heart" to PetalMaterialShapes.Heart,
    )

    val Extras: List<Pair<String, ExpressiveShapeHolder>> = listOf(
        "Sun" to PetalMaterialShapes.Sun,
        "Cookie10Sided" to PetalMaterialShapes.Cookie10Sided,
        "RoundedSquare" to PetalMaterialShapes.RoundedSquare,
        "Rectangle" to PetalMaterialShapes.Rectangle,
        "RightTriangle" to PetalMaterialShapes.RightTriangle,
        "Hexagon" to PetalMaterialShapes.Hexagon,
        "Octagon" to PetalMaterialShapes.Octagon,
        "Decagon" to PetalMaterialShapes.Decagon,
        "Dodecagon" to PetalMaterialShapes.Dodecagon,
        "Scallop" to PetalMaterialShapes.Scallop,
        "SoftScallop" to PetalMaterialShapes.SoftScallop,
        "Teardrop" to PetalMaterialShapes.Teardrop,
        "Star4Sided" to PetalMaterialShapes.Star4Sided,
        "Star8Sided" to PetalMaterialShapes.Star8Sided,
    )

    val All: List<Pair<String, ExpressiveShapeHolder>> = Official35 + Extras
}
