/******/ (function() { // webpackBootstrap
/*!***************************!*\
  !*** ./src/js/sidebar.js ***!
  \***************************/
/**
 * AxisUI Sidebar Component - Minimal JavaScript
 * Handles sidebar toggle, collapse, and submenu functionality
 */

(function() {
    'use strict';
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        setupSidebarToggles();
        setupSubmenuToggles();
        setupMobileHandlers();
        fixSidebarLinks();
    }
    
    // Fix sidebar navigation links for subdirectory pages
    function fixSidebarLinks() {
        const currentPath = window.location.pathname;
        
        // Find the depth from /html/
        const htmlIndex = currentPath.indexOf('/html/');
        if (htmlIndex === -1) return;
        
        const afterHtml = currentPath.substring(htmlIndex + 6); // after /html/
        const depth = (afterHtml.match(/\//g) || []).length;
        
        if (depth === 0) return; // at root level
        
        const prefix = '../'.repeat(depth);
        
        // Find all sidebar links
        const sidebar = document.querySelector('.sidebar-nav');
        if (!sidebar) return;
        
        const links = sidebar.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
                link.setAttribute('href', prefix + href);
            }
        });
    }
    
    // Setup sidebar collapse/expand toggles
    function setupSidebarToggles() {
        const toggles = document.querySelectorAll('.sidebar-toggle');
        
        toggles.forEach(function(btn, index) {
            // Add visual feedback
            btn.style.cursor = 'pointer';
            
            btn.addEventListener('click', function(e) {
                console.log('=== CLICK EVENT FIRED ===', index);
                e.preventDefault();
                e.stopPropagation();
                
                const sidebar = this.closest('.sidebar');
                if (!sidebar) {
                    console.log('No sidebar parent found');
                    return;
                }
                // Toggle collapsed or minimized based on current classes
                if (sidebar.classList.contains('collapsed') || sidebar.classList.contains('minimized')) {
                    sidebar.classList.remove('collapsed', 'minimized');
                } else {
                    // Check if sidebar has minimized class initially, otherwise use collapsed
                    const useMinimized = sidebar.id === 'sidebar5';
                    sidebar.classList.add(useMinimized ? 'minimized' : 'collapsed');
                }
            }, { capture: false, passive: false });
        });
    }
    
    // Setup mobile menu toggles
    function setupMobileHandlers() {
        // Mobile menu toggle buttons
        const mobileToggles = document.querySelectorAll('.mobile-menu-toggle, .toggle-btn');
        
        mobileToggles.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the associated sidebar
                const wrapper = this.closest('.sidebar-wrapper');
                if (!wrapper) {
                    console.log('No wrapper found');
                    return;
                }
                
                const sidebar = wrapper.querySelector('.sidebar');
                const backdrop = wrapper.querySelector('.sidebar-backdrop');
                
                if (sidebar) {
                    const isOpen = sidebar.classList.toggle('open');
                    
                    // Toggle button icon
                    if (isOpen) {
                        this.classList.add('active');
                    } else {
                        this.classList.remove('active');
                    }
                    
                    // Toggle backdrop
                    if (backdrop) {
                        if (isOpen) {
                            backdrop.classList.add('active');
                        } else {
                            backdrop.classList.remove('active');
                        }
                    }
                }
            });
        });
        
        // Close sidebar when clicking backdrop
        document.querySelectorAll('.sidebar-backdrop').forEach(function(backdrop) {
            backdrop.addEventListener('click', function(e) {
                const wrapper = this.closest('.sidebar-wrapper');
                if (wrapper) {
                    const sidebar = wrapper.querySelector('.sidebar');
                    const toggleBtn = wrapper.querySelector('.mobile-menu-toggle, .toggle-btn');
                    if (sidebar) {
                        sidebar.classList.remove('open');
                        this.classList.remove('active');
                        if (toggleBtn) {
                            toggleBtn.classList.remove('active');
                        }
                    }
                }
            });
        });
        
        // Close sidebar when clicking outside (mobile only)
        document.addEventListener('click', function(e) {
            if (window.innerWidth > 768) return;
            
            const openSidebars = document.querySelectorAll('.sidebar.open');
            openSidebars.forEach(function(sidebar) {
                if (!sidebar.contains(e.target)) {
                    const wrapper = sidebar.closest('.sidebar-wrapper');
                    const toggleBtn = wrapper ? wrapper.querySelector('.mobile-menu-toggle, .toggle-btn') : null;
                    const backdrop = wrapper ? wrapper.querySelector('.sidebar-backdrop') : null;
                    
                    if (!toggleBtn || !toggleBtn.contains(e.target)) {
                        sidebar.classList.remove('open');
                        if (toggleBtn) {
                            toggleBtn.classList.remove('active');
                        }
                        if (backdrop) {
                            backdrop.classList.remove('active');
                        }
                    }
                }
            });
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.sidebar.open').forEach(function(sidebar) {
                    sidebar.classList.remove('open');
                    const wrapper = sidebar.closest('.sidebar-wrapper');
                    if (wrapper) {
                        const backdrop = wrapper.querySelector('.sidebar-backdrop');
                        const toggleBtn = wrapper.querySelector('.mobile-menu-toggle, .toggle-btn');
                        if (backdrop) {
                            backdrop.classList.remove('active');
                        }
                        if (toggleBtn) {
                            toggleBtn.classList.remove('active');
                        }
                    }
                });
            }
        });
        
        // Clean up on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    document.querySelectorAll('.sidebar.open').forEach(function(sidebar) {
                        sidebar.classList.remove('open');
                        const wrapper = sidebar.closest('.sidebar-wrapper');
                        if (wrapper) {
                            const backdrop = wrapper.querySelector('.sidebar-backdrop');
                            const toggleBtn = wrapper.querySelector('.mobile-menu-toggle, .toggle-btn');
                            if (backdrop) {
                                backdrop.classList.remove('active');
                            }
                            if (toggleBtn) {
                                toggleBtn.classList.remove('active');
                            }
                        }
                    });
                }
            }, 250);
        });
    }
    
    // Setup submenu toggle functionality
    function setupSubmenuToggles() {
        document.querySelectorAll('.sidebar-nav .item.has-submenu').forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const submenu = this.nextElementSibling;
                if (!submenu || !submenu.classList.contains('submenu')) return;
                
                // Toggle current submenu
                const isOpen = this.classList.contains('open');
                
                // Close other submenus in same nav (optional)
                const nav = this.closest('.sidebar-nav');
                if (nav) {
                    nav.querySelectorAll('.item.has-submenu.open').forEach(function(openItem) {
                        if (openItem !== item) {
                            openItem.classList.remove('open');
                            const openSubmenu = openItem.nextElementSibling;
                            if (openSubmenu) {
                                openSubmenu.classList.remove('open');
                            }
                        }
                    });
                }
                
                // Toggle current
                this.classList.toggle('open');
                submenu.classList.toggle('open');
            });
        });
        
        // Prevent submenu links from closing the submenu
        document.querySelectorAll('.submenu .item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    }
    
})();

/******/ })()
;
//# sourceMappingURL=axis-sidebar.js.map