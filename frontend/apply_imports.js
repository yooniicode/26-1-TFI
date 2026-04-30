const fs = require('fs');

function addTranslationHook(filePath) {
  if(!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  
  if(!text.includes('useTranslation')) {
    // Add import right after the first line of imports or after 'use client'
    const importHook = "import { useTranslation } from '@/lib/i18n/I18nContext';\n";
    if (text.includes("'use client'")) {
      text = text.replace(/'use client'\r?\n/, "'use client'\n" + importHook);
    } else {
      text = importHook + text;
    }
  }

  // Add the const { t } = useTranslation() hook inside the main component function
  // We need a regex that finds the component declaration
  const funcRegex = /(export\s+default\s+function\s+\w+\(.*?\)\s*\{)/;
  if(!text.includes('const { t } = useTranslation()') && funcRegex.test(text)) {
    text = text.replace(funcRegex, "$1\n  const { t } = useTranslation();");
  }

  fs.writeFileSync(filePath, text, 'utf8');
}

['src/app/mypage/page.tsx', 'src/app/handovers/page.tsx', 'src/app/interpreters/page.tsx', 'src/app/scripts/patient/[patientId]/page.tsx'].forEach(addTranslationHook);

console.log('Hooks injected successfully!');
