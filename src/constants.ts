import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import IconWechat from "@/assets/icons/IconWechat.svg";
import IconTodo from "@/assets/icons/IconTodo.svg";
import IconCalendar from "@/assets/icons/IconCalendar.svg";
import IconImgbed from "@/assets/icons/IconImgbed.svg"
import IconTomato from "@/assets/icons/IconTomato.svg"
import IconPaste from "@/assets/icons/IconPaste.svg"
import IconMemo from "@/assets/icons/IconMemo.svg"
import IconSafari from "@/assets/icons/IconSafari.svg"
import IconRename from "@/assets/icons/IconRename.svg"
import { SITE } from "@/config";
import type { GiscusProps } from "@giscus/react";


export const GISCUS: GiscusProps = {
  repo: "hoochanlon/hoochanlon.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkxMzIzMjYzMjM=",
  category: "Announcements",
  categoryId: "DIC_kwDOB-Mjs84COzES",
  mapping: "title",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "zh-CN",
  loading: "lazy"
};

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

interface DEPLOY {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/hoochanlon",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "Wechat",
    href: "./about",
    linkTitle: `${SITE.title} on Wechat`,
    icon: IconWechat,
  },
  {
    name: "Mail",
    href: "mailto:hoochanlon@outlook.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
  {
    name: "Telegram",
    href: "https://t.me/s/at1234560",
    linkTitle: `${SITE.title} on Telegram`,
    icon: IconTelegram,
  }
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;

export const DEPLOY_LINKS: DEPLOY[] = [
  {
    name: "Todo",
    href: "https://hoochanlon.github.io/todo",
    linkTitle: `${SITE.title} on Todo`,
    icon: IconTodo,
  },
  {
    name: "Tomato",
    href: "https://hoochanlon.github.io/tomato",
    linkTitle: `${SITE.title} on Tomato`,
    icon: IconTomato,
  },
  {
    name: "Calendar",
    href: "https://hoochanlon.github.io/calendar",
    linkTitle: `${SITE.title} on Calendar`,
    icon: IconCalendar,
  },
  {
    name: "Rename",
    href: "https://rename.hoochanlon.moe",
    linkTitle: `${SITE.title} on Rename`,
    icon: IconRename,
  },
  {
    name: "Imgbed",
    href: "https://cf-imgbed.hoochanlon.moe",
    linkTitle: `${SITE.title} on Imgbed`,
    icon: IconImgbed,
  },
  {
    name: "CloudPaste",
    href: "https://cloudpaste.hoochanlon.moe",
    linkTitle: `${SITE.title} on Paste`,
    icon: IconPaste,
  },
  {
    name: "Memos-Worker",
    href: "https://memos-worker.hoochanlon.moe",
    linkTitle: `${SITE.title} on memos-worker`,
    icon: IconMemo,
  },
  {
    name: "Nav",
    href: "https://nav.hoochanlon.moe",
    linkTitle: `${SITE.title} on Nav`,
    icon: IconSafari,
  },
  ] as const;