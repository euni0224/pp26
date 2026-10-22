import { initPointer } from './modules/pointer.js';
import { initScramble, observeScramble } from './modules/scramble.js';
import { initPanels } from './modules/panels.js';
import { initWorks } from './modules/works.js';
import { initAbout } from './modules/about.js';
import { initTools } from './modules/tools.js';
import { initSession } from './modules/session.js';
import { initCursor } from './modules/cursor.js';
import { initShortcuts } from './modules/shortcuts.js';
import { initBoot } from './modules/boot.js';
import { countUp } from './modules/counter.js';
import { observeStack } from './modules/stack.js';
import { initBackground } from './modules/background.js';

initPointer();
initScramble();
initWorks();
initPanels();
initAbout();
initTools();
initSession();
initCursor();
initShortcuts();
// 부팅 화면이 끝난 뒤 시작할 연출
initBoot(() => {
  countUp();
  observeScramble();
  observeStack();
});
initBackground();
