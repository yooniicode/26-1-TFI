const fs = require('fs');

function appendToDict(filePath, newKeys) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lastBraceIndex = content.lastIndexOf('}');
  if (lastBraceIndex === -1) return;
  
  let newContent = content.slice(0, lastBraceIndex).trim();
  if (newContent.endsWith(',')) {
    newContent += '\n  ' + newKeys + '\n}\n';
  } else {
    newContent += ',\n  ' + newKeys + '\n}\n';
  }
  fs.writeFileSync(filePath, newContent, 'utf8');
}

const koKeys = `myRecords: {
    title: '병원 방문 보고서',
    timeline_title: '이주민 열람용 기록',
    empty_records: '병원 방문 보고서가 없습니다.',
    unknown_hospital: '병원 미기록',
    diagnosis: '진단명',
    diagnosis_content: '받은 진단 내용',
    treatment_result: '진료 결과',
    medication: '처방받은 약 복용',
    next_appointment: '다음 진료 일정:',
    patient_comment: '통번역가의 코멘트',
    saved_scripts: '저장된 대본',
    create_script: '새 대본 생성',
    empty_scripts: '저장된 대본이 없습니다.',
    show_doctor: '의사에게 보여주기',
  }`;

const enKeys = `myRecords: {
    title: 'Hospital Visit Reports',
    timeline_title: 'Patient View Timeline',
    empty_records: 'No hospital visit reports yet.',
    unknown_hospital: 'Unknown Hospital',
    diagnosis: 'Diagnosis',
    diagnosis_content: 'Diagnosis Details',
    treatment_result: 'Treatment Results',
    medication: 'Prescribed Medication',
    next_appointment: 'Next Appointment:',
    patient_comment: 'Interpreter Comment',
    saved_scripts: 'Saved Scripts',
    create_script: 'New Script',
    empty_scripts: 'No scripts saved.',
    show_doctor: 'Show to Doctor',
  }`;

const viKeys = `myRecords: {
    title: 'Bao cao kham b?nh',
    timeline_title: 'L?ch s? kham b?nh',
    empty_records: 'Ch?a co bao cao kham b?nh.',
    unknown_hospital: 'B?nh vi?n khong xac đ?nh',
    diagnosis: 'Ch?n đoan',
    diagnosis_content: 'N?i dung ch?n đoan',
    treatment_result: 'K?t qu? đi?u tr?',
    medication: 'Thu?c đ??c ke đ?n',
    next_appointment: 'L?ch kham ti?p theo:',
    patient_comment: 'Nh?n xet c?a Phien d?ch',
    saved_scripts: 'K?ch b?n đa l?u',
    create_script: 'T?o k?ch b?n m?i',
    empty_scripts: 'Khong co k?ch b?n nao đ??c l?u.',
    show_doctor: 'đ?a cho Bac s?',
  }`;

appendToDict('src/lib/i18n/ko.ts', koKeys);
appendToDict('src/lib/i18n/en.ts', enKeys);
appendToDict('src/lib/i18n/vi.ts', viKeys);
console.log('Appended successfully');
