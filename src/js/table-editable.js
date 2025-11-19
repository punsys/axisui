// =============================================================================
// TABLE-EDITABLE.JS - AxisUI Framework Editable Table Component
// Advanced inline editing with validation, save/cancel, and data management
// =============================================================================

(function() {
  'use strict';

  // =============================================================================
  // CONFIGURATION
  // =============================================================================
  
  const config = {
    editOnDoubleClick: true,
    editOnClick: false,
    saveOnBlur: true,
    saveOnEnter: true,
    cancelOnEscape: true,
    allowEmpty: false,
    highlightEditing: true,
    editingClass: 'editing',
    modifiedClass: 'modified',
    errorClass: 'error'
  };

  // =============================================================================
  // EDITABLE TABLE CLASS
  // =============================================================================
  
  class EditableTable {
    constructor(table, options = {}) {
      this.table = table;
      this.options = { ...config, ...options };
      this.originalData = new Map();
      this.modifiedCells = new Set();
      this.currentEditingCell = null;
      
      this.init();
    }

    init() {
      this.setupTable();
      this.attachEventListeners();
      this.storeOriginalData();
    }

    setupTable() {
      this.table.classList.add('table-editable-enhanced');
      
      // Add toolbar if doesn't exist
      if (!this.table.closest('.table-editable-wrapper')) {
        this.createWrapper();
      }
    }

    createWrapper() {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-editable-wrapper';
      
      const toolbar = document.createElement('div');
      toolbar.className = 'table-editable-toolbar';
      toolbar.innerHTML = `
        <div class="toolbar-left">
          <button class="btn btn-sm btn-green" data-action="save-all">
            <span class="icon">💾</span> Save All
          </button>
          <button class="btn btn-sm btn-red" data-action="cancel-all">
            <span class="icon">✕</span> Cancel All
          </button>
          <button class="btn btn-sm btn-blue" data-action="reset">
            <span class="icon">↺</span> Reset
          </button>
        </div>
        <div class="toolbar-right">
          <span class="changes-indicator">
            <span class="changes-count">0</span> changes
          </span>
        </div>
      `;
      
      this.table.parentNode.insertBefore(wrapper, this.table);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(this.table);
      
      this.toolbar = toolbar;
      this.attachToolbarListeners();
    }

    attachToolbarListeners() {
      if (!this.toolbar) return;
      
      this.toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;
        
        const action = button.dataset.action;
        
        switch(action) {
          case 'save-all':
            this.saveAllChanges();
            break;
          case 'cancel-all':
            this.cancelAllChanges();
            break;
          case 'reset':
            this.resetToOriginal();
            break;
        }
      });
    }

    attachEventListeners() {
      const cells = this.table.querySelectorAll('tbody td:not(.no-edit):not(.table-action-cell):not(.table-select-cell)');
      
      cells.forEach(cell => {
        // Skip cells with buttons or checkboxes
        if (cell.querySelector('.btn, input, a')) {
          cell.classList.add('no-edit');
          return;
        }
        
        // Add editable indicator
        cell.classList.add('editable');
        
        if (this.options.editOnDoubleClick) {
          cell.addEventListener('dblclick', (e) => this.startEdit(cell));
        }
        
        if (this.options.editOnClick) {
          cell.addEventListener('click', (e) => {
            if (e.target === cell || e.target.closest('.editable')) {
              this.startEdit(cell);
            }
          });
        }
      });
    }

    storeOriginalData() {
      const cells = this.table.querySelectorAll('tbody td.editable');
      cells.forEach((cell, index) => {
        const value = cell.textContent.trim();
        this.originalData.set(cell, value);
        cell.dataset.cellId = index;
      });
    }

    startEdit(cell) {
      // If already editing, finish that first
      if (this.currentEditingCell && this.currentEditingCell !== cell) {
        this.finishEdit(this.currentEditingCell, true);
      }
      
      if (cell.classList.contains('editing')) return;
      
      const value = cell.textContent.trim();
      const cellType = this.detectCellType(cell, value);
      
      cell.classList.add(this.options.editingClass);
      this.currentEditingCell = cell;
      
      const input = this.createInput(cellType, value, cell);
      cell.textContent = '';
      cell.appendChild(input);
      
      input.focus();
      if (input.type === 'text' || input.tagName === 'TEXTAREA') {
        input.select();
      }
      
      // Event listeners for the input
      if (this.options.saveOnBlur) {
        input.addEventListener('blur', () => this.finishEdit(cell, true));
      }
      
      input.addEventListener('keydown', (e) => {
        if (this.options.saveOnEnter && e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.finishEdit(cell, true);
        } else if (this.options.cancelOnEscape && e.key === 'Escape') {
          e.preventDefault();
          this.finishEdit(cell, false);
        }
      });
    }

    detectCellType(cell, value) {
      // Check data attribute first
      if (cell.dataset.type) {
        return cell.dataset.type;
      }
      
      // Auto-detect based on content
      if (!isNaN(value) && value !== '') {
        return 'number';
      }
      
      if (Date.parse(value) && /\d{4}-\d{2}-\d{2}/.test(value)) {
        return 'date';
      }
      
      if (value.includes('@') && value.includes('.')) {
        return 'email';
      }
      
      if (value.startsWith('$') || value.startsWith('€')) {
        return 'currency';
      }
      
      if (value.length > 50) {
        return 'textarea';
      }
      
      return 'text';
    }

    createInput(type, value, cell) {
      let input;
      
      switch(type) {
        case 'textarea':
          input = document.createElement('textarea');
          input.value = value;
          input.rows = 2;
          break;
          
        case 'number':
          input = document.createElement('input');
          input.type = 'number';
          input.value = value.replace(/[^0-9.-]/g, '');
          input.step = 'any';
          break;
          
        case 'date':
          input = document.createElement('input');
          input.type = 'date';
          input.value = value;
          break;
          
        case 'email':
          input = document.createElement('input');
          input.type = 'email';
          input.value = value;
          break;
          
        case 'currency':
          input = document.createElement('input');
          input.type = 'text';
          input.value = value;
          input.pattern = '[0-9.,]+';
          break;
          
        case 'select':
          input = document.createElement('select');
          const options = cell.dataset.options ? cell.dataset.options.split(',') : [];
          options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.trim();
            option.textContent = opt.trim();
            option.selected = opt.trim() === value;
            input.appendChild(option);
          });
          break;
          
        default:
          input = document.createElement('input');
          input.type = 'text';
          input.value = value;
      }
      
      input.className = 'table-edit-input';
      return input;
    }

    finishEdit(cell, save) {
      if (!cell.classList.contains('editing')) return;
      
      const input = cell.querySelector('.table-edit-input');
      if (!input) return;
      
      const newValue = input.value.trim();
      const originalValue = this.originalData.get(cell);
      
      cell.classList.remove(this.options.editingClass);
      this.currentEditingCell = null;
      
      if (save) {
        // Validate
        if (!this.options.allowEmpty && newValue === '') {
          cell.textContent = originalValue;
          cell.classList.add(this.options.errorClass);
          setTimeout(() => cell.classList.remove(this.options.errorClass), 2000);
          this.showNotification('Empty values are not allowed', 'error');
          return;
        }
        
        if (input.type === 'email' && !this.isValidEmail(newValue)) {
          cell.textContent = originalValue;
          cell.classList.add(this.options.errorClass);
          setTimeout(() => cell.classList.remove(this.options.errorClass), 2000);
          this.showNotification('Invalid email address', 'error');
          return;
        }
        
        // Format currency if needed
        let displayValue = newValue;
        if (cell.dataset.type === 'currency' && newValue) {
          displayValue = this.formatCurrency(newValue);
        }
        
        cell.textContent = displayValue;
        
        // Mark as modified if changed
        if (newValue !== originalValue) {
          cell.classList.add(this.options.modifiedClass);
          this.modifiedCells.add(cell);
          cell.dataset.newValue = newValue;
        } else {
          cell.classList.remove(this.options.modifiedClass);
          this.modifiedCells.delete(cell);
          delete cell.dataset.newValue;
        }
      } else {
        // Cancel - restore original
        cell.textContent = originalValue;
      }
      
      this.updateChangesCount();
      this.triggerChangeEvent(cell, save, originalValue, newValue);
    }

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    formatCurrency(value) {
      const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
      if (isNaN(num)) return value;
      return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    saveAllChanges() {
      if (this.modifiedCells.size === 0) {
        this.showNotification('No changes to save', 'info');
        return;
      }
      
      const changes = [];
      this.modifiedCells.forEach(cell => {
        const rowIndex = cell.parentElement.rowIndex;
        const cellIndex = cell.cellIndex;
        const originalValue = this.originalData.get(cell);
        const newValue = cell.dataset.newValue || cell.textContent.trim();
        
        changes.push({
          row: rowIndex,
          col: cellIndex,
          oldValue: originalValue,
          newValue: newValue,
          cell: cell
        });
        
        // Update original data
        this.originalData.set(cell, newValue);
        cell.classList.remove(this.options.modifiedClass);
        delete cell.dataset.newValue;
      });
      
      this.modifiedCells.clear();
      this.updateChangesCount();
      
      // Trigger save event
      this.table.dispatchEvent(new CustomEvent('table-save', {
        detail: { changes }
      }));
      
      this.showNotification(`Saved ${changes.length} change${changes.length > 1 ? 's' : ''}`, 'success');
    }

    cancelAllChanges() {
      if (this.modifiedCells.size === 0) {
        this.showNotification('No changes to cancel', 'info');
        return;
      }
      
      const count = this.modifiedCells.size;
      
      this.modifiedCells.forEach(cell => {
        const originalValue = this.originalData.get(cell);
        cell.textContent = originalValue;
        cell.classList.remove(this.options.modifiedClass);
        delete cell.dataset.newValue;
      });
      
      this.modifiedCells.clear();
      this.updateChangesCount();
      
      this.showNotification(`Cancelled ${count} change${count > 1 ? 's' : ''}`, 'info');
    }

    resetToOriginal() {
      if (confirm('Reset all data to original values? This cannot be undone.')) {
        this.originalData.forEach((value, cell) => {
          cell.textContent = value;
          cell.classList.remove(this.options.modifiedClass);
          delete cell.dataset.newValue;
        });
        
        this.modifiedCells.clear();
        this.updateChangesCount();
        this.showNotification('Table reset to original values', 'info');
      }
    }

    updateChangesCount() {
      const indicator = this.toolbar?.querySelector('.changes-count');
      if (indicator) {
        indicator.textContent = this.modifiedCells.size;
        
        const parent = indicator.closest('.changes-indicator');
        if (this.modifiedCells.size > 0) {
          parent.classList.add('has-changes');
        } else {
          parent.classList.remove('has-changes');
        }
      }
    }

    triggerChangeEvent(cell, saved, oldValue, newValue) {
      this.table.dispatchEvent(new CustomEvent('table-cell-change', {
        detail: {
          cell: cell,
          saved: saved,
          oldValue: oldValue,
          newValue: newValue,
          row: cell.parentElement.rowIndex,
          col: cell.cellIndex
        }
      }));
    }

    showNotification(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `table-notification table-notification-${type}`;
      notification.textContent = message;
      
      const wrapper = this.table.closest('.table-editable-wrapper') || this.table.parentElement;
      wrapper.style.position = 'relative';
      wrapper.appendChild(notification);
      
      // Animate in
      setTimeout(() => notification.classList.add('show'), 10);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    getModifiedData() {
      const data = [];
      this.modifiedCells.forEach(cell => {
        data.push({
          row: cell.parentElement.rowIndex,
          col: cell.cellIndex,
          oldValue: this.originalData.get(cell),
          newValue: cell.dataset.newValue || cell.textContent.trim()
        });
      });
      return data;
    }

    destroy() {
      const cells = this.table.querySelectorAll('tbody td.editable');
      cells.forEach(cell => {
        cell.classList.remove('editable', 'editing', 'modified');
      });
    }
  }

  // =============================================================================
  // AUTO-INITIALIZATION
  // =============================================================================
  
  function initEditableTables() {
    const tables = document.querySelectorAll('.table-editable-advanced');
    
    tables.forEach(table => {
      if (!table.editableInstance) {
        table.editableInstance = new EditableTable(table);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditableTables);
  } else {
    initEditableTables();
  }

  // =============================================================================
  // PUBLIC API
  // =============================================================================
  
  window.AxisUI = window.AxisUI || {};
  window.AxisUI.EditableTable = EditableTable;
  window.AxisUI.initEditableTables = initEditableTables;

})();
