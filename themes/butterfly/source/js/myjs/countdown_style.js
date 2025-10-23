// 确保 DOM 完全加载后执行脚本
document.addEventListener('DOMContentLoaded', function () {
    // 获取所有包含 'card-widget user-countdown wow animate__zoomIn' 类的元素
    const elements = document.querySelectorAll('.card-widget.user-countdown.wow.animate__zoomIn');

    // 遍历这些元素并删除其中的 .item-headline 元素
    elements.forEach(element => {
        const headline = element.querySelector('.item-headline');
        console.log('Found .item-headline:', headline); // 调试：查看是否找到 .item-headline 元素
        if (headline) {
            headline.remove(); // 删除该元素
            console.log('Removed .item-headline'); // 调试：删除时的提示
        }
    });
});

// 使用 MutationObserver 监视 DOM 的变化，确保动态加载的元素也能被删除
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            // 如果是 .item-headline 元素，删除它
            if (node.matches && node.matches('.item-headline')) {
                console.log('Removed dynamically added .item-headline'); // 调试：动态添加的元素被删除
                node.remove();
            }
        });
    });
});

// 开始观察文档的变化
observer.observe(document.body, {
    childList: true,  // 观察子节点的添加与删除
    subtree: true     // 观察所有子元素
});
