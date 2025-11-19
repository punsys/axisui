/*!
 * AxisUI Advanced Forms Enhancement
 * Framework-Agnostic: PHP, Java, Ruby, WordPress, Joomla, Django, Flask, React, Vue, Angular
 * 
 * FEATURES:
 * - Range slider value display
 * - Form repeater (add/remove dynamic fields)
 * - Form wizard navigation with validation
 * - Tabbed form switching
 * - Drag-and-drop file upload
 * - Conditional field toggling
 * - Auto-save functionality (optional)
 * 
 * Pure JavaScript, no inline styles, no external dependencies
 * Compatible with all major frameworks and server-side technologies
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedForms);
  } else {
    initAdvancedForms();
  }

  function initAdvancedForms() {
    initRangeSliders();
    initFormRepeater();
    initFormWizard();
    initFormTabs();
    initFileUpload();
    initConditionalFields();
  }

  // =============================================================================
  // RANGE SLIDER VALUE DISPLAY
  // =============================================================================
  
  function initRangeSliders() {
    const sliders = [
      { input: '#volume', value: '#volume-value' },
      { input: '#brightness', value: '#brightness-value' },
      { input: '#price', value: '#price-value' },
      { input: '#satisfaction', value: '#satisfaction-value' }
    ];

    sliders.forEach(function(slider) {
      const input = document.querySelector(slider.input);
      const valueDisplay = document.querySelector(slider.value);
      
      if (input && valueDisplay) {
        const updateValue = function() {
          valueDisplay.textContent = input.value;
        };
        
        input.addEventListener('input', updateValue);
        updateValue(); // Set initial value
      }
    });

    // Generic range sliders (find all without explicit handlers)
    document.querySelectorAll('.form-range').forEach(function(input) {
      if (!input.id || !['volume', 'brightness', 'price', 'satisfaction'].includes(input.id)) {
        const label = input.parentElement.querySelector('label');
        if (label) {
          const valueSpan = document.createElement('span');
          valueSpan.className = 'range-value';
          valueSpan.textContent = input.value;
          label.appendChild(valueSpan);
          
          input.addEventListener('input', function() {
            valueSpan.textContent = input.value;
          });
        }
      }
    });
  }

  // =============================================================================
  // FORM REPEATER (ADD/REMOVE DYNAMIC FIELDS)
  // =============================================================================
  
  function initFormRepeater() {
    document.querySelectorAll('.form-repeater').forEach(function(repeater) {
      const addBtn = repeater.querySelector('.form-repeater-add');
      if (!addBtn) return;
      
      const itemTemplate = repeater.querySelector('.form-repeater-item');
      if (!itemTemplate) return;
      
      // Attach remove handlers to existing items
      function attachRemoveHandler(item) {
        const removeBtn = item.querySelector('.form-repeater-remove');
        if (removeBtn) {
          removeBtn.addEventListener('click', function() {
            const items = repeater.querySelectorAll('.form-repeater-item');
            if (items.length > 1) {
              item.classList.add('removing');
              setTimeout(function() {
                item.remove();
              }, 300);
            } else {
              alert('At least one item is required.');
            }
          });
        }
      }
      
      // Attach to all initial items
      repeater.querySelectorAll('.form-repeater-item').forEach(attachRemoveHandler);
      
      // Add button handler
      addBtn.addEventListener('click', function() {
        const clone = itemTemplate.cloneNode(true);
        clone.classList.remove('removing');
        
        // Clear input values
        clone.querySelectorAll('input, select, textarea').forEach(function(el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
          } else {
            el.value = '';
          }
        });
        
        attachRemoveHandler(clone);
        clone.classList.add('form-scale-in');
        repeater.insertBefore(clone, addBtn);
      });
    });
  }

  // =============================================================================
  // FORM WIZARD (MULTI-STEP NAVIGATION)
  // =============================================================================
  
  function initFormWizard() {
    document.querySelectorAll('.form-wizard').forEach(function(wizard) {
      const steps = wizard.querySelectorAll('.form-wizard-step');
      const contents = wizard.querySelectorAll('.form-wizard-content');
      const actions = wizard.querySelector('.form-wizard-actions');
      
      if (!steps.length || !contents.length || !actions) return;
      
      const prevBtn = actions.querySelector('.step-btn-prev');
      const nextBtn = actions.querySelector('.step-btn-next');
      let currentStep = 0;
      
      function showStep(index) {
        // Update step indicators
        steps.forEach(function(step, i) {
          step.classList.remove('active', 'completed');
          if (i === index) {
            step.classList.add('active');
          } else if (i < index) {
            step.classList.add('completed');
          }
        });
        
        // Update content visibility
        contents.forEach(function(content, i) {
          content.style.display = (i === index) ? '' : 'none';
        });
        
        // Update button states
        if (prevBtn) {
          prevBtn.disabled = (index === 0);
        }
        
        if (nextBtn) {
          nextBtn.textContent = (index === steps.length - 1) ? 'Finish' : 'Next';
        }
        
        currentStep = index;
      }
      
      // Initialize wizard
      showStep(currentStep);
      
      // Next button
      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          if (currentStep < steps.length - 1) {
            // Optional: Add validation here
            if (validateStep(contents[currentStep])) {
              showStep(currentStep + 1);
            }
          } else {
            // Final step - submit form
            const form = wizard.closest('form');
            if (form) {
              form.submit();
            } else {
              console.log('Wizard completed!');
              alert('Form wizard completed successfully!');
            }
          }
        });
      }
      
      // Previous button
      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          if (currentStep > 0) {
            showStep(currentStep - 1);
          }
        });
      }
      
      // Optional step validation
      function validateStep(stepContent) {
        const requiredFields = stepContent.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(function(field) {
          if (!field.value || (field.type === 'checkbox' && !field.checked)) {
            isValid = false;
            field.classList.add('is-invalid');
          } else {
            field.classList.remove('is-invalid');
          }
        });
        
        if (!isValid) {
          alert('Please fill in all required fields before proceeding.');
        }
        
        return isValid;
      }
    });
  }

  // =============================================================================
  // FORM TABS (TABBED SECTIONS)
  // =============================================================================
  
  function initFormTabs() {
    document.querySelectorAll('.form-tabs').forEach(function(tabs) {
      const nav = tabs.querySelector('.form-tab-nav');
      if (!nav) return;
      
      const buttons = nav.querySelectorAll('.form-tab-button');
      const contents = tabs.querySelectorAll('.form-tab-content');
      
      buttons.forEach(function(btn, index) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Update buttons
          buttons.forEach(function(b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          
          // Update contents
          contents.forEach(function(content, i) {
            if (i === index) {
              content.classList.add('active');
              content.setAttribute('aria-hidden', 'false');
            } else {
              content.classList.remove('active');
              content.setAttribute('aria-hidden', 'true');
            }
          });
        });
      });
    });
  }

  // =============================================================================
  // DRAG-AND-DROP FILE UPLOAD
  // =============================================================================
  
  function initFileUpload() {
    document.querySelectorAll('.form-file-upload').forEach(function(uploadArea) {
      const fileInput = uploadArea.querySelector('.form-file-input');
      const fileLabel = uploadArea.querySelector('.form-file-label');
      
      if (!fileInput) return;
      
      // Drag and drop events
      uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });
      
      uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
      });
      
      uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          fileInput.files = files;
          updateFileLabel(uploadArea, files);
        }
      });
      
      // File input change
      fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
          updateFileLabel(uploadArea, fileInput.files);
        }
      });
      
      function updateFileLabel(area, files) {
        const label = area.querySelector('.form-file-label');
        if (label) {
          if (files.length === 1) {
            label.textContent = files[0].name;
          } else {
            label.textContent = files.length + ' files selected';
          }
          label.style.color = '#2e7d32'; // Green color
        }
      }
    });
  }

  // =============================================================================
  // CONDITIONAL FIELDS (SHOW/HIDE BASED ON INPUT)
  // =============================================================================
  
  function initConditionalFields() {
    document.querySelectorAll('.form-conditional').forEach(function(conditional) {
      const trigger = conditional.querySelector('.form-conditional-trigger');
      const content = conditional.querySelector('.form-conditional-content');
      
      if (!trigger || !content) return;
      
      // Find trigger inputs (checkbox or radio)
      const inputs = trigger.querySelectorAll('input[type="checkbox"], input[type="radio"]');
      
      inputs.forEach(function(input) {
        input.addEventListener('change', function() {
          if (input.checked) {
            content.classList.add('show');
            content.style.display = 'block';
          } else {
            // For checkboxes, hide when unchecked
            if (input.type === 'checkbox') {
              content.classList.remove('show');
              setTimeout(function() {
                content.style.display = 'none';
              }, 300);
            }
          }
        });
        
        // Initialize state
        if (input.checked) {
          content.style.display = 'block';
          content.classList.add('show');
        }
      });
    });
  }

  // =============================================================================
  // AUTO-SAVE FUNCTIONALITY (OPTIONAL)
  // =============================================================================
  
  // Optional: Enable auto-save for forms with data-autosave attribute
  document.querySelectorAll('form[data-autosave]').forEach(function(form) {
    let autoSaveTimeout;
    
    form.addEventListener('input', function() {
      clearTimeout(autoSaveTimeout);
      
      autoSaveTimeout = setTimeout(function() {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach(function(value, key) {
          data[key] = value;
        });
        
        // Save to localStorage
        localStorage.setItem('form-autosave-' + form.id, JSON.stringify(data));
        
        // Optional: Show save indicator
        console.log('Form auto-saved');
      }, 2000); // Save after 2 seconds of inactivity
    });
    
    // Restore from localStorage on page load
    const savedData = localStorage.getItem('form-autosave-' + form.id);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(function(key) {
          const input = form.querySelector('[name="' + key + '"]');
          if (input && input.type !== 'file') {
            input.value = data[key];
          }
        });
      } catch (e) {
        console.error('Failed to restore form data:', e);
      }
    }
  });

})();