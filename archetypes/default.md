---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
slug: "{{ now.Format "20060102150405" }}"
categories: ["随笔"]
tags: []
summary: ""
featured: false
# featuredWeight: 1  # 精选排序，越小越靠前；仅 featured: true 时生效
---
