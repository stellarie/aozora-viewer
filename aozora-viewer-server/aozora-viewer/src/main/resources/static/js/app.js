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

  const state = {
    author: "",
    title: "",
    link: ""
  }

  // for any css changes on the fly
  const init = () => {
    const loader = useAozoraLoader();
    document.getElementById("loading").style.display = "none";
    document.getElementById("reader").style["overflow-x"] = "unset";
    state.author = "";
    state.title = "";
    state.link = "";

    return loader;
  }

  const load = (path) => {
    const reader = document.getElementById("reader");
    document.getElementById("loading").style.display = "block";
    document.getElementById("library").style["display"] = "none";
    document.getElementById("reader").style["display"] = "block";
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
        const pageTitle = document.getElementById("viewer-title");
        const pageAuthor = document.getElementById("viewer-author");
        const title = document.getElementsByClassName("title").item(0).textContent;
        const author = document.getElementsByClassName("author").item(0).textContent;

        pageTitle.innerHTML = title;
        pageAuthor.innerHTML = author;
        document.getElementById("reader").style["overflow-x"] = "scroll";
        document.getElementsByClassName("title").item(0).scrollIntoView();
        document.getElementById("loading").style.display = "none";

        state.title = title;
        state.author = author;
        state.link = path;
        resolve();
      });
    })
  }

  const save = () => {
    if (!state.title || !state.author || !state.link) return;

    const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    if (savedItems.some(item => item.link === state.link)) return;

    savedItems.push({
      title: state.title,
      author: state.author,
      link: state.link
    });
    localStorage.setItem("savedItems", JSON.stringify(savedItems))
    alert(`${state.title} by ${state.author} has been saved. \n\n${state.link}`);
  }

  const showLibrary = () => {
    const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    if (savedItems.length === 0) return;

    document.getElementById("reader").style["display"] = "none";
    const library = document.getElementById("library");
    library.innerHTML = "";
    library.style["display"] = "block";
    const table = document.createElement("table");
    table.classList.add("library-table");
    table.innerHTML = `<tr><th>書名</th><th>作家</th><th></th></tr>`;

    savedItems.forEach(item => {
      const row = table.insertRow();
      const titleCell = row.insertCell();
      titleCell.innerHTML = item.title;
      const authorCell = row.insertCell();
      authorCell.innerHTML = item.author;
      const readCell = row.insertCell();
      const readButton = document.createElement("button");
      readButton.addEventListener("click", () => loadPage(item.link));
      readButton.classList.add("library-read-button");
      readButton.innerHTML = "読む";
      readCell.appendChild(readButton);
    });
    library.appendChild(table);
  }

  return {
    save,
    init,
    load,
    showLibrary
  };
};

const loader = useAozoraLoader();
loader.init();

const loadPage = (path) => {
  loader.load(path);
};

const savePage = () => {
  loader.save();
}

const showLibrary = () => {
  loader.showLibrary();
}
