(() => {
  const figure = document.querySelector(".about-profile-image--playable");
  if (!figure) return;

  const button = figure.querySelector("[data-about-play]");
  const audio = figure.querySelector("audio");
  const progress = figure.querySelector("[data-about-progress]");
  if (!button || !audio) return;

  const title = audio.dataset.title || "播放";
  const circumference = progress
    ? 2 * Math.PI * Number(progress.getAttribute("r") || 15.5)
    : 0;

  if (progress) {
    progress.style.strokeDasharray = `${circumference}`;
    progress.style.strokeDashoffset = `${circumference}`;
  }

  const setPlaying = (playing) => {
    figure.classList.toggle("is-playing", playing);
    button.setAttribute("aria-label", playing ? `暂停 ${title}` : `播放 ${title}`);
  };

  const setProgress = (ratio) => {
    if (!progress) return;
    const value = Math.min(Math.max(ratio, 0), 1);
    progress.style.strokeDashoffset = `${circumference * (1 - value)}`;
  };

  button.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    audio.pause();
    setPlaying(false);
  });

  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    setProgress(audio.currentTime / audio.duration);
  });
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    setPlaying(false);
    setProgress(0);
  });
})();
