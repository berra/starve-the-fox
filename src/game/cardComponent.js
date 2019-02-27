export function CardPlaceholder() {
  return `<div class="card card--placeholder"></div>`;
}

export function Card({ suite, value, label }, className) {
  const color = suite === "♥︎" || suite === "♦︎" ? "red" : "black";
  return `
      <div style="
        --value: '${value}'; 
        --suite: '${suite}'; 
        --color: ${color};" 
        class="card ${className}">
        <span class="card__content">${suite}</span>
      </div>
    `;
}
