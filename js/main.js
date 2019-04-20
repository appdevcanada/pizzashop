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
let msgInfo = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
  document.querySelector("#logo").addEventListener("click", () => { showOverlay(TYPE_INFO, "just a test"); });
  document.querySelector("#closebtn").addEventListener("click", hideOverlay);
  document.querySelector(".modal").addEventListener("transitionend", closeDrawer);
}

function closeDrawer() {
  setTimeout(hideOverlay, 5000);
}

function showOverlay(typeMsg, msgInfo) {
  // e.preventDefault();
  let overlayMenu = document.querySelector(".overlay-menu");
  overlayMenu.classList.remove("hide");
  overlayMenu.classList.add("show");
  let overlay = document.querySelector(".overlay");
  showModal(MDL[typeMsg], msgInfo);
  overlay.classList.remove("hide");
  overlay.classList.add("show");
}

function showModal(typemsg, message) {
  // e.preventDefault();
  let modal = document.querySelector(".modal");
  let info = document.querySelector("#infotype");
  let idtype = document.querySelector("#idtype");
  idtype.textContent = typemsg.title;
  info.classList.add(typemsg.class);
  let msg = document.querySelector("#msgctt");
  msg.textContent = message;
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
