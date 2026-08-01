"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseVoiceRecordingOptions {
  onTranscript: (transcriptChunk: string) => void;
  lang?: string;
}

export function useVoiceRecording({
  onTranscript,
  lang = "en-IN",
}: UseVoiceRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimText("");
  }, []);

  const startRecording = useCallback(() => {
    setError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const msg =
        "Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.";
      setError(msg);
      alert(msg);
      return;
    }

    try {
      if (recognitionRef.current) {
        stopRecording();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsRecording(true);
        setInterimText("");
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += chunk + " ";
          } else {
            currentInterim += chunk;
          }
        }

        if (finalChunk.trim()) {
          onTranscript(finalChunk.trim());
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          const msg =
            "Microphone permission denied. Please allow microphone access in browser settings to record voice.";
          setError(msg);
          alert(msg);
        } else if (event.error !== "no-speech") {
          setError(`Voice recognition error: ${event.error}`);
        }
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText("");
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error("Failed to start voice recognition:", err);
      setIsRecording(false);
      setInterimText("");
      setError(err?.message || "Could not start microphone recording.");
    }
  }, [lang, onTranscript, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    interimText,
    error,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
