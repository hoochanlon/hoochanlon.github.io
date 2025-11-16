(function() {
    // 隐藏父容器，防止闪现
    document.querySelectorAll('.card-widget.user-countdown').forEach(el => {
        el.style.visibility = 'hidden';
    });

    // 删除 .item-headline 函数
    function removeItemHeadline(context = document) {
        context.querySelectorAll('.item-headline').forEach(el => el.remove());
    }

    // 处理现有 DOM
    removeItemHeadline();
    document.querySelectorAll('.card-widget.user-countdown').forEach(el => {
        el.style.visibility = 'visible'; // 删除完成再显示
    });

    // MutationObserver 处理动态添加元素
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                removeItemHeadline(node);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
