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
// const BASE_URL = "https://pizzashop.ca/api";
const BASE_URL = "file:///Users/luishmsouza/Documents/Code/MADD-9022/pizzashop";
let msgInfo = "";
let pages = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
  pages = document.querySelectorAll(".pages");
  // history.pushState(null, null, document.location);
  document.querySelector("#signinlnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    changePage(e, 0);
  });
  document.querySelector("#signuplnk").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    changePage(e, 1);
  });
  document.querySelector("#closebtn").addEventListener("click", hideOverlay);
  document.querySelector(".modal").addEventListener("transitionend", closeDrawer);
  document.querySelector("#submitSUP").addEventListener("click", signUp);
}

function closeDrawer() {
  setTimeout(hideOverlay, 5000);
}

function signUp() {
  fetch(BASE_URL + "/api/users")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // imageURL = data.images.secure_base_url;
    })
    .catch(function (error) {
      let status = 'Internal Server Error',
        code = 'Code: 500',
        title = 'Problem saving document to the database.',
        detail = "just a msg"
      showOverlay(TYPE_ERR, status, code, title, detail);
      // showOverlay(TYPE_ERR, error.status, error.code, error.title, error.detail);
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
  let data = e.target.getAttribute('data-name');
  console.log(data);
  let url = data + ".html";
  // history.replaceState(data, null, url);
  for (let i = 0; i < pages.length; i++) {
    pages[i].className = "pages hide";
    if (i == page) {
      pages[i].classList.remove("hide");
    }
  }
}