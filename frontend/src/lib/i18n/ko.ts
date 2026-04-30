export const ko = {
  common: {
    loading: '로딩 중...',
    save: '저장',
    cancel: '취소',
    search: '검색',
    confirm: '확인',
    unconfirmed: '미확인',
    edit: '수정',
    delete: '삭제',
  },
  auth: {
    login: '로그인',
    logout: '로그아웃',
    signup: '회원가입',
    email: '이메일',
    name: '이름',
    password: '비밀번호',
  },
  nav: {
    dashboard: '대시보드',
    consultations: '보고서',
    patients: '이주민',
    interpreters: '통번역가',
    handovers: '인수인계',
    mypage: '내 정보',
  },
  dashboard: {
    welcome: '안녕하세요',
    role_admin: '센터장',
    role_interpreter: '통번역가',
    role_patient: '이주민',
    write_report: '보고서 작성',
    my_records: '내 진료 기록',
    medical_scripts: '의료 대본',
    recent_reports: '최근 보고서',
    no_reports: '보고서가 없습니다.',
    view_all: '전체 보기',
  }
}

export type AppTranslation = typeof ko
