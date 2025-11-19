/**
 * AxisUI Form Validation System
 * Comprehensive client-side validation with modular rules and live feedback
 * Pure vanilla JavaScript with no external dependencies
 */

(function () {
  'use strict';

  const config = {
    debounceDelay: 300,
    asyncCheckDelay: 500,
    passwordMinLength: 8,
    passwordMaxLength: 128,
  };

  const rules = {
    required: (value) => value && value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    emailStrict: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    phoneUS: (value) => {
      const digits = value.replace(/\D/g, '');
      return /^1?\d{10}$/.test(digits);
    },
    phoneInternational: (value) => /^\+?[1-9]\d{1,14}$/.test(value.replace(/[\s-()]/g, '')),
    url: (value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    zipUS: (value) => {
      const digits = value.replace(/\D/g, '');
      return /^\d{5}$/.test(digits) || /^\d{9}$/.test(digits);
    },
    zipCanada: (value) => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value),
    zipUK: (value) => /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(value),
    creditCard: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 13 || digits.length > 19) return false;
      let sum = 0;
      let isEven = false;
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    },
    cvv: (value) => {
      const digits = value.replace(/\D/g, '');
      return /^\d{3,4}$/.test(digits);
    },
    ssn: (value) => {
      const digits = value.replace(/\D/g, '');
      return /^\d{9}$/.test(digits);
    },
    dateISO: (value) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value),
    dateUS: (value) => /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(value),
    time12: (value) => /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM|am|pm)$/.test(value),
    time24: (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
    ipv4: (value) => {
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return false;
      return value.split('.').every(num => {
        const n = parseInt(num);
        return n >= 0 && n <= 255;
      });
    },
    ipv6: (value) => /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(value),
    alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value),
    alphabetic: (value) => /^[a-zA-Z]+$/.test(value),
    numeric: (value) => /^\d+$/.test(value),
    decimal: (value) => /^\d+(\.\d+)?$/.test(value),
    hexColor: (value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
    username: (value) => /^[a-zA-Z0-9_-]{3,20}$/.test(value),
    strongPassword: (value) => {
      return value.length >= 8 &&
             /[A-Z]/.test(value) &&
             /[a-z]/.test(value) &&
             /\d/.test(value) &&
             /[!@#$%^&*(),.?":{}|<>]/.test(value);
    },
  };

  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const showFeedback = (input, state, message) => {
    const formGroup = input.closest('.form-group');
    input.classList.remove('valid', 'invalid', 'warning');
    const existingFeedback = formGroup?.querySelectorAll('.valid-feedback, .invalid-feedback, .warning-feedback, .info-feedback');
    existingFeedback?.forEach(el => el.remove());
    if (state) {
      input.classList.add(state);
      if (message && formGroup) {
        const feedback = document.createElement('div');
        feedback.className = `${state}-feedback`;
        feedback.textContent = message;
        input.parentNode.insertBefore(feedback, input.nextSibling);
      }
      input.setAttribute('aria-invalid', state === 'invalid' ? 'true' : 'false');
      if (formGroup) {
        formGroup.classList.remove('is-valid', 'is-invalid', 'is-warning');
        formGroup.classList.add(`is-${state}`);
      }
    }
  };

  const addShakeAnimation = (input) => {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
  };

  const validateInput = (input) => {
    const value = input.value;
    const type = input.getAttribute('data-validate');
    const required = input.hasAttribute('required') || input.hasAttribute('data-required');
    
    // Skip validation for masked inputs that are still being typed
    const isMaskedInput = input.hasAttribute('data-mask') || input.hasAttribute('data-mask-pattern');
    
    if (!value.trim()) {
      if (required) {
        showFeedback(input, 'invalid', 'This field is required');
        return false;
      } else {
        showFeedback(input, null, null);
        return true;
      }
    }
    
    // For masked inputs, determine if we need clean value or formatted value
    let testValue = value;
    if (isMaskedInput) {
      // These validation types need the formatted value (with separators)
      const needsFormattedValue = ['dateISO', 'dateUS', 'time12', 'time24', 'ipv4', 'ipv6', 'url'];
      
      if (type && !needsFormattedValue.includes(type)) {
        // Clean value for numeric validations (phone, credit card, SSN, ZIP, etc.)
        testValue = value.replace(/[^\d]/g, '');
      }
      
      // Check if mask is complete based on pattern
      const maskPattern = input.getAttribute('data-mask-pattern') || getMaskPattern(input.getAttribute('data-mask'));
      if (maskPattern) {
        const expectedLength = maskPattern.replace(/[^9]/g, '').length;
        const cleanLength = value.replace(/[^\d]/g, '').length;
        
        if (cleanLength < expectedLength) {
          showFeedback(input, 'warning', 'Please complete the input');
          return false;
        }
      }
    }
    
    if (type && rules[type]) {
      if (rules[type](testValue)) {
        showFeedback(input, 'valid', null);
        return true;
      } else {
        const errorMessage = input.getAttribute('data-error-message') || getDefaultErrorMessage(type);
        showFeedback(input, 'invalid', errorMessage);
        addShakeAnimation(input);
        return false;
      }
    }
    const minLength = input.getAttribute('data-min-length');
    const maxLength = input.getAttribute('data-max-length');
    if (minLength && value.length < parseInt(minLength)) {
      showFeedback(input, 'invalid', `Minimum ${minLength} characters required`);
      return false;
    }
    if (maxLength && value.length > parseInt(maxLength)) {
      showFeedback(input, 'invalid', `Maximum ${maxLength} characters allowed`);
      return false;
    }
    const min = input.getAttribute('min');
    const max = input.getAttribute('max');
    const numValue = parseFloat(value);
    if (min && numValue < parseFloat(min)) {
      showFeedback(input, 'invalid', `Value must be at least ${min}`);
      return false;
    }
    if (max && numValue > parseFloat(max)) {
      showFeedback(input, 'invalid', `Value must be at most ${max}`);
      return false;
    }
    const pattern = input.getAttribute('data-pattern');
    if (pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        const errorMessage = input.getAttribute('data-error-message') || 'Invalid format';
        showFeedback(input, 'invalid', errorMessage);
        return false;
      }
    }
    showFeedback(input, 'valid', null);
    return true;
  };

  const getMaskPattern = (maskType) => {
    const patterns = {
      'phone': '(999) 999-9999',
      'phone-intl': '+9 (999) 999-9999',
      'date': '99/99/9999',
      'date-iso': '9999-99-99',
      'time': '99:99',
      'time-24': '99:99:99',
      'credit-card': '9999 9999 9999 9999',
      'credit-card-amex': '9999 999999 99999',
      'cvv': '999',
      'cvv-4': '9999',
      'ssn': '999-99-9999',
      'zip': '99999',
      'zip-plus4': '99999-9999',
      'ip': '999.999.999.999'
    };
    return patterns[maskType] || null;
  };

  const validatePasswordStrength = (input) => {
    const value = input.value;
    if (!value) {
      showFeedback(input, 'invalid', 'Password is required');
      return false;
    }
    if (value.length < config.passwordMinLength) {
      showFeedback(input, 'invalid', `Password must be at least ${config.passwordMinLength} characters`);
      return false;
    }
    if (value.length > config.passwordMaxLength) {
      showFeedback(input, 'invalid', `Password must not exceed ${config.passwordMaxLength} characters`);
      return false;
    }
    if (value.length < 10 && !/[A-Z]/.test(value)) {
      showFeedback(input, 'warning', 'Consider using uppercase letters for stronger password');
      return true;
    }
    if (value.length < 10 && !/\d/.test(value)) {
      showFeedback(input, 'warning', 'Consider adding numbers for stronger password');
      return true;
    }
    if (rules.strongPassword(value)) {
      showFeedback(input, 'valid', 'Strong password');
      return true;
    }
    showFeedback(input, 'valid', null);
    return true;
  };

  const validatePasswordMatch = (password, confirm) => {
    if (!confirm.value) {
      showFeedback(confirm, 'invalid', 'Please confirm your password');
      return false;
    }
    if (password.value !== confirm.value) {
      showFeedback(confirm, 'invalid', 'Passwords do not match');
      return false;
    }
    showFeedback(confirm, 'valid', 'Passwords match');
    return true;
  };

  const validateCheckboxGroup = (checkboxes, min, max) => {
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    if (min && checked < min) {
      checkboxes.forEach(cb => showFeedback(cb, 'invalid', `Select at least ${min} options`));
      return false;
    }
    if (max && checked > max) {
      checkboxes.forEach(cb => showFeedback(cb, 'invalid', `Select at most ${max} options`));
      return false;
    }
    checkboxes.forEach(cb => showFeedback(cb, 'valid', null));
    return true;
  };

  const validateFileInput = (input) => {
    const file = input.files[0];
    if (!file) {
      if (input.hasAttribute('required')) {
        showFeedback(input, 'invalid', 'Please select a file');
        return false;
      }
      return true;
    }
    const maxSize = input.getAttribute('data-max-size') || 5242880;
    if (file.size > maxSize) {
      const maxMB = (maxSize / (1024 * 1024)).toFixed(2);
      showFeedback(input, 'invalid', `File size must not exceed ${maxMB}MB`);
      return false;
    }
    const allowedTypes = input.getAttribute('data-allowed-types');
    if (allowedTypes) {
      const typesArray = allowedTypes.split(',').map(t => t.trim());
      if (!typesArray.includes(file.type)) {
        showFeedback(input, 'invalid', 'File type not allowed');
        return false;
      }
    }
    showFeedback(input, 'valid', `${file.name} (${(file.size / 1024).toFixed(2)}KB)`);
    return true;
  };

  const validateAsyncUsername = debounce((input) => {
    const value = input.value;
    if (!value) return;
    showFeedback(input, 'info', 'Checking availability...');
    setTimeout(() => {
      const takenUsernames = ['admin', 'test', 'user', 'root'];
      if (takenUsernames.includes(value.toLowerCase())) {
        showFeedback(input, 'invalid', 'Username is already taken');
      } else {
        showFeedback(input, 'valid', 'Username is available');
      }
    }, config.asyncCheckDelay);
  }, config.debounceDelay);

  const validateAsyncEmail = debounce((input) => {
    const value = input.value;
    if (!value || !rules.email(value)) return;
    showFeedback(input, 'info', 'Verifying email...');
    setTimeout(() => {
      const takenEmails = ['test@example.com', 'admin@example.com'];
      if (takenEmails.includes(value.toLowerCase())) {
        showFeedback(input, 'invalid', 'Email is already registered');
      } else {
        showFeedback(input, 'valid', 'Email is available');
      }
    }, config.asyncCheckDelay);
  }, config.debounceDelay);

  const validateDateRange = (startInput, endInput) => {
    const startDate = new Date(startInput.value);
    const endDate = new Date(endInput.value);
    if (isNaN(startDate) || isNaN(endDate)) {
      return false;
    }
    if (startDate > endDate) {
      showFeedback(endInput, 'invalid', 'End date must be after start date');
      return false;
    }
    showFeedback(startInput, 'valid', null);
    showFeedback(endInput, 'valid', null);
    return true;
  };

  const getDefaultErrorMessage = (type) => {
    const messages = {
      email: 'Please enter a valid email address',
      emailStrict: 'Please enter a valid email address',
      phoneUS: 'Please enter a valid US phone number',
      phoneInternational: 'Please enter a valid international phone number',
      url: 'Please enter a valid URL',
      zipUS: 'Please enter a valid US ZIP code',
      zipCanada: 'Please enter a valid Canadian postal code',
      zipUK: 'Please enter a valid UK postcode',
      creditCard: 'Please enter a valid credit card number',
      cvv: 'Please enter a valid CVV code',
      ssn: 'Please enter a valid SSN',
      dateISO: 'Please enter date in YYYY-MM-DD format',
      dateUS: 'Please enter date in MM/DD/YYYY format',
      time12: 'Please enter time in 12-hour format',
      time24: 'Please enter time in 24-hour format',
      ipv4: 'Please enter a valid IPv4 address',
      ipv6: 'Please enter a valid IPv6 address',
      alphanumeric: 'Only letters and numbers allowed',
      alphabetic: 'Only letters allowed',
      numeric: 'Only numbers allowed',
      decimal: 'Please enter a valid decimal number',
      hexColor: 'Please enter a valid hex color code',
      username: 'Username must be 3-20 characters (letters, numbers, _ or -)',
      strongPassword: 'Password must be 8+ characters with uppercase, lowercase, number, and special character',
    };
    return messages[type] || 'Invalid input';
  };

  const validateForm = (form) => {
    let isValid = true;
    const errors = [];
    form.querySelectorAll('input[data-validate], select[data-validate], textarea[data-validate]').forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
        errors.push(input.getAttribute('data-field-name') || input.name || 'Field');
      }
    });
    const passwordInputs = form.querySelectorAll('input[data-validate="password-strength"]');
    passwordInputs.forEach(input => {
      if (!validatePasswordStrength(input)) {
        isValid = false;
        errors.push('Password');
      }
    });
    const passwordConfirm = form.querySelector('input[data-validate="password-confirm"]');
    if (passwordConfirm) {
      const password = form.querySelector('input[data-validate="password-strength"]') || 
                      form.querySelector('input[type="password"]:not([data-validate="password-confirm"])');
      if (password && !validatePasswordMatch(password, passwordConfirm)) {
        isValid = false;
        errors.push('Password Confirmation');
      }
    }
    const checkboxGroups = form.querySelectorAll('[data-checkbox-group]');
    checkboxGroups.forEach(group => {
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const min = parseInt(group.getAttribute('data-min-checked'));
      const max = parseInt(group.getAttribute('data-max-checked'));
      if (!validateCheckboxGroup(checkboxes, min, max)) {
        isValid = false;
        errors.push(group.getAttribute('data-group-name') || 'Checkbox Group');
      }
    });
    form.querySelectorAll('input[type="file"]').forEach(input => {
      if (!validateFileInput(input)) {
        isValid = false;
        errors.push(input.getAttribute('data-field-name') || 'File');
      }
    });
    const dateRanges = form.querySelectorAll('[data-date-range]');
    dateRanges.forEach(range => {
      const startInput = range.querySelector('[data-date-start]');
      const endInput = range.querySelector('[data-date-end]');
      if (startInput && endInput && !validateDateRange(startInput, endInput)) {
        isValid = false;
        errors.push('Date Range');
      }
    });
    showValidationSummary(form, isValid, errors);
    return isValid;
  };

  const showValidationSummary = (form, isValid, errors) => {
    let summary = form.querySelector('.validation-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'validation-summary';
      form.insertBefore(summary, form.firstChild);
    }
    if (!isValid && errors.length > 0) {
      summary.className = 'validation-summary validation-summary-error';
      summary.innerHTML = `
        <div class="validation-summary-title">Please correct the following errors:</div>
        <ul>
          ${errors.map(error => `<li>${error} is invalid</li>`).join('')}
        </ul>
      `;
      summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (isValid) {
      summary.className = 'validation-summary validation-summary-success';
      summary.innerHTML = '<div class="validation-summary-title">✓ Form is valid and ready to submit!</div>';
      setTimeout(() => summary.remove(), 3000);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[data-validate], select[data-validate], textarea[data-validate]').forEach(input => {
      const validateType = input.getAttribute('data-validate');
      input.addEventListener('input', debounce(() => {
        if (validateType === 'username-async') {
          validateAsyncUsername(input);
        } else if (validateType === 'email-async') {
          validateAsyncEmail(input);
        } else if (validateType === 'password-strength') {
          validatePasswordStrength(input);
        } else {
          validateInput(input);
        }
      }, config.debounceDelay));
      input.addEventListener('blur', () => {
        if (validateType === 'password-strength') {
          validatePasswordStrength(input);
        } else if (!validateType.includes('async')) {
          validateInput(input);
        }
      });
    });
    document.querySelectorAll('input[data-validate="password-confirm"]').forEach(confirm => {
      const form = confirm.closest('form');
      const password = form?.querySelector('input[data-validate="password-strength"]') ||
                      form?.querySelector('input[type="password"]:not([data-validate="password-confirm"])');
      if (password) {
        confirm.addEventListener('input', debounce(() => {
          validatePasswordMatch(password, confirm);
        }, config.debounceDelay));
        password.addEventListener('input', debounce(() => {
          if (confirm.value) {
            validatePasswordMatch(password, confirm);
          }
        }, config.debounceDelay));
      }
    });
    document.querySelectorAll('[data-checkbox-group]').forEach(group => {
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const min = parseInt(group.getAttribute('data-min-checked'));
      const max = parseInt(group.getAttribute('data-max-checked'));
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          validateCheckboxGroup(checkboxes, min, max);
        });
      });
    });
    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('change', () => {
        validateFileInput(input);
      });
    });
    document.querySelectorAll('[data-date-range]').forEach(range => {
      const startInput = range.querySelector('[data-date-start]');
      const endInput = range.querySelector('[data-date-end]');
      if (startInput && endInput) {
        [startInput, endInput].forEach(input => {
          input.addEventListener('change', () => {
            validateDateRange(startInput, endInput);
          });
        });
      }
    });
    document.querySelectorAll('form[data-validate-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(form)) {
          console.log('Form is valid - ready to submit');
        } else {
          console.log('Form validation failed');
        }
      });
    });
  });

  window.AxisUIValidation = {
    validate: validateInput,
    validateForm: validateForm,
    addRule: (name, validator) => {
      rules[name] = validator;
    },
    rules: rules,
    config: config,
  };
})();
