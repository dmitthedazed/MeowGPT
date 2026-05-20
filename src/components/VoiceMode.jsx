import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useTranslation } from "../translations";

const LANG_MAP = {
  en: "en-US",
  ru: "ru-RU",
  uk: "uk-UA",
  sk: "sk-SK",
  pl: "pl-PL",
  sim: "en-US",
  meow: "ru-RU",
  twink: "en-US",
  brainrot: "en-US",
};

export default function VoiceMode({ language, currentChat, isTemporaryMode, onSendMessage, onClose }) {
  const { t } = useTranslation(language);
  const [status, setStatus] = useState("listening");

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const audioCtxRef = useRef(null);

  function playMeow() {
    isSpeakingRef.current = true;
    setStatus("speaking");
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

      setTimeout(() => {
        osc1.disconnect();
        osc2.disconnect();
        filter.disconnect();
        gain.disconnect();
        isSpeakingRef.current = false;
        startListening();
      }, (duration + 0.1) * 1000);
    } catch (e) {
      console.log("audio unavailable");
      isSpeakingRef.current = false;
      startListening();
    }
  }

  function startListening() {
    if (isSpeakingRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus('unsupported'); return; }
    const recognition = new SR();
    recognition.lang = LANG_MAP[language] || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) {
        startListening();
        return;
      }
      isSpeakingRef.current = true;
      setStatus("processing");
      const msg = { id: Date.now(), content: transcript, sender: "user", timestamp: Date.now() };
      onSendMessage(msg, { onAiResponse: playMeow });
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setStatus("error");
      } else if (event.error === "no-speech") {
        startListening();
      } else {
        if (!isSpeakingRef.current) startListening();
      }
    };

    recognition.onend = () => {
      if (!isSpeakingRef.current) {
        startListening();
      }
    };

    recognitionRef.current = recognition;
    setStatus("listening");
    recognition.start();
  }

  function handleClose() {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    isSpeakingRef.current = false;
    onClose();
  }

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("unsupported");
      return;
    }
    startListening();

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  const statusText = {
    listening: t("voiceListening"),
    processing: t("voiceProcessing"),
    speaking: t("voiceSpeaking"),
    error: t("voiceNotSupported"),
    unsupported: t("voiceNotSupported"),
  }[status];

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
