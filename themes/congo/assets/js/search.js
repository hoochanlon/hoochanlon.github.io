var fuse;
var showButtons = document.querySelectorAll("[id^='search-button']");
var hideButton = document.getElementById("close-search-button");
var wrapper = document.getElementById("search-wrapper");
var modal = document.getElementById("search-modal");
var input = document.getElementById("search-query");
var output = document.getElementById("search-results");
var first = output.firstChild;
var last = output.lastChild;
var searchVisible = false;
var indexed = false;
var hasResults = false;

// Listen for events
showButtons.forEach((button) => {
  button.addEventListener("click", displaySearch);
});
hideButton.addEventListener("click", hideSearch);
wrapper.addEventListener("click", hideSearch);
modal.addEventListener("click", function (event) {
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
});
document.addEventListener("keydown", function (event) {
  // Forward slash to open search wrapper
  if (event.key == "/") {
    if (!searchVisible) {
      event.preventDefault();
      displaySearch();
    }
  }

  // Esc to close search wrapper
  if (event.key == "Escape") {
    hideSearch();
  }

  // Down arrow to move down results list
  if (event.key == "ArrowDown") {
    if (searchVisible && hasResults) {
      event.preventDefault();
      if (document.activeElement == input) {
        first.focus();
      } else if (document.activeElement == last) {
        last.focus();
      } else {
        document.activeElement.parentElement.nextSibling.firstElementChild.focus();
      }
    }
  }

  // Up arrow to move up results list
  if (event.key == "ArrowUp") {
    if (searchVisible && hasResults) {
      event.preventDefault();
      if (document.activeElement == input) {
        input.focus();
      } else if (document.activeElement == first) {
        input.focus();
      } else {
        document.activeElement.parentElement.previousSibling.firstElementChild.focus();
      }
    }
  }
});

input.onkeyup = function (event) {
  // queue an update after each keypress. the last one after some idle time wins
  let isFirstRun = throttle(() => executeQuery(this.value));
  // on first run, show a spinner
  if (isFirstRun) {
    output.innerHTML = `<li class="mb-2">
      <a class="flex items-center px-3 py-2 rounded-md appearance-none bg-neutral-100 dark:bg-neutral-700 focus:bg-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 dark:focus:bg-primary-900 focus:outline-dotted focus:outline-transparent focus:outline-2" href="#" tabindex="0">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g>
              <circle cx="12" cy="3" r="1" fill="currentColor">
                <animate id="spnDot0" attributeName="r" begin="0;spnDot2.end-0.5s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="16.5" cy="4.21" r="1" fill="currentColor">
                <animate id="spnDot1" attributeName="r" begin="spnDot0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="7.5" cy="4.21" r="1" fill="currentColor">
                <animate id="spnDot2" attributeName="r" begin="spnDot4.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="19.79" cy="7.5" r="1" fill="currentColor">
                <animate id="spnDot3" attributeName="r" begin="spnDot1.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="4.21" cy="7.5" r="1" fill="currentColor">
                <animate id="spnDot4" attributeName="r" begin="spnDot6.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="21" cy="12" r="1" fill="currentColor">
                <animate id="spnDot5" attributeName="r" begin="spnDot3.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="3" cy="12" r="1" fill="currentColor">
                <animate id="spnDot6" attributeName="r" begin="spnDot8.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="19.79" cy="16.5" r="1" fill="currentColor">
                <animate id="spnDot7" attributeName="r" begin="spnDot5.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="4.21" cy="16.5" r="1" fill="currentColor">
                <animate id="spnDot8" attributeName="r" begin="spnDota.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="16.5" cy="19.79" r="1" fill="currentColor">
                <animate id="spnDot9" attributeName="r" begin="spnDot7.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="7.5" cy="19.79" r="1" fill="currentColor">
                <animate id="spnDota" attributeName="r" begin="spnDotb.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <circle cx="12" cy="21" r="1" fill="currentColor">
                <animate id="spnDotb" attributeName="r" begin="spnDot9.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".27,.42,.37,.99;.53,0,.61,.73" values="1;2;1"/>
              </circle>
              <animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="360 12 12;0 12 12"/>
          </g>
        </svg>
      </a>
    </li>`;
  }
};

function throttle(func, time = 750) {
  let isFirstRun = throttle.timeout === undefined;
  if (!isFirstRun) {
    clearTimeout(throttle.timeout);
  }
  throttle.timeout = setTimeout(() => {
    func();
    throttle.timeout = undefined;
  }, time);
  return isFirstRun;
}

function displaySearch() {
  if (!indexed) {
    buildIndex();
  }
  if (!searchVisible) {
    document.body.style.overflow = "hidden";
    wrapper.style.visibility = "visible";
    input.focus();
    searchVisible = true;
  }
}

function hideSearch() {
  if (searchVisible) {
    document.body.style.overflow = "visible";
    wrapper.style.visibility = "hidden";
    input.value = "";
    output.innerHTML = "";
    document.activeElement.blur();
    searchVisible = false;
  }
}

function fetchJSON(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

function buildIndex() {
  var baseURL = wrapper.getAttribute("data-url");
  baseURL = baseURL.replace(/\/?$/, "/");
  fetchJSON(baseURL + "index.json", function (data) {
    var options = {
      shouldSort: true,
      ignoreLocation: true,
      threshold: 0.0,
      includeMatches: true,
      keys: [
        { name: "title", weight: 0.8 },
        { name: "section", weight: 0.2 },
        { name: "summary", weight: 0.6 },
        { name: "content", weight: 0.4 },
      ],
    };
    fuse = new Fuse(data, options);
    indexed = true;
  });
}

function executeQuery(term) {
  let results = fuse.search(term);
  hasResults = results.length > 0;

  if (results.length > 0) {
    // prettier-ignore
    output.innerHTML = results.map(function (value) {
    return `<li class="mb-2">
        <a class="flex items-center px-3 py-2 rounded-md appearance-none bg-neutral-100 dark:bg-neutral-700 focus:bg-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 dark:focus:bg-primary-900 focus:outline-dotted focus:outline-transparent focus:outline-2" href="${value.item.permalink}" tabindex="0">
          <div class="grow">
            <div class="-mb-1 text-lg font-bold">${value.item.title}</div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400">${value.item.section}${value.item.date == null ? '' : `<span class="px-2 text-primary-500">&middot;</span>${value.item.date}</span>`}</div>
            <div class="text-sm italic">${value.item.summary}</div>
          </div>
          <div class="ml-2 ltr:block rtl:hidden text-neutral-500">&rarr;</div>
          <div class="mr-2 ltr:hidden rtl:block text-neutral-500">&larr;</div>
        </a>
      </li>`;
    }).join("");

    first = output.firstChild.firstElementChild;
    last = output.lastChild.firstElementChild;
  } else {
    output.innerHTML = "";
  }
}
