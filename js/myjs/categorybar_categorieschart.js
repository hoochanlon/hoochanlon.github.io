document.addEventListener("DOMContentLoaded", function() {
  // 获取元素
  const chart = document.getElementById('tiantianquan-categories');
  const bar = document.getElementById('categoryBar');
  const categoryLists = document.querySelector('.category-lists');

  // 1️⃣ 移动 chart 到 categoryBar 上方
  if (chart && bar && bar.parentNode) {
    bar.parentNode.insertBefore(chart, bar);
  }

  // 2️⃣ 可选：隐藏整个 category-lists 容器
  if (categoryLists) {
    categoryLists.style.display = 'none';
  }
});

