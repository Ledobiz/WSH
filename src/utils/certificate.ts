// Client-side certificate generator. Draws a certificate of completion onto a
// canvas and triggers a PNG download — no external dependencies or backend needed.

interface CertificateData {
    studentName: string;
    courseTitle: string;
    date: string; // human-readable, e.g. "July 21, 2026"
    certificateId?: string;
}

const PRIMARY = "#7c3aed";
const ACCENT = "#f59e0b";
const INK = "#1f2937";
const MUTED = "#6b7280";

const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (ctx.measureText(candidate).width > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines;
};

const drawCertificate = (data: CertificateData): HTMLCanvasElement => {
    const width = 1600;
    const height = 1131;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#faf8ff";
    ctx.fillRect(0, 0, width, height);

    // Outer + inner borders
    ctx.strokeStyle = PRIMARY;
    ctx.lineWidth = 10;
    ctx.strokeRect(40, 40, width - 80, height - 80);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 3;
    ctx.strokeRect(64, 64, width - 128, height - 128);

    ctx.textAlign = "center";

    // Brand
    ctx.fillStyle = PRIMARY;
    ctx.font = "bold 34px Georgia, 'Times New Roman', serif";
    ctx.fillText("WOMEN SKILLS HUB", width / 2, 170);

    ctx.fillStyle = MUTED;
    ctx.font = "20px Georgia, serif";
    ctx.fillText("Upskilling for financial independence", width / 2, 205);

    // Title
    ctx.fillStyle = INK;
    ctx.font = "bold 74px Georgia, serif";
    ctx.fillText("Certificate of Completion", width / 2, 340);

    // Accent divider
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 375);
    ctx.lineTo(width / 2 + 120, 375);
    ctx.stroke();

    // Body
    ctx.fillStyle = MUTED;
    ctx.font = "28px Georgia, serif";
    ctx.fillText("This is to certify that", width / 2, 460);

    // Student name
    ctx.fillStyle = PRIMARY;
    ctx.font = "italic bold 66px Georgia, serif";
    ctx.fillText(data.studentName, width / 2, 555);

    // Underline under name
    const nameWidth = Math.min(ctx.measureText(data.studentName).width + 80, width - 300);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - nameWidth / 2, 585);
    ctx.lineTo(width / 2 + nameWidth / 2, 585);
    ctx.stroke();

    ctx.fillStyle = MUTED;
    ctx.font = "28px Georgia, serif";
    ctx.fillText("has successfully completed the course", width / 2, 650);

    // Course title (wrapped)
    ctx.fillStyle = INK;
    ctx.font = "bold 44px Georgia, serif";
    const lines = wrapText(ctx, data.courseTitle, width - 400);
    let y = 730;
    for (const line of lines.slice(0, 3)) {
        ctx.fillText(line, width / 2, y);
        y += 58;
    }

    // Footer: date + signature line
    const footerY = 970;

    ctx.fillStyle = INK;
    ctx.font = "26px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(data.date, width / 2 - 380, footerY);
    ctx.fillText("Women Skills Hub", width / 2 + 380, footerY);

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 540, footerY + 18);
    ctx.lineTo(width / 2 - 220, footerY + 18);
    ctx.moveTo(width / 2 + 220, footerY + 18);
    ctx.lineTo(width / 2 + 540, footerY + 18);
    ctx.stroke();

    ctx.fillStyle = MUTED;
    ctx.font = "20px Georgia, serif";
    ctx.fillText("Date", width / 2 - 380, footerY + 50);
    ctx.fillText("Authorized Signature", width / 2 + 380, footerY + 50);

    if (data.certificateId) {
        ctx.fillStyle = MUTED;
        ctx.font = "16px Georgia, serif";
        ctx.fillText(`Certificate ID: ${data.certificateId}`, width / 2, height - 90);
    }

    return canvas;
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export const downloadCertificate = (data: CertificateData) => {
    const canvas = drawCertificate(data);
    const link = document.createElement("a");
    link.download = `wsh-certificate-${slugify(data.courseTitle) || "course"}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
