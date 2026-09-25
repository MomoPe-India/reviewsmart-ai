/**
 * Universal, Multi-Layer Clipboard Copy Utility
 * 
 * Specifically engineered for 100% reliability on:
 * - iPhone & iPad (iOS Safari, Mobile Safari, Chrome iOS)
 * - In-App WebViews on iOS (Camera QR scanner preview, WhatsApp, Instagram, Telegram)
 * - Android (Chrome, Samsung Internet, Firefox)
 * - Desktop browsers (Safari, Chrome, Firefox, Edge)
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  let copied = false;

  // ── LAYER 1: Synchronous DOM Range selection on an unstyled SPAN ──
  // This is the most reliable method for iOS Safari and iOS WebViews because:
  // 1. It runs synchronously within the user's tap gesture frame (never expires).
  // 2. It does NOT focus a textarea or input, so the iOS virtual keyboard NEVER pops up.
  // 3. It prevents iOS viewport zoom and scrolling jumps.
  try {
    const span = document.createElement("span");
    span.textContent = text;
    span.setAttribute("aria-hidden", "true");
    span.style.all = "unset";
    span.style.position = "fixed";
    span.style.top = "0";
    span.style.left = "0";
    span.style.clip = "rect(0, 0, 0, 0)";
    span.style.whiteSpace = "pre";
    span.style.webkitUserSelect = "text";
    span.style.userSelect = "text";
    span.style.opacity = "0.001";
    span.style.pointerEvents = "none";
    document.body.appendChild(span);

    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        copied = document.execCommand("copy");
      } catch {
        // May fail in rare restricted security contexts
      }
      selection.removeAllRanges();
    }
    document.body.removeChild(span);
  } catch (err) {
    console.warn("Layer 1 Range copy error:", err);
  }

  // ── LAYER 2: Synchronous TEXTAREA setSelectionRange (iOS / WebKit secondary) ──
  if (!copied) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.contentEditable = "true";
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      textArea.style.fontSize = "16pt"; // Prevents iOS Safari auto-zoom
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);

      textArea.focus({ preventScroll: true });
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      try {
        copied = document.execCommand("copy");
      } catch {}

      textArea.blur();
      document.body.removeChild(textArea);
    } catch (err) {
      console.warn("Layer 2 Textarea copy error:", err);
    }
  }

  // ── LAYER 3: Modern Async Clipboard API (ClipboardItem & writeText) ──
  // Always trigger modern API so UIPasteboard on modern iOS (13.4 - 18+)
  // and modern Android/Desktop browsers are updated through the system pasteboard API.
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        const item = new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        copied = true;
      } else if (navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (asyncErr) {
      // Async failure is non-fatal if Layer 1 or 2 already succeeded!
      console.warn("Layer 3 Async clipboard write error:", asyncErr);
    }
  }

  return copied;
}
