---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
slug: "{{ now.Format "20060102150405" }}"
categories: ["随笔"]
tags: []
summary: ""
featured: false
---
