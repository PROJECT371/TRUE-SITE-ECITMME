import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Already installed as PWA?
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (standalone) return;

    // Já dispensou antes?
    if (localStorage.getItem('ecit_install_dismissed')) return;

    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua);

    if (iOS) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShow(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
    setDeferredPrompt(null);
  }

  function dismiss() {
    setShow(false);
    localStorage.setItem('ecit_install_dismissed', '1');
  }

  if (!show || installed) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-icon">📱</div>
      <div className="install-banner-text">
        <strong>Instalar o App</strong>
        {isIOS ? (
          <span>Toque em Compartilhar 􀈂 e depois em "Adicionar à Tela de Início"</span>
        ) : (
          <span>Acesse o portal direto da tela inicial do celular</span>
        )}
      </div>
      {!isIOS && <button className="install-btn" onClick={install}>Instalar</button>}
      <button className="install-close" onClick={dismiss}>✕</button>
    </div>
  );
}
