/**
 * copy from anzhiyu-hexo-music
 */
// custom api
var meting_api =
  "https://meting.qjqq.cn/?server=:server&type=:type&id=:id&auth=:auth&r=:r";
var anzhiyu_music = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    if (window.location.pathname != "/music/") {
      return;
    }
    const anMusicBg = document.getElementById("an_music_bg");

    if (isChangeBg) {
      // player listswitch 会进入此处
      const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
      anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(() => {
        const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
        // 确保player加载完成
        if (musiccover) {
          clearInterval(timer);
          // 绑定事件
          anzhiyu_music.addEventListenerChangeMusicBg();
        }
      }, 100);
    }
  },
  addEventListenerChangeMusicBg: function () {
    const anMusicPage = document.getElementById("anMusic-page");
    const aplayerIconMenu = anMusicPage.querySelector(
      ".aplayer-info .aplayer-time .aplayer-icon-menu"
    );

    anMusicPage
      .querySelector("meting-js")
      .aplayer.on("loadeddata", function () {
        anzhiyu_music.changeMusicBg();
        console.info("player loadeddata");
      });

    aplayerIconMenu.addEventListener("click", function () {
      document.getElementById("menu-mask").style.display = "block";
      document.getElementById("menu-mask").style.animation =
        "0.5s ease 0s 1 normal none running to_show";
    });

    document.getElementById("menu-mask").addEventListener("click", function () {
      if (window.location.pathname != "/music/") return;
      anMusicPage
        .querySelector(".aplayer-list")
        .classList.remove("aplayer-list-hide");
    });
  },
};

anzhiyu_music.changeMusicBg(false);
