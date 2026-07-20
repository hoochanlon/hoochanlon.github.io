/**
 * 过期提示：按访问日判断是否已满阈值年，并刷新「已超过 X 年」中的 X。
 */
(function () {
  function fullYearsSince(baseSec, nowSec) {
    var base = new Date(baseSec * 1000);
    var now = new Date(nowSec * 1000);
    var years = now.getFullYear() - base.getFullYear();
    var anniv = new Date(base);
    anniv.setFullYear(base.getFullYear() + years);
    if (anniv.getTime() > now.getTime()) years -= 1;
    return years < 0 ? 0 : years;
  }

  function shouldShow(el, nowSec) {
    var deadline = el.getAttribute("data-deadline-unix");
    if (deadline != null && deadline !== "") {
      var d = Number(deadline);
      if (!Number.isNaN(d)) return nowSec >= d;
    }
    var base = Number(el.getAttribute("data-base-unix"));
    var threshold = Number(el.getAttribute("data-threshold-years") || "1");
    if (Number.isNaN(base) || base <= 0) return false;
    return fullYearsSince(base, nowSec) >= (Number.isNaN(threshold) ? 1 : threshold);
  }

  function refresh() {
    var nowSec = Math.floor(Date.now() / 1000);
    document.querySelectorAll("aside[data-sc-outdated]").forEach(function (el) {
      var show = shouldShow(el, nowSec);
      if (show) {
        el.hidden = false;
        el.removeAttribute("hidden");
      } else {
        el.hidden = true;
        el.setAttribute("hidden", "");
        return;
      }

      if (el.getAttribute("data-sc-outdated-auto") !== "1") return;
      var base = Number(el.getAttribute("data-base-unix"));
      var threshold = Number(el.getAttribute("data-threshold-years") || "1");
      if (Number.isNaN(base) || base <= 0) return;
      var age = fullYearsSince(base, nowSec);
      if (age < threshold) age = threshold;
      var node = el.querySelector("[data-sc-outdated-age-years]");
      if (node) node.textContent = String(age);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
