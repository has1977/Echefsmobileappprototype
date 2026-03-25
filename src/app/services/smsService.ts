import { OTP_CONFIG, DEMO_OTP, isDemoMode, validateKyrgyzstanPhone } from '../utils/smsProviders';

/**
 * SMS Service for OTP verification
 * Supports multiple SMS providers for Kyrgyzstan
 */

interface SendOTPResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface OTPRecord {
  code: string;
  expiryTime: number;
  attempts: number;
  createdAt: number;
}

export class SMSService {
  private otpStore: Map<string, OTPRecord> = new Map();

  /**
   * إرسال رمز OTP إلى رقم الهاتف
   * Send OTP code to phone number
   * 
   * @param phoneNumber - Phone number in format +996XXXXXXXXX
   * @param language - Language for SMS template (en, ru, ky, ar)
   * @returns Result with success status and messageId
   */
  async sendOTP(
    phoneNumber: string, 
    language: 'en' | 'ru' | 'ky' | 'ar' = 'en'
  ): Promise<SendOTPResult> {
    // Validate phone number
    const validation = validateKyrgyzstanPhone(phoneNumber);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'Invalid phone number'
      };
    }

    // Check rate limiting
    const rateLimitError = this.checkRateLimit(phoneNumber);
    if (rateLimitError) {
      return { success: false, error: rateLimitError };
    }

    // Generate OTP
    const code = this.generateOTP();

    // Store OTP
    await this.storeOTP(phoneNumber, code);

    // In development mode, just log and return success
    if (isDemoMode()) {
      console.log(`
╔════════════════════════════════════════╗
║  📱 DEMO MODE - OTP Verification      ║
╠════════════════════════════════════════╣
║  Phone: ${phoneNumber.padEnd(24)} ║
║  Code:  ${code.padEnd(24)} ║
║  Valid: 5 minutes                      ║
╚════════════════════════════════════════╝
      `);
      return { 
        success: true, 
        messageId: `demo-${Date.now()}` 
      };
    }

    try {
      // Get message template
      const message = this.getMessageTemplate(code, language);

      // TODO: Replace with actual SMS provider integration
      // Choose one of the following:
      
      // Option 1: Twilio (Global)
      // const result = await this.sendViaTwilio(phoneNumber, message);
      
      // Option 2: SMSC.kg (Local Kyrgyzstan)
      // const result = await this.sendViaSMSC(phoneNumber, message);
      
      // Option 3: MessageBird (Global)
      // const result = await this.sendViaMessageBird(phoneNumber, message);

      // For now, throw error to remind developer
      throw new Error(
        'SMS provider not configured. Please implement one of the providers in smsService.ts'
      );

    } catch (error) {
      console.error('Failed to send OTP:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send SMS'
      };
    }
  }

  /**
   * التحقق من رمز OTP
   * Verify OTP code
   * 
   * @param phoneNumber - Phone number
   * @param code - 6-digit OTP code
   * @returns true if valid, false otherwise
   */
  async verifyOTP(phoneNumber: string, code: string): Promise<{
    valid: boolean;
    error?: string;
  }> {
    // In demo mode, accept demo OTP
    if (isDemoMode() && code === DEMO_OTP) {
      return { valid: true };
    }

    // Get stored OTP
    const stored = this.otpStore.get(phoneNumber) || 
      this.getFromLocalStorage(phoneNumber);

    if (!stored) {
      return { valid: false, error: 'No OTP found. Please request a new code.' };
    }

    // Check expiry
    if (Date.now() > stored.expiryTime) {
      this.otpStore.delete(phoneNumber);
      this.removeFromLocalStorage(phoneNumber);
      return { valid: false, error: 'OTP expired. Please request a new code.' };
    }

    // Check max attempts
    if (stored.attempts >= OTP_CONFIG.maxAttempts) {
      this.otpStore.delete(phoneNumber);
      this.removeFromLocalStorage(phoneNumber);
      return { valid: false, error: 'Maximum attempts exceeded. Please request a new code.' };
    }

    // Verify code
    if (stored.code === code) {
      this.otpStore.delete(phoneNumber);
      this.removeFromLocalStorage(phoneNumber);
      return { valid: true };
    }

    // Increment attempts
    stored.attempts++;
    this.otpStore.set(phoneNumber, stored);
    this.saveToLocalStorage(phoneNumber, stored);

    const attemptsLeft = OTP_CONFIG.maxAttempts - stored.attempts;
    return { 
      valid: false, 
      error: `Invalid code. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.` 
    };
  }

  /**
   * توليد رمز OTP عشوائي
   * Generate random OTP code
   */
  private generateOTP(): string {
    if (isDemoMode()) {
      return DEMO_OTP;
    }
    
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < OTP_CONFIG.length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  /**
   * حفظ OTP
   * Store OTP
   */
  private async storeOTP(phoneNumber: string, code: string): Promise<void> {
    const expiryTime = Date.now() + (OTP_CONFIG.expiryMinutes * 60 * 1000);
    
    const record: OTPRecord = {
      code,
      expiryTime,
      attempts: 0,
      createdAt: Date.now()
    };

    // Store in memory
    this.otpStore.set(phoneNumber, record);

    // Backup in localStorage for development
    this.saveToLocalStorage(phoneNumber, record);
  }

  /**
   * التحقق من معدل الطلبات (Rate Limiting)
   */
  private checkRateLimit(phoneNumber: string): string | null {
    const stored = this.otpStore.get(phoneNumber) || 
      this.getFromLocalStorage(phoneNumber);

    if (!stored) return null;

    const cooldownMs = OTP_CONFIG.resendCooldownSeconds * 1000;
    const timeSinceCreation = Date.now() - stored.createdAt;

    if (timeSinceCreation < cooldownMs) {
      const secondsLeft = Math.ceil((cooldownMs - timeSinceCreation) / 1000);
      return `Please wait ${secondsLeft} seconds before requesting a new code.`;
    }

    return null;
  }

  /**
   * الحصول على قالب الرسالة
   * Get message template
   */
  private getMessageTemplate(code: string, language: 'en' | 'ru' | 'ky' | 'ar'): string {
    const templates = {
      en: `Your eChefs verification code is: ${code}\nValid for ${OTP_CONFIG.expiryMinutes} minutes.`,
      ru: `Ваш код подтверждения eChefs: ${code}\nДействителен ${OTP_CONFIG.expiryMinutes} минут.`,
      ky: `Сиздин eChefs ырастоо кодуңуз: ${code}\n${OTP_CONFIG.expiryMinutes} мүнөткө жарактуу.`,
      ar: `رمز التحقق من eChefs: ${code}\nصالح لمدة ${OTP_CONFIG.expiryMinutes} دقائق.`
    };

    return templates[language] || templates.en;
  }

  // ==================== Storage Helpers ====================

  private saveToLocalStorage(phoneNumber: string, record: OTPRecord): void {
    try {
      localStorage.setItem(`otp_${phoneNumber}`, JSON.stringify(record));
    } catch (error) {
      console.warn('Failed to save OTP to localStorage:', error);
    }
  }

  private getFromLocalStorage(phoneNumber: string): OTPRecord | null {
    try {
      const stored = localStorage.getItem(`otp_${phoneNumber}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to read OTP from localStorage:', error);
      return null;
    }
  }

  private removeFromLocalStorage(phoneNumber: string): void {
    try {
      localStorage.removeItem(`otp_${phoneNumber}`);
    } catch (error) {
      console.warn('Failed to remove OTP from localStorage:', error);
    }
  }

  // ==================== SMS Provider Integrations ====================

  /**
   * إرسال عبر Twilio
   * Send via Twilio (Example - requires twilio package)
   */
  private async sendViaTwilio(phoneNumber: string, message: string): Promise<SendOTPResult> {
    // TODO: Install twilio package: npm install twilio
    // TODO: Set environment variables:
    //   - TWILIO_ACCOUNT_SID
    //   - TWILIO_AUTH_TOKEN
    //   - TWILIO_PHONE_NUMBER

    /*
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    try {
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return {
        success: true,
        messageId: result.sid
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
    */

    throw new Error('Twilio integration not implemented');
  }

  /**
   * إرسال عبر SMSC.kg (مزود محلي)
   * Send via SMSC.kg (Local provider)
   */
  private async sendViaSMSC(phoneNumber: string, message: string): Promise<SendOTPResult> {
    // TODO: Set environment variables:
    //   - SMSC_LOGIN
    //   - SMSC_PASSWORD

    /*
    const API_URL = 'https://smsc.kg/sys/send.php';
    const params = new URLSearchParams({
      login: process.env.SMSC_LOGIN || '',
      psw: process.env.SMSC_PASSWORD || '',
      phones: phoneNumber.replace('+', ''),
      mes: message,
      charset: 'utf-8',
      fmt: '3' // JSON response
    });

    try {
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();

      if (data.error_code) {
        return {
          success: false,
          error: data.error
        };
      }

      return {
        success: true,
        messageId: data.id?.toString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
    */

    throw new Error('SMSC.kg integration not implemented');
  }

  /**
   * إرسال عبر MessageBird
   * Send via MessageBird (Example - requires messagebird package)
   */
  private async sendViaMessageBird(phoneNumber: string, message: string): Promise<SendOTPResult> {
    // TODO: Install messagebird package: npm install messagebird
    // TODO: Set environment variable: MESSAGEBIRD_API_KEY

    /*
    const messagebird = require('messagebird');
    const client = messagebird(process.env.MESSAGEBIRD_API_KEY);

    return new Promise((resolve) => {
      client.messages.create({
        originator: 'eChefs',
        recipients: [phoneNumber],
        body: message
      }, (error: any, response: any) => {
        if (error) {
          resolve({
            success: false,
            error: error.message
          });
        } else {
          resolve({
            success: true,
            messageId: response.id
          });
        }
      });
    });
    */

    throw new Error('MessageBird integration not implemented');
  }
}

// Export singleton instance
export const smsService = new SMSService();
