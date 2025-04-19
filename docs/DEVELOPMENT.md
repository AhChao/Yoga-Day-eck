# Development Guide

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd yoga-day-eck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Code Organization

#### Component Structure
Components follow a functional pattern with hooks:
```javascript
function ComponentName({ prop1, prop2 }) {
  // State hooks
  const [state, setState] = useState(initial)

  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies])

  // Event handlers
  const handleEvent = () => {
    // Event logic
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### State Management
- Use React's built-in state management
- Lift state up when needed
- Use context for global state
- Persist to localStorage where needed

### Data Flow
1. User interactions trigger event handlers
2. Event handlers update state
3. State changes trigger re-renders
4. LocalStorage syncs on state changes

## Adding New Features

### New Asanas
1. Add asana data to the static asanas array
2. Include all required fields:
   - id
   - name
   - description
   - difficulty
   - benefits
   - tags

### New Flow Features
1. Update Flow model if needed
2. Add UI components
3. Implement state management
4. Add event handlers
5. Update documentation

### New Tags
1. Add tag to available tags list
2. Update UI to show new tag
3. Ensure filtering works with new tag

## Testing

### Manual Testing Checklist
1. Flow Creation
   - [ ] Create new flow
   - [ ] Add asanas
   - [ ] Add tags
   - [ ] Set duration
   - [ ] Save flow

2. Flow Editing
   - [ ] Edit flow details
   - [ ] Add/remove asanas
   - [ ] Reorder asanas
   - [ ] Add/remove tags
   - [ ] Save changes

3. Flow Management
   - [ ] Filter flows
   - [ ] Delete flow
   - [ ] Clear filters
   - [ ] Persistence check

## Deployment

### Build Process
1. Create production build:
   ```bash
   npm run build
   ```

2. Test production build:
   ```bash
   npm run preview
   ```

### Deployment Checklist
- [ ] Run all tests
- [ ] Create production build
- [ ] Test build locally
- [ ] Deploy to hosting platform
- [ ] Verify deployment
- [ ] Check all features

## Troubleshooting

### Common Issues

#### State Updates Not Reflecting
1. Check component re-render
2. Verify state update syntax
3. Check parent component props

#### Drag and Drop Issues
1. Verify DnD context
2. Check drag handle refs
3. Verify sort algorithm

#### LocalStorage Issues
1. Clear localStorage
2. Check data structure
3. Verify persistence logic

## Best Practices

### Code Style
- Use meaningful variable names
- Comment complex logic
- Keep components focused
- Use TypeScript types/JSDoc
- Follow React hooks rules

### Performance
- Memoize callbacks
- Use React.memo where needed
- Optimize re-renders
- Lazy load components
- Use proper key props

### Accessibility
- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast

## Contributing

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Make changes
4. Update documentation
5. Submit pull request

### Code Review Guidelines
- Check code style
- Verify functionality
- Review documentation
- Test edge cases
- Check performance impact
