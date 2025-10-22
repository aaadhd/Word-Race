import sharp from "sharp";

const file = "spritesheet.png"; // 자르고 싶은 이미지 이름
const rows = 4, cols = 4;       // 4x4로 16개 분할
const gutter = 0;                // 프레임 사이 간격 있을 땐 픽셀값 넣기

const run = async () => {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const fw = Math.floor((width - gutter * (cols - 1)) / cols);
  const fh = Math.floor((height - gutter * (rows - 1)) / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const left = c * (fw + gutter);
      const top  = r * (fh + gutter);
      await img.extract({ left, top, width: fw, height: fh })
               .png()
               .toFile(`frames/frame_${String(r * cols + c + 1).padStart(2, "0")}.png`);
    }
  }
  console.log("✅ 16 frames saved to /frames");
};

run();
