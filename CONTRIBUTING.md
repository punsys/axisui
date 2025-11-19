# Contributing to AxisUI

Thank you for your interest in contributing to AxisUI! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Follow the project's guidelines

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Basic knowledge of SCSS/CSS
- Git for version control

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/axis-ui.git
   cd axis-ui
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development:
   ```bash
   npm run dev
   ```

## Development Workflow

### Project Structure

```
axis-ui/
├── src/
│   ├── scss/
│   │   ├── abstracts/    # Variables, mixins, functions
│   │   ├── base/         # Reset, base styles
│   │   ├── components/   # UI components
│   │   ├── elements/     # Typography, tables
│   │   ├── layouts/      # Grid, containers
│   │   ├── utilities/    # Utility classes
│   │   └── axis-ui.scss  # Main entry point
│   ├── html/             # Example pages
│   └── js/               # Optional JavaScript
├── dist/                 # Compiled CSS
├── docs/                 # Documentation
└── webpack.config.js     # Build configuration
```

### Available Scripts

```bash
npm run dev          # Development build
npm run dev:serve    # Dev build with hot reload
npm run build        # Production build
npm run watch        # Watch mode
npm run clean        # Clean build directory
```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes:
   ```bash
   npm run build
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## Coding Standards

### SCSS Guidelines

1. **Container Scoping**: All classes MUST be scoped under `.axis-ui`
   ```scss
   .axis-ui {
     .btn {
       // Button styles
     }
   }
   ```

2. **Variable Naming**: Use `$ax-` prefix for variables
   ```scss
   $ax-blue: #3b82f6;
   $ax-spacing-unit: 0.25rem;
   ```

3. **Direct Color Names**: NO semantic abstractions
   ```scss
   // ✅ CORRECT
   .btn-blue { }
   .btn-red { }
   
   // ❌ WRONG
   .btn-primary { }
   .btn-danger { }
   ```

4. **Three Color Variants**: Each color must have light, normal, dark
   ```scss
   .btn-blue-light { }
   .btn-blue { }
   .btn-blue-dark { }
   ```

5. **No Class Prefixes**: Classes should NOT have prefixes in HTML
   ```scss
   // ✅ CORRECT
   .btn { }
   .card { }
   
   // ❌ WRONG
   .ax-btn { }
   .axis-card { }
   ```

6. **BEM-like Structure**: Use clear, descriptive class names
   ```scss
   .card { }
   .card-header { }
   .card-body { }
   .card-footer { }
   ```

### CSS Best Practices

- Keep selectors simple and flat
- Avoid deep nesting (max 3 levels)
- Use variables for repeated values
- Add comments for complex logic
- Maintain mobile-first responsive design
- Test in multiple browsers

### File Organization

- **abstracts/**: Global variables, mixins, functions (no CSS output)
- **base/**: Reset styles, typography base
- **components/**: Self-contained UI components
- **layouts/**: Grid system, containers, layout utilities
- **utilities/**: Single-purpose utility classes

### Naming Conventions

- **Classes**: Lowercase with hyphens (kebab-case)
- **Variables**: Lowercase with hyphens, `$ax-` prefix
- **Mixins**: Lowercase with hyphens
- **Files**: Lowercase with hyphens, underscore prefix for partials

## Submitting Changes

### Pull Request Process

1. **Update Documentation**: If you add features, update relevant docs
   - Update `docs/AXIS_UI_COMPLETE_GUIDE.md`
   - Update `README.md` if needed
   - Add examples to `docs/COMPONENT_TEMPLATES_ACTUAL.html`

2. **Test Thoroughly**:
   - Build succeeds: `npm run build`
   - No console errors
   - Works in Chrome, Firefox, Safari, Edge
   - Mobile responsive

3. **Commit Message Format**:
   ```
   type(scope): subject
   
   body (optional)
   
   footer (optional)
   ```
   
   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   
   Examples:
   ```
   feat(button): add loading state
   fix(modal): correct z-index issue
   docs(readme): update installation steps
   ```

4. **Submit Pull Request**:
   - Clear title describing the change
   - Detailed description of what and why
   - Link to related issues
   - Screenshots for visual changes

5. **Code Review**:
   - Address reviewer feedback
   - Keep PR focused and small
   - Be patient and respectful

### Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] All classes are scoped under `.axis-ui`
- [ ] Variables use `$ax-` prefix
- [ ] Colors use direct names (not semantic)
- [ ] Each color has 3 variants (light, normal, dark)
- [ ] Build completes without errors
- [ ] Changes work in major browsers
- [ ] Documentation is updated
- [ ] Examples are added if applicable
- [ ] Commit messages follow convention
- [ ] No unnecessary files included

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Browser and version
   - Operating system
   - AxisUI version
6. **Screenshots**: If applicable
7. **Code Example**: Minimal reproducible example

### Feature Requests

When requesting features, include:

1. **Use Case**: Why is this needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions considered
4. **Examples**: Visual mockups or code examples

## Component Development Guidelines

### Adding New Components

1. **Create SCSS file**: `src/scss/components/_your-component.scss`
2. **Follow structure**:
   ```scss
   .axis-ui {
     .your-component {
       // Base styles
       
       // Modifiers
       &-variant { }
       
       // Sizes
       &-sm { }
       &-lg { }
       
       // States
       &:hover { }
       &:focus { }
       &:disabled { }
       
       // Color variants
       @each $color in (blue, red, green) {
         &-#{$color} { }
         &-#{$color}-light { }
         &-#{$color}-dark { }
       }
     }
   }
   ```

3. **Import in main file**: Add to `src/scss/axis-ui.scss`
4. **Create examples**: Add to `src/html/components/`
5. **Document**: Add to `docs/AXIS_UI_COMPLETE_GUIDE.md`
6. **Update templates**: Add to `docs/COMPONENT_TEMPLATES_ACTUAL.html`

### Component Checklist

- [ ] Follows container scoping
- [ ] All 12 colors with 3 variants each
- [ ] Multiple sizes (xs, sm, md, lg, xl)
- [ ] Responsive (mobile-first)
- [ ] Dark mode compatible
- [ ] Accessible (keyboard, screen readers)
- [ ] Documented with examples
- [ ] No JavaScript required (unless absolutely necessary)

## Questions?

- Check existing [documentation](docs/)
- Review [existing issues](https://github.com/YOUR-USERNAME/axis-ui/issues)
- Read [complete guide](docs/AXIS_UI_COMPLETE_GUIDE.md)
- Ask in discussions or create an issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AxisUI! 🎉
