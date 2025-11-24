import os
import frontmatter
from datetime import datetime

# 更新 heroImage 字段的链接
def update_hero_image_url(hero_image_url):
    if 'hoochanlon.github.io' in hero_image_url:
        return hero_image_url.replace('https://hoochanlon.github.io', 'https://cdn.jsdelivr.net/gh/hoochanlon')
    return hero_image_url

# 更新 front-matter
def update_front_matter(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 解析 front-matter
    post = frontmatter.loads(content)

    # 获取原始日期，转换成你需要的 slug 格式
    if 'date' in post:
        # 确保 post['date'] 是 datetime 对象
        if isinstance(post['date'], str):
            try:
                post['date'] = datetime.strptime(post['date'], '%Y-%m-%d %H:%M:%S')  # 如果是字符串，转换为 datetime
            except ValueError:
                post['date'] = datetime.now()  # 如果格式不对，则默认使用当前时间

        # 直接从 post['date'] 生成 slug，不做过多的格式化
        slug = post['date'].strftime('%Y%m%d%H%M%S')  # 按照年月日时分秒格式化
        publish_date = post['date'].strftime('%Y-%m-%d')  # 保留原日期格式
    else:
        # 如果没有原始日期，使用当前日期生成 slug
        slug = datetime.now().strftime('%Y%m%d%H%M%S')
        publish_date = post.get('publishDate', datetime.now().strftime('%Y-%m-%d'))  # 保持原 publishDate 或默认值

    # 获取 description，确保它是一个字符串，并去掉空格
    description = post.get('description', '')
    description = description.strip() if description else ''  # 清理 description

    # 如果 description 为空，强制写入 "" 确保字段存在
    if description == '':
        description = '"本文没有特定描述，建议读者根据内容自行总结。"'

    # 获取 tags，确保它是一个列表
    tags = post.get('tags', [])
    if not isinstance(tags, list):
        tags = []  # 确保 tags 是一个列表

    # 处理 heroImage 字段
    cover = post.get('cover', '')
    hero_image = {}
    if cover:
        hero_image['src'] = update_hero_image_url(cover)
        # hero_image['inferSize'] = True
        hero_image['width'] = 1200
        hero_image['height'] = 630
    else:
        hero_image = None  # 如果没有 cover，则移除 heroImage 字段

    # 创建新的 front-matter 数据
    new_front_matter = {
        'title': post.get('title', 'Untitled'),
        'categories': post.get('categories', ''),
        'tags': tags,
        'pubDatetime': publish_date,  # 保持原日期或使用默认日期
        'slug': f'"{slug}"',
        'description': description,  # 确保 description 为有效字符串
    }

    # 仅在有 heroImage 时才加入 heroImage 字段
    if hero_image:
        new_front_matter['heroImage'] = hero_image

    # 格式化成新的 front-matter
    new_front_matter_str = '---\n' + '\n'.join([f"{key}: {value}" for key, value in new_front_matter.items()]) + '\n---\n'

    # 更新文件内容，保留原文章内容，替换 front-matter
    new_content = new_front_matter_str + content.split('---\n')[2]

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)
    print(f"Updated: {file_path}")

# 遍历文件夹中的所有文件
def process_folder(root_folder):
    for subdir, dirs, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(subdir, file)
                update_front_matter(file_path)

# 执行转换
process_folder('C:/Users/hooch/Pictures/_posts')
