const fs = require('fs');

['ko.ts', 'en.ts', 'vi.ts'].forEach(f => {
  const p = 'src/lib/i18n/' + f;
  let text = fs.readFileSync(p, 'utf8');
  
  if (!text.includes('err_not_found:')) {
    const errText = 
      f === 'ko.ts' ? "err_not_found: '가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.'," :
      f === 'en.ts' ? "err_not_found: 'Email not registered. Please sign up first.'," :
      "err_not_found: 'Email ch?a đ??c đ?ng ky. Vui long th? đ?ng ky tr??c.',";
      
    // insert right after err_email:
    let modified = false;
    text = text.replace(/err_email:\s*[^\n]+,/, match => {
      modified = true;
      return match + '\n    ' + errText;
    });
    
    // fallback if err_email: wasn't found
    if(!modified) {
      text = text.replace(/login:\s*\{/, match => match + '\n    ' + errText);
    }
    
    fs.writeFileSync(p, text);
  }
});
console.log('Error messages added');
