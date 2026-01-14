// ===============================
// LOGIN / USUÁRIOS (simples)
// - Sem backend (apenas navegador)
// - Usuários: localStorage
// - Sessão: sessionStorage
// ===============================

const USERS_KEY = "quartz_users_v1";
const AUTH_KEY  = "quartz_auth_v1";
const ROLE_KEY  = "quartz_role_v1"; // "admin" | "consulta"

function getUsers() {
  const padrao = [
    { user: "admin",   pass: "88032566", role: "admin" },
    { user: "usuario", pass: "quartz",   role: "consulta" }
  ];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(padrao));
      return padrao;
    }
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : padrao;
  } catch (e) {
    localStorage.setItem(USERS_KEY, JSON.stringify(padrao));
    return padrao;
  }
}

function showError(msg) {
  const el = document.getElementById("login-error");
  if (!el) return;
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
}

function setScreens(logged) {
  const loginScreen = document.getElementById("login-screen");
  const appScreen   = document.getElementById("app-screen");
  if (loginScreen) loginScreen.style.display = logged ? "none" : "block";
  if (appScreen)   appScreen.style.display   = logged ? "block" : "none";
}

function login() {
  const u = (document.getElementById("login-username")?.value || "").trim();
  const p = (document.getElementById("login-password")?.value || "").trim();

  const users = getUsers();
  const found = users.find(x => x.user === u && x.pass === p);

  if (found) {
    sessionStorage.setItem(ROLE_KEY, found.role);
    sessionStorage.setItem(AUTH_KEY, "ok");
    showError("");
    setScreens(true);
    if (typeof init === "function") init();
  } else {
    showError("Usuário ou senha inválidos");
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  location.reload();
}

window.addEventListener("load", () => {
  // sempre começar no login
  sessionStorage.removeItem(AUTH_KEY);
  setScreens(false);

  const btn = document.getElementById("login-btn");
  if (btn) btn.addEventListener("click", login);

  ["login-username", "login-password"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        login();
      }
    });
  });

  const out = document.getElementById("btn-logout");
  if (out) out.addEventListener("click", logout);
});
