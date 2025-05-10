const OTP = {
  otp: new Map(),
  generateOTP: function (email, length) {
    let otp = "";
    const characters = "0123456789";
    for (let i = 0; i < length; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.otp.set(email, otp);
    return otp;
  },
  getOTP: function (email) {
    return this.otp.get(email);
  },
  verifyOTP: function (email, otpToVerify) {
    return this.otp.get(email) === otpToVerify;
  },
  deleteOTP: function (email) {
    this.otp.delete(email);
  },
};

export default OTP;
