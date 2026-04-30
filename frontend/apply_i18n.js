const fs = require('fs');

// --- 1. Append Dictionaries ---
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

const koKeys = `
  mypage: {
    title: '내 정보',
    user_info: '사용자 정보',
    email: '이메일',
    name: '이름',
    affiliation: '소속 기관 / 부서',
    phone: '전화번호',
    medical_field: '진료 분야 / 직책',
    unknown: '미등록',
    roles: '보유 역할',
    admin: '관리자',
    interpreter: '통번역가',
    reporter: '보고서 작성자',
    patient: '이주민/환자',
    language: '주 사용 언어',
    nationality: '국적',
    dob: '생년월일',
    settings: '설정',
    edit: '정보 수정',
    logout_confirm: '로그아웃 하시겠습니까?',
    logout: '로그아웃',
  },
  handovers: {
    title: '인수인계 타임라인',
    new_btn: '인수인계 등록',
    general: '일반',
    emergency: '긴급',
    empty: '아직 등록된 인수인계 사항이 없습니다.',
  },
  interpreters: {
    title: '통번역가 목록',
    all: '전체',
    korean: '한국어',
    english: '영어',
    vietnamese: '베트남어',
    empty: '등록된 통번역가가 없습니다.',
    search_placeholder: '이름으로 검색...',
    specialty: '주요 분야',
    experience: '경력',
    status: '상태',
    active: '활동 중',
    inactive: '휴식 중',
    phone: '연락처',
    email: '이메일',
  },
  scripts: {
    title: '의료 대본 생성',
    patient_info: '이주민 정보',
    dob: '생년월일',
    gender: '성별',
    address: '주소',
    phone: '전화번호',
    script_type: '대본 유형',
    script_type_placeholder: '대본 유형을 선택하세요.',
    symptoms: '주요 증상',
    symptoms_placeholder: '어떤 증상이 있으신가요?',
    duration: '증상 발생 시기 및 기간',
    duration_placeholder: '언제부터 증상이 시작되었나요?',
    history: '과거 병력',
    history_placeholder: '앓고 있는 질환이나 큰 수술 경험이 있나요?',
    medication: '현재 복용 중인 약',
    medication_placeholder: '현재 드시고 계신 약이 있다면 적어주세요.',
    allergies: '알레르기 정보',
    allergies_placeholder: '특정 약물이나 음식 알레르기가 있나요?',
    pain_level: '통증 강도 (1-10)',
    fever: '발열 여부',
    yes: '예',
    no: '아니오',
    generating: '생성 중...',
    generate_btn: '대본 생성 및 저장',
    success: '대본이 성공적으로 생성되었습니다.',
    fail: '대본 생성에 실패했습니다. 다시 시도해주세요.',
    unknown: '알 수 없음',
  }
`;

const enKeys = `
  mypage: {
    title: 'My Page',
    user_info: 'User Information',
    email: 'Email',
    name: 'Name',
    affiliation: 'Affiliation / Department',
    phone: 'Phone Number',
    medical_field: 'Medical Field / Position',
    unknown: 'Unregistered',
    roles: 'Roles',
    admin: 'Admin',
    interpreter: 'Interpreter',
    reporter: 'Reporter',
    patient: 'Patient / Migrant',
    language: 'Primary Language',
    nationality: 'Nationality',
    dob: 'Date of Birth',
    settings: 'Settings',
    edit: 'Edit Information',
    logout_confirm: 'Are you sure you want to log out?',
    logout: 'Log Out',
  },
  handovers: {
    title: 'Handover Timeline',
    new_btn: 'New Handover',
    general: 'General',
    emergency: 'Emergency',
    empty: 'No handovers recorded yet.',
  },
  interpreters: {
    title: 'Interpreters List',
    all: 'All',
    korean: 'Korean',
    english: 'English',
    vietnamese: 'Vietnamese',
    empty: 'No interpreters registered.',
    search_placeholder: 'Search by name...',
    specialty: 'Specialty',
    experience: 'Experience',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    phone: 'Phone',
    email: 'Email',
  },
  scripts: {
    title: 'Create Medical Script',
    patient_info: 'Patient Info',
    dob: 'Date of Birth',
    gender: 'Gender',
    address: 'Address',
    phone: 'Phone Number',
    script_type: 'Script Type',
    script_type_placeholder: 'Select script type.',
    symptoms: 'Main Symptoms',
    symptoms_placeholder: 'What are your symptoms?',
    duration: 'Duration of Symptoms',
    duration_placeholder: 'When did the symptoms start?',
    history: 'Medical History',
    history_placeholder: 'Any past illnesses or surgeries?',
    medication: 'Current Medications',
    medication_placeholder: 'List any drugs you are currently taking.',
    allergies: 'Allergies',
    allergies_placeholder: 'Any drug or food allergies?',
    pain_level: 'Pain Level (1-10)',
    fever: 'Fever',
    yes: 'Yes',
    no: 'No',
    generating: 'Generating...',
    generate_btn: 'Generate & Save Script',
    success: 'Script successfully generated.',
    fail: 'Failed to generate script. Please try again.',
    unknown: 'Unknown',
  }
`;

const viKeys = `
  mypage: {
    title: 'Trang ca nhan',
    user_info: 'Thong tin ng??i dung',
    email: 'Email',
    name: 'Ten',
    affiliation: 'C? quan / Phong ban',
    phone: 'S? đi?n tho?i',
    medical_field: 'L?nh v?c y t? / Ch?c v?',
    unknown: 'Ch?a đ?ng ky',
    roles: 'Vai tro',
    admin: 'Qu?n tr? vien',
    interpreter: 'Phien d?ch vien',
    reporter: 'Ng??i bao cao',
    patient: 'B?nh nhan / Ng??i di c?',
    language: 'Ngon ng? chinh',
    nationality: 'Qu?c t?ch',
    dob: 'Ngay sinh',
    settings: 'Cai đ?t',
    edit: 'Ch?nh s?a thong tin',
    logout_confirm: 'B?n co ch?c ch?n mu?n đ?ng xu?t khong?',
    logout: 'đ?ng xu?t',
  },
  handovers: {
    title: 'Dong th?i gian ban giao',
    new_btn: 'Them ban giao',
    general: 'Chung',
    emergency: 'Kh?n c?p',
    empty: 'Ch?a co thong tin ban giao nao.',
  },
  interpreters: {
    title: 'Danh sach phien d?ch vien',
    all: 'T?t c?',
    korean: 'Ti?ng Han',
    english: 'Ti?ng Anh',
    vietnamese: 'Ti?ng Vi?t',
    empty: 'Ch?a co phien d?ch vien nao đ??c đ?ng ky.',
    search_placeholder: 'Tim ki?m theo ten...',
    specialty: 'Chuyen mon',
    experience: 'Kinh nghi?m',
    status: 'Tr?ng thai',
    active: 'đang ho?t đ?ng',
    inactive: 'Khong ho?t đ?ng',
    phone: 'S? đi?n tho?i',
    email: 'Email',
  },
  scripts: {
    title: 'T?o k?ch b?n y t?',
    patient_info: 'Thong tin b?nh nhan',
    dob: 'Ngay sinh',
    gender: 'Gi?i tinh',
    address: 'đ?a ch?',
    phone: 'S? đi?n tho?i',
    script_type: 'Lo?i k?ch b?n',
    script_type_placeholder: 'Ch?n lo?i k?ch b?n.',
    symptoms: 'Tri?u ch?ng chinh',
    symptoms_placeholder: 'B?n co tri?u ch?ng gi?',
    duration: 'Th?i gian va th?i đi?m xu?t hi?n tri?u ch?ng',
    duration_placeholder: 'Tri?u ch?ng b?t đ?u t? khi nao?',
    history: 'Ti?n s? b?nh',
    history_placeholder: 'Co ti?n s? b?nh ho?c t?ng ph?u thu?t l?n khong?',
    medication: 'Thu?c đang dung',
    medication_placeholder: 'Vui long li?t ke cac lo?i thu?c b?n đang dung.',
    allergies: 'Thong tin d? ?ng',
    allergies_placeholder: 'B?n co b? d? ?ng thu?c hay th?c ?n nao khong?',
    pain_level: 'M?c đ? đau (1-10)',
    fever: 'S?t',
    yes: 'Co',
    no: 'Khong',
    generating: 'đang t?o...',
    generate_btn: 'T?o va l?u k?ch b?n',
    success: 'T?o k?ch b?n thanh cong.',
    fail: 'Khong t?o đ??c k?ch b?n. Vui long th? l?i.',
    unknown: 'Khong ro',
  }
`;

appendToDict('src/lib/i18n/ko.ts', koKeys);
appendToDict('src/lib/i18n/en.ts', enKeys);
appendToDict('src/lib/i18n/vi.ts', viKeys);

