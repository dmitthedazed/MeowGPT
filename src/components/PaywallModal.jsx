import React, { useState } from "react";
import { FiX, FiZap, FiCheck, FiCreditCard, FiLock, FiStar } from "react-icons/fi";
import { useTranslation } from "../translations";

const PaywallModal = ({ isOpen, onClose, onUpgradeSuccess, language }) => {
  const { t } = useTranslation(language);
  const [step, setStep] = useState("plan"); // plan -> pay -> success
  const [loadingText, setLoadingText] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("•••");
  const [cardName, setCardName] = useState("Alex Meowson");

  if (!isOpen) return null;

  const handleChoosePlan = () => {
    setStep("pay");
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep("loading");

    const loadingStages = [
      "Verifying feline credentials...",
      "Connecting to MeowBank secure vault...",
      "Authenticating purchase with catnip index...",
      "Applying premium purr privileges...",
    ];

    let stageIdx = 0;
    setLoadingText(loadingStages[0]);

    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < loadingStages.length) {
        setLoadingText(loadingStages[stageIdx]);
      } else {
        clearInterval(interval);
        setStep("success");
        onUpgradeSuccess();
      }
    }, 1200);
  };

  // Localized lists of perks
  const perks = [
    {
      title: language === "ru" ? "Турбо-скорость" : language === "uk" ? "Турбо-швидкість" : "Turbo Speed",
      desc: language === "ru" ? "В 10 раз более быстрые мяу-ответы" : language === "uk" ? "В 10 разів швидші няв-відповіді" : "10x faster meow responses",
    },
    {
      title: language === "ru" ? "Умный Мяу Ультра" : language === "uk" ? "Розумний Няв Ультра" : "Smart Meow Ultra",
      desc: language === "ru" ? "Доступ к продвинутому кошачьему разуму" : language === "uk" ? "Доступ до прогресивного котячого інтелекту" : "Access to advanced feline intelligence",
    },
    {
      title: language === "ru" ? "Кошачий Арт" : language === "uk" ? "Котячий Арт" : "Feline Art Priority",
      desc: language === "ru" ? "Создание картинок в HD кошачьем формате" : language === "uk" ? "Створення картинок в HD котячому форматі" : "Priority HD image generation",
    },
    {
      title: language === "ru" ? "Премиум Мурчание" : language === "uk" ? "Преміум Муркотіння" : "Premium Purr Modes",
      desc: language === "ru" ? "Высококачественные голосовые мурчащие режимы" : language === "uk" ? "Високоякісні голосові муркотливі режими" : "High-fidelity voice purring modes",
    },
  ];

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <button className="paywall-close-btn" onClick={onClose} title={t("close") || "Close"}>
          <FiX size={20} />
        </button>

        {step === "plan" && (
          <div className="paywall-content animate-fade-in">
            <div className="paywall-header">
              <div className="premium-badge">
                <FiZap size={14} />
                <span>PLUS</span>
              </div>
              <h2>MeowGPT Plus</h2>
              <p className="paywall-subtitle">
                {language === "ru" 
                  ? "Раскройте абсолютный кошачий интеллект без ограничений" 
                  : language === "uk" 
                  ? "Розкрийте абсолютний котячий інтелект без обмежень" 
                  : "Unleash the ultimate feline intelligence without restrictions"}
              </p>
            </div>

            <div className="paywall-perks">
              {perks.map((perk, i) => (
                <div key={i} className="perk-item">
                  <div className="perk-icon">
                    <FiCheck size={16} />
                  </div>
                  <div className="perk-info">
                    <div className="perk-title">{perk.title}</div>
                    <div className="perk-desc">{perk.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="plans-comparison">
              <div className="plan-card">
                <div className="plan-name">Free</div>
                <div className="plan-price">$0</div>
                <div className="plan-features">
                  <div>Standard speed meows</div>
                  <div>5 meows / 5s rate limit</div>
                </div>
                <button className="plan-btn disabled" disabled>
                  {language === "ru" ? "Ваш текущий тариф" : language === "uk" ? "Ваш поточний тариф" : "Current Plan"}
                </button>
              </div>

              <div className="plan-card plan-card--plus">
                <div className="plan-tag">Popular</div>
                <div className="plan-name">Meow Plus</div>
                <div className="plan-price">$9.99<span className="price-period">/mo</span></div>
                <div className="plan-features">
                  <div>⚡ Turbo-charged speed</div>
                  <div>👑 Smart Meow Ultra model</div>
                  <div>🎨 Priority HD Cat Art</div>
                  <div>🎙️ VIP Premium Purring voice</div>
                </div>
                <button className="plan-btn plan-btn--plus" onClick={handleChoosePlan}>
                  {language === "ru" ? "Выбрать Meow Plus" : language === "uk" ? "Обрати Meow Plus" : "Upgrade to Plus"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "pay" && (
          <form className="paywall-content animate-fade-in" onSubmit={handlePaymentSubmit}>
            <div className="paywall-header">
              <h2>{language === "ru" ? "Оплата подписки" : language === "uk" ? "Оплата підписки" : "Secure Payment"}</h2>
              <p className="paywall-subtitle">
                {language === "ru"
                  ? "Премиум-доступ активируется моментально"
                  : language === "uk"
                  ? "Преміум-доступ активується миттєво"
                  : "Start your Meow Plus subscription today"}
              </p>
            </div>

            <div className="checkout-summary">
              <div className="summary-row">
                <span>MeowGPT Plus Monthly</span>
                <span>$9.99</span>
              </div>
              <div className="summary-row summary-row--total">
                <span>{language === "ru" ? "Итого к оплате" : language === "uk" ? "Всього до сплати" : "Total Due"}</span>
                <span>$9.99</span>
              </div>
            </div>

            <div className="credit-card-form">
              <div className="form-group">
                <label>{language === "ru" ? "Владелец карты" : language === "uk" ? "Власник карти" : "Cardholder Name"}</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="card-input"
                />
              </div>

              <div className="form-group">
                <label>{language === "ru" ? "Номер карты" : language === "uk" ? "Номер карти" : "Card Number"}</label>
                <div className="card-input-wrapper">
                  <FiCreditCard className="card-input-icon" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="card-input card-input--with-icon"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{language === "ru" ? "Срок действия" : language === "uk" ? "Термін дії" : "Expiry"}</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="card-input"
                  />
                </div>

                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="card-input"
                  />
                </div>
              </div>

              <div className="payment-security-note">
                <FiLock size={12} />
                <span>
                  {language === "ru"
                    ? "Все транзакции зашифрованы кошачьим блокчейном"
                    : language === "uk"
                    ? "Усі транзакції зашифровані котячим блокчейном"
                    : "Payments are encrypted and secured with Feline SSL"}
                </span>
              </div>

              <button type="submit" className="plan-btn plan-btn--plus plan-btn--pay-submit">
                {language === "ru" ? "Оплатить $9.99" : language === "uk" ? "Сплатити $9.99" : "Pay $9.99"}
              </button>
            </div>
          </form>
        )}

        {step === "loading" && (
          <div className="paywall-content paywall-content--loading animate-fade-in">
            <div className="paywall-spinner-wrapper">
              <div className="paywall-spinner"></div>
              <FiZap className="spinner-icon-overlay" size={24} />
            </div>
            <h3>{language === "ru" ? "Обработка платежа..." : language === "uk" ? "Обробка платежу..." : "Processing..."}</h3>
            <p className="loading-status-text">{loadingText}</p>
          </div>
        )}

        {step === "success" && (
          <div className="paywall-content paywall-content--success animate-fade-in">
            <div className="success-sparkle-wrapper">
              <div className="success-badge-glow"></div>
              <div className="success-badge">
                <FiStar size={40} />
              </div>
            </div>
            <h2>
              {language === "ru"
                ? "Ура! Вы перешли на Plus! 🐱✨"
                : language === "uk"
                ? "Ура! Ви перейшли на Plus! 🐱✨"
                : "Welcome to Meow Plus! 🐱✨"}
            </h2>
            <p className="paywall-subtitle">
              {language === "ru"
                ? "Ваш статус обновлен. Теперь вам доступны все премиум-возможности без ограничений!"
                : language === "uk"
                ? "Ваш статус оновлено. Тепер вам доступні всі преміум-можливості без обмежень!"
                : "Your account is upgraded! Enjoy ultra-fast speeds and smart feline intelligence."}
            </p>
            <button className="plan-btn plan-btn--plus" onClick={onClose}>
              {language === "ru" ? "Начать использование" : language === "uk" ? "Почати використання" : "Let's Go!"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaywallModal;
