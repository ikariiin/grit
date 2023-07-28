export function generateDefaultCover(title: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 849;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    // TOOD: fallback to default pre-generated cover
    throw new Error("Could not draw default cover");
  }

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px 'Labrada Variable', 'Times New Roman', serif";
  ctx.fillStyle = "black";

  const words = title.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < 600) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  const mean = Math.abs(0 - lines.length - 1) / 2;

  lines.forEach((line, idx) => {
    const yPosFactor = idx - mean;
    const lineMetrics = ctx.measureText(line);
    const lineHeight = lineMetrics.actualBoundingBoxAscent + lineMetrics.actualBoundingBoxDescent;
    const yPos = canvas.height / 2 + (yPosFactor * lineHeight + idx * 20);
    ctx.fillText(line, canvas.width / 2 - lineMetrics.width / 2, yPos);
  });

  return canvas.toDataURL();
}
