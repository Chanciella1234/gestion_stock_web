function afficherEtoiles(note, max) {
  if (!max) max = 5;
  let html = '';
  for (let i = 1; i <= max; i++) {
    html += '<i class="fas fa-star" style="color:' + (i <= note ? '#d29922' : '#30363d') + '"></i>';
  }
  return html;
}
