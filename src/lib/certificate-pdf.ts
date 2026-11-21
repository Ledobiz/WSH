import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, PDFFont, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { CERTIFICATE_LAYOUT as LAYOUT, certificateSentence, formatCertificateDate } from "@/src/utils/certificate";

/*
 * Server-only. Builds a certificate PDF by stamping the student-specific details
 * onto the original Canva template (src/assets/certificate/template.pdf, A4
 * landscape, 841.89 x 595.28 pt, origin bottom-left). Everything else on the
 * page — logo, shapes, title, the Head Instructor signature — comes from the
 * template as-is.
 *
 * Fonts (SIL OFL, see fonts/OFL-*.txt) are the closest Google Fonts to the
 * Canva originals: Playball (script name), Zilla Slab Bold (≈ Montnapha Bold),
 * Hind Medium (≈ Asangha).
 */

const ASSET_DIR = path.join(process.cwd(), "src", "assets", "certificate");

const PURPLE = rgb(0x6a / 255, 0x1b / 255, 0x9a / 255);
const INK = rgb(0.07, 0.07, 0.07);
const WHITE = rgb(1, 1, 1);

export interface CertificatePdfData {
    name: string;
    courseTitle: string;
    date: Date;
    signature?: Uint8Array | null; // PNG (transparent background preferred)
}

let assetCache: Promise<{ template: Buffer; script: Buffer; slab: Buffer; sans: Buffer }> | null = null;

const loadAssets = () => {
    assetCache ??= Promise.all([
        readFile(path.join(ASSET_DIR, "template.pdf")),
        readFile(path.join(ASSET_DIR, "fonts", "Playball-Regular.ttf")),
        readFile(path.join(ASSET_DIR, "fonts", "ZillaSlab-Bold.ttf")),
        readFile(path.join(ASSET_DIR, "fonts", "Hind-Medium.ttf")),
    ]).then(([template, script, slab, sans]) => ({ template, script, slab, sans }));
    assetCache.catch(() => { assetCache = null; });
    return assetCache;
};

const fitSize = (font: PDFFont, text: string, maxSize: number, minSize: number, maxWidth: number) => {
    let size = maxSize;
    while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5;
    return size;
};

const wrap = (font: PDFFont, text: string, size: number, maxWidth: number) => {
    const lines: string[] = [];
    let current = "";
    for (const word of text.split(/\s+/)) {
        const candidate = current ? `${current} ${word}` : word;
        if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
            lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines;
};

export async function buildCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
    const assets = await loadAssets();

    const pdf = await PDFDocument.load(assets.template);
    pdf.registerFontkit(fontkit);
    const [script, slab, sans] = await Promise.all([
        pdf.embedFont(assets.script, { subset: false }), // subsetting breaks Playball glyph rendering
        pdf.embedFont(assets.slab, { subset: true }),
        pdf.embedFont(assets.sans, { subset: true }),
    ]);

    const page = pdf.getPage(0);
    const name = data.name.trim().replace(/\s+/g, " ");

    const drawCentered = (text: string, font: PDFFont, size: number, centerX: number, y: number, color = INK) =>
        page.drawText(text, { x: centerX - font.widthOfTextAtSize(text, size) / 2, y, size, font, color });

    // 1. Student name (script)
    const { name: N } = LAYOUT;
    const nameSize = fitSize(script, name, N.maxSize, N.minSize, N.maxWidth);
    drawCentered(name, script, nameSize, LAYOUT.pageCenterX, N.baselineY, PURPLE);

    // 2. Date inside the purple pill
    const { date: D } = LAYOUT;
    const dateText = formatCertificateDate(data.date);
    const dateSize = fitSize(slab, dateText, D.size, 10, D.maxWidth);
    const capHeight = slab.heightAtSize(dateSize, { descender: false });
    drawCentered(dateText, slab, dateSize, D.centerX, D.centerY - capHeight / 2 + dateSize * 0.06, WHITE);

    // 3. Course sentence (wrapped, centred)
    const { body: B } = LAYOUT;
    const sentence = certificateSentence(data.courseTitle);
    let bodySize = B.size;
    let lines = wrap(sans, sentence, bodySize, B.maxWidth);
    while (lines.length > B.maxLines && bodySize > B.minSize) {
        bodySize -= 0.5;
        lines = wrap(sans, sentence, bodySize, B.maxWidth);
    }
    const lineHeight = B.lineHeight * (bodySize / B.size);
    lines.forEach((line, i) => drawCentered(line, sans, bodySize, LAYOUT.pageCenterX, B.firstBaselineY - i * lineHeight));

    // 4. Student signature above the right-hand line
    if (data.signature?.length) {
        const image = await pdf.embedPng(data.signature);
        const { signature: S, studentLine: L } = LAYOUT;
        const scale = Math.min(S.maxWidth / image.width, S.maxHeight / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        page.drawImage(image, { x: L.centerX - w / 2, y: L.y + S.gapAboveLine, width: w, height: h });
    }

    // 5. Student name in capitals under the line
    const { studentName: SN } = LAYOUT;
    const upper = name.toUpperCase();
    const upperSize = fitSize(slab, upper, SN.size, SN.minSize, SN.maxWidth);
    drawCentered(upper, slab, upperSize, SN.centerX, SN.baselineY, PURPLE);

    pdf.setTitle(`Certificate of Participation — ${name}`);
    pdf.setAuthor("Women Skills Hub");
    pdf.setSubject(data.courseTitle);
    pdf.setProducer("Women Skills Hub");

    return pdf.save();
}
