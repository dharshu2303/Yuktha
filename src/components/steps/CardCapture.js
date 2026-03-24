"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import VoiceInput from "@/components/VoiceInput";

export default function CardCapture({ onNext }) {
  const { t } = useTranslation();
  const [cardImage, setCardImage] = useState(null);
  const [cardPreview, setCardPreview] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCardPreview(e.target.result);
      setCardImage(e.target.result); // base64
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e) => {
      const file = e.target.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  // --- Camera Logic ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      // Fallback to file picker if camera fails
      fileInputRef.current?.click();
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame onto the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the base64 image data (using JPEG for smaller size)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    
    setCardPreview(dataUrl);
    setCardImage(dataUrl);
    stopCamera();
  };

  const handleGenerate = () => {
    if (!cardImage && !voiceText.trim()) return;
    onNext({ cardImage, voiceText });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl animate-slide-up">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-heading text-text-primary">
            {t("step2Title")}
          </h2>
        </div>

        {/* Camera Modal/Overlay */}
        {isCameraActive && (
          <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-black rounded-2xl overflow-hidden border border-border/20 shadow-2xl">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera Overlays */}
              <div className="absolute inset-0 pointer-events-none border-4 border-accent/30 m-4 rounded-xl"></div>
              
              {/* Controls */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
                <button 
                  onClick={stopCamera}
                  className="px-4 py-2 text-white font-medium hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={captureImage}
                  className="w-16 h-16 rounded-full bg-white border-4 border-accent hover:scale-105 active:scale-95 transition-all outline-none ring-4 ring-black/50"
                  aria-label="Take photo"
                ></button>
                <div className="w-16"></div> {/* Spacer for centering */}
              </div>
            </div>
            <p className="text-white/70 mt-4 text-sm font-medium">Position the card within the frame</p>
          </div>
        )}

        {/* Upload Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Upload Card */}
          <Card
            className={`p-6 cursor-pointer transition-all duration-200 ${
              isDragOver ? "border-accent bg-accent/5" : ""
            }`}
            hover
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="upload-zone flex flex-col items-center justify-center py-8 border-0">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <span className="font-semibold text-text-primary text-sm">{t("uploadCard")}</span>
              <span className="text-xs text-text-secondary mt-1">{t("dragDropText")}</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </Card>

          {/* Camera */}
          <Card
            className="p-6 cursor-pointer"
            hover
            onClick={startCamera}
          >
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
              <span className="font-semibold text-text-primary text-sm">{t("useCamera")}</span>
            </div>
            {/* The hidden input is no longer used for the camera button itself, 
                as we use navigator.mediaDevices.getUserMedia now. */}
          </Card>
        </div>

        {/* Image Preview */}
        {cardPreview && !isCameraActive && (
          <Card className="mb-6 p-4 animate-fade-in">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={cardPreview}
                alt="Business card preview"
                className="w-full h-auto max-h-64 object-contain bg-background-alt rounded-xl"
              />
              <button
                onClick={() => {
                  setCardImage(null);
                  setCardPreview(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shadow-sm"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Card>
        )}

        {/* Voice Input */}
        <Card className="p-6 mb-6">
          <VoiceInput onTranscriptChange={setVoiceText} />
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            disabled={!cardImage && !voiceText.trim()}
            onClick={handleGenerate}
            className="w-full sm:w-auto text-base px-10 py-4"
          >
            {t("generateButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
