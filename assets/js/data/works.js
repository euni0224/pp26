// [WORK/LIST] 순서 그대로. ext: 외부 사이트(새 탭), award: 트로피 아이콘 표시
export const WORKS = [
  {
    name: 'EBS 수학진단도구', type: 'Education', year: '2026', role: '학생 화면 전체 퍼블리싱', size: '25 screens', href: 'projects/ebs/index.html',
    desc: '우주 탐사 콘셉트로 중학생의 수학 결손 개념을 진단하는 서비스. 11가지 문항 유형과 개념 지도 리포트까지 학생이 만나는 전 화면을 만들었습니다.',
    tags: ['SCSS', 'KaTeX', 'Lottie', 'Drag & Drop', 'Canvas'],
    imgs: ['projects/ebs/img/portfolio/home.jpg', 'projects/ebs/img/portfolio/question-match.jpg', 'projects/ebs/img/portfolio/reporter.jpg']
  },
  {
    name: '시원스쿨 AI 스피킹', type: 'Web App', year: '2025', role: '전 화면 퍼블리싱 · 인터랙션', size: '28 screens', href: 'projects/siwon/index.html',
    desc: '설치 없이 브라우저에서 앱처럼 쓰는 모바일 웹앱. AI 캐릭터와 영어로 대화하고 발음 리포트를 받는 화면을 PC · 태블릿 · 모바일에 맞춰 만들었습니다.',
    tags: ['Mobile Web App', 'Thymeleaf', 'Swiper', 'dotLottie', '100dvh'],
    imgs: ['projects/siwon/img/portfolio/chatbot_intent.jpg', 'projects/siwon/img/portfolio/test_report.jpg', 'projects/siwon/img/portfolio/choose_level.jpg']
  },
  {
    name: 'Build Up Literacy', type: 'Education', year: '2025', role: '학생 화면 퍼블리싱', size: '23 screens', href: 'projects/yeamoonsa/index.html',
    desc: '초등학생이 영어 리터러시를 쌓는 학습 서비스. Step · Book 선택부터 주차별 학습, 게임 6종, 마이페이지까지 만들었습니다.',
    tags: ['Games ×6', 'Lottie', 'Swiper', 'State markup'],
    imgs: ['projects/yeamoonsa/img/portfolio/content-weekly.jpg', 'projects/yeamoonsa/img/portfolio/game-wordhunt.jpg', 'projects/yeamoonsa/img/portfolio/sticker-book.jpg']
  },
  {
    name: 'BuildUp LMS', type: 'Admin', year: '2025', role: '퍼블리싱 + 일부 UI 디자인', size: '49 screens', href: 'projects/lms/index.html',
    desc: '본사 · 지사 · 원 · 교사가 쓰는 관리 시스템. 권한 4종에 맞춘 대시보드, 통계, 학습 결과 화면을 퍼블리싱하고 일부 화면은 UI 디자인까지 했습니다.',
    tags: ['Chart.js', 'Quill', 'jQuery', 'Role-based UI'],
    imgs: ['projects/lms/screenshots/dashboard.png', 'projects/lms/screenshots/classroom_stats.png', 'projects/lms/screenshots/ranking.png']
  },
  {
    name: '햄운사주', type: 'React', year: '2026', role: 'UI 화면 구현 (2인 팀)', size: 'Web App', href: 'https://hamwoonsaju.com/', ext: true,
    desc: '모바일 브라우저에 맞춘 AI 사주 서비스. Figma 시안을 React 컴포넌트로 옮겨 로그인 · 온보딩, 홈, 오늘의 운세, MY 화면을 구현했습니다.',
    tags: ['React', 'TypeScript', 'Vite', 'CSS Modules'],
    imgs: ['assets/img/works/hamwoonsaju.jpg']
  },
  {
    name: '일동생활건강', type: 'Corporate', year: '2025', role: '퍼블리싱 · 인터랙션', size: 'Website', href: 'http://www.ildongcare.com/', ext: true, award: true,
    desc: '헬스케어 기업 사이트. 그누보드 기반 PHP 환경에서 GSAP 인터랙션을 더했고 GDWEB에서 수상했습니다.',
    tags: ['PHP', 'GSAP', 'jQuery', 'GDWEB Award'],
    imgs: ['assets/img/works/ildongcare.jpg']
  },
  {
    name: 'ADCO', type: 'Corporate', year: '2025', role: '퍼블리싱 · 인터랙션', size: 'Website', href: 'https://adco.or.kr/', ext: true,
    desc: '안동국제컨벤션센터 공식 사이트. 행사 일정 캘린더와 Canvas 인터랙션을 구현했습니다.',
    tags: ['PHP', 'GSAP', 'Canvas', 'FullCalendar'],
    imgs: ['assets/img/works/adco.jpg']
  },
  {
    name: 'WTC', type: 'Corporate', year: '2025', role: '퍼블리싱 · 인터랙션', size: 'Website', href: 'http://www.wtckorea.com/', ext: true,
    desc: '플로어링 브랜드 기업 사이트. 제품 이미지가 돋보이도록 스크롤 인터랙션을 설계했습니다.',
    tags: ['PHP', 'GSAP', 'jQuery'],
    imgs: ['assets/img/works/wtc.jpg']
  },
  {
    name: '안동컨벤션뷰로', type: 'Corporate', year: '2024', role: '퍼블리싱 · 인터랙션', size: 'Website', href: 'http://andongmice.or.kr/', ext: true,
    desc: 'MICE 홍보 반응형 사이트. ScrollTrigger로 섹션 전환 인터랙션을 구현했습니다.',
    tags: ['PHP', 'GSAP', 'ScrollTrigger'],
    imgs: ['assets/img/works/andong.jpg']
  },
  {
    name: 'PILL', type: 'Personal', year: '2023', role: '기획 · 퍼블리싱', size: 'Landing', href: 'https://euni0224.github.io/PILL/', ext: true,
    desc: 'GSAP 인터랙션을 연습하며 만든 반응형 랜딩 페이지.',
    tags: ['GSAP', 'jQuery', 'Responsive'],
    imgs: ['assets/img/works/pill.jpg']
  },
  {
    name: 'NIKE', type: 'Personal', year: '2023', role: '기획 · 퍼블리싱', size: 'Promotion', href: 'https://euni0224.github.io/nike/', ext: true,
    desc: 'ScrollTrigger로 제품을 보여주는 브랜드 프로모션 페이지.',
    tags: ['GSAP', 'ScrollTrigger'],
    imgs: ['assets/img/works/nike.jpg']
  }
];
