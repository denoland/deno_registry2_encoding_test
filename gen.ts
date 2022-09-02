const CHARS = [
  "\x01",
  "\t",
  "\n",
  "\r",
  "\x1f",
  " ",
  ",",
  ";",
  ":",
  "!",
  "?",
  "'",
  '"',
  "(",
  ")",
  "[",
  "]",
  "@",
  "*",
  "\\",
  "&",
  "#",
  "%",
  "+",
  "=",
  "$",
  "\x9f",
  "\u{123}",
  "\u{1234}",
  "\u{12345}",
];

Deno.mkdirSync("gen", { recursive: true });

let imports = "";

for (const char of CHARS) {
  const cp = char.codePointAt(0)!.toString(16);
    Deno.writeTextFileSync(`gen/${cp}.${char}.ts`, `export default 0x${cp};`);
  
  // Import URI encoded path.
  imports += `import "./gen/${cp}.${encodeURIComponent(char)}.ts";\n`;

  if (/^[\t\r\n\\?#]$/.test(char)) {
    // Cannot import raw path.
  } else if (char === '"') {
    imports += `import './gen/${cp}.${char}.ts';\n`;
  } else {
    imports += `import "./gen/${cp}.${char}.ts";\n`;
  };
}

Deno.writeTextFileSync("main.ts", imports);
