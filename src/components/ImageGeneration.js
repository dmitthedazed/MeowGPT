import React from "react";
import {
  FiImage,
  FiDownload,
  FiLoader,
  FiTrash2,
  FiMenu,
} from "react-icons/fi";
import { useTranslation } from "../translations";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateImage();
  };

  const handleDownloadImage = (imageUrl, index) => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearGallery = () => {
    if (
      window.confirm("Are you sure you want to clear all generated images?")
    ) {
      setImageGallery([]);
    }
  };

  return (
    <div className="image-generation-interface">
      <div className="image-generation-header">
        <div className="header-content">
          <button
            className="hamburger-menu mobile-only"
            onClick={onToggleSidebar}
            title="Toggle menu"
          >
            <FiMenu size={20} />
          </button>
          <FiImage size={24} />
          <h1>{t("imageGenerationTitle")}</h1>
        </div>
      </div>

      <div className="image-generation-content">
        <div className="image-prompt-section">
          <form onSubmit={handleSubmit}>
            <div className="prompt-input-container">
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder={t("imagePromptPlaceholder")}
                className="image-prompt-input"
                rows={3}
                disabled={isGeneratingImages}
              />
              <button
                type="submit"
                className="generate-btn"
                disabled={!imagePrompt.trim() || isGeneratingImages}
              >
                {isGeneratingImages ? (
                  <>
                    <FiLoader className="spinner" size={16} />
                    {t("generatingImages")}
                  </>
                ) : (
                  <>
                    <FiImage size={16} />
                    {t("generateImages")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="generated-images-section">
          {/* Current Generated Image Preview */}
          {generatedImages.length > 0 && (
            <div className="current-image-preview">
              <h3>Latest Generated Image</h3>
              <div className="current-image-preview-container">
                <img
                  src={generatedImages[0].url}
                  alt="Latest generated image"
                  className="current-generated-image-preview"
                />
                <div className="image-preview-info">
                  <div className="image-prompt-preview">
                    <strong>Prompt:</strong>{" "}
                    {generatedImages[0].prompt.length > 60
                      ? generatedImages[0].prompt.substring(0, 60) + "..."
                      : generatedImages[0].prompt}
                  </div>
                  <button
                    className="download-btn-preview"
                    onClick={() =>
                      handleDownloadImage(generatedImages[0].url, 0)
                    }
                    title={t("downloadImage")}
                  >
                    <FiDownload size={14} />
                    {t("downloadImage")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGeneratingImages && (
            <div className="generating-placeholder">
              <div className="generating-single">
                <div className="loading-spinner">
                  <FiLoader className="spinner" size={24} />
                </div>
                <p>{t("generatingImages")}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGeneratingImages &&
            generatedImages.length === 0 &&
            imagePrompt && (
              <div className="empty-state">
                <FiImage size={48} />
                <p>{t("imageGenerationEmptyState")}</p>
              </div>
            )}

          {/* Gallery Section */}
          {imageGallery.length > 0 && (
            <div className="gallery-section">
              <div className="gallery-header">
                <h3>
                  {t("galleryTitle")} ({imageGallery.length})
                </h3>
                <button
                  className="clear-gallery-btn"
                  onClick={handleClearGallery}
                  title={t("clearGallery")}
                >
                  <FiTrash2 size={16} />
                  {t("clearGallery")}
                </button>
              </div>
              <div className="gallery-grid">
                {imageGallery.map((image, index) => (
                  <div key={image.id} className="gallery-image-container">
                    <img
                      src={image.url}
                      alt={`Gallery image ${index + 1}`}
                      className="gallery-image"
                    />
                    <div className="gallery-image-overlay">
                      <button
                        className="gallery-download-btn"
                        onClick={() => handleDownloadImage(image.url, index)}
                        title={t("downloadImage")}
                      >
                        <FiDownload size={14} />
                      </button>
                    </div>
                    <div className="gallery-image-prompt">
                      {image.prompt.length > 50
                        ? image.prompt.substring(0, 50) + "..."
                        : image.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Empty State */}
          {imageGallery.length === 0 &&
            !isGeneratingImages &&
            generatedImages.length === 0 && (
              <div className="gallery-empty-state">
                <FiImage size={48} />
                <p>{t("galleryEmpty")}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;
