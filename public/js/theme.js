(function () {
  const defaultTheme = document.currentScript && document.currentScript.getAttribute('data-default') || 'dark';
  var saved = localStorage.getItem('theme');
  if (!saved) saved = defaultTheme;
  document.documentElement.setAttribute('data-theme', saved);

  function appliquerTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    var icon = document.getElementById('floatingThemeIcon');
    if (icon) icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
  }

  function creerBoutonFloating() {
    if (document.getElementById('floatingThemeBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'floatingThemeBtn';
    btn.className = 'theme-floating-btn';
    btn.setAttribute('title', 'Changer le thème');
    var current = document.documentElement.getAttribute('data-theme');
    btn.innerHTML = '<i class="fas fa-' + (current === 'light' ? 'sun' : 'moon') + '" id="floatingThemeIcon"></i>';
    btn.addEventListener('click', function () {
      var curr = document.documentElement.getAttribute('data-theme');
      appliquerTheme(curr === 'light' ? 'dark' : 'light');
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', creerBoutonFloating);
  } else {
    creerBoutonFloating();
  }
})();

function alertAsync(message, type) {
  if (!type) type = 'info';
  return new Promise(function (resolve) {
    var overlay = document.createElement('div');
    overlay.className = 'alert-overlay';
    var iconMap = { info: 'fa-info-circle', warn: 'fa-exclamation-triangle', error: 'fa-times-circle', success: 'fa-check-circle' };
    overlay.innerHTML =
      '<div class="alert-box">' +
        '<div class="alert-icon ' + type + '"><i class="fas ' + (iconMap[type] || 'fa-info-circle') + '"></i></div>' +
        '<div class="alert-msg">' + message + '</div>' +
        '<div class="alert-actions">' +
          '<button class="btn btn-primary" id="alertOk">OK</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    document.getElementById('alertOk').focus();
    document.getElementById('alertOk').addEventListener('click', function () {
      overlay.remove();
      resolve();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.remove();
        resolve();
      }
    });
  });
}

function confirmAsync(message) {
  return new Promise(function (resolve) {
    var overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML =
      '<div class="confirm-box">' +
        '<div class="confirm-icon"><i class="fas fa-exclamation-triangle"></i></div>' +
        '<div class="confirm-msg">' + message + '</div>' +
        '<div class="confirm-actions">' +
          '<button class="btn btn-secondary" id="confirmNo">Annuler</button>' +
          '<button class="btn btn-danger" id="confirmYes">Confirmer</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    document.getElementById('confirmYes').focus();
    document.getElementById('confirmYes').addEventListener('click', function () {
      overlay.remove();
      resolve(true);
    });
    document.getElementById('confirmNo').addEventListener('click', function () {
      overlay.remove();
      resolve(false);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
  });
}