export default class LoadMoreBtn {
 static classes = {
  hidden: "hidden",
 }
 constructor({ selector, isHidden = false }) {
  this.button = this.getBtn(selector)
  isHidden && this.hideBtn();
 }

 getBtn(selector) {
  return document.querySelector(selector)
 }

 hideBtn() {
this.button.classList.add(LoadMoreBtn.classes.hidden)
 }

 showBtn() {
  this.button.classList.remove(LoadMoreBtn.classes.hidden)
 }

 disable() {
  this.button.disabled = true;
  this.button.textContent = "Loading...";
}

 enable() {
  this.button.disabled = false;
  this.button.textContent = "Load more";
 }
}