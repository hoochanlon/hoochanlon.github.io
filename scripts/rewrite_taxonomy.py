#!/usr/bin/env python3
"""
重新梳理文章分类和标签

新分类体系 (7个):
1. 社会观察 - 社会结构、政治与治理、文化与媒介中的社会议题
2. 职场与经济 - 就业、劳动、经济等
3. 教育与流动 - 教育、代际传递、阶层流动等
4. 性别与亲密关系 - 两性关系、婚恋等
5. 心理与健康 - 心理、健康、生活方式等
6. 技术与工具 - 技术折腾、写作相关、工具链
7. 生活随笔 - 个人经验、游戏、日常记录、兴趣爱好

标签策略:
- 删除重复/低价值标签 (个人记录、生活经验、自我处境等)
- 删除出现≤2次的标签
- 合并相近概念
"""

import os
import re

# 分类映射
CATEGORY_MAP = {
    "个人经验": "生活随笔",
    "性别与亲密关系": "性别与亲密关系",
    "教育与流动": "教育与流动",
    "职场与经济": "职场与经济",
    "政治与治理": "社会观察",
    "技术折腾": "技术与工具",
    "社会结构": "社会观察",
    "文化与媒介": "社会观察",
    "心理与健康": "心理与健康",
    "写作": "技术与工具",
    "游戏": "生活随笔",
}

# 标签合并/删除规则
TAG_REMOVALS = {
    # 完全删除的标签 (重复/低价值)
    "个人记录", "生活经验", "自我处境", "实践记录", "制度分析",
    "微观处境", "叙事规训", "日记", "基层治理", "政治权力",
    "媒介批评", "文档规范", "女性书写", "舆论场", "租房", "美区账号",
    "Combo", "K9", "GitHub", "人口结构", "创业风险", "寻租",
    "媒介语言", "组织倦怠", "壁纸", "礼品卡", "Serverless", "Memos",
    "珠泪", "网盘", "ChatGPT", "订阅", "虚拟信用卡", "Apple ID",
    "资源索引", "灵摆", "电子龙", "云服务", "建站", "学习场所",
    "意识形态", "慢性病", "决策模型", "校园霸凌", "留学泡沫",
    "规则漏洞", "成瘾", "文本分析", "数字生活", "薪资", "养老危机",
    "双轨制", "权威崇拜", "模板定制", "发文流程", "Markdown",
    "短代码", "灰色产业", "法治失序", "离岸生存", "维权话语",
    "求职", "网络故障",
}

TAG_MERGES = {
    # 合并为新标签
    "亲密关系": "两性关系",
    "情感压抑": "心理困境",
    "就业下行": "职场困境",
    "劳动处境": "职场困境",
    "职场压榨": "职场困境",
}

# 保留的高频标签 (出现≥3次)
TAG_KEEP = {
    "社会流动", "代际传递", "工具链", "文化批评", "教育异化",
    "自我防御", "生命周期", "阶层分化", "性别博弈", "婚恋市场",
    "游戏王", "写作指南", "心理困境", "图床", "校园治理", "ACG",
    "Hugo", "Congo", "卡组构筑", "内容生产", "两性关系", "职场困境",
}


def parse_front_matter_tags(content):
    """解析 front matter 中的 tags，支持多种格式"""
    # 格式1: tags: ["tag1", "tag2"]
    single_line_match = re.search(r'^tags:\s*\[([^\]]*)\]', content, re.MULTILINE)
    if single_line_match:
        tags = [t.strip().strip('"').strip("'") for t in single_line_match.group(1).split(',') if t.strip()]
        return tags, single_line_match.group(0), 'single'

    # 格式2: tags:
    #        - tag1
    #        - tag2
    multi_line_match = re.search(r'^tags:\s*\n((?:\s*-\s+[^"\']+\s*\n?)+)', content, re.MULTILINE)
    if multi_line_match:
        tag_lines = multi_line_match.group(1)
        tags = [re.sub(r'^\s*-\s+', '', line).strip() for line in tag_lines.split('\n') if line.strip()]
        return tags, multi_line_match.group(0), 'multi'

    return [], None, None


def parse_front_matter_categories(content):
    """解析 front matter 中的 categories，支持多种格式"""
    # 格式1: categories: ["cat1", "cat2"]
    single_line_match = re.search(r'^categories:\s*\[([^\]]*)\]', content, re.MULTILINE)
    if single_line_match:
        cats = [c.strip().strip('"').strip("'") for c in single_line_match.group(1).split(',') if c.strip()]
        return cats, single_line_match.group(0), 'single'

    # 格式2: categories:
    #        - cat1
    #        - cat2
    multi_line_match = re.search(r'^categories:\s*\n((?:\s*-\s+[^"\']+\s*\n?)+)', content, re.MULTILINE)
    if multi_line_match:
        cat_lines = multi_line_match.group(1)
        cats = [re.sub(r'^\s*-\s+', '', line).strip() for line in cat_lines.split('\n') if line.strip()]
        return cats, multi_line_match.group(0), 'multi'

    return [], None, None


def process_file(filepath):
    """处理单个文章文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changed = False

    # 提取并转换分类
    old_cats, cat_match_str, cat_format = parse_front_matter_categories(content)
    if old_cats and cat_match_str:
        new_cats = [CATEGORY_MAP.get(c, c) for c in old_cats]
        new_cats = sorted(list(set(new_cats)))

        if cat_format == 'single':
            new_str = 'categories: ["' + '", "'.join(new_cats) + '"]'
        else:
            new_str = 'categories:\n' + '\n'.join([f'  - {c}' for c in new_cats])

        content = content.replace(cat_match_str, new_str)
        changed = True

    # 提取并转换标签
    old_tags, tag_match_str, tag_format = parse_front_matter_tags(content)
    if old_tags and tag_match_str:
        new_tags = []

        for tag in old_tags:
            if tag in TAG_REMOVALS:
                continue
            merged_tag = TAG_MERGES.get(tag, tag)
            if merged_tag in TAG_KEEP:
                new_tags.append(merged_tag)

        new_tags = sorted(list(set(new_tags)))

        if new_tags:
            if tag_format == 'single':
                new_str = 'tags: ["' + '", "'.join(new_tags) + '"]'
            else:
                new_str = 'tags:\n' + '\n'.join([f'  - {t}' for t in new_tags])
            content = content.replace(tag_match_str, new_str)
            changed = True
        else:
            # 删除整个tags行/块
            content = content.replace(tag_match_str + '\n', '')
            content = content.replace(tag_match_str, '')
            changed = True

    return content, changed


def main():
    base_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts')
    base_dir = os.path.abspath(base_dir)

    processed = 0
    changed = 0

    for root, dirs, files in os.walk(base_dir):
        for f in files:
            if f.endswith('.md'):
                filepath = os.path.join(root, f)
                processed += 1

                new_content, was_changed = process_file(filepath)

                if was_changed:
                    with open(filepath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    changed += 1
                    print(f'✓ Updated: {filepath}')

    print(f'\n处理完成: 共 {processed} 篇文章，修改 {changed} 篇')


if __name__ == '__main__':
    main()
