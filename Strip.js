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
		'F':[0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b10000],
		'G':[0b01110,0b10001,0b10000,0b10111,0b10001,0b10001,0b01110],
		'H':[0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
		'I':[0b01110,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
		'J':[0b00111,0b00010,0b00010,0b00010,0b10010,0b10010,0b01100],
		'K':[0b10001,0b10010,0b10100,0b11000,0b10100,0b10010,0b10001],
		'L':[0b10000,0b10000,0b10000,0b10000,0b10000,0b10000,0b11111],
		'M':[0b10001,0b11011,0b10101,0b10101,0b10001,0b10001,0b10001],
		'N':[0b10001,0b10001,0b11001,0b10101,0b10011,0b10001,0b10001],
		'O':[0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
		'P':[0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b10000],
		'Q':[0b01110,0b10001,0b10001,0b10001,0b10101,0b10010,0b01101],
		'R':[0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
		'S':[0b01111,0b10000,0b10000,0b01110,0b00001,0b00001,0b11110],
		'T':[0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
		'U':[0b10001,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
		'V':[0b10001,0b10001,0b10001,0b10001,0b10001,0b01010,0b00100],
		'W':[0b10001,0b10001,0b10001,0b10101,0b10101,0b11011,0b10001],
		'X':[0b10001,0b10001,0b01010,0b00100,0b01010,0b10001,0b10001],
		'Y':[0b10001,0b10001,0b01010,0b00100,0b00100,0b00100,0b00100],
		'Z':[0b11111,0b00001,0b00010,0b00100,0b01000,0b10000,0b11111],

		'a':[0b00000,0b00000,0b01110,0b00001,0b01111,0b10001,0b01111],
		'b':[0b10000,0b10000,0b10110,0b11001,0b10001,0b10001,0b11110],
		'c':[0b00000,0b00000,0b01110,0b10000,0b10000,0b10001,0b01110],
		'd':[0b00001,0b00001,0b01101,0b10011,0b10001,0b10001,0b01111],
		'e':[0b00000,0b00000,0b01110,0b10001,0b11111,0b10000,0b01110],
		'f':[0b00110,0b01001,0b01000,0b11100,0b01000,0b01000,0b01000],
		'g':[0b00000,0b00000,0b01111,0b10001,0b01111,0b00001,0b01110],
		'h':[0b10000,0b10000,0b10110,0b11001,0b10001,0b10001,0b10001],
		'i':[0b00100,0b00000,0b01100,0b00100,0b00100,0b00100,0b01110],
		'j':[0b00100,0b00000,0b01110,0b00100,0b00100,0b10100,0b01000],
		'k':[0b10000,0b10000,0b10010,0b10100,0b11000,0b10100,0b10010],
		'l':[0b01100,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
		'm':[0b00000,0b00000,0b11010,0b10101,0b10101,0b10101,0b10101],
		'n':[0b00000,0b00000,0b10110,0b11001,0b10001,0b10001,0b10001],
		'o':[0b00000,0b00000,0b01110,0b10001,0b10001,0b10001,0b01110],
		'p':[0b00000,0b00000,0b11110,0b10001,0b11110,0b10000,0b10000],
		'q':[0b00000,0b00000,0b01101,0b10011,0b01111,0b00001,0b00001],
		'r':[0b00000,0b00000,0b10110,0b11001,0b10000,0b10000,0b10000],
		's':[0b00000,0b00000,0b01111,0b10000,0b01110,0b00001,0b11110],
		't':[0b01000,0b01000,0b11100,0b01000,0b01000,0b01001,0b00110],
		'u':[0b00000,0b00000,0b10001,0b10001,0b10001,0b10011,0b01101],
		'v':[0b00000,0b00000,0b10001,0b10001,0b10001,0b01010,0b00100],
		'w':[0b00000,0b00000,0b10001,0b10101,0b10101,0b11011,0b10001],
		'x':[0b00000,0b00000,0b10001,0b01010,0b00100,0b01010,0b10001],
		'y':[0b00000,0b00000,0b10001,0b10001,0b01111,0b00001,0b01110],
		'z':[0b00000,0b00000,0b11111,0b00010,0b00100,0b01000,0b11111],

		'0':[0b01110,0b10001,0b10011,0b10101,0b11001,0b10001,0b01110],
		'1':[0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110],
		'2':[0b01110,0b10001,0b00001,0b00010,0b00100,0b01000,0b11111],
		'3':[0b11111,0b00010,0b00100,0b00010,0b00001,0b10001,0b01110],
		'4':[0b00010,0b00110,0b01010,0b10010,0b11111,0b00010,0b00010],
		'5':[0b11111,0b10000,0b11110,0b00001,0b00001,0b10001,0b01110],
		'6':[0b00110,0b01000,0b10000,0b11110,0b10001,0b10001,0b01110],
		'7':[0b11111,0b00001,0b00010,0b00100,0b01000,0b01000,0b01000],
		'8':[0b01110,0b10001,0b10001,0b01110,0b10001,0b10001,0b01110],
		'9':[0b01110,0b10001,0b10001,0b01111,0b00001,0b00010,0b01100],

		' ':[0b00000,0b00000,0b00000,0b00000,0b00000,0b00000,0b00000],
		'!':[0b00100,0b00100,0b00100,0b00100,0b00100,0b00000,0b00100],
		'"':[0b01010,0b01010,0b01010,0b00000,0b00000,0b00000,0b00000],
		'#':[0b01010,0b11111,0b01010,0b01010,0b11111,0b01010,0b01010],
		'$':[0b00100,0b01111,0b10100,0b01110,0b00101,0b11110,0b00100],
		'%':[0b11001,0b11010,0b00100,0b01000,0b10110,0b01101,0b00000],
		'&':[0b01100,0b10010,0b10100,0b01000,0b10101,0b10010,0b01101],
		"'":[0b00100,0b00100,0b00100,0b00000,0b00000,0b00000,0b00000],
		'(':[0b00010,0b00100,0b01000,0b01000,0b01000,0b00100,0b00010],
		')':[0b01000,0b00100,0b00010,0b00010,0b00010,0b00100,0b01000],
		'*':[0b00000,0b00100,0b10101,0b01110,0b10101,0b00100,0b00000],
		'+':[0b00000,0b00100,0b00100,0b11111,0b00100,0b00100,0b00000],
		',':[0b00000,0b00000,0b00000,0b00000,0b00100,0b00100,0b01000],
		'-':[0b00000,0b00000,0b00000,0b01110,0b00000,0b00000,0b00000],
		'.':[0b00000,0b00000,0b00000,0b00000,0b00000,0b01100,0b01100],
		'/':[0b00001,0b00010,0b00100,0b01000,0b10000,0b00000,0b00000],
		':':[0b00000,0b01100,0b01100,0b00000,0b01100,0b01100,0b00000],
		';':[0b00000,0b01100,0b01100,0b00000,0b01100,0b01100,0b01000],
		'<':[0b00010,0b00100,0b01000,0b10000,0b01000,0b00100,0b00010],
		'=':[0b00000,0b00000,0b11111,0b00000,0b11111,0b00000,0b00000],
		'>':[0b01000,0b00100,0b00010,0b00001,0b00010,0b00100,0b01000],
		'?':[0b01110,0b10001,0b00010,0b00100,0b00100,0b00000,0b00100],
		'@':[0b01110,0b10001,0b10111,0b10101,0b10111,0b10000,0b01111],
		'[':[0b01110,0b01000,0b01000,0b01000,0b01000,0b01000,0b01110],
		']':[0b01110,0b00010,0b00010,0b00010,0b00010,0b00010,0b01110],
		'^':[0b00100,0b01010,0b10001,0b00000,0b00000,0b00000,0b00000],
		'_':[0b00000,0b00000,0b00000,0b00000,0b00000,0b00000,0b11111],
		'`':[0b01000,0b00100,0b00010,0b00000,0b00000,0b00000,0b00000],
		'{':[0b00010,0b00100,0b00100,0b11000,0b00100,0b00100,0b00010],
		'|':[0b00100,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
		'}':[0b01000,0b00100,0b00100,0b00011,0b00100,0b00100,0b01000],
		'~':[0b00000,0b00000,0b01101,0b10110,0b00000,0b00000,0b00000],
		
		'А':[0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
		'Б':[0b11111,0b10000,0b11110,0b10001,0b10001,0b10001,0b11110],
		'В':[0b11110,0b10001,0b10001,0b11110,0b10001,0b10001,0b11110],
		'Г':[0b11111,0b10000,0b10000,0b10000,0b10000,0b10000,0b10000],
		'Д':[0b00110,0b01010,0b10001,0b10001,0b10001,0b11111,0b10001],
		'Е':[0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b11111],
		'Ж':[0b10001,0b01010,0b00100,0b11111,0b00100,0b01010,0b10001],
		'З':[0b01110,0b10001,0b00010,0b00100,0b01000,0b10001,0b01110],
		'И':[0b10001,0b10001,0b11001,0b10101,0b10011,0b10001,0b10001],
		'Й':[0b01010,0b10101,0b10001,0b11001,0b10101,0b10001,0b10001],
		'К':[0b10001,0b10010,0b10100,0b11000,0b10100,0b10010,0b10001],
		'Л':[0b00110,0b01010,0b10001,0b10001,0b10001,0b10001,0b10001],
		'М':[0b10001,0b11011,0b10101,0b10101,0b10001,0b10001,0b10001],
		'Н':[0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
		'О':[0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
		'П':[0b11111,0b10001,0b10001,0b10001,0b10001,0b10001,0b10001],
		'Р':[0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b10000],
		'С':[0b01110,0b10001,0b10000,0b10000,0b10000,0b10001,0b01110],
		'Т':[0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
		'У':[0b10001,0b10001,0b10001,0b01110,0b00100,0b00100,0b00100],
		'Ф':[0b01110,0b10101,0b01110,0b00100,0b01110,0b10101,0b01110],
		'Х':[0b10001,0b10001,0b01010,0b00100,0b01010,0b10001,0b10001],
		'Ц':[0b10001,0b10001,0b10001,0b10001,0b10001,0b11111,0b00001],
		'Ч':[0b10001,0b10001,0b10001,0b01111,0b00001,0b00001,0b00001],
		'Ш':[0b10001,0b10001,0b10001,0b10001,0b10101,0b11111,0b00000],
		'Щ':[0b10001,0b10001,0b10001,0b10001,0b10101,0b11111,0b00001],
		'Ъ':[0b11101,0b10010,0b10010,0b11110,0b10010,0b10010,0b11101],
		'Ы':[0b10001,0b10001,0b10001,0b10111,0b10001,0b10001,0b10001],
		'Ь':[0b10000,0b10000,0b10000,0b11110,0b10001,0b10001,0b11110],
		'Э':[0b01110,0b10001,0b00001,0b01110,0b00001,0b10001,0b01110],
		'Ю':[0b10011,0b10101,0b11011,0b10001,0b10001,0b10001,0b10001],
		'Я':[0b01110,0b10001,0b10001,0b01110,0b00100,0b01000,0b10000],

		'а':[0b00000,0b00000,0b01110,0b00001,0b01111,0b10001,0b01111],
		'б':[0b00000,0b00000,0b11110,0b10000,0b11110,0b10001,0b11110],
		'в':[0b00000,0b00000,0b10110,0b11001,0b10001,0b10001,0b11110],
		'г':[0b00000,0b00000,0b11111,0b10000,0b10000,0b10000,0b10000],
		'д':[0b00000,0b00000,0b01101,0b10011,0b10001,0b11111,0b10001],
		'е':[0b00000,0b00000,0b01110,0b10001,0b11111,0b10000,0b01110],
		'ж':[0b00000,0b00000,0b10001,0b01010,0b00100,0b01010,0b10001],
		'з':[0b00000,0b00000,0b01110,0b10001,0b00010,0b00100,0b01110],
		'и':[0b00000,0b00000,0b10001,0b11001,0b10101,0b10011,0b10001],
		'й':[0b00000,0b00000,0b01010,0b10101,0b10001,0b11001,0b10001],
		'к':[0b00000,0b00000,0b10001,0b10010,0b10100,0b11000,0b10100],
		'л':[0b00000,0b00000,0b00110,0b01010,0b10001,0b10001,0b10001],
		'м':[0b00000,0b00000,0b10001,0b11011,0b10101,0b10101,0b10001],
		'н':[0b00000,0b00000,0b10110,0b11001,0b10001,0b10001,0b10001],
		'о':[0b00000,0b00000,0b01110,0b10001,0b10001,0b10001,0b01110],
		'п':[0b00000,0b00000,0b11111,0b10001,0b10001,0b10001,0b10001],
		'р':[0b00000,0b00000,0b11110,0b10001,0b11110,0b10000,0b10000],
		'с':[0b00000,0b00000,0b01110,0b10000,0b10000,0b10001,0b01110],
		'т':[0b00000,0b00000,0b11111,0b00100,0b00100,0b00100,0b00100],
		'у':[0b00000,0b00000,0b10001,0b10001,0b01111,0b00001,0b01110],
		'ф':[0b00000,0b00000,0b01110,0b10101,0b01110,0b00100,0b01110],
		'х':[0b00000,0b00000,0b10001,0b01010,0b00100,0b01010,0b10001],
		'ц':[0b00000,0b00000,0b10001,0b10001,0b10001,0b11111,0b00001],
		'ч':[0b00000,0b00000,0b10001,0b10001,0b01111,0b00001,0b00001],
		'ш':[0b00000,0b00000,0b10001,0b10001,0b10001,0b10101,0b11111],
		'щ':[0b00000,0b00000,0b10001,0b10001,0b10001,0b10101,0b11111],
		'ъ':[0b00000,0b00000,0b11101,0b10010,0b10010,0b11110,0b00000],
		'ы':[0b00000,0b00000,0b10001,0b10001,0b10111,0b10001,0b10001],
		'ь':[0b00000,0b00000,0b10000,0b10000,0b11110,0b10001,0b11110],
		'э':[0b00000,0b00000,0b01110,0b10001,0b00111,0b10001,0b01110],
		'ю':[0b00000,0b00000,0b10011,0b10101,0b11011,0b10001,0b10001],
		'я':[0b00000,0b00000,0b01110,0b10001,0b01110,0b00100,0b01000],
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


