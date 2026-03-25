/**
 * SMS Providers Configuration for Kyrgyzstan
 * 
 * This file contains information about SMS gateway providers
 * commonly used in Kyrgyzstan for OTP verification.
 */

export interface SMSProvider {
  name: string;
  description: string;
  website: string;
  supportedCountries: string[];
  features: string[];
  pricing?: string;
}

/**
 * List of recommended SMS providers for Kyrgyzstan market
 */
export const kyrgyzstanSMSProviders: SMSProvider[] = [
  {
    name: 'Twilio',
    description: 'Global SMS API with Kyrgyzstan support',
    website: 'https://www.twilio.com',
    supportedCountries: ['KG', 'Global'],
    features: [
      'Programmable SMS',
      'Voice calls',
      'Verify API for OTP',
      'Number lookup',
      'High deliverability'
    ],
    pricing: 'Pay-as-you-go (~$0.07 per SMS to KG)'
  },
  {
    name: 'MessageBird',
    description: 'Cloud communications platform',
    website: 'https://www.messagebird.com',
    supportedCountries: ['KG', 'Global'],
    features: [
      'SMS API',
      'Verify API',
      'Voice',
      'WhatsApp Business',
      'Number masking'
    ],
    pricing: 'Pay-as-you-go (~$0.06 per SMS to KG)'
  },
  {
    name: 'Vonage (Nexmo)',
    description: 'Communications API platform',
    website: 'https://www.vonage.com',
    supportedCountries: ['KG', 'Global'],
    features: [
      'SMS API',
      'Verify API',
      'Voice API',
      'Number Insight',
      'Conversion tracking'
    ],
    pricing: 'Pay-as-you-go (~$0.05 per SMS to KG)'
  },
  {
    name: 'SMSC.kg',
    description: 'Local Kyrgyzstan SMS gateway',
    website: 'https://smsc.kg',
    supportedCountries: ['KG'],
    features: [
      'Direct local carrier connections',
      'High delivery rate in KG',
      'Cyrillic support',
      'Lower latency',
      'Local support'
    ],
    pricing: 'Contact for pricing'
  },
  {
    name: 'SMS.ru',
    description: 'CIS-focused SMS platform',
    website: 'https://sms.ru',
    supportedCountries: ['KG', 'RU', 'KZ', 'UZ', 'TJ'],
    features: [
      'Regional coverage',
      'Cyrillic support',
      'HLR lookup',
      'Voice messages',
      'Russian interface'
    ],
    pricing: 'Pay-as-you-go'
  },
  {
    name: 'SMSINT',
    description: 'International SMS gateway with Central Asia coverage',
    website: 'https://smsint.ru',
    supportedCountries: ['KG', 'Central Asia'],
    features: [
      'Central Asia focus',
      'Multiple languages',
      'OTP templates',
      'Analytics',
      'API & SMPP'
    ],
    pricing: 'Contact for pricing'
  }
];

/**
 * Mobile operators in Kyrgyzstan
 */
export const kyrgyzstanOperators = [
  {
    name: 'Beeline (Sky Mobile)',
    code: ['700', '770', '771', '772', '773', '774', '775', '776', '777', '778'],
    mnc: '01'
  },
  {
    name: 'O! (MegaCom)',
    code: ['550', '551', '552', '553', '554', '555', '556', '557', '558', '559'],
    mnc: '05'
  },
  {
    name: 'NUR Telecom (Alfa Telecom)',
    code: ['500', '501', '502', '503', '504', '505', '506', '507', '508', '509'],
    mnc: '09'
  }
];

/**
 * Phone number validation for Kyrgyzstan
 */
export const validateKyrgyzstanPhone = (phone: string): {
  valid: boolean;
  formatted?: string;
  operator?: string;
  error?: string;
} => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if starts with country code
  if (!digits.startsWith('996')) {
    return {
      valid: false,
      error: 'Phone number must start with +996'
    };
  }
  
  // Check total length (996 + 9 digits = 12)
  if (digits.length !== 12) {
    return {
      valid: false,
      error: 'Phone number must be 9 digits after +996'
    };
  }
  
  // Extract the operator prefix
  const operatorPrefix = digits.substring(4, 7);
  
  // Find operator
  let operator = 'Unknown';
  for (const op of kyrgyzstanOperators) {
    if (op.code.includes(operatorPrefix)) {
      operator = op.name;
      break;
    }
  }
  
  // Format as +996 XXX XXX XXX
  const formatted = `+996 ${digits.substring(4, 7)} ${digits.substring(7, 10)} ${digits.substring(10, 12)}`;
  
  return {
    valid: true,
    formatted,
    operator
  };
};

/**
 * Format phone number for display
 */
export const formatKyrgyzstanPhone = (phone: string): string => {
  const result = validateKyrgyzstanPhone(phone);
  return result.formatted || phone;
};

/**
 * Sample OTP configuration for production
 */
export const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 5,
  resendCooldownSeconds: 60,
  maxAttempts: 3,
  
  // SMS Template (multilingual)
  templates: {
    en: (code: string, appName: string) => 
      `Your ${appName} verification code is: ${code}. Valid for 5 minutes.`,
    
    ru: (code: string, appName: string) => 
      `Ваш код подтверждения ${appName}: ${code}. Действителен 5 минут.`,
    
    ky: (code: string, appName: string) => 
      `Сиздин ${appName} ырастоо кодуңуз: ${code}. 5 мүнөткө жарактуу.`,
  },
  
  // Provider recommendation
  recommendedProvider: 'Twilio', // or SMSC.kg for local
};

/**
 * Demo OTP for testing (remove in production!)
 */
export const DEMO_OTP = '123456';
export const isDemoMode = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Example integration code for Twilio
 */
export const twilioIntegrationExample = `
// Install: npm install twilio

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendOTP(phoneNumber: string, code: string) {
  try {
    const message = await client.messages.create({
      body: \`Your eChefs verification code is: \${code}. Valid for 5 minutes.\`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber // Format: +996XXXXXXXXX
    });
    
    console.log('SMS sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error };
  }
}
`;

/**
 * Example integration code for local provider (SMSC.kg)
 */
export const smscKgIntegrationExample = `
// Example for SMSC.kg integration

async function sendOTP(phoneNumber: string, code: string) {
  const API_URL = 'https://smsc.kg/sys/send.php';
  const params = new URLSearchParams({
    login: process.env.SMSC_LOGIN || '',
    psw: process.env.SMSC_PASSWORD || '',
    phones: phoneNumber.replace('+', ''), // Remove + sign
    mes: \`Ваш код: \${code}. Действителен 5 минут.\`,
    charset: 'utf-8',
    fmt: '3' // JSON response
  });
  
  try {
    const response = await fetch(\`\${API_URL}?\${params}\`);
    const data = await response.json();
    
    if (data.error_code) {
      throw new Error(data.error);
    }
    
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error };
  }
}
`;
