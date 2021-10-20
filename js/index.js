
import { game } from "./game.js";

if (document.readyState !== 'loading') {
  new game().init();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    new game().init();
  });
}
