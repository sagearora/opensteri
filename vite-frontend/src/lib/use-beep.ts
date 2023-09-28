import { useCallback, useRef } from 'react';

interface UseBeepOptions {
  duration?: number;
}

const useBeep = ({ duration = 200 }: UseBeepOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
  };

  const playBeep = useCallback((frequency: 860|720) => {
    initAudioContext();

    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.5;

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, duration);
  }, [duration]);

  return playBeep;
};

export default useBeep;