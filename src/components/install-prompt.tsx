
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e); // Store the event
      setShowInstallPrompt(true); // Show our custom UI
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the browser's install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // We've used the prompt, and can't use it again, so clear it
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Install Fundees App</h2>
            <p className="text-gray-600">Get the full Fundees experience. Add it to your home screen for quick and easy access.</p>
            <Button onClick={handleInstallClick} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Install
            </Button>
        </div>
    </div>
  );
}
