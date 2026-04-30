const fs = require('fs');

['ko.ts', 'en.ts', 'vi.ts'].forEach(f => {
  const p = 'src/lib/i18n/' + f;
  let text = fs.readFileSync(p, 'utf8');
  
  const blocks = text.match(/  \w+: \{[\s\S]*?  \},?/g);
  if(!blocks) return;
  
  const map = new Map();
  for(let b of blocks) {
    const key = b.match(/  (\w+): \{/)[1];
    map.set(key, b);
  }
  
  let newText = text.substring(0, text.indexOf(blocks[0]));
  newText += Array.from(map.values()).join('\n') + '\n}';
  if(f === 'ko.ts') newText += '\nexport type AppTranslation = typeof ko;';
  
  fs.writeFileSync(p, newText);
});
