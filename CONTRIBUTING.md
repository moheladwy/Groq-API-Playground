# Contributing to Groq API Playground

Thank you for your interest in contributing to the Groq API Playground! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, yarn, or pnpm
- Git
- A Groq API key for testing

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/groq-api-playground.git
   cd groq-api-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Groq API key to .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify setup**
   - Open `http://localhost:5173`
   - Test all features with your API key

## 🛠️ Development Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript with proper type annotations
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Format code consistently (run `npm run format` if available)
- **File naming**: Use kebab-case for files and PascalCase for React components

### Component Structure

```tsx
// Good component structure
import { useState } from 'react';
import { useGroq } from '@/hooks/use-groq';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MyComponent() {
  const { groq, isLoading, hasApiKey } = useGroq();
  const [state, setState] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (!hasApiKey) return <ApiKeyPrompt />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Component</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
}
```

### Project Structure

- `src/components/`: React components
- `src/components/ui/`: Reusable UI components (shadcn/ui)
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions
- `src/types/`: TypeScript type definitions
- `docs/`: Documentation files

### API Integration

Always use the centralized `useGroq` hook for API calls:

```tsx
// ✅ Good
const { groq } = useGroq();
const result = await groq.chat.completions.create({...});

// ❌ Bad
const groq = new Groq({apiKey: '...'});
```

### Error Handling

Implement comprehensive error handling:

```tsx
try {
  const response = await groq.audio.speech.create({...});
  // Handle success
} catch (error) {
  console.error('API call failed:', error);
  setError('Failed to generate speech. Please try again.');
}
```

## 📝 Commit Guidelines

### Commit Message Format

Use the conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(tts): add support for new voice models
fix(api): handle rate limiting errors gracefully
docs(readme): update installation instructions
style(components): fix linting issues
```

## 🔍 Pull Request Process

### Before Submitting

1. **Test thoroughly**
   - Test all affected features
   - Test with and without API key
   - Test on different screen sizes

2. **Run quality checks**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Update documentation**
   - Update README if needed
   - Add/update JSDoc comments
   - Update type definitions

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested with API key
- [ ] Tested without API key
- [ ] Mobile responsive

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```

### Feature Requests

```markdown
## Feature Description
Clear description of the feature

## Problem it Solves
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Text-to-Speech functionality
- [ ] Speech-to-Text functionality  
- [ ] Image analysis functionality
- [ ] API key management
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states

### Browser Testing

Test on major browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Documentation

### Code Documentation

- Add JSDoc comments to functions
- Include examples in complex components
- Document prop types clearly

```tsx
/**
 * Generates speech from text using Groq TTS
 * @param text - The text to convert to speech
 * @param voice - The voice ID to use
 * @param language - The language code
 * @returns Promise<AudioBlob>
 */
const generateSpeech = async (text: string, voice: string, language: string) => {
  // Implementation
};
```

### README Updates

When adding new features:
1. Update feature list
2. Add usage examples
3. Update screenshots if needed
4. Update dependencies list

## 🔧 Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # Check TypeScript

# Dependencies
npm run deps:update     # Update dependencies
npm run deps:check      # Check for outdated packages
```

### IDE Setup

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🎯 Contribution Areas

We welcome contributions in these areas:

### High Priority
- Bug fixes and performance improvements
- Accessibility improvements
- Mobile responsiveness
- Error handling enhancements

### Medium Priority
- New voice models support
- Additional language support
- UI/UX improvements
- Documentation improvements

### Low Priority
- Code refactoring
- Performance optimizations
- New features (discuss first)

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the `/docs` folder
- **Code Review**: Tag maintainers for review

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- GitHub contributors page

## 📋 Checklist for Maintainers

### Code Review
- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Performance impact considered

### Release Process
- [ ] Version bumped appropriately
- [ ] Changelog updated
- [ ] Release notes written
- [ ] Documentation updated

## 🤝 Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 🙏 Thank You

Your contributions help make this project better for everyone. Thank you for taking the time to contribute!

---

**Happy Contributing! 🚀**