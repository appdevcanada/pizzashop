'use strict';

const MDL = [
  {
    title: "Information",
    class: "modal-header-info"
  },
  {
    title: "Success",
    class: "modal-header-succ"
  },
  {
    title: "Error",
    class: "modal-header-error"
  }
];

const TYPE_INFO = 0;
const TYPE_SUCC = 1;
const TYPE_ERR = 2;
const SESSION_KEY = "SK_PizzaShop";
// const BASE_URL = "http://mora0199.edumedia.ca";
// const BASE_URL = "http://localhost:3030";
const BASE_URL = "https://mora0199.github.io/pizzashop";
let pages = [];
let token = "";
let initPageIdx = 99;
let loggedUser = {};

/* INITIAL FUNCTION **************/
document.addEventListener("DOMContentLoaded", init);

function init() {
  window.historyInitiated = true;
  let initPage = window.location.href;
  console.log("Initial page:", initPage);

  pages = document.querySelectorAll(".pages");
  initPageIdx = pages.length - 1;
  history.pushState(null, null, initPage);
  document.querySelector("#signinlnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    switchPage(e, 0, "");
    document.querySelector("#inputEmailSI").focus();
  });
  document.querySelector("#signoutlnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    signOut();
  });
  document.querySelector("#signuplnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    switchPage(e, 1, "");
    document.querySelector("#first_name").focus();
  });
  document.querySelector("#closebtn").addEventListener("click", hideOverlay);
  document.querySelector(".modal").addEventListener("transitionend", closeDrawer);
  document.querySelector("#submitSUP").addEventListener("click", signUp);
  document.querySelector("#submitSIN").addEventListener("click", signIn);
  window.addEventListener("popstate", (e) => {
    console.log("Refresh pressed");
    history.replaceState(null, null, initPage);
  });
  document.querySelector("#mn-home").href = initPage;
  switchPage(false, initPageIdx, "index");

}

function closeDrawer() {
  setTimeout(hideOverlay, 5000);
}

/* OPERATIONAL FUNCTIONS *************/
function signUp(e) {
  e.preventDefault();
  let url = BASE_URL + "/auth/users";
  let userType = document.querySelector("#userType")
  let selUser = userType.options[userType.selectedIndex].value;
  let staffYN = selUser === "S" ? true : false;
  let formData = {
    firstName: document.querySelector("#first_name").value,
    lastName: document.querySelector("#last_name").value,
    email: document.querySelector("#validEmail").value,
    password: document.querySelector("#inputPasswordSU").value,
    isStaff: staffYN
  };
  let jsonData = JSON.stringify(formData);
  let headers = new Headers();
  headers.append('Content-Type', 'application/json;charset=UTF-8');
  let req = new Request(url, {
    headers: headers,
    method: 'POST',
    mode: 'cors',
    body: jsonData
  });
  fetch(req)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (!data.errors) {
        let code = data.status,
          status = data.data.firstName,
          title = "",
          detail = "Thanks for registering with us!";
        showOverlay(TYPE_SUCC, status, code, title, detail);
      } else {
        let code = "Code: " + data.errors[0].code,
          status = data.errors[0].status,
          title = data.errors[0].title,
          detail = data.errors[0].detail;
        showOverlay(TYPE_ERR, status, code, title, detail);
      };
      switchPage(false, 0, "signin");
      document.querySelector("#inputEmailSI").focus();
    })
    .catch(error => {
      showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
    })
}

