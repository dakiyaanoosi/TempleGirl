/**
 * mockData.js — Centralized Mock Data & LocalStorage State Manager
 * Enables full frontend testing of Subscription, Phone OTP, Coupons,
 * and Subscription Management without requiring an active backend connection.
 */

const STORAGE_KEY_AUTH = 'tg_mock_user_auth';
const STORAGE_KEY_SUB = 'tg_mock_user_subscription';

// ─── Available Subscription Plans ───────────────────────────────────────────
export const MOCK_PLANS = {
  monthly: {
    id: 'plan_premium_monthly',
    name: 'Premium Monthly',
    price: 249,
    priceDisplay: '₹249',
    period: 'month',
    billingText: 'Billed every 30 days. Cancel anytime.',
    features: [
      'Full-length story audio (5–8 mins each)',
      'Temple Girl Radio 24/7 continuous streaming',
      'Sleep timer & uninterrupted audio',
      '100+ cultural & mythological audio stories',
      'Zero ads & child-safe audio experience',
    ]
  },
  annual: {
    id: 'plan_premium_annual',
    name: 'Premium Annual',
    price: 1999,
    originalPrice: 2988,
    priceDisplay: '₹1,999',
    savingsBadge: 'Save 33%',
    period: 'year',
    billingText: 'Billed once annually (equivalent to ~₹166/month).',
    features: [
      'Full-length story audio (5–8 mins each)',
      'Temple Girl Radio 24/7 continuous streaming',
      'Sleep timer & uninterrupted audio',
      '100+ cultural & mythological audio stories',
      'Zero ads & child-safe audio experience',
      'Exclusive early access to new releases',
    ]
  }
};

// ─── Valid Mock Coupon Codes ────────────────────────────────────────────────
export const MOCK_COUPONS = {
  'TEMPLE10': { discountPercent: 10, code: 'TEMPLE10', description: '10% OFF Special Discount' },
  'WELCOME20': { discountPercent: 20, code: 'WELCOME20', description: '20% OFF Welcome Bonus' },
  'FESTIVE500': { discountAmount: 500, code: 'FESTIVE500', description: '₹500 OFF Special Offer' }
};

/** Validates user coupon code input */
export function validateMockCoupon(code) {
  if (!code) return { valid: false, error: 'Please enter a coupon code.' };
  const normalized = code.trim().toUpperCase();
  if (MOCK_COUPONS[normalized]) {
    return { valid: true, coupon: MOCK_COUPONS[normalized] };
  }
  return { valid: false, error: 'Invalid coupon code. Try "TEMPLE10" or "WELCOME20".' };
}

// ─── Auth State Management ──────────────────────────────────────────────────
export function getMockUserAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setMockUserAuth(phone) {
  const authObj = {
    phoneNumber: phone,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authObj));
  return authObj;
}

export function clearMockUserAuth() {
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

// ─── Active Subscription Management ─────────────────────────────────────────
export function getMockUserSubscription() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUB);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Default initial active subscription for testing if user is signed in
  const auth = getMockUserAuth();
  if (auth) {
    return {
      status: 'ACTIVE', // 'ACTIVE' | 'CANCELLED'
      planId: 'plan_premium_annual',
      planName: 'Premium Annual Access',
      priceDisplay: '₹1,999 / year',
      billingCycle: 'annual',
      startDate: '2026-05-15',
      nextBillingDate: '2027-05-15',
      paymentMethod: 'Razorpay UPI (Auto-renewing)',
      autoRenew: true,
    };
  }
  return null;
}

export function createMockSubscription(planKey, phone) {
  setMockUserAuth(phone);
  const plan = MOCK_PLANS[planKey] || MOCK_PLANS.annual;
  const now = new Date();
  const nextYear = new Date(now.getFullYear() + (planKey === 'annual' ? 1 : 0), now.getMonth() + (planKey === 'monthly' ? 1 : 0), now.getDate());

  const subObj = {
    status: 'ACTIVE',
    planId: plan.id,
    planName: plan.name,
    priceDisplay: `${plan.priceDisplay} / ${plan.period}`,
    billingCycle: planKey,
    startDate: now.toISOString().split('T')[0],
    nextBillingDate: nextYear.toISOString().split('T')[0],
    paymentMethod: 'Razorpay UPI (Auto-renewing)',
    autoRenew: true,
  };

  localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(subObj));
  return subObj;
}

export function cancelMockSubscription() {
  const current = getMockUserSubscription();
  if (!current) return null;

  const updated = {
    ...current,
    status: 'CANCELLED',
    autoRenew: false,
    cancelledAt: new Date().toISOString().split('T')[0],
  };

  localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(updated));
  return updated;
}
