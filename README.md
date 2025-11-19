# AxisUI Framework

**Pure CSS power without the JavaScript complexity.**

A modern, lightweight, responsive CSS framework built with SCSS, featuring a comprehensive design system, utility classes, and component styles - **optimized for both human developers and AI assistants like GitHub Copilot**.

## ✨ Features

- **Pure CSS**: Zero JavaScript dependencies - 100% CSS only
- **Responsive Design**: Mobile-first approach with modern grid and flexbox
- **Design System**: Consistent colors, typography, and spacing scale
- **Component Library**: Pre-built UI components (buttons, cards, forms, modals, tables, etc.)
- **Utility-First Classes**: Flexible utility system for rapid prototyping
- **Dark Mode Support**: Comprehensive dark mode with CSS-only toggle
- **AI-Friendly Documentation**: Complete class references for AI code generation
- **Copilot-Optimized**: Special instructions file for GitHub Copilot integration
- **Cross-Browser Compatible**: Works across all modern browsers
- **Accessibility-First**: WCAG 2.1 AA compliant components

## 🚀 Quick Start

### 1. Include the CSS
```html
<link rel="stylesheet" href="dist/assets/css/axis-ui.css">
```

### 2. Wrap Your Content (REQUIRED)
```html
<div class="axis-ui">
  <!-- All your content must be inside this container -->
  <button class="btn btn-blue">Click Me</button>
</div>
```

### 3. Start Building
```html
<div class="axis-ui">
  <div class="container">
    <h1 class="text-3xl fw-bold">Hello AxisUI!</h1>
    <div class="card">
      <div class="card-body">
        <p>Your content here</p>
        <button class="btn btn-blue">Action</button>
      </div>
    </div>
  </div>
</div>
```

**That's it!** See [Quick Start Guide](docs/QUICK_START.md) for more details.

## 📚 Documentation

### For Developers
- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[Complete Class Reference](docs/CLASS_REFERENCE.md)** - All available classes and utilities
- **[Component Templates](docs/COMPONENT_TEMPLATES.html)** - Copy-paste ready HTML templates
- **[Dark Mode Guide](docs/DARK_MODE_IMPLEMENTATION.md)** - Dark mode implementation details

### For AI Assistants (GitHub Copilot)
- **[.copilot-instructions.md](.copilot-instructions.md)** - Framework-specific instructions for GitHub Copilot
- **Inline CSS Documentation** - Quick reference in `dist/assets/css/axis-ui.css` header
- **Pattern Recognition** - Consistent naming conventions for better AI code generation

## 🎯 Key Principles

### The Golden Rules

