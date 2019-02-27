export function addClickEvent(selector, fn) {
  const el = document.querySelector(selector);
  // prevent code sandbox to bind multiple times.
  el.removeEventListener("click", fn);
  el.addEventListener("click", fn);
}
