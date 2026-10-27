import { useCallback, useEffect, useRef, useState } from 'react';
import { extractYouTubeId } from '../utils/youtube';

// Loads YouTube's official IFrame Player API once for the whole app.
let apiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => {
        apiPromise = null;
        reject(new Error('Could not load the YouTube player.'));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

const PLAYING = 1;
const BUFFERING = 3;

/**
 * Plays the break-music YouTube video through a small embedded player.
 *
 * Browsers only allow sound to start by itself on a page the person has
 * already clicked. So `prepare()` must be called from the Start button: it
 * creates the player (paused) during that click. Later, when the focus
 * session ends, `play()` can start the music with no click. If the browser
 * blocks it anyway, `status` becomes 'blocked' so the UI can show a
 * one-tap "Play music" button.
 *
 * status: 'idle' | 'playing' | 'blocked' | 'error'
 */
export function useBreakMusic({ url, enabled }) {
  const videoId = enabled ? extractYouTubeId(url) : null;
  const hostRef = useRef(null); // the element the player is mounted into
  const playerRef = useRef(null);
  const readyRef = useRef(false);
  const wantPlayRef = useRef(false);
  const checkTimerRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const startPlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    player.playVideo();
    // If nothing is playing a few seconds later, the browser blocked it.
    clearTimeout(checkTimerRef.current);
    checkTimerRef.current = setTimeout(() => {
      const state = playerRef.current?.getPlayerState?.();
      if (wantPlayRef.current && state !== PLAYING && state !== BUFFERING) setStatus('blocked');
    }, 3000);
  }, []);

  const prepare = useCallback(() => {
    if (!videoId || playerRef.current || !hostRef.current) return;
    const host = hostRef.current;
    loadYouTubeApi()
      .then((YT) => {
        if (playerRef.current || !host.isConnected) return;
        const target = document.createElement('div');
        host.appendChild(target);
        playerRef.current = new YT.Player(target, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: { autoplay: 0, controls: 1, loop: 1, playlist: videoId, playsinline: 1, rel: 0 },
          events: {
            onReady: () => {
              readyRef.current = true;
              if (wantPlayRef.current) startPlayback();
            },
            onStateChange: (e) => {
              if (e.data === PLAYING) {
                clearTimeout(checkTimerRef.current);
                setStatus('playing');
              } else if (e.data === 2 /* paused */ && !wantPlayRef.current) {
                setStatus('idle');
              }
            },
            onAutoplayBlocked: () => setStatus('blocked'),
            onError: () => setStatus('error'),
          },
        });
      })
      .catch(() => setStatus('error'));
  }, [videoId, startPlayback]);

  const play = useCallback(() => {
    wantPlayRef.current = true;
    setStatus((s) => (s === 'blocked' || s === 'error' ? 'idle' : s));
    if (!playerRef.current) prepare();
    else startPlayback();
  }, [prepare, startPlayback]);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    clearTimeout(checkTimerRef.current);
    if (readyRef.current) playerRef.current?.pauseVideo?.();
    setStatus('idle');
  }, []);

  const stop = useCallback(() => {
    wantPlayRef.current = false;
    clearTimeout(checkTimerRef.current);
    if (readyRef.current) {
      playerRef.current?.pauseVideo?.();
      playerRef.current?.seekTo?.(0, true);
    }
    setStatus('idle');
  }, []);

  // A different video (changed in Settings) needs a fresh player.
  useEffect(() => {
    const host = hostRef.current;
    return () => {
      clearTimeout(checkTimerRef.current);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      readyRef.current = false;
      if (host) host.replaceChildren();
    };
  }, [videoId]);

  return { hostRef, videoId, status, prepare, play, pause, stop };
}
