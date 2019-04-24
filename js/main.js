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
//const BASE_URL = "http://mora0199.edumedia.ca";
const BASE_URL = "http://localhost:3030";
let pages = [];
let token = "";
let loggedUser = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  pages = document.querySelectorAll(".pages");
  // history.pushState(null, null, document.location);
  document.querySelector("#signinlnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    changePage(e, 0);
    document.querySelector("#inputEmailSI").focus();
  });
  document.querySelector("#signuplnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    changePage(e, 1);
    document.querySelector("#first_name").focus();
  });
  document.querySelector("#closebtn").addEventListener("click", hideOverlay);
  document.querySelector(".modal").addEventListener("transitionend", closeDrawer);
  document.querySelector("#submitSUP").addEventListener("click", signUp);
  document.querySelector("#submitSIN").addEventListener("click", signIn);
}

function closeDrawer() {
  setTimeout(hideOverlay, 5000);
}

function signIn() {
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
      return response.json();
    })
    .then(result => {
      token = result.data.token;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(token));
      let url = BASE_URL + "/auth/users/me";
      let headers = new Headers();
      headers.append('Content-Type', 'application/json;charset=UTF-8');
      headers.append('Authorization', 'Bearer ' + token);
      console.log('header token: ', token);
      console.log('header auth: ', headers);
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
            changePage(false, 2);
          } else {
            let code = "Code: " + result.errors[0].code,
              status = result.errors[0].status,
              title = result.errors[0].title,
              detail = result.errors[0].detail;
            showOverlay(TYPE_ERR, status, code, title, detail);
          };
        })
        .catch(error => {
          // let code = "Code: " + error.errors[0].code,
          //   status = error.errors[0].status,
          //   title = error.errors[0].title,
          //   detail = error.errors[0].detail;
          showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
          // showOverlay(TYPE_ERR, status, code, title, detail);
        })
    })
    .catch(error => {
      showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
    });
}

function signUp() {
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
      changePage(false, 0);
      document.querySelector("#inputEmailSI").focus();
    })
    .catch(error => {
      showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
    })
}

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

function changePage(e, page) {
  let data = "";
  if (e) {
    data = e.target.getAttribute('data-name');
  } else {
    data = "signin";
  }
  let url = data + ".html";
  // history.replaceState(data, null, url);
  for (let i = 0; i < pages.length; i++) {
    pages[i].className = "pages hide";
    if (i == page) {
      pages[i].classList.remove("hide");
    }
  }

}