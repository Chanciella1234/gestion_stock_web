const API = '/api';

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    return null;
  }
}

function showToast(msg, type) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
  toast.innerHTML = '<i class="fas ' + icon + '"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function afficherLoader() {
  let loader = document.getElementById('loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'loader-overlay';
    loader.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';
    document.body.appendChild(loader);
  }
  loader.style.display = 'flex';
}

function masquerLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('mot_de_passe').value;
      const btn = document.getElementById('loginBtn');

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';

      try {
        const res = await fetch(API + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, mot_de_passe: password })
        });
        const data = await res.json();

        if (data.success) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data));
          const role = data.data.role;
          window.location.href = role === 'admin' ? '/views/admin/dashboard.html' : '/views/produits/catalogue.html';
        } else {
          const container = document.getElementById('alertMessage');
          if (container) container.innerHTML = '<div class="alert alert-danger">' + (data.message || 'Identifiants incorrects') + '</div>';
        }
      } catch (err) {
        const container = document.getElementById('alertMessage');
        if (container) container.innerHTML = '<div class="alert alert-danger">Erreur de connexion au serveur.</div>';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
      }
    });
  }
});
