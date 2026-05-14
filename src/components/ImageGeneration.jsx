import React, { useRef, useEffect, useState } from "react";
import {
  FiImage,
  FiDownload,
  FiTrash2,
  FiMenu,
  FiSend,
  FiZap,
} from "react-icons/fi";
import { useTranslation } from "../translations";

const REVEAL_DELAY_MS = 5000;

const ImageGeneration = ({
  language,
  imagePrompt,
  setImagePrompt,
  generatedImages,
  isGeneratingImages,
  onGenerateImage,
  imageGallery,
  setImageGallery,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const { t } = useTranslation(language);
  const textareaRef = useRef(null);

  // revealedImage: the image currently shown (delayed by REVEAL_DELAY_MS after generation)
  const [revealedImage, setRevealedImage] = useState(null);
  // isWaiting: generation done but delay not elapsed yet → keep skeleton
  const [isWaiting, setIsWaiting] = useState(false);
  // countdown seconds for the skeleton label
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  // Watch for new generated image → start delay
  useEffect(() => {
    const latest = generatedImages[0] ?? null;
    if (!latest) return;
    // same image already revealed → skip
    if (revealedImage && revealedImage.id === latest.id) return;

    // Clear any previous timers
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);

    setIsWaiting(true);
    setCountdown(Math.round(REVEAL_DELAY_MS / 1000));

    // Tick countdown each second
    let remaining = Math.round(REVEAL_DELAY_MS / 1000);
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) clearInterval(countdownRef.current);
    }, 1000);

    timerRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
      setIsWaiting(false);
      setRevealedImage(latest);
    }, REVEAL_DELAY_MS);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedImages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [imagePrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePrompt.trim() || isGeneratingImages || isWaiting) return;
    onGenerateImage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDownloadImage = (imageUrl, index) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `meowgpt-image-${index + 1}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearGallery = () => {
    if (window.confirm("Clear all generated images?")) {
      setImageGallery([]);
      setRevealedImage(null);
    }
  };

  const showSkeleton = isGeneratingImages || isWaiting;

  return (
    <div className="img-gen-root">
      {/* Top bar */}
      <header className="img-gen-header">
        <div className="img-gen-header-left">
          <button
            className="hamburger-menu mobile-only"
            onClick={onToggleSidebar}
            title="Toggle menu"
          >
            <FiMenu size={20} />
          </button>
          <span className="img-gen-title-icon"><FiZap size={20} /></span>
          <h1 className="img-gen-title">{t("imageGenerationTitle")}</h1>
        </div>
        {imageGallery.length > 0 && (
          <button className="img-gen-clear-btn" onClick={handleClearGallery}>
            <FiTrash2 size={15} />
            <span>{t("clearGallery")}</span>
          </button>
        )}
      </header>

      {/* Scrollable body */}
      <div className="img-gen-body">

        {/* Result area */}
        <div className="img-gen-result-area">
          {showSkeleton ? (
            <div className={`img-gen-skeleton${isWaiting ? " waiting" : ""}`}>
              <div className="img-gen-skeleton-shimmer" />
              {isWaiting ? (
                <div className="img-gen-skeleton-reveal-label">
                  <div className="img-gen-reveal-ring">
                    <svg viewBox="0 0 44 44" className="img-gen-reveal-svg">
                      <circle cx="22" cy="22" r="18" className="img-gen-reveal-track" />
                      <circle cx="22" cy="22" r="18" className="img-gen-reveal-progress"
                        style={{ "--progress": `${((REVEAL_DELAY_MS / 1000 - countdown) / (REVEAL_DELAY_MS / 1000)) * 113}px` }}
                      />
                    </svg>
                    <span className="img-gen-reveal-countdown">{countdown}</span>
                  </div>
                  <span className="img-gen-reveal-text">Preparing your image…</span>
                </div>
              ) : (
                <p className="img-gen-skeleton-label">{t("generatingImages")}</p>
              )}
            </div>
          ) : revealedImage ? (
            <div className="img-gen-result-card img-gen-result-card--animate">
              <div className="img-gen-reveal-overlay" />
              <img
                src={revealedImage.url}
                alt="Generated"
                className="img-gen-result-img"
              />
              <div className="img-gen-result-footer">
                <p className="img-gen-result-prompt">{revealedImage.prompt}</p>
                <button
                  className="img-gen-download-btn"
                  onClick={() => handleDownloadImage(revealedImage.url, 0)}
                  title={t("downloadImage")}
                >
                  <FiDownload size={16} />
                  <span>{t("downloadImage")}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="img-gen-empty">
              <div className="img-gen-empty-icon">
                <FiImage size={40} />
              </div>
              <p className="img-gen-empty-title">{t("galleryEmpty")}</p>
              <p className="img-gen-empty-sub">{t("imageGenerationEmptyState")}</p>
            </div>
          )}
        </div>

        {/* Gallery — only past images, below the main result */}
        {(() => {
          const pastImages = imageGallery.filter(
            (img) => img.id !== (generatedImages[0]?.id)
          );
          if (pastImages.length === 0) return null;
          return (
            <div className="img-gen-gallery">
              <div className="img-gen-gallery-header">
                <span className="img-gen-gallery-title">{t("galleryTitle")}</span>
                <span className="img-gen-gallery-count">{pastImages.length}</span>
              </div>
              <div className="img-gen-grid">
                {pastImages.map((image, index) => (
                  <div key={image.id} className="img-gen-card">
                    <div className="img-gen-card-img-wrap">
                      <img
                        src={image.url}
                        alt={`Generated ${index + 1}`}
                        className="img-gen-card-img"
                      />
                      <div className="img-gen-card-overlay">
                        <button
                          className="img-gen-card-dl-btn"
                          onClick={() => handleDownloadImage(image.url, index)}
                          title={t("downloadImage")}
                        >
                          <FiDownload size={15} />
                        </button>
                      </div>
                    </div>
                    <p className="img-gen-card-prompt">
                      {image.prompt.length > 80
                        ? image.prompt.substring(0, 80) + "…"
                        : image.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Prompt input bar — fixed at bottom */}
      <form className="img-gen-input-bar" onSubmit={handleSubmit}>
        <div className="img-gen-input-wrap">
          <textarea
            ref={textareaRef}
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("imagePromptPlaceholder")}
            className="img-gen-textarea"
            rows={1}
            disabled={isGeneratingImages || isWaiting}
          />
          <button
            type="submit"
            className={`img-gen-send-btn${(isGeneratingImages || isWaiting) ? " loading" : ""}`}
            disabled={!imagePrompt.trim() || isGeneratingImages || isWaiting}
            title={t("generateImages")}
          >
            {(isGeneratingImages || isWaiting) ? (
              <span className="img-gen-spinner" />
            ) : (
              <FiSend size={18} />
            )}
          </button>
        </div>
        <p className="img-gen-hint">Enter ↵ to generate · Shift+Enter for new line</p>
      </form>
    </div>
  );
};

export default ImageGeneration;
