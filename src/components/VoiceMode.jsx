import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useTranslation } from "../translations";

const MEOW_VARIANTS = [
  "meow", "meow meow", "mrrrow", "purrr", "mew", "MEOW", "meow?", "meow!",
  "mrow mrow", "*purrs*", "meeeow", "nya", "mraow", "prrrp", "meow meow meow",
  "*tail flick* meow", "...meow", "MEOWWW", "mrrp?", "purr purr",
];

export default function VoiceMode({ language, onSendMessage, onClose }) {
  const { t } = useTranslation(language);
  const [status, setStatus] = useState("listening");
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const closedRef = useRef(false);

  function playMeow(onEnd) {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const duration = 0.4 + Math.random() * 0.3;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "sawtooth";
      osc2.type = "sine";
      filter.type = "lowpass";
      filter.Q.value = 8;

      const startFreq = 600 + Math.random() * 200;
      const peakFreq = startFreq * 1.4;
      const endFreq = startFreq * 0.7;

      osc1.frequency.setValueAtTime(startFreq, now);
      osc1.frequency.linearRampToValueAtTime(peakFreq, now + duration * 0.3);
      osc1.frequency.linearRampToValueAtTime(endFreq, now + duration);

      osc2.frequency.setValueAtTime(startFreq * 2, now);
      osc2.frequency.linearRampToValueAtTime(peakFreq * 2, now + duration * 0.3);
      osc2.frequency.linearRampToValueAtTime(endFreq * 2, now + duration);

      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(2000, now + duration * 0.3);
      filter.frequency.linearRampToValueAtTime(600, now + duration);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.setValueAtTime(0.15, now + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);

      timerRef.current = setTimeout(() => {
        osc1.disconnect();
        osc2.disconnect();
        filter.disconnect();
        gain.disconnect();
        onEnd?.();
      }, (duration + 0.1) * 1000);
    } catch {
      onEnd?.();
    }
  }

  function startCycle() {
    if (closedRef.current) return;
    setStatus("listening");
    const listenDuration = 2500 + Math.random() * 2500;

    timerRef.current = setTimeout(() => {
      if (closedRef.current) return;
      setStatus("processing");

      timerRef.current = setTimeout(() => {
        if (closedRef.current) return;
        setStatus("speaking");

        const meow = MEOW_VARIANTS[Math.floor(Math.random() * MEOW_VARIANTS.length)];
        const userMsg = {
          id: Date.now(),
          content: "🎤 " + meow,
          sender: "user",
          timestamp: Date.now(),
        };
        onSendMessage(userMsg);

        playMeow(() => {
          timerRef.current = setTimeout(() => startCycle(), 600);
        });
      }, 700 + Math.random() * 400);
    }, listenDuration);
  }

  useEffect(() => {
    startCycle();
    return () => {
      closedRef.current = true;
      clearTimeout(timerRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  function handleClose() {
    closedRef.current = true;
    clearTimeout(timerRef.current);
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    onClose();
  }

  const statusText = {
    listening: t("voiceListening"),
    processing: t("voiceProcessing"),
    speaking: t("voiceSpeaking"),
  }[status] ?? t("voiceListening");

  return (
    <div
      className="voice-mode-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="voice-mode-modal">
        <div className={`voice-orb voice-orb--${status}`} />
        <p className="voice-status-text">{statusText}</p>
        <div className="voice-controls">
          <button className="voice-close-btn" onClick={handleClose} title={t("voiceClose")}>
            <FiX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
