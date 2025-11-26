import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import IconWechat from "@/assets/icons/IconWechat.svg";
import IconSubway from "@/assets/icons/IconSubway.svg";
import type { GiscusProps } from "@giscus/react";
import { SITE } from "@/config";


export const GISCUS: GiscusProps = {
  repo: "hoochanlon/hoochanlon.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkxMzIzMjYzMjM=",
  category: "Announcements",
  categoryId: "DIC_kwDOB-Mjs84COzES",
  mapping: "title",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "zh-CN",
  loading: "lazy"
};

interface Social {
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
    icon: IconGitHub
  },
  {
    name: "Wechat",
    href: "./about#add-friend",
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
    name: "Subway",
    href: "https://www.travellings.cn/go.html",
    linkTitle: `Going to a random place by subway!`,
    icon: IconSubway,
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
