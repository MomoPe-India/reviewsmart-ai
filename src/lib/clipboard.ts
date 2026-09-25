/**
 * Universal Clipboard Copy Engine (iOS Safari, iOS WebViews, Android & Desktop)
 *
 * CRITICAL FOR iPHONE / iOS SAFARI:
 * 1. `navigator.clipboard.writeText(text)` MUST be called as the VERY FIRST operation
 *    inside a user tap gesture BEFORE any DOM mutations or `execCommand` calls.
 *    Running `execCommand` first consumes WebKit's transient UserGestureIndicator token
 *    and causes `navigator.clipboard` to fail on iOS Safari.
 * 2. Only if `navigator.clipboard.writeText` throws (e.g. non-HTTPS local IP or legacy WebView)
 *    do we fall back to `ClipboardItem` or synchronous `<textarea>` selection.
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // ── 1. PRIMARY: Native WebKit / Blink Async Clipboard API (writeText) ──
  // Works natively on iOS 13.4–18+ Safari, Chrome iOS, and Android Chrome when called first.
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Primary navigator.clipboard.writeText failed, trying fallbacks:", err);
    }
  }

  // ── 2. SECONDARY: Apple WebKit ClipboardItem with Promise<Blob> ──
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.write === "function" &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      const item = new ClipboardItem({
        "text/plain": Promise.resolve(new Blob([text], { type: "text/plain" })),
      });
      await navigator.clipboard.write([item]);
      return true;
    } catch (err) {
      console.warn("Secondary ClipboardItem write failed:", err);
    }
  }

  // ── 3. FALLBACK: Classic iOS / Android <textarea> setSelectionRange + execCommand ──
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Prevent iOS auto-zoom (font-size >= 16px) and prevent viewport scroll jump
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.fontSize = "16px";
    textArea.style.opacity = "0.01";
    textArea.style.zIndex = "-1";

    textArea.contentEditable = "true";
    textArea.readOnly = false;

    document.body.appendChild(textArea);

    textArea.focus({ preventScroll: true });
    textArea.select();
    textArea.setSelectionRange(0, 999999);

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }

    textArea.blur();
    document.body.removeChild(textArea);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }

    return ok;
  } catch (err) {
    console.warn("Fallback textarea copy error:", err);
    return false;
  }
}
