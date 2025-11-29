import os
import re

# 定义文件夹路径
folder_path = r'C:\Users\hooch\Documents\GitHub\hoochanlon.github.io\src\data\blog'  # 修改为你的文件夹路径
print(f"Opening folder: {folder_path}")

# 定义 GitHub 图片链接的正则表达式，匹配 GitHub 图片链接和普通链接
github_image_pattern = r'!\[.*?\]\(https://hoochanlon.github.io/picx-images-hosting[^\s\)]+|https://hoochanlon.github.io/picx-images-hosting[^\s\)]+'

# 定义 CDN 的基础 URL
cdn_base_url = 'https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/'

# 遍历文件夹中的所有 Markdown 文件
for root, dirs, files in os.walk(folder_path):
    for file in files:
        if file.endswith('.md'):  # 只处理 Markdown 文件
            file_path = os.path.join(root, file)
            print(f"Processing file: {file_path}")

            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 查找所有 GitHub 图片链接并替换为 CDN 链接
            def replace_github_image_url(match):
                original_url = match.group(0)
                print(f"Found URL: {original_url}")  # 打印找到的 GitHub 图片链接

                # 提取 URL 部分，去掉 ![]() 语法中的其他部分
                try:
                    url = re.search(r'https://hoochanlon.github.io/picx-images-hosting[^\s\)]+', original_url).group(0)
                    print(f"Extracted URL: {url}")  # 打印提取的 URL

                    # 构建 CDN URL
                    cdn_url = cdn_base_url + url.split('hoochanlon.github.io/picx-images-hosting/')[1]
                    return original_url.replace(url, cdn_url)
                except Exception as e:
                    print(f"Error while processing URL: {original_url}, {e}")
                    return original_url  # 如果出错，保持原 URL

            # 替换链接
            updated_content = re.sub(github_image_pattern, replace_github_image_url, content)

            # 如果文件内容有变化，保存更新后的内容
            if updated_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Updated: {file_path}")
            else:
                print(f"No changes for: {file_path}")
