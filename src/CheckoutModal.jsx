import { useState, useRef, useEffect } from 'react';
import { MOCK_PLANS, validateMockCoupon, createMockSubscription } from './services/mockData';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, planKey = 'annual', onSuccess }) {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Review & Pay (Summary + Coupon + Billing), 4: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [billingName, setBillingName] = useState('');
  const [billingState, setBillingState] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [resendMsg, setResendMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  const otpInputsRef = useRef([]);

  const selectedPlan = MOCK_PLANS[planKey] || MOCK_PLANS.annual;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber('');
      setOtp(['', '', '', '', '', '']);
      setBillingName('');
      setBillingState('');
      setCouponCode('');
      setAppliedCoupon(null);
      setErrorMsg('');
      setCouponMsg(null);
      setIsProcessing(false);
      setResendCooldown(60);
      setResendMsg('');
    }
  }, [isOpen, planKey]);

  // Reset resend cooldown when step becomes 2
  useEffect(() => {
    if (step === 2) {
      setResendCooldown(60);
      setResendMsg('');
    }
  }, [step]);

  // Cooldown timer countdown interval
  useEffect(() => {
    let timer;
    if (step === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setResendMsg('');
    setStep(2);
  };

  // OTP Paste handler
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    setErrorMsg('');
    setResendMsg('');

    const nextIndex = Math.min(pastedData.length - 1, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  // OTP Input change helper (supports single digit replacement & SMS autofill)
  const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, '');
    
    // If browser SMS autofill inserts 5 or 6 digits at once
    if (digits.length >= 5) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      setErrorMsg('');
      setResendMsg('');
      const nextIndex = Math.min(digits.length - 1, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    // If last digit is already filled and extra number is typed, ignore overflow
    if (index === 5 && otp[5] && digits.length > 1) {
      return;
    }

    // Single digit input or replacing character in current input box
    const val = digits.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (errorMsg) setErrorMsg('');
    if (resendMsg) setResendMsg('');

    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
      return;
    }

    // Prevent extra typing when current box is already filled with a digit
    if (/^[0-9]$/.test(e.key)) {
      if (otp[index]) {
        e.preventDefault();
        // If last digit (index 5) is already filled, ignore extra keypresses
        if (index === 5) return;

        const newOtp = [...otp];
        newOtp[index] = e.key;
        setOtp(newOtp);
        if (errorMsg) setErrorMsg('');
        if (resendMsg) setResendMsg('');
        if (index < 5) {
          otpInputsRef.current[index + 1]?.focus();
        }
      }
    }
  };

  const handleResendOtp = (e) => {
    e.preventDefault();
    if (resendCooldown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setErrorMsg('');
    setResendMsg('New verification code sent successfully!');
    setResendCooldown(60);
    otpInputsRef.current[0]?.focus();
  };

  const handleChangeMobile = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResendMsg('');
    setOtp(['', '', '', '', '', '']);
    setStep(1);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const INDIAN_STATES = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setAppliedCoupon(null);
      setCouponMsg({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }
    const res = validateMockCoupon(couponCode);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setCouponMsg({ type: 'success', text: `Coupon applied: ${res.coupon.description}` });
    } else {
      setAppliedCoupon(null);
      setCouponMsg({ type: 'error', text: res.error });
    }
  };

  // Calculate pricing
  const basePrice = selectedPlan.price;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((basePrice * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = appliedCoupon.discountAmount;
    }
  }
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Step 3: Complete Payment (Validates Billing details first)
  const handlePayNow = () => {
    if (!billingName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!billingState) {
      setErrorMsg('Please select your state.');
      return;
    }
    setErrorMsg('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      createMockSubscription(planKey, phoneNumber);
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="checkout-close-btn"
          onClick={onClose}
          aria-label="Close checkout modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M0 0h2.857v2.857H0V0Zm5.714 5.714H2.857V2.857h2.857v2.857Zm2.857 2.857H5.714V5.714h2.857v2.857Zm2.858 0H8.57v2.858H5.714v2.857H2.857v2.857H0V20h2.857v-2.857h2.857v-2.857h2.857v-2.857h2.858v2.857h2.857v2.857h2.857V20H20v-2.857h-2.857v-2.857h-2.857v-2.857h-2.857V8.57Zm2.857-2.857v2.857h-2.857V5.714h2.857Zm2.857-2.857v2.857h-2.857V2.857h2.857Zm0 0V0H20v2.857h-2.857Z" />
          </svg>
        </button>

        {/* Step Indicator */}
        <div className="checkout-step-indicator">
          <div className={`checkout-step-dot ${step === 1 ? 'active' : 'completed'}`} />
          <div className={`checkout-step-dot ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} />
          <div className={`checkout-step-dot ${step === 3 ? 'active' : ''}`} />
        </div>

        {/* Step 1: Mobile Phone Number Input */}
        {step === 1 && (
          <div>
            <h2 className="checkout-title">Sign In to Subscribe</h2>
            <p className="checkout-subtitle">
              Enter your mobile number to receive a verification OTP and activate your subscription.
            </p>

            <div className="checkout-plan-summary">
              <div>
                <div className="checkout-plan-name">{selectedPlan.name}</div>
                <div className="checkout-plan-period">
                  {planKey === 'annual' || selectedPlan.period === 'year' ? 'Billed Annually' : 'Billed Monthly'}
                </div>
              </div>
              <div className="checkout-plan-price">{selectedPlan.priceDisplay}</div>
            </div>

            <form onSubmit={handleSendOtp}>
              <div className="checkout-phone-field-group">
                <label htmlFor="checkout-phone-input" className="checkout-label">Mobile Number</label>
                <div className="checkout-phone-input-container">
                  <span className="checkout-phone-prefix">+91</span>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    required
                    placeholder="98765 43210"
                    maxLength={10}
                    className="checkout-minimal-input"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      if (errorMsg) setErrorMsg('');
                    }}
                  />
                </div>
                {errorMsg && <div className="checkout-error-text">{errorMsg}</div>}
              </div>

              <button type="submit" className="checkout-primary-btn">
                Send OTP
              </button>
            </form>
          </div>
        )}

        {/* Step 2: 6-Digit OTP Entry */}
        {step === 2 && (
          <div>
            <h2 className="checkout-title">Enter Verification Code</h2>
            <p className="checkout-subtitle">
              Sent a 6-digit OTP code to <strong className="checkout-highlight-phone">+91 {phoneNumber}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp}>
              <div className="checkout-otp-row">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    className="checkout-otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              {errorMsg && <div className="checkout-error-text">{errorMsg}</div>}
              {resendMsg && <div className="checkout-success-text">{resendMsg}</div>}

              <button type="submit" className="checkout-primary-btn">
                Verify OTP
              </button>

              <div className="checkout-otp-actions-row">
                <button
                  type="button"
                  className="checkout-action-btn"
                  onClick={handleChangeMobile}
                >
                  Change mobile number
                </button>

                <button
                  type="button"
                  className="checkout-action-btn"
                  disabled={resendCooldown > 0}
                  onClick={handleResendOtp}
                >
                  {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review & Pay (Summary + Coupon + Billing Details) */}
        {step === 3 && (
          <div>
            <h2 className="checkout-title">Review &amp; Pay</h2>
            <p className="checkout-subtitle">
              Confirm your subscription details and billing information.
            </p>

            {/* Price breakdown */}
            <div className="checkout-breakdown-card">
              <div className="checkout-breakdown-row">
                <span>{selectedPlan.name}</span>
                <span>₹{basePrice}</span>
              </div>

              {appliedCoupon && (
                <div className="checkout-breakdown-row discount">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="checkout-breakdown-row tax">
                <span>Applicable Taxes</span>
                <span>₹0</span>
              </div>

              <div className="checkout-breakdown-divider" />

              <div className="checkout-breakdown-total">
                <span>Total Amount</span>
                <span>₹{finalPrice}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="checkout-field-group">
              <label htmlFor="checkout-coupon-input" className="checkout-label">Have a Coupon Code?</label>
              <div className="checkout-coupon-row">
                <input
                  id="checkout-coupon-input"
                  type="text"
                  placeholder="Try TEMPLE10"
                  className="checkout-minimal-coupon-input"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    if (couponMsg) setCouponMsg(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                />
                <button
                  type="button"
                  className="checkout-coupon-apply-btn"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <div className={couponMsg.type === 'success' ? 'checkout-success-text' : 'checkout-error-text'}>
                  {couponMsg.text}
                </div>
              )}
            </div>

            {/* Billing Details (Positioned Below Payment Info) */}
            <div className="checkout-billing-section">
              <div className="checkout-billing-fields">
                {/* Field 1: Billing Region (Static text, no input underline) */}
                <div className="checkout-billing-region-label">
                  Billing region: India
                </div>

                {/* Field 2: Name */}
                <div className="minimal-field-group">
                  <input
                    id="checkout-name-input"
                    name="name"
                    autoComplete="name"
                    type="text"
                    required
                    placeholder="Your Name *"
                    className="minimal-input"
                    value={billingName}
                    onChange={(e) => {
                      setBillingName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                  />
                </div>

                {/* Field 3: Select State (Default native options UI with clean single bottom line) */}
                <div className="minimal-field-group">
                  <div className="checkout-select-wrapper">
                    <select
                      id="checkout-state-select"
                      name="address-level1"
                      autoComplete="address-level1"
                      required
                      className="checkout-minimal-select"
                      value={billingState}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matchedState = INDIAN_STATES.find(
                          (st) => st.toLowerCase() === val.toLowerCase()
                        ) || val;
                        setBillingState(matchedState);
                        if (errorMsg) setErrorMsg('');
                      }}
                    >
                      <option value="" disabled hidden>
                        Select state *
                      </option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st} className="checkout-select-option">
                          {st}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="checkout-select-chevron"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <p className="checkout-billing-tip">
                    This account will be linked to your subscription
                  </p>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="checkout-error-text" style={{ marginBottom: '1.25rem' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              className="checkout-primary-btn"
              disabled={isProcessing}
              onClick={handlePayNow}
            >
              {isProcessing ? 'Processing' : `Pay ₹${finalPrice} with Razorpay`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
