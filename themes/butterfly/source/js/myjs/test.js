(function() {
    console.log('🎯 初始化兼容主题的代码折叠功能...');

    const style = document.createElement('style');
    style.textContent = `
        .compatible-fold-wrapper {
            position: relative;
        }
        .compatible-fold-wrapper.folded {
            max-height: 300px;
            overflow: hidden;
        }
        .compatible-fold-wrapper.folded::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 80px;
            background: linear-gradient(transparent, rgba(255,255,255,0.8), white);
            pointer-events: none;
            z-index: 1;
        }
        .compatible-fold-btn {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.95);
            color: #475569;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .compatible-fold-btn:hover {
            background: rgba(255, 255, 255, 1);
            color: #1e293b;
            border-color: #9ca3af;
            transform: translateX(-50%) translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        /* 主题展开时移除我们的折叠限制 */
        figure.highlight:not(.closed) .compatible-fold-wrapper {
            max-height: none !important;
            overflow: visible !important;
        }
        figure.highlight:not(.closed) .compatible-fold-wrapper::after {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    function initCompatibleFold() {
        const codeBlocks = document.querySelectorAll('figure.highlight:not(.closed)');

        codeBlocks.forEach((block, index) => {
            if (block.classList.contains('compatible-fold-processed')) return;

            const blockHeight = block.scrollHeight;
            if (blockHeight > 350) {
                block.classList.add('compatible-fold-processed');

                // 创建包装容器
                const wrapper = document.createElement('div');
                wrapper.className = 'compatible-fold-wrapper folded';

                // 将代码块移动到包装容器中
                const parent = block.parentNode;
                parent.insertBefore(wrapper, block);
                wrapper.appendChild(block);

                // 创建按钮
                const btn = document.createElement('button');
                btn.className = 'compatible-fold-btn';
                btn.innerHTML = '<i class="fas fa-chevron-down"></i><span>展开代码</span>';

                let isExpanded = false;

                btn.onclick = function(e) {
                    e.stopPropagation();

                    if (isExpanded) {
                        // 收起代码
                        wrapper.classList.add('folded');
                        btn.innerHTML = '<i class="fas fa-chevron-down"></i><span>展开代码</span>';
                        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        // 展开代码
                        wrapper.classList.remove('folded');
                        btn.innerHTML = '<i class="fas fa-chevron-up"></i><span>收起代码</span>';
                    }
                    isExpanded = !isExpanded;
                };

                wrapper.appendChild(btn);

                // 监听主题按钮的点击
                const themeBtn = block.querySelector('.highlight-tools .expand');
                if (themeBtn) {
                    themeBtn.addEventListener('click', function() {
                        setTimeout(() => {
                            if (block.classList.contains('closed')) {
                                // 主题收起时，恢复我们的折叠状态
                                wrapper.classList.add('folded');
                                isExpanded = false;
                                btn.innerHTML = '<i class="fas fa-chevron-down"></i><span>展开代码</span>';
                            } else {
                                // 主题展开时，移除我们的折叠限制（通过CSS）
                                wrapper.classList.remove('folded');
                                btn.innerHTML = '<i class="fas fa-chevron-up"></i><span>收起代码</span>';
                            }
                        }, 50);
                    });
                }

                console.log(`✅ 代码块 ${index + 1} 兼容折叠功能已添加`);
            }
        });
    }

    // 先清理之前的修改
    document.querySelectorAll('.compatible-fold-wrapper').forEach(wrapper => {
        const block = wrapper.querySelector('figure.highlight');
        if (block) {
            wrapper.parentNode.insertBefore(block, wrapper);
            wrapper.remove();
        }
    });

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompatibleFold);
    } else {
        initCompatibleFold();
    }

    // 使用 MutationObserver 动态监听 DOM 变化，避免 setTimeout
    const observer = new MutationObserver(() => {
        initCompatibleFold();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 延迟初始化
    setTimeout(initCompatibleFold, 1000);
})();
