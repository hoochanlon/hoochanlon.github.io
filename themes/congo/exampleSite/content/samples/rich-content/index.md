---
title: "Rich Content"
date: 2019-03-10
description: "A brief description of Rich Content"
summary: "This is an _example_ of a **rich** content summary."
coverAlt: "An example cover image depicting icons of some popular media organisations."
coverCaption: "This is an example cover image with a caption."
tags: ["shortcodes", "privacy", "sample", "gist", "twitter", "youtube", "vimeo"]
---

Hugo ships with several [built-in shortcodes](https://gohugo.io/content-management/shortcodes/#use-hugos-built-in-shortcodes) for rich content, along with a [privacy config](https://gohugo.io/about/hugo-and-gdpr/) and a set of _simple shortcodes_ that enable static and no-JS versions of various social media embeds.

## YouTube

Below is an example using the built-in `youtube` shortcode. It requires only the video ID.

{{< youtube ZJthWmvUzzc >}}

## X (formerly Twitter)

This example uses the `x` shortcode to output a Tweet. It requires two named parameters `user` and `id`.

{{< x user="DesignReviewed" id="1085870671291310081" >}}

## Instagram

The `instagram` shortcode will embed an Instagram post. It requires only the post ID.

{{< instagram CxOWiQNP2MO >}}

## Vimeo

The `vimeo` shortcode will embed a Vimeo video. It requires only the video ID.

{{< vimeo 48912912 >}}
