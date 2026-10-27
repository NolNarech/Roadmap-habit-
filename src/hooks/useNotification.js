import { useCallback, useState, useEffect } from 'react';

/**
 * useNotification — wraps the browser Notification API so a session-complete
 * alert can pop up as a real OS notification (visible even if the tab is in
 * the background or minimized), separate from the in-page overlay + sound.
 *
 * Two hard browser limits, unavoidable — not a bug in this app:
 * 1. The person must explicitly grant permission (a browser security rule).
 * 2. The browser tab must still be open (even if backgrounded/minimized).
 *    If the tab is fully closed, no JavaScript is running, so nothing can fire.
 */
export function useNotification() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    if (typeof Notification === 'undefined') setPermission('unsupported');
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notify = useCallback((title, options) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const n = new Notification(title, { icon: '/favicon.svg', ...options });
    // Clicking the OS notification brings the tab back into focus.
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return n;
  }, []);

  return { permission, requestPermission, notify };
}
