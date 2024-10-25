const speakeasy = require('speakeasy');
const Redis = require('ioredis');

class OTPService {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });
    }

    async generateOTP(userId) {
        const otp = speakeasy.totp({
            secret: process.env.OTP_SECRET,
            encoding: 'base32',
            step: 300 // 5 minutes
        });

        // Store OTP in Redis with 5 minutes expiry
        await this.redis.set(`otp:${userId}`, otp, 'EX', 300);
        return otp;
    }

    async verifyOTP(userId, otp) {
        const storedOTP = await this.redis.get(`otp:${userId}`);
        if (!storedOTP || storedOTP !== otp) {
            return false;
        }

        // Delete OTP after successful verification
        await this.redis.del(`otp:${userId}`);
        return true;
    }
}

module.exports = new OTPService();