const fallbackCopy = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
};

const copyText = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (_) {
    // 不支持权限 API 的上下文会使用下方的兼容路径。
  }

  if (!fallbackCopy(text)) {
    throw new Error("浏览器拒绝写入剪贴板");
  }
};

const setCopyState = (button, state) => {
  window.clearTimeout(button.copyResetTimer);
  button.classList.toggle("is-copied", state === "copied");
  button.setAttribute("aria-label", state === "copied" ? "已复制代码" : "复制代码");
  button.title = state === "copied" ? "已复制" : "复制代码";

  if (state === "copied") {
    button.copyResetTimer = window.setTimeout(() => setCopyState(button, "idle"), 1800);
  }
};

const initialiseCodeCopy = () => {
  document.querySelectorAll(".sc-code__copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.closest(".sc-code")?.querySelector("pre code");
      if (!code) return;

      try {
        await copyText(code.textContent);
        setCopyState(button, "copied");
      } catch (error) {
        console.warn("代码复制失败", error);
      }
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseCodeCopy, { once: true });
} else {
  initialiseCodeCopy();
}
