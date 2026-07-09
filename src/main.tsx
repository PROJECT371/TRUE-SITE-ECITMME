import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function mostrarErro(msg: string) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;inset:0;background:#1a2340;color:#fff;padding:20px;font-family:monospace;font-size:13px;white-space:pre-wrap;overflow:auto;z-index:99999;';
  div.textContent = '⚠️ ERRO NO SITE:\n\n' + msg;
  document.body.appendChild(div);
}

window.addEventListener('error', (e) => {
  mostrarErro((e.error && e.error.stack) || e.message || String(e));
});
window.addEventListener('unhandledrejection', (e) => {
  const r: any = e.reason;
  mostrarErro((r && r.stack) || (r && r.message) || String(r));
});

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (err: any) {
  mostrarErro((err && err.stack) || String(err));
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((err) => console.error('SW registration failed:', err));
  });
}
