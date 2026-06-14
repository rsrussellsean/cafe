import { toPng } from "html-to-image";

// Builds a timestamped filename like "06-14-26_13-20_kp.png".
export function receiptFilename(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  const mm = p(d.getMonth() + 1);
  const dd = p(d.getDate());
  const yy = p(d.getFullYear() % 100);
  const hr = p(d.getHours());
  const min = p(d.getMinutes());
  return `${mm}-${dd}-${yy}_${hr}-${min}_kp.png`;
}

// Render a DOM node to a PNG and trigger a download. The node must be present
// in the document (not display:none) so fonts and images rasterize correctly.
export async function saveReceiptPng(
  node: HTMLElement,
  filename = receiptFilename(),
) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    // Match the foam receipt background so transparent corners read cleanly.
    backgroundColor: "#fbf7ee",
    // The canvas is sized to the element's box only, so any outer margin
    // (e.g. mx-auto when the receipt sits in a wide column on /bag) would
    // shift the clone and clip the right edge. Zero it on the captured clone.
    style: { margin: "0" },
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
