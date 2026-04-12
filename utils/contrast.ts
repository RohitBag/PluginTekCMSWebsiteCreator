/**
 * Determines whether black or white text should be used on a given background color.
 * Uses the YIQ luminance formula.
 * @param hexcolor - The background color in hex format (e.g., "#ffffff" or "ffffff")
 * @returns "white" or "black"
 */
export function getContrastColor(hexcolor: string | undefined): "white" | "black" {
    if (!hexcolor) return "black";
    
    // Remove the hash if it exists
    const hex = hexcolor.replace("#", "");
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate YIQ luminance
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Return white for dark backgrounds, black for light backgrounds
    return (yiq >= 128) ? "black" : "white";
}
