import os
from datetime import datetime
import sys
import pytz

# 获取命令行参数，默认值为 'undefined'
file_name = sys.argv[1] if len(sys.argv) > 1 else 'undefined'

# 获取当前日期和时间（带时区）
timezone = pytz.timezone('Asia/Shanghai')  # 设置时区为上海（UTC+8）
current_date = datetime.now(timezone)

# 获取年月日时分秒
year = current_date.year
month = str(current_date.month).zfill(2)  # 确保月份是两位数
day = str(current_date.day).zfill(2)    # 确保日期是两位数
hour = str(current_date.hour).zfill(2)  # 确保小时是两位数
minute = str(current_date.minute).zfill(2)  # 确保分钟是两位数
second = str(current_date.second).zfill(2)  # 确保秒数是两位数

# 生成唯一的 slug (yearmmddhhss)
slug = f"{year}{month}{day}{hour}{minute}{second}"
file_name_prefix = f"{year}-{month}-{day}"

# 设置文件夹路径
folder_path = os.path.join('src', 'data', 'blog', str(year), f"{year}-{month}")

# 创建文件夹（如果不存在的话）
os.makedirs(folder_path, exist_ok=True)

# 设置文件路径，包括基于时间戳生成的 slug
file_path = os.path.join(folder_path, f"{file_name_prefix}-{file_name}.md")

# 设置 pubDatetime 格式，带时区
pub_datetime_str = current_date.strftime(f"{year}-{month}-{day} {hour}:{minute}:{second}+08:00")

# 创建文章内容
content = f"""---
title: "{file_name}"
pubDatetime: {pub_datetime_str}
description: ""  
tags: []  
slug: "{slug}"  
---

这里是文章内容...
"""

# 写入文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Post created at {file_path}")
