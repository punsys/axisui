// AxisUI Input Mask JS
// Comprehensive vanilla JS input mask for various formats
// No dependencies. Professional and production-ready.

document.addEventListener('DOMContentLoaded', function () {
  // Mask configurations with flexible patterns
  const maskConfigs = {
    phone: {
      pattern: '(999) 999-9999',
      regex: /\d/g,
      placeholder: '(___) ___-____',
      selector: '[data-mask="phone"]'
    },
    phoneIntl: {
      pattern: '+9 (999) 999-9999',
      regex: /\d/g,
      placeholder: '+_ (___) ___-____',
      selector: '[data-mask="phone-intl"]'
    },
    date: {
      pattern: '99/99/9999',
      regex: /\d/g,
      placeholder: 'MM/DD/YYYY',
      selector: '[data-mask="date"]'
    },
    dateISO: {
      pattern: '9999-99-99',
      regex: /\d/g,
      placeholder: 'YYYY-MM-DD',
      selector: '[data-mask="date-iso"]'
    },
    time: {
      pattern: '99:99',
      regex: /\d/g,
      placeholder: 'HH:MM',
      selector: '[data-mask="time"]'
    },
    time24: {
      pattern: '99:99:99',
      regex: /\d/g,
      placeholder: 'HH:MM:SS',
      selector: '[data-mask="time-24"]'
    },
    creditCard: {
      pattern: '9999 9999 9999 9999',
      regex: /\d/g,
      placeholder: '#### #### #### ####',
      selector: '[data-mask="credit-card"]'
    },
    creditCardShort: {
      pattern: '9999 999999 99999',
      regex: /\d/g,
      placeholder: '#### ###### #####',
      selector: '[data-mask="credit-card-amex"]'
    },
    cvv: {
      pattern: '999',
      regex: /\d/g,
      placeholder: '###',
      selector: '[data-mask="cvv"]'
    },
    cvv4: {
      pattern: '9999',
      regex: /\d/g,
      placeholder: '####',
      selector: '[data-mask="cvv-4"]'
    },
    currency: {
      pattern: '$9,999.99',
      regex: /[\d.]/g,
      placeholder: '$0.00',
      selector: '[data-mask="currency"]'
    },
    currencyEuro: {
      pattern: '€9.999,99',
      regex: /[\d.,]/g,
      placeholder: '€0,00',
      selector: '[data-mask="currency-euro"]'
    },
    ssn: {
      pattern: '999-99-9999',
      regex: /\d/g,
      placeholder: '###-##-####',
      selector: '[data-mask="ssn"]'
    },
    zip: {
      pattern: '99999',
      regex: /\d/g,
      placeholder: '#####',
      selector: '[data-mask="zip"]'
    },
    zipPlus4: {
      pattern: '99999-9999',
      regex: /\d/g,
      placeholder: '#####-####',
      selector: '[data-mask="zip-plus4"]'
    },
    percentage: {
      pattern: '99.99%',
      regex: /[\d.]/g,
      placeholder: '0.00%',
      selector: '[data-mask="percentage"]'
    },
    ipAddress: {
      pattern: '999.999.999.999',
      regex: /\d/g,
      placeholder: '0.0.0.0',
      selector: '[data-mask="ip"]'
    }
  };

  // Apply mask to input
  function applyMask(input, pattern, regex) {
    let previousValue = '';

    input.addEventListener('input', function (e) {
      let cursorPosition = input.selectionStart;
      let valueBefore = previousValue;
      let valueAfter = input.value;

      // Extract only valid characters
      let cleanValue = (input.value.match(regex) || []).join('');
      let maskedValue = '';
      let cleanIndex = 0;

      // Build masked value
      for (let i = 0; i < pattern.length && cleanIndex < cleanValue.length; i++) {
        if (pattern[i] === '9') {
          maskedValue += cleanValue[cleanIndex++];
        } else {
          maskedValue += pattern[i];
        }
      }

      // Update input value
      input.value = maskedValue;
      previousValue = maskedValue;

      // Restore cursor position intelligently
      if (valueAfter.length > valueBefore.length) {
        // Typing forward
        let newCursor = cursorPosition;
        while (newCursor < maskedValue.length && 
               pattern[newCursor] && 
               pattern[newCursor] !== '9') {
          newCursor++;
        }
        input.setSelectionRange(newCursor, newCursor);
      }
    });

    // Handle backspace/delete for better UX
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        let cursorPosition = input.selectionStart;
        let currentChar = pattern[cursorPosition - 1];
        
        // Skip over format characters when deleting
        if (currentChar && currentChar !== '9' && e.key === 'Backspace') {
          e.preventDefault();
          let newPosition = cursorPosition - 1;
          while (newPosition > 0 && pattern[newPosition - 1] !== '9') {
            newPosition--;
          }
          input.value = input.value.slice(0, newPosition - 1) + input.value.slice(newPosition);
          input.setSelectionRange(newPosition - 1, newPosition - 1);
          input.dispatchEvent(new Event('input'));
        }
      }
    });

    // Show validation feedback
    input.addEventListener('blur', function () {
      validateMaskedInput(input, pattern);
    });
  }

  // Validate masked input completion
  function validateMaskedInput(input, pattern) {
    let expectedLength = pattern.replace(/[^9]/g, '').length;
    let actualLength = (input.value.match(/\d/g) || []).length;

    // Remove previous validation classes
    input.classList.remove('valid', 'invalid', 'warning');

    if (actualLength === 0) {
      // Empty - no validation
      return;
    } else if (actualLength === expectedLength) {
      // Complete - valid
      input.classList.add('valid');
      
      // Trigger validation if form validation is present
      if (window.AxisUIValidation && input.hasAttribute('data-validate')) {
        window.AxisUIValidation.validate(input);
      }
    } else if (actualLength > expectedLength * 0.5) {
      // Partial - warning
      input.classList.add('warning');
    } else {
      // Incomplete - invalid
      input.classList.add('invalid');
    }
  }

  // Initialize all masks
  Object.values(maskConfigs).forEach(config => {
    document.querySelectorAll(config.selector).forEach(input => {
      // Set placeholder if not already set
      if (!input.placeholder || input.placeholder === '') {
        input.placeholder = config.placeholder;
      }

      // Add input-mask class for styling
      input.classList.add('input-mask');

      // Apply mask
      applyMask(input, config.pattern, config.regex);
    });
  });

  // Custom mask support via data-mask-pattern attribute
  document.querySelectorAll('[data-mask-pattern]').forEach(input => {
    let pattern = input.getAttribute('data-mask-pattern');
    let regex = /[\d]/g; // Default to digits
    
    if (input.hasAttribute('data-mask-regex')) {
      regex = new RegExp(input.getAttribute('data-mask-regex'), 'g');
    }

    input.classList.add('input-mask');
    applyMask(input, pattern, regex);
  });

  // Real-time format preview for complex masks
  document.querySelectorAll('.input-mask').forEach(input => {
    let wrapper = input.parentElement;
    if (wrapper && wrapper.classList.contains('input-mask-wrapper')) {
      let preview = wrapper.querySelector('.mask-format-preview');
      if (preview) {
        input.addEventListener('focus', function () {
          preview.classList.add('show');
        });
        input.addEventListener('blur', function () {
          preview.classList.remove('show');
        });
      }
    }
  });
});