1. ✅ **ALWAYS wrap content in `.axis-ui` container** (styles won't work without it)
2. ✅ **No class prefixes** - Use `.btn`, not `.ax-btn`
3. ✅ **Direct color naming** - Use `blue`, `red`, `green` (not `primary`, `danger`, `success`)
4. ✅ **Three color variants** - `color-light`, `color`, `color-dark` (not `color-100`, `color-500`)
5. ✅ **Mobile-first responsive** - Start with mobile, scale up
6. ✅ **No inline styles** - Use framework classes

### Example: ✅ Correct vs ❌ Wrong

```html
<!-- ✅ CORRECT -->
<div class="axis-ui">
  <button class="btn btn-blue">Blue Button</button>
  <div class="alert alert-red">Error message</div>
  <span class="text-green-dark">Dark green text</span>
</div>

<!-- ❌ WRONG -->
<button class="ax-btn btn-primary">Button</button>
<div class="alert alert-danger">Error</div>
<span class="text-green-700">Text</span>
```

## 🎨 Color System

**Available Colors:** blue, red, green, yellow, orange, purple, pink, teal, cyan, indigo

**Each color has 3 variants:**
- `{color}-light` - Lighter shade
- `{color}` - Normal shade
- `{color}-dark` - Darker shade

```html
<!-- Buttons -->
<button class="btn btn-blue">Blue</button>
<button class="btn btn-red">Red</button>
<button class="btn btn-green">Green</button>

<!-- Backgrounds -->
<div class="bg-blue-light">Light blue background</div>
<div class="bg-red">Red background</div>
<div class="bg-green-dark">Dark green background</div>

<!-- Text -->
<span class="text-blue">Blue text</span>
<span class="text-red-light">Light red text</span>
<span class="text-green-dark">Dark green text</span>
```

## 🌓 Dark Mode

AxisUI includes comprehensive dark mode support with multiple activation methods:

### Automatic (System Preference)
```html
<!-- Automatically adapts based on user's system preference -->
<!-- No code needed! -->
```

### CSS-Only Toggle
```html
<input type="checkbox" id="darkToggle" class="dark-mode-toggle">
<label for="darkToggle">Dark Mode</label>
```

### Manual Override
```html
<html data-theme="dark">
  <!-- Content -->
</html>
```

### Dark Mode Adaptive Classes
Use these for elements that should adapt to dark/light mode:
- `.bg-body`, `.bg-surface`, `.bg-card` - Adaptive backgrounds
- `.text-primary`, `.text-secondary`, `.text-muted` - Adaptive text colors

Use direct colors (`.btn-blue`, `.alert-red`) for components that should maintain their identity.

## 📦 Components

## Emoji Icon System

AxisUI includes a comprehensive emoji-based icon system using pure CSS pseudo-elements. All icons are rendered using emoji characters for consistency and accessibility.

### Usage

Add icons using the `.emoji` base class combined with specific icon classes:

```html
<!-- Decorative icon (no screen reader announcement) -->
<span class="emoji emoji-home" aria-hidden="true"></span>

<!-- Semantic icon (announced by screen readers) -->
<span class="emoji emoji-home" role="img" aria-label="Home"></span>
```

### Icon Sizes

Control icon size with size modifiers:

```html
<span class="emoji emoji-star emoji-xs" aria-hidden="true"></span>  <!-- 12px -->
<span class="emoji emoji-star emoji-sm" aria-hidden="true"></span>  <!-- 14px -->
<span class="emoji emoji-star emoji-md" aria-hidden="true"></span>  <!-- 16px (default) -->
<span class="emoji emoji-star emoji-lg" aria-hidden="true"></span>  <!-- 20px -->
<span class="emoji emoji-star emoji-xl" aria-hidden="true"></span>  <!-- 24px -->
<span class="emoji emoji-star emoji-xxl" aria-hidden="true"></span> <!-- 32px -->
```

### Icon Colors

Apply colors using direct color names:

```html
<span class="emoji emoji-check emoji-green" aria-hidden="true"></span>
<span class="emoji emoji-warning emoji-red" aria-hidden="true"></span>
<span class="emoji emoji-info emoji-blue" aria-hidden="true"></span>
```

### Available Icons

- **Arrows**: `emoji-arrow-right`, `emoji-arrow-left`, `emoji-arrow-up`, `emoji-arrow-down`
- **Interface**: `emoji-close`, `emoji-menu`, `emoji-plus`, `emoji-minus`, `emoji-search`
- **Status**: `emoji-loading`, `emoji-check`, `emoji-warning`, `emoji-error`, `emoji-info`
- **Social/Utility**: `emoji-heart`, `emoji-star`, `emoji-share`, `emoji-download`, `emoji-upload`, `emoji-link`, `emoji-mail`, `emoji-phone`, `emoji-home`, `emoji-user`, `emoji-users`, `emoji-settings`, `emoji-calendar`, `emoji-clock`, `emoji-folder`, `emoji-file`
- **Business**: `emoji-stats`, `emoji-chart-up`, `emoji-money`, `emoji-target`
- **Misc**: `emoji-dot`, `emoji-rocket`, `emoji-palette`, `emoji-mobile`, `emoji-flash`, `emoji-tools`, `emoji-note`, `emoji-eye`, `emoji-globe`, `emoji-shop`, `emoji-bell`, `emoji-lock`, `emoji-sparkle`, `emoji-chart-down`
- **Geometric**: `emoji-circle`, `emoji-square`, `emoji-triangle`, `emoji-diamond`

### Accessibility

- **Decorative icons**: Use `aria-hidden="true"` to hide from screen readers
- **Semantic icons**: Use `role="img"` and `aria-label="description"` for meaningful icons
- All icons inherit color from their parent or use the `currentColor` value

### Animations

Add motion to icons:

```html
<span class="emoji emoji-loading emoji-spin" aria-hidden="true"></span>
<span class="emoji emoji-heart emoji-pulse" aria-hidden="true"></span>
<span class="emoji emoji-star emoji-bounce" aria-hidden="true"></span>
```

## Components

AxisUI provides pre-built components including:

- Buttons
- Cards
- Modals
- Forms
- Navigation (navbar, sidebar)
- Tables
- Alerts
- Badges
- Progress bars
- And more...

## Customization

The framework uses SCSS variables for easy customization. Key variables include:

- Colors: `$ax-blue`, `$ax-red`, `$ax-green`, etc.
- Spacing: `$ax-spacing-unit`
- Typography: Font families, sizes, and weights
- Breakpoints: Responsive design breakpoints

## Build System

Compile the framework using the included webpack configuration:

```bash
npm install
npm run build
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License
**AxisUI Framework** - Pure CSS power without the JavaScript complexity.