// --- 2. Replace Text in Files ---
function doReplace(filePath, rules) {
  if(!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  for (let rule of rules) {
    text = text.replace(rule.regex, rule.repl);
  }
  fs.writeFileSync(filePath, text, 'utf8');
}

const mypageRules = [
  { regex: />내 정보<\/h1>/g, repl: '>{t.mypage?.title || "내 정보"}</h1>' },
  { regex: />사용자 정보<\/h2>/g, repl: '>{t.mypage?.user_info || "사용자 정보"}</h2>' },
  { regex: /label=\"이메일\"/g, repl: 'label={t.mypage?.email || "이메일"}' },
  { regex: /label=\"이름\"/g, repl: 'label={t.mypage?.name || "이름"}' },
  { regex: /label=\"소속 기관 \/ 부서\"/g, repl: 'label={t.mypage?.affiliation || "소속 기관 / 부서"}' },
  { regex: /label=\"전화번호\"/g, repl: 'label={t.mypage?.phone || "전화번호"}' },
  { regex: /label=\"진료 분야 \/ 직책\"/g, repl: 'label={t.mypage?.medical_field || "진료 분야 / 직책"}' },
  { regex: /\'미등록\'/g, repl: 't.mypage?.unknown || \'미등록\'' },
  { regex: />보유 역할<\/h2>/g, repl: '>{t.mypage?.roles || "보유 역할"}</h2>' },
  { regex: /\'이주민\/환자\'/g, repl: 't.mypage?.patient || \'이주민/환자\'' },
  { regex: /\'통번역가\'/g, repl: 't.mypage?.interpreter || \'통번역가\'' },
  { regex: /\'보고서 작성자\'/g, repl: 't.mypage?.reporter || \'보고서 작성자\'' },
  { regex: /\'관리자\'/g, repl: 't.mypage?.admin || \'관리자\'' },
  { regex: /label=\"주 사용 언어\"/g, repl: 'label={t.mypage?.language || "주 사용 언어"}' },
  { regex: /label=\"국적\"/g, repl: 'label={t.mypage?.nationality || "국적"}' },
  { regex: /label=\"생년월일\"/g, repl: 'label={t.mypage?.dob || "생년월일"}' },
  { regex: />설정<\/h2>/g, repl: '>{t.mypage?.settings || "설정"}</h2>' },
  { regex: />\s*정보 수정\s*<\/button>/g, repl: '>{t.mypage?.edit || "정보 수정"}</button>' },
  { regex: /confirm\(\'로그아웃 하시겠습니까\?\'\)/g, repl: 'confirm(t.mypage?.logout_confirm || \'로그아웃 하시겠습니까?\')' },
  { regex: />\s*로그아웃\s*<\/button>/g, repl: '>{t.mypage?.logout || "로그아웃"}</button>' }
];
doReplace('src/app/mypage/page.tsx', mypageRules);

const handoversRules = [
  { regex: />인수인계 타임라인<\/h1>/g, repl: '>{t.handovers?.title || "인수인계 타임라인"}</h1>' },
  { regex: />\s*\+ 인수인계 등록\s*<\/Link>/g, repl: '>+ {t.handovers?.new_btn || "인수인계 등록"}</Link>' },
  { regex: />일반<\/span>/g, repl: '>{t.handovers?.general || "일반"}</span>' },
  { regex: />긴급<\/span>/g, repl: '>{t.handovers?.emergency || "긴급"}</span>' },
  { regex: /message=\"아직 등록된 인수인계 사항이 없습니다\.\"/g, repl: 'message={t.handovers?.empty || "아직 등록된 인수인계 사항이 없습니다."}' }
];
doReplace('src/app/handovers/page.tsx', handoversRules);

const intsRules = [
  { regex: />통번역가 목록<\/h1>/g, repl: '>{t.interpreters?.title || "통번역가 목록"}</h1>' },
  { regex: />전체<\/button>/g, repl: '>{t.interpreters?.all || "전체"}</button>' },
  { regex: />한국어<\/button>/g, repl: '>{t.interpreters?.korean || "한국어"}</button>' },
  { regex: />영어<\/button>/g, repl: '>{t.interpreters?.english || "영어"}</button>' },
  { regex: />베트남어<\/button>/g, repl: '>{t.interpreters?.vietnamese || "베트남어"}</button>' },
  { regex: /message=\"등록된 통번역가가 없습니다\.\"/g, repl: 'message={t.interpreters?.empty || "등록된 통번역가가 없습니다."}' },
  { regex: /placeholder=\"이름으로 검색\.\.\.\"/g, repl: 'placeholder={t.interpreters?.search_placeholder || "이름으로 검색..."}' },
  { regex: /<span>주요 분야:<\/span>/g, repl: '<span>{(t.interpreters?.specialty || "주요 분야")}:</span>' },
  { regex: /<span>경력:<\/span>/g, repl: '<span>{(t.interpreters?.experience || "경력")}:</span>' },
  { regex: /<span>상태:<\/span>/g, repl: '<span>{(t.interpreters?.status || "상태")}:</span>' },
  { regex: />활동 중<\/span>/g, repl: '>{t.interpreters?.active || "활동 중"}</span>' },
  { regex: />휴식 중<\/span>/g, repl: '>{t.interpreters?.inactive || "휴식 중"}</span>' },
  { regex: /<span>연락처:<\/span>/g, repl: '<span>{(t.interpreters?.phone || "연락처")}:</span>' },
  { regex: /<span>이메일:<\/span>/g, repl: '<span>{(t.interpreters?.email || "이메일")}:</span>' }
];
doReplace('src/app/interpreters/page.tsx', intsRules);

const scriptRules = [
  { regex: />\s*의료 대본 생성\s*<\/h1>/g, repl: '>{t.scripts?.title || "의료 대본 생성"}</h1>' },
  { regex: />이주민 정보<\/h2>/g, repl: '>{t.scripts?.patient_info || "이주민 정보"}</h2>' },
  { regex: />생년월일:<\/strong>/g, repl: '>{t.scripts?.dob || "생년월일"}:</strong>' },
  { regex: />성별:<\/strong>/g, repl: '>{t.scripts?.gender || "성별"}:</strong>' },
  { regex: />주소:<\/strong>/g, repl: '>{t.scripts?.address || "주소"}:</strong>' },
  { regex: />전화번호:<\/strong>/g, repl: '>{t.scripts?.phone || "전화번호"}:</strong>' },
  { regex: />대본 유형<\/label>/g, repl: '>{t.scripts?.script_type || "대본 유형"}</label>' },
  { regex: />대본 유형을 선택하세요\./g, repl: '>{t.scripts?.script_type_placeholder || "대본 유형을 선택하세요."}' },
  { regex: />주요 증상<\/label>/g, repl: '>{t.scripts?.symptoms || "주요 증상"}</label>' },
  { regex: /placeholder=\"어떤 증상이 있으신가요\?\"/g, repl: 'placeholder={t.scripts?.symptoms_placeholder || "어떤 증상이 있으신가요?"}' },
  { regex: />증상 발생 시기 및 기간<\/label>/g, repl: '>{t.scripts?.duration || "증상 발생 시기 및 기간"}</label>' },
  { regex: /placeholder=\"언제부터 증상이 시작되었나요\?\"/g, repl: 'placeholder={t.scripts?.duration_placeholder || "언제부터 증상이 시작되었나요?"}' },
  { regex: />과거 병력<\/label>/g, repl: '>{t.scripts?.history || "과거 병력"}</label>' },
  { regex: /placeholder=\"앓고 있는 질환이나 큰 수술 경험이 있나요\?\"/g, repl: 'placeholder={t.scripts?.history_placeholder || "앓고 있는 질환이나 큰 수술 경험이 있나요?"}' },
  { regex: />현재 복용 중인 약<\/label>/g, repl: '>{t.scripts?.medication || "현재 복용 중인 약"}</label>' },
  { regex: /placeholder=\"현재 드시고 계신 약이 있다면 적어주세요\.\"/g, repl: 'placeholder={t.scripts?.medication_placeholder || "현재 드시고 계신 약이 있다면 적어주세요."}' },
  { regex: />알레르기 정보<\/label>/g, repl: '>{t.scripts?.allergies || "알레르기 정보"}</label>' },
  { regex: /placeholder=\"특정 약물이나 음식 알레르기가 있나요\?\"/g, repl: 'placeholder={t.scripts?.allergies_placeholder || "특정 약물이나 음식 알레르기가 있나요?"}' },
  { regex: />통증 강도 \(1-10\)<\/label>/g, repl: '>{t.scripts?.pain_level || "통증 강도 (1-10)"}</label>' },
  { regex: />발열 여부<\/label>/g, repl: '>{t.scripts?.fever || "발열 여부"}</label>' },
  { regex: />예<\/span>/g, repl: '>{t.scripts?.yes || "예"}</span>' },
  { regex: />아니오<\/span>/g, repl: '>{t.scripts?.no || "아니오"}</span>' },
  { regex: />\s*생성 중\.\.\.\s*<\/button>/g, repl: '>\n            {t.scripts?.generating || "생성 중..."}\n          </button>' },
  { regex: />\s*대본 생성 및 저장\s*<\/button>/g, repl: '>\n            {t.scripts?.generate_btn || "대본 생성 및 저장"}\n          </button>' },
  { regex: /alert\(\'대본이 성공적으로 생성되었습니다\.\'\)/g, repl: 'alert(t.scripts?.success || \'대본이 성공적으로 생성되었습니다.\')' },
  { regex: /alert\(\'대본 생성에 실패했습니다\. 다시 시도해주세요\.\'\)/g, repl: 'alert(t.scripts?.fail || \'대본 생성에 실패했습니다. 다시 시도해주세요.\')' },
  { regex: /\'알 수 없음\'/g, repl: '(t.scripts?.unknown || \'알 수 없음\')' }
];
doReplace('src/app/scripts/patient/[patientId]/page.tsx', scriptRules);

console.log('Batch update completed successfully!');
