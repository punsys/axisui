// =============================================================================
// TABLE.JS - AxisUI Framework Table Interactive Features
// Handles sortable columns, selectable rows, and other table interactions
// =============================================================================

(function() {
  'use strict';

  // =============================================================================
  // SORTABLE TABLES
  // =============================================================================
  
  function initSortableTables() {
    const sortableTables = document.querySelectorAll('.table-sortable, .table-sortable-enhanced');
    
    sortableTables.forEach(table => {
      const headers = table.querySelectorAll('th.sortable');
      
      headers.forEach((header, columnIndex) => {
        // Skip if already initialized
        if (header.dataset.sortInitialized) return;
        header.dataset.sortInitialized = 'true';
        
        header.style.cursor = 'pointer';
        
        header.addEventListener('click', function() {
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          
          // Determine current sort direction
          let direction = 'asc';
          if (header.classList.contains('sort-asc')) {
            direction = 'desc';
          }
          
          // Remove sort classes from all headers
          headers.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
          });
          
          // Add appropriate class to clicked header
          header.classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
          
          // Sort rows
          rows.sort((a, b) => {
            const aCell = a.cells[columnIndex];
            const bCell = b.cells[columnIndex];
            
            if (!aCell || !bCell) return 0;
            
            let aValue = aCell.textContent.trim();
            let bValue = bCell.textContent.trim();
            
            // Try to parse as numbers
            const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
            const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return direction === 'asc' ? aNum - bNum : bNum - aNum;
            }
            
            // Try to parse as dates
            const aDate = Date.parse(aValue);
            const bDate = Date.parse(bValue);
            
            if (!isNaN(aDate) && !isNaN(bDate)) {
              return direction === 'asc' ? aDate - bDate : bDate - aDate;
            }
            
            // String comparison
            if (direction === 'asc') {
              return aValue.localeCompare(bValue);
            } else {
              return bValue.localeCompare(aValue);
            }
          });
          
          // Re-append sorted rows
          rows.forEach(row => tbody.appendChild(row));
        });
      });
    });
  }

  // =============================================================================
  // SELECTABLE TABLES
  // =============================================================================
  
  function initSelectableTables() {
    const selectableTables = document.querySelectorAll('.table-selectable, .table-multi-select');
    
    selectableTables.forEach(table => {
      // Select all checkbox
      const selectAllCheckbox = table.querySelector('thead input[type="checkbox"]');
      const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');
      const rows = table.querySelectorAll('tbody tr');
      
      if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
          const isChecked = this.checked;
          
          rowCheckboxes.forEach((checkbox, index) => {
            checkbox.checked = isChecked;
            
            if (isChecked) {
              rows[index].classList.add('selected');
            } else {
              rows[index].classList.remove('selected');
            }
          });
        });
      }
      
      // Individual row checkboxes
      rowCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            rows[index].classList.add('selected');
          } else {
            rows[index].classList.remove('selected');
          }
          
          // Update select all checkbox state
          if (selectAllCheckbox) {
            const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
            
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = someChecked && !allChecked;
          }
        });
      });
      
      // Click on row to toggle (except when clicking checkbox or buttons)
      rows.forEach((row, index) => {
        row.addEventListener('click', function(e) {
          // Don't toggle if clicking on checkbox, button, or link
          if (e.target.type === 'checkbox' || 
              e.target.tagName === 'BUTTON' || 
              e.target.tagName === 'A' ||
              e.target.closest('button') ||
              e.target.closest('a')) {
            return;
          }
          
          const checkbox = rowCheckboxes[index];
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
          }
        });
      });
    });
  }

  // =============================================================================
  // EXPANDABLE TABLES
  // =============================================================================
  
  function initExpandableTables() {
    const expandableTables = document.querySelectorAll('.table-expandable');
    
    expandableTables.forEach(table => {
      const rows = table.querySelectorAll('tbody tr:not(.expand-content)');
      
      rows.forEach(row => {
        // Skip if already initialized
        if (row.dataset.expandInitialized) return;
        row.dataset.expandInitialized = 'true';
        
        const expandContent = row.nextElementSibling;
        if (expandContent && expandContent.classList.contains('expand-content')) {
          row.style.cursor = 'pointer';
          
          row.addEventListener('click', function(e) {
            // Don't toggle if clicking on checkbox, button, or link
            if (e.target.type === 'checkbox' || 
                e.target.tagName === 'BUTTON' || 
                e.target.tagName === 'A' ||
                e.target.closest('button') ||
                e.target.closest('a')) {
              return;
            }
            
            this.classList.toggle('expanded');
            expandContent.classList.toggle('show');
          });
        }
      });
    });
  }

  // =============================================================================
  // EDITABLE TABLES
  // =============================================================================
  
  function initEditableTables() {
    const editableTables = document.querySelectorAll('.table-editable');
    
    editableTables.forEach(table => {
      const cells = table.querySelectorAll('tbody td');
      
      cells.forEach(cell => {
        // Skip if already has input or initialized
        if (cell.querySelector('input') || cell.dataset.editInitialized) return;
        cell.dataset.editInitialized = 'true';
        
        const originalValue = cell.textContent;
        
        cell.addEventListener('dblclick', function() {
          const input = document.createElement('input');
          input.type = 'text';
          input.value = this.textContent;
          input.style.width = '100%';
          input.style.border = 'none';
          input.style.background = 'transparent';
          input.style.padding = '0';
          input.style.font = 'inherit';
          
          this.textContent = '';
          this.appendChild(input);
          input.focus();
          input.select();
          
          const saveEdit = () => {
            const newValue = input.value || originalValue;
            cell.textContent = newValue;
          };
          
          input.addEventListener('blur', saveEdit);
          input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
              saveEdit();
            } else if (e.key === 'Escape') {
              cell.textContent = originalValue;
            }
          });
        });
      });
    });
  }

  // =============================================================================
  // TABLE NUMBERED ROWS
  // =============================================================================
  
  function initNumberedTables() {
    const numberedTables = document.querySelectorAll('.table-numbered');
    
    numberedTables.forEach(table => {
      // CSS counter handles this, but we can add aria labels for accessibility
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row, index) => {
        row.setAttribute('aria-rowindex', index + 1);
      });
    });
  }

  // =============================================================================
  // LOADING STATE TOGGLE (for demo purposes)
  // =============================================================================
  
  window.toggleTableLoading = function(tableSelector) {
    const table = document.querySelector(tableSelector);
    if (table) {
      table.classList.toggle('table-loading');
    }
  };

  // =============================================================================
  // INITIALIZATION
  // =============================================================================
  
  function initTables() {
    initSortableTables();
    initSelectableTables();
    initExpandableTables();
    initEditableTables();
    initNumberedTables();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTables);
  } else {
    initTables();
  }

  // Re-initialize when new content is added dynamically
  window.AxisUI = window.AxisUI || {};
  window.AxisUI.reinitTables = initTables;

  // =============================================================================
  // PUBLIC API
  // =============================================================================
  
  window.AxisUI.Table = {
    sort: initSortableTables,
    select: initSelectableTables,
    expand: initExpandableTables,
    edit: initEditableTables,
    number: initNumberedTables,
    reinit: initTables
  };

})();
