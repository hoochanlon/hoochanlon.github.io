---
title: "基础文字排版效果"
date: 2018-12-18
lastmod: 2026-07-20
draft: false
slug: "typography-test"
author: "你的名字"
coverCaption: "封面图"
categories: ["写作"]
tags: ["排版","标注"]
summary: "基础的文字与图片排版演示。"
featured: true
featuredWeight: 1
---

## Lorem Ipsum 段落

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## 日文段落

日本語の組版では、和欧混植が重要な課題です。全角と半角のバランス、句読点の位置、縦組と横組の切り替えなど、多くのルールが存在します。さらに、ルビ（振り仮名）や圏点など、日本語特有の装飾要素も考慮する必要があります。

## 超文本标注

缺点：代码复杂；优点：多样性。

* 波浪线：<span style="text-decoration: wavy underline;color: red;">波浪线</span>，继续普通文本。
* 下划线：<u>下划线文字</u>
* 文字下的着重点：这是<span style="text-emphasis: dot; text-emphasis-position: under;">文字下方着重点</span>。


```
# 波浪线，字体红色
<span style="text-decoration: wavy underline; color: red;">波浪线</span>


# 文字下方着重点
<span style="text-emphasis: dot; text-emphasis-position: under;">文字下方着重点</span>
```


```
/* 语法：线型 + 样式 + 颜色 + 厚度 */
text-decoration: underline wavy red 2px;
            ↓         ↓       ↓    ↓
          "装饰"  "在哪里" "什么样" "什么色" "多粗"
```

## 诗 · 横排注音

{{< poem title="杂诗" author="陶渊明〔魏晋〕" dir="h" >}}
人生无根蒂，飘如陌上尘。
rén shēng wú gēn dì piāo rú mò shàng chén

分散逐风转，此已非常身。
fēn sàn zhú fēng zhuǎn cǐ yǐ fēi cháng shēn

落地为兄弟，何必骨肉亲！
luò dì wéi xiōng dì hé bì gǔ ròu qīn

得欢当作乐，斗酒聚比邻。
dé huān dāng zuò lè dǒu jiǔ jù bǐ lín

盛年不重来，一日难再晨。
shèng nián bù chóng lái yī rì nán zài chén

及时当勉励，岁月不待人。
jí shí dāng miǎn lì suì yuè bù dài rén
{{< /poem >}}

## 诗 · 竖排注音

{{< poem title="杂诗" author="陶渊明〔魏晋〕" dir="v" >}}
人生无根蒂，飘如陌上尘。
rén shēng wú gēn dì piāo rú mò shàng chén

分散逐风转，此已非常身。
fēn sàn zhú fēng zhuǎn cǐ yǐ fēi cháng shēn

落地为兄弟，何必骨肉亲！
luò dì wéi xiōng dì hé bì gǔ ròu qīn

得欢当作乐，斗酒聚比邻。
dé huān dāng zuò lè dǒu jiǔ jù bǐ lín

盛年不重来，一日难再晨。
shèng nián bù chóng lái yī rì nán zài chén

及时当勉励，岁月不待人。
jí shí dāng miǎn lì suì yuè bù dài rén
{{< /poem >}}

## 词 · 横排注音

{{< poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="h" >}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào

枝上柳绵吹又少，天涯何处无芳草！
zhī shàng liǔ mián chuī yòu shǎo tiān yá hé chù wú fāng cǎo

墙里秋千墙外道。
qiáng lǐ qiū qiān qiáng wài dào

墙外行人，墙里佳人笑。
qiáng wài xíng rén qiáng lǐ jiā rén xiào

笑渐不闻声渐悄，多情却被无情恼。
xiào jiàn bù wén shēng jiàn qiǎo duō qíng què bèi wú qíng nǎo
{{< /poem >}}

## 词 · 竖排注音

{{< poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="v" >}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào

枝上柳绵吹又少，天涯何处无芳草！
zhī shàng liǔ mián chuī yòu shǎo tiān yá hé chù wú fāng cǎo

墙里秋千墙外道。
qiáng lǐ qiū qiān qiáng wài dào

墙外行人，墙里佳人笑。
qiáng wài xíng rén qiáng lǐ jiā rén xiào

笑渐不闻声渐悄，多情却被无情恼。
xiào jiàn bù wén shēng jiàn qiǎo duō qíng què bèi wú qíng nǎo
{{< /poem >}}
