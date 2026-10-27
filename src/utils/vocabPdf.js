// Builds the printable vocabulary list as a plain DOM element (textContent
// only, so words can never inject HTML) and saves it as a PDF. The page is
// rendered by the browser itself, which is what makes Khmer script shape
// correctly. The Khmer font is bundled with the app, so this works offline.
const FONT = '"Noto Sans Khmer", Inter, Arial, sans-serif';

// Local date as YYYY-MM-DD (not UTC), so the file name matches your calendar day.
function localDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function el(tag, css, text) {
  const node = document.createElement(tag);
  node.style.cssText = css;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildDocument(words) {
  const root = el('div', `font-family:${FONT};color:#111;background:#fff;padding:8px 4px;width:700px;`);
  root.appendChild(el('h1', 'font-size:22px;margin:0 0 4px;', 'My English Vocabulary'));
  root.appendChild(el('p', 'font-size:12px;color:#555;margin:0 0 16px;', `${words.length} words · English → Khmer · ${localDate()}`));

  const table = el('table', 'width:100%;border-collapse:collapse;font-size:14px;');
  const head = el('tr', 'background:#eef2f6;');
  ['#', 'English word', 'Khmer meaning'].forEach((label, i) =>
    head.appendChild(el('th', `text-align:left;padding:8px 10px;border-bottom:2px solid #333;${i === 0 ? 'width:36px;' : i === 1 ? 'width:210px;' : ''}`, label))
  );
  table.appendChild(head);

  words.forEach((w, i) => {
    const row = el('tr', 'page-break-inside:avoid;break-inside:avoid;');
    row.appendChild(el('td', 'padding:8px 10px;border-bottom:1px solid #ddd;color:#777;vertical-align:top;', String(i + 1)));
    row.appendChild(el('td', 'padding:8px 10px;border-bottom:1px solid #ddd;font-weight:700;vertical-align:top;', w.word));
    row.appendChild(el('td', 'padding:8px 10px;border-bottom:1px solid #ddd;line-height:1.7;vertical-align:top;', w.definition));
    table.appendChild(row);
  });
  root.appendChild(table);
  return root;
}

/** Downloads all saved words as vocabulary-YYYY-MM-DD.pdf, sorted A–Z. */
export async function exportVocabPdf(words) {
  const sorted = [...words].sort((a, b) => a.word.localeCompare(b.word, 'en', { sensitivity: 'base' }));
  // Make sure the fonts are really loaded before the page is drawn.
  await Promise.all([
    document.fonts.load('400 14px "Noto Sans Khmer"', 'ក'),
    document.fonts.load('700 14px "Noto Sans Khmer"', 'ក'),
  ]);
  const { default: html2pdf } = await import('html2pdf.js'); // loaded only when exporting
  await html2pdf()
    .set({
      margin: [12, 10, 12, 10],
      filename: `vocabulary-${localDate()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: 'tr' },
    })
    .from(buildDocument(sorted))
    .save();
}
