// 获取需要调整颜色的元素
const postTitle = document.querySelector('#post-info .post-title');
const postMetaLinks = document.querySelectorAll('#post-info #post-meta a');
const postMeta = document.querySelector('#post-info #post-meta');

// 设置过渡的目标颜色
const targetColor = '#4C4948';

// 监听滚动事件
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) { // 当页面滚动超过 50px 时
        postTitle.style.color = targetColor;
        postMetaLinks.forEach(link => link.style.color = targetColor);
        postMeta.style.color = targetColor;
    } else {
        postTitle.style.color = ''; // 恢复默认颜色
        postMetaLinks.forEach(link => link.style.color = '');
        postMeta.style.color = '';
    }
});
