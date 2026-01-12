const waitForElement = (selector) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

const useAozoraLoader = () => {

  // for any css changes on the fly
  const init = () => {
    const loader = useAozoraLoader();
    document.getElementById("loading").style.display = "none";
    document.getElementById("reader").style["overflow-x"] = "unset";
    return loader;
  }

  const load = (path) => {
    const reader = document.getElementById("reader");
    document.getElementById("loading").style.display = "block";
    document.getElementById("reader").style["overflow-x"] = "unset";

    reader.innerHTML = "";
    return new Promise((resolve, reject) => {
      const page = fetch(`/?path=${path}`).then(response => {
        if (!response.ok) {
          document.getElementById("loading").style.display = "none";
          alert("Failed to load the page!");
          return reject();
        }
        return response;
      });
      page.then(response => response.text()).then(html => {
        reader.innerHTML = html;
      });
      waitForElement(".title").then(() => {
        resolve();
      });
    })
  }

  return {
    init,
    load
  };
};

const loader = useAozoraLoader();
loader.init();

const loadPage = (path) => {
  loader.load(path).then(() => {
    const title = document.getElementById("viewer-title");
    const author = document.getElementById("viewer-author");
    title.innerHTML = document.getElementsByClassName("title").item(0).textContent;
    author.innerHTML = document.getElementsByClassName("author").item(0).textContent;
    document.getElementById("reader").style["overflow-x"] = "scroll";
    document.getElementsByClassName("title").item(0).scrollIntoView();
    document.getElementById("loading").style.display = "none";
  });
};

