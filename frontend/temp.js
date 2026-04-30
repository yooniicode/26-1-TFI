const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/>병원 방문 보고서<\/h1>/g, '>{t.myRecords?.title || \'병원 방문 보고서\'}</h1>');
  content = content.replace(/>이주민 열람용\\s*기록<\/h2>/g, '>{t.myRecords?.timeline_title || \'이주민 열람용 기록\'}</h2>');
  content = content.replace(/message="병원 방문 보고서가 없습니다\."/g, 'message={t.myRecords?.empty_records || \'병원 방문 보고서가 없습니다.\'}');
  content = content.replace(/'병원 미기록'/g, '(t.myRecords?.unknown_hospital || \'병원 미기록\')');
  content = content.replace(/>진단명: /g, '>{(t.myRecords?.diagnosis || \'진단명\')}: ');
  content = content.replace(/label="받은 진단 내용"/g, 'label={t.myRecords?.diagnosis_content || \'받은 진단 내용\'}');
  content = content.replace(/label="진료 결과"/g, 'label={t.myRecords?.treatment_result || \'진료 결과\'}');
  content = content.replace(/label="처방받은 약 복용"/g, 'label={t.myRecords?.medication || \'처방받은 약 복용\'}');
  content = content.replace(/다음 진료 일정:/g, '{(t.myRecords?.next_appointment || \'다음 진료 일정:\')}');
  content = content.replace(/label="통번역가 코멘트"/g, 'label={t.myRecords?.patient_comment || \'통번역가 코멘트\'}');
  content = content.replace(/>저장된 대본<\/h2>/g, '>{t.myRecords?.saved_scripts || \'저장된 대본\'}</h2>');
  content = content.replace(/>\s*새 대본 생성\s*<\/Link>/g, '>\n              {t.myRecords?.create_script || \'새 대본 생성\'}\n            </Link>');
  content = content.replace(/message="저장된 대본이 없습니다\."/g, 'message={t.myRecords?.empty_scripts || \'저장된 대본이 없습니다.\'}');
  content = content.replace(/>\s*의사에게 보여주기\s*<\/Link>/g, '>\n                  {t.myRecords?.show_doctor || \'의사에게 보여주기\'}\n                </Link>');
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/app/my-records/page.tsx');
console.log('Replaced my-records text successfully.');
