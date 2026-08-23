const root = document.documentElement;

function css(name) {
  return "rgb(" + getComputedStyle(root).getPropertyValue(name) + ")";
}

let isDark = root.classList.contains("dark");
let isLatexDark = root.dataset.palette === "latex" && isDark;
let isSakuraDark = root.dataset.palette === "sakura" && isDark;

const typoraNight = {
  background: "rgb(54 59 64)",
  surface: "rgb(51 51 51)",
  border: "rgb(71 77 84)",
  text: "rgb(184 191 198)",
  heading: "rgb(222 222 222)",
  muted: "rgb(157 162 166)",
};

const sakuraNight = {
  background: css("--color-neutral-900"),
  surface: css("--color-neutral-800"),
  border: css("--color-primary-400"),
  text: css("--color-neutral-100"),
  muted: css("--color-neutral-300"),
};

const darkDiagram = isLatexDark ? typoraNight : isSakuraDark ? sakuraNight : null;

mermaid.initialize({
  theme: "base",
  themeVariables: {
    background: darkDiagram ? darkDiagram.background : css("--color-neutral"),
    primaryTextColor: darkDiagram
      ? darkDiagram.text
      : isDark
        ? css("--color-neutral-200")
        : css("--color-neutral-700"),
    primaryColor: darkDiagram
      ? darkDiagram.surface
      : isDark
        ? css("--color-primary-700")
        : css("--color-primary-200"),
    secondaryColor: darkDiagram
      ? darkDiagram.surface
      : isDark
        ? css("--color-secondary-700")
        : css("--color-secondary-200"),
    tertiaryColor: darkDiagram
      ? darkDiagram.surface
      : isDark
        ? css("--color-neutral-700")
        : css("--color-neutral-100"),
    primaryBorderColor: darkDiagram
      ? darkDiagram.border
      : isDark
        ? css("--color-primary-500")
        : css("--color-primary-400"),
    secondaryBorderColor: darkDiagram ? darkDiagram.border : css("--color-secondary-400"),
    tertiaryBorderColor: darkDiagram
      ? darkDiagram.border
      : isDark
        ? css("--color-neutral-300")
        : css("--color-neutral-400"),
    lineColor: darkDiagram
      ? darkDiagram.muted
      : isDark
        ? css("--color-neutral-300")
        : css("--color-neutral-600"),
    fontFamily:
      "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif",
    fontSize: "16px",
    pieTitleTextSize: "19px",
    pieSectionTextSize: "16px",
    pieLegendTextSize: "16px",
    pieStrokeWidth: "1px",
    pieOuterStrokeWidth: "0.5px",
    pieStrokeColor: darkDiagram
      ? darkDiagram.border
      : isDark
        ? css("--color-neutral-300")
        : css("--color-neutral-400"),
    pieOpacity: "1",
  },
});
