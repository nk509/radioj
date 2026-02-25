// ledMarquee.js — модульный LED-маркиз (шрифт 7px, итоговая высота 9 виртуальных строк)
export function initLedMarquee(container, options = {}) {
  const COLS = options.widthPx || 200;
  const ROWS = 9;
  const PIXEL_SIZE = options.pixelSize ?? 3;
  const GAP = options.gap ?? 1;
  const ON_COLOR = options.color || '#39ff14';
  const SPEED_DEFAULT = options.speed ?? 40;

  const root = document.createElement('div');
  root.style.display = 'inline-block';
  const screen = document.createElement('div');
  screen.className = 'led-marquee-screen';
  root.appendChild(screen);
  container.appendChild(root);

  const style = document.createElement('style');
  style.textContent = `
    .led-marquee-screen{
      --cols: ${COLS};
      --rows: ${ROWS};
      --pixel-size: ${PIXEL_SIZE}px;
      --gap: ${GAP}px;
      --on-color: ${ON_COLOR};
      --bg-dim: rgba(255,255,255,0.02);
      display: grid;
      grid-template-columns: repeat(var(--cols), var(--pixel-size));
      grid-template-rows: repeat(var(--rows), var(--pixel-size));
      gap: var(--gap);
      width: calc(var(--cols) * var(--pixel-size) + (var(--cols)-1)*var(--gap));
      height: calc(var(--rows) * var(--pixel-size) + (var(--rows)-1)*var(--gap));
      background: transparent;
      image-rendering: pixelated;
    }
    .led-marquee-screen .pix{
      width: var(--pixel-size);
      height: var(--pixel-size);
      background: rgba(255,255,255,0.02);
      border-radius: 2px;
      transition: background 80ms linear, box-shadow 80ms linear;
    }
    .led-marquee-screen .pix.on{
      background: var(--on-color);
      box-shadow: 0 0 6px rgba(57,255,20,0.14), 0 0 12px rgba(57,255,20,0.08);
    }
  `;
  root.appendChild(style);

  const FONT_5x7 = {
    width:5, height:7,
    glyphs: {
      ' ': [0,0,0,0,0,0,0],
      'A':[0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
      'B':[0b11110,0b10001,0b10001,0b11110,0b10001,0b10001,0b11110],
      'C':[0b01110,0b10001,0b10000,0b10000,0b10000,0b10001,0b01110],
      'D':[0b11100,0b10010,0b10001,0b10001,0b10001,0b10010,0b11100],
      'E':[0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b11111],
      'H':[0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
      'I':[0b01110,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
      'L':[0b10000,0b10000,0b10000,0b10000,0b10000,0b10000,0b11111],
      'O':[0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
      'R':[0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
      'S':[0b01111,0b10000,0b10000,0b01110,0b00001,0b00001,0b11110],
      'T':[0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
      'U':[0b10001,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
      '-':[0b00000,0b00000,0b01110,0b00000,0b00000,0b00000,0b00000],
      '!':[0b00100,0b00100,0b00100,0b00100,0b00100,0b00000,0b00100],
      '1':[0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110],
      '2':[0b01110,0b10001,0b00001,0b00010,0b00100,0b01000,0b11111],
      '3':[0b11111,0b00010,0b00100,0b00010,0b00001,0b10001,0b01110],
    }
  };

  const pixels = new Array(ROWS);
  for (let r=0;r<ROWS;r++){
    pixels[r] = new Array(COLS);
    for (let c=0;c<COLS;c++){
      const d = document.createElement('div');
      d.className = 'pix';
      d.dataset.r = r; d.dataset.c = c;
      screen.appendChild(d);
      pixels[r][c] = d;
    }
  }

  function setPixel(r,c,on){
    if (r<0||r>=ROWS||c<0||c>=COLS) return;
    pixels[r][c].classList.toggle('on', !!on);
  }
  function clear(){
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) pixels[r][c].classList.remove('on');
  }

  function textToCols(text){
    const f = FONT_5x7;
    const cols = [];
    const vOffset = 1;
    for (const ch0 of text.toUpperCase()){
      const ch = f.glyphs[ch0] || f.glyphs[' '];
      for (let x=0;x<f.width;x++){
        let colVal = 0;
        for (let y=0;y<f.height;y++){
          const rowMask = ch[y] || 0;
          const bit = (rowMask >> (f.width-1 - x)) & 1;
          if (bit) colVal |= (1 << y);
        }
        cols.push({ val: colVal, vOffset, height: f.height });
      }
      cols.push({ val: 0, vOffset, height: f.height });
    }
    return cols;
  }

  function drawColAt(x, col){
    const val = col.val;
    const vOff = col.vOffset;
    const h = col.height;
    for (let y=0;y<h;y++){
      const bit = (val >> y) & 1;
      setPixel(vOff + y, x, bit);
    }
  }

  let timerHandle = null;
  let running = false;
  const api = {
    start(text = (options.text || 'HELLO'), speed = (options.speed ?? SPEED_DEFAULT)) {
      if (running) api.stop();
      const cols = textToCols(text);
      let offset = COLS;
      clear();
      running = true;
      function frame(){
        if (!running) return;
        clear();
        for (let i=0;i<cols.length;i++){
          const sx = i + offset - cols.length;
          if (sx >= 0 && sx < COLS) drawColAt(sx, cols[i]);
        }
        offset--;
        if (offset < -cols.length) offset = COLS;
        timerHandle = setTimeout(frame, speed);
      }
      frame();
    },
    stop(){ running = false; if (timerHandle) { clearTimeout(timerHandle); timerHandle = null; } },
    clear(){ api.stop(); clear(); },
    setColor(cssColor){
      root.querySelector('style').textContent = root.querySelector('style').textContent.replace(/--on-color: .*?;/,'--on-color: '+cssColor+';');
    },
    element: root
  };

  if (options.text) api.start(options.text, options.speed);
  return api;
}