function signIn(e) {
  e.preventDefault();
  let url = BASE_URL + "/auth/tokens";
  let formData = {
    email: document.querySelector("#inputEmailSI").value,
    password: document.querySelector("#inputPasswordSI").value
  };
  let jsonData = JSON.stringify(formData);
  let headers = new Headers();
  headers.append('Content-Type', 'application/json;charset=UTF-8');
  let req = new Request(url, {
    headers: headers,
    method: 'POST',
    mode: 'cors',
    body: jsonData
  });
  fetch(req)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(`Request rejected with status ${response.status}`);
      }
    })
    .then(result => {
      token = result.data.token;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(token));
      let url = BASE_URL + "/auth/users/me";
      let headers = new Headers();
      headers.append('Content-Type', 'application/json;charset=UTF-8');
      headers.append('Authorization', 'Bearer ' + token);
      let req = new Request(url, {
        headers: headers,
        method: 'GET',
        mode: 'cors'
      });
      fetch(req)
        .then(response => {
          return response.json();
        })
        .then(result => {
          if (!result.errors) {
            loggedUser = result.data;
            let code = "Welcome back!",
              status = loggedUser.firstName,
              title = "",
              detail = "";
            showOverlay(TYPE_SUCC, status, code, title, detail);
            updateMenu();
            switchPage(false, initPageIdx, "index");
          } else {
            let code = "Code: " + result.errors[0].code,
              status = result.errors[0].status,
              title = result.errors[0].title,
              detail = result.errors[0].detail;
            showOverlay(TYPE_ERR, status, code, title, detail);
          };
        })
        .catch(error => {
          console.log("ERROR: ", error);
          showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
        })
    })
    .catch(error => {
      console.log("ERROR: ", error);
      showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
    });
}

function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.clear();
  updateMenu();
  switchPage(false, initPageIdx, "index");
}

function changePW() {
  switchPage(false, 2, "profile");
}

/* OVERLAY AND MODAL WINDOWS **************/
function showOverlay(typeMsg, msgStt, msgCode, msgTitle, msgDetail) {
  let overlayMenu = document.querySelector(".overlay-menu");
  overlayMenu.classList.remove("hide");
  overlayMenu.classList.add("show");
  let overlay = document.querySelector(".overlay");
  showModal(MDL[typeMsg], msgStt, msgCode, msgTitle, msgDetail);
  overlay.classList.remove("hide");
  overlay.classList.add("show");
}

function showModal(typemsg, msgstatus, msgcode, msgtitle, msgdetail) {
  let modal = document.querySelector(".modal");
  let info = document.querySelector("#infotype");
  let idtype = document.querySelector("#idtype");
  idtype.textContent = typemsg.title;
  info.classList.add(typemsg.class);
  let msgstt = document.querySelector("#msgStt");
  msgstt.textContent = msgstatus;
  let msgcod = document.querySelector("#msgCod");
  msgcod.textContent = msgcode;
  let msgtit = document.querySelector("#msgTit");
  msgtit.textContent = msgtitle;
  let msgdet = document.querySelector("#msgDet");
  msgdet.textContent = msgdetail;
  modal.classList.remove("off");
  modal.classList.remove("offout");
  modal.classList.add("on");
}

function hideOverlay(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
    hideModal(e);
  } else {
    hideModal();
  }
  let overlayMenu = document.querySelector(".overlay-menu");
  overlayMenu.classList.remove("show");
  overlayMenu.classList.add("hide");
  let overlay = document.querySelector(".overlay");
  overlay.classList.remove("show");
  overlay.classList.add("hide");
}

function hideModal(e) {
  if (e) {
    e.preventDefault();
  }
  let modal = document.querySelector(".modal");
  modal.classList.remove("on");
  if (e) {
    modal.classList.remove("off");
    modal.classList.add("offout");
  } else {
    modal.classList.remove("offout");
    modal.classList.add("off");
  }
}

/* SWITCH PAGES ******************/
function switchPage(e, pageIdx, fakeURL) {
  let data = "";
  if (e) {
    data = e.target.getAttribute('data-name');
  } else {
    data = fakeURL;
  }
  let url = data + ".html";
  // history.replaceState(null, null, url);
  for (let i = 0; i < pages.length; i++) {
    pages[i].className = "pages hide";
    if (i == pageIdx) {
      pages[i].classList.remove("hide");
    }
  }

}

function updateMenu() {
  document.querySelector(".submenu").classList.toggle("hide");
  document.querySelector("#mn-admin").classList.toggle("hide");
  document.querySelector("#mn-admin-si").classList.toggle("hide");
  document.querySelector("#mn-chgpwd").addEventListener('click', changePW);
}