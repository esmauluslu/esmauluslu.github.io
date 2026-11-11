/*
 * Bridge between an episode page and the course shell (index.html).
 * Inside the shell, every call goes to window.parent.SHELL, which owns the single SCORM session.
 * Opened on its own (for review or testing), the episode keeps its state in this browser only.
 */
(function () {
  let shell = null;
  try { if (window.parent !== window && window.parent.SHELL) shell = window.parent.SHELL; } catch (e) { shell = null; }
  if (shell) document.documentElement.classList.add('embed');

  const KEY = 'dfdl-supermarkt-local';
  function local() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function saveLocal(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  const PORTRAITS = {
    Mira: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="40" fill="#F9CCC6"/><path d="M18 80c0-16 10-26 22-26s22 10 22 26z" fill="#7B4FA8"/><circle cx="40" cy="36" r="16" fill="#D9A27E"/><path d="M24 36c-1-14 8-20 16-20s17 6 16 20c-4-8-10-11-16-11s-12 3-16 11z" fill="#2E1E16"/><circle cx="40" cy="15" r="7" fill="#2E1E16"/><circle cx="34" cy="37" r="1.8" fill="#1D1F1E"/><circle cx="46" cy="37" r="1.8" fill="#1D1F1E"/><path d="M35 44q5 4 10 0" stroke="#8E4A3A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    Rahul: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="40" fill="#DAF6E0"/><path d="M18 80c0-16 10-26 22-26s22 10 22 26z" fill="#2C3E66"/><circle cx="40" cy="36" r="16" fill="#B07A55"/><path d="M24 33c0-12 8-17 16-17s16 5 16 17c-5-6-10-8-16-8s-11 2-16 8z" fill="#1A1414"/><path d="M27 41c2 11 8 14 13 14s11-3 13-14c-3 5-8 7-13 7s-10-2-13-7z" fill="#1A1414"/><circle cx="34" cy="36" r="1.8" fill="#1D1F1E"/><circle cx="46" cy="36" r="1.8" fill="#1D1F1E"/></svg>'
  };

  window.Bridge = {
    embedded: !!shell,
    getChar() { return shell ? shell.getChar() : (local().char || ''); },
    setChar(c) { if (shell) shell.setChar(c); else { const s = local(); s.char = c; saveLocal(s); } },
    getData(k) { return shell ? shell.getData(k) : local()[k]; },
    setData(k, v) { if (shell) shell.setData(k, v); else { const s = local(); s[k] = v; saveLocal(s); } },
    interaction(id, response, result) { if (shell) shell.interaction(id, response, result); },
    episodeDone(n) { if (shell) shell.episodeDone(n); else { const s = local(); s.done = Array.from(new Set([...(s.done || []), n])); saveLocal(s); } },
    openEpisode(n) { if (shell) shell.openEpisode(n); },
    backToMenu() { if (shell) shell.showMenu(); },
    lms() { try { return shell && shell.lmsStatus ? shell.lmsStatus() : null; } catch (e) { return null; } },
    // a real portrait (img/portrait_mira.jpg …) when it exists; the drawn avatar stays as fallback
    portrait(name) { return PORTRAITS[name] ? `<img class="portrait" src="img/portrait_${name.toLowerCase()}.jpg" alt="" onerror="this.remove()">` + PORTRAITS[name] : ''; }
  };
})();
