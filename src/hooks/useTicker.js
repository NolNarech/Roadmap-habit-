import { useEffect, useRef } from 'react';

/**
 * Calls `callback` about every `intervalMs` while `active` is true.
 *
 * It uses a tiny Web Worker for the heartbeat. Browsers slow normal timers a
 * lot (to about once a minute) in tabs you are not looking at, which would
 * make a study timer end late while you work in another window. Worker
 * timers are not slowed that way. If a Worker cannot be created, it falls
 * back to a normal setInterval.
 */
export function useTicker(callback, active, intervalMs = 250) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!active) return;
    let worker = null;
    let blobUrl = null;
    let fallbackId = null;

    const startFallback = () => {
      if (fallbackId === null) fallbackId = setInterval(() => callbackRef.current(), intervalMs);
    };

    try {
      blobUrl = URL.createObjectURL(new Blob([`setInterval(() => postMessage(0), ${intervalMs});`], { type: 'text/javascript' }));
      worker = new Worker(blobUrl);
      worker.onmessage = () => callbackRef.current();
      worker.onerror = () => {
        worker?.terminate();
        worker = null;
        startFallback();
      };
    } catch {
      startFallback();
    }

    return () => {
      worker?.terminate();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (fallbackId !== null) clearInterval(fallbackId);
    };
  }, [active, intervalMs]);
}
