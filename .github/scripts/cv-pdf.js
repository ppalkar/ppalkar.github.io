// Saves the built CV page (/cv/) as a PDF, so the download button on the CV
// page always matches assets/json/resume.json. Run by the "Deploy site"
// workflow after the site is built.
//
// Usage: node cv-pdf.js <cv page url> <output pdf path>

const { chromium } = require("playwright");

// Page chrome that should not appear in the PDF: top navbar, footer,
// the table-of-contents sidebar and the PDF download button itself.
const PRINT_CSS = `
  #navbar, header:not(.post-header), footer, #toc-sidebar,
  .post-title a.float-right { display: none !important; }
  .container.mt-5 > .row > .col-sm-3 { display: none !important; }
  .container.mt-5 > .row > .col-sm-9 { flex: 0 0 100% !important; max-width: 100% !important; }
  .container.mt-5 { margin-top: 0 !important; padding-top: 0 !important; max-width: 100% !important; }
  body { padding-top: 0 !important; padding-bottom: 0 !important; }
  .card { box-shadow: none !important; }
  .card-title { break-after: avoid; }
  .list-group-item, .table-cv-map tr { break-inside: avoid; }
`;

async function renderCvPdf(url, outPath, launchOptions = {}, contextOptions = {}) {
  const browser = await chromium.launch(launchOptions);
  try {
    const context = await browser.newContext({ colorScheme: "light", ...contextOptions });
    const page = await context.newPage();
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    if (!response || !response.ok()) {
      throw new Error(`Could not load ${url} (HTTP ${response ? response.status() : "no response"})`);
    }
    // Force the light theme regardless of any saved preference.
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
    await page.addStyleTag({ content: PRINT_CSS });
    await page.emulateMedia({ media: "screen" });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      // Lay the page out wider than A4 (then shrink it) so the date column
      // sits beside each entry, as on the web page, instead of above it.
      scale: 0.8,
      margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" },
    });
  } finally {
    await browser.close();
  }
}

module.exports = { renderCvPdf };

if (require.main === module) {
  const [url, outPath] = process.argv.slice(2);
  if (!url || !outPath) {
    console.error("Usage: node cv-pdf.js <cv page url> <output pdf path>");
    process.exit(2);
  }
  renderCvPdf(url, outPath)
    .then(() => console.log(`Wrote ${outPath}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
