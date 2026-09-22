import timer from 'lucide-static/icons/timer.svg?raw';
import listChecks from 'lucide-static/icons/list-checks.svg?raw';
import barChart3 from 'lucide-static/icons/bar-chart-3.svg?raw';
import history from 'lucide-static/icons/history.svg?raw';
import settings from 'lucide-static/icons/settings.svg?raw';
import circleCheck from 'lucide-static/icons/circle-check.svg?raw';
import square from 'lucide-static/icons/square.svg?raw';
import target from 'lucide-static/icons/target.svg?raw';
import trash2 from 'lucide-static/icons/trash-2.svg?raw';
import flame from 'lucide-static/icons/flame.svg?raw';
import coffee from 'lucide-static/icons/coffee.svg?raw';
import trees from 'lucide-static/icons/trees.svg?raw';
import calendar from 'lucide-static/icons/calendar.svg?raw';
import trophy from 'lucide-static/icons/trophy.svg?raw';
import hourglass from 'lucide-static/icons/hourglass.svg?raw';
import play from 'lucide-static/icons/play.svg?raw';
import pause from 'lucide-static/icons/pause.svg?raw';
import rotateCcw from 'lucide-static/icons/rotate-ccw.svg?raw';

const icons = {
  timer,
  'list-checks': listChecks,
  'bar-chart-3': barChart3,
  history,
  settings,
  'circle-check': circleCheck,
  square,
  target,
  'trash-2': trash2,
  flame,
  coffee,
  trees,
  calendar,
  trophy,
  hourglass,
  play,
  pause,
  'rotate-ccw': rotateCcw,
};

export function icon(name, className = '') {
  const svg = icons[name];
  if (!svg) return '';
  if (!className) return svg;
  return svg.replace(/class="([^"]*)"/, `class="$1 ${className}"`);
}
