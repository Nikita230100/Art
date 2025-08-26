class AuthValidator {
  static validateSignUp({
    username,
    email,
    password,
    phone,
    role,
    avatar,
    isActive,
    isEmailVerified,
    isPhoneVerified,
    isTwoFactorEnabled,
  }) {
    // Username validation
    if (!username || username.trim().length === 0 || typeof username !== 'string') {
      return {
        isValid: false,
        error: 'Username is required and must be non empty string',
      };
    }

    // Email validation
    if (
      !email ||
      email.trim().length === 0 ||
      typeof email !== 'string' ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'Email is required and must non-empty string and must be valid email',
      };
    }

    // Password validation
    if (
      !password ||
      password.trim().length === 0 ||
      typeof password !== 'string' ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          'Password is required, must be a non-empty string, contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
      };
    }

    // Phone validation
    if (
      !phone ||
      phone.trim().length === 0 ||
      typeof phone !== 'string' ||
      !this.validatePhone(phone)
    ) {
      return {
        isValid: false,
        error: 'Phone number is required and must be valid',
      };
    }

    // Role validation
    if (role && !this.validateRole(role)) {
      return {
        isValid: false,
        error: "Role must be either 'buyer' or 'seller'",
      };
    }

    // Avatar validation (optional)
    if (avatar && typeof avatar !== 'string') {
      return {
        isValid: false,
        error: 'Avatar must be a string',
      };
    }

    // Boolean fields validation
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return {
        isValid: false,
        error: 'isActive must be a boolean',
      };
    }

    if (isEmailVerified !== undefined && typeof isEmailVerified !== 'boolean') {
      return {
        isValid: false,
        error: 'isEmailVerified must be a boolean',
      };
    }

    if (isPhoneVerified !== undefined && typeof isPhoneVerified !== 'boolean') {
      return {
        isValid: false,
        error: 'isPhoneVerified must be a boolean',
      };
    }

    if (isTwoFactorEnabled !== undefined && typeof isTwoFactorEnabled !== 'boolean') {
      return {
        isValid: false,
        error: 'isTwoFactorEnabled must be a boolean',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignIn({ email, password }) {
    if (!email || email.trim().length === 0 || typeof email !== 'string') {
      return {
        isValid: false,
        error: 'Email is required and must non-empty string',
      };
    }

    if (!password || password.trim().length === 0 || typeof password !== 'string') {
      return {
        isValid: false,
        error: 'Password is required, must be a non-empty string',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateEmail(email) {
    const emailPattern = /^[A-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password) {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
    const isValidLength = password.length >= 8;

    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false;
    }
    return true;
  }

  static validatePhone(phone) {
    const phonePattern = /^(\+7|8)[0-9]{10}$/;
    return phonePattern.test(phone);
  }

  static validateRole(role) {
    return ['buyer', 'seller'].includes(role);
  }

  // валидация данных продавца
  static validateUpdateSeller({ username, email, phone, avatar }) {
    const errors = {};

    if (!username) {
      errors.username = 'Username is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    }
    if (email && !this.validateEmail(email)) {
      errors.email = 'Email is invalid';
    }
    if (!phone) {
      errors.phone = 'Phone is required';
    }
    if (!this.validatePhone(phone)) {
      errors.phone = 'Phone is invalid';
    }
    if (!avatar) {
      errors.avatar = 'Avatar is required';
    }

    return {
      isValid: true,
      error: null,
    };
  }
}

module.exports = AuthValidator;
