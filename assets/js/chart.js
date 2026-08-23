function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

Chart.defaults.font.size = 14;
Chart.defaults.plugins.colors.enabled = false;
Chart.defaults.backgroundColor = css("--color-primary-300");
Chart.defaults.elements.point.borderColor = css("--color-primary-400");
Chart.defaults.elements.bar.borderColor = css("--color-primary-500");
Chart.defaults.elements.bar.borderWidth = 1;
Chart.defaults.elements.line.borderColor = css("--color-primary-400");
Chart.defaults.elements.arc.backgroundColor = css("--color-primary-200");
Chart.defaults.elements.arc.borderColor = css("--color-primary-500");
Chart.defaults.elements.arc.borderWidth = 1;

// 动画配置：缩短入场时间，降低普通浏览器 Profile 下的主线程压力
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
Chart.defaults.animation.duration = prefersReducedMotion ? 0 : 250;
Chart.defaults.animation.easing = 'easeOutQuart';
// 饼图优化：只启用旋转，禁用缩放
Chart.defaults.datasets.doughnut.animation.animateRotate = !prefersReducedMotion;
Chart.defaults.datasets.doughnut.animation.animateScale = false;
