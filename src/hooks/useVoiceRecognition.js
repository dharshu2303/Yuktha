"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function useVoiceRecognition(lang = "en-IN") {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // Sync state to ref for access in callbacks
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      
      // Magic fix for word doubling: continuous = false.
      // We will manually restart it onend.
      // This completely bypasses the browser's broken internal accumulator.
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event) => {
        let currentInterim = "";
        let currentFinal = "";

        // Because continuous=false, we only care about the single phrase
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        // Output interim to UI
        setInterimTranscript(currentInterim);

        // When a phrase is finalized, append it to the main transcript state
        if (currentFinal) {
          setTranscript((prev) => {
            const separator = (prev && !prev.endsWith(' ')) ? ' ' : '';
            return prev + separator + currentFinal.trim();
          });
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setInterimTranscript(""); // clear interim text
        
        // Auto-restart if we haven't stopped listening
        if (isListeningRef.current && recognitionRef.current) {
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignore "already started" errors
              }
            }
          }, 250); // slight delay avoids rapid loop crashes
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        // Prevent onend from auto-restarting
        isListeningRef.current = false;
        recognitionRef.current.abort();
      }
    };
  }, [lang]);

  // Update lang dynamically when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, [lang]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        setTranscript("");
        setInterimTranscript("");
        setIsListening(true);
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition:", e);
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      setIsListening(false); // Update state so onend knows to stop
      recognitionRef.current.stop();
    }
  }, []);

  const setTranscriptExternal = useCallback((newText) => {
    setTranscript(newText);
    setInterimTranscript("");
  }, []);

  return { 
    isListening, 
    transcript, 
    interimTranscript,
    startListening, 
    stopListening, 
    isSupported, 
    setTranscript: setTranscriptExternal 
  };
}
