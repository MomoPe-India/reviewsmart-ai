/**
 * Utility for isolated, pixel-perfect document printing.
 * Spawns an isolated invisible iframe to prevent layout shifting, clipping, or multi-page blank overflows.
 */
export function printElement(
  elementId: string,
  title: string = "ReviewSmart AI - Printable Stand",
  pageCss: string = "@page { size: 4in 6in; margin: 0; }"
): void {
  if (typeof window === "undefined") return;

  const targetEl = document.getElementById(elementId);
  if (!targetEl) {
    window.print();
    return;
  }

  // Remove any previously orphaned print iframes
  const oldIframe = document.getElementById("reviewsmart-print-iframe");
  if (oldIframe) {
    oldIframe.remove();
  }

  const iframe = document.createElement("iframe");
  iframe.id = "reviewsmart-print-iframe";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Collect all stylesheet links and style tags from current document
  const headStyles = Array.from(
    document.querySelectorAll("link[rel='stylesheet'], style")
  )
    .map((el) => el.outerHTML)
    .join("\n");

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${headStyles}
        <style>
          ${pageCss}
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          #print-target {
            box-shadow: none !important;
            margin: auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${targetEl.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Allow styles and images to fully render before opening print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error("Print error:", err);
      window.print();
    } finally {
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2000);
    }
  }, 350);
}
