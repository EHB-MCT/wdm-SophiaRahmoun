# Project Standards - Selfie Analysis Pipeline

## Purpose of Standards

Standards ensure consistency, maintainability, and evaluation clarity in academic software projects. They provide a framework for collaborative development, facilitate code review, and demonstrate professional practices. This document defines the mandatory standards followed throughout the Selfie Analysis Pipeline project.

## Technical Scope

- **Frontend**: React Native with Expo framework
- **Backend**: Node.js + Express.js API
- **Database**: MongoDB for data persistence
- **Containerization**: Docker and Docker Compose for deployment
- **External Dependencies**: No external biometric APIs or cloud services

## Coding Conventions

### Component Rules
- **Functional components only**: No class components permitted
- **React Hooks**: Use hooks according to React documentation rules
- **Component purity**: Components must be pure functions of props and state
- **No side effects in render**: All side effects must be in useEffect hooks

### Variable Declarations
- **No `var`**: Use `const` by default, `let` only for reassignment
- **Destructuring**: Prefer destructuring for objects and arrays when appropriate
- **Scope awareness**: Variables declared at the narrowest possible scope

### Logic Separation
- **No logic in JSX**: All business logic must be in functions or hooks
- **Separation of concerns**: UI, state management, and data fetching must be separate
- **Pure functions**: Utility functions must be pure and testable

### Error Handling
- **Try-catch blocks**: Required for all async operations
- **Error boundaries**: Implement error boundaries for React components
- **User feedback**: All errors must provide meaningful user feedback

## Naming Conventions

### Components
- **PascalCase**: All React components must use PascalCase
- **Descriptive names**: Component names must clearly describe their purpose
- **File naming**: Component files must match component names

### Functions and Variables
- **camelCase**: All functions and variables must use camelCase
- **Verb-noun pattern**: Functions should follow verb-noun pattern (e.g., `getUserData`)
- **Boolean prefixes**: Boolean variables should use `is`, `has`, `can` prefixes

### Constants
- **CONSTANT_CASE**: All configuration constants must use CONSTANT_CASE
- **Centralized config**: Configuration values must be in dedicated config files

### Files and Folders
- **camelCase**: Regular files and folders use camelCase
- **index files**: Use index.js for barrel exports
- **Descriptive names**: File names must indicate content clearly

## Styling Rules

### StyleSheet Requirements
- **No inline styles**: All styles must be defined using StyleSheet.create
- **Component-local styles**: Styles must be defined within component files
- **Reusable styles**: Common styles must be extracted to shared files

### Layout Consistency
- **Flexbox usage**: Prefer flexbox for layout over absolute positioning
- **Responsive design**: Styles must accommodate different screen sizes
- **Platform-specific styles**: Use Platform.select when necessary

### Style Organization
- **Logical grouping**: Related styles must be grouped together
- **Naming convention**: Style names must use camelCase with descriptive prefixes
- **Consistent spacing**: Use consistent spacing and sizing units

## Project Structure Rules

### Frontend (React Native)
```
app/
├── (tabs)/          # Tab-based navigation
├── config/          # Configuration files
├── constants/       # App constants
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── _layout.tsx      # Root layout component
└── modal.tsx        # Modal components
```

### Backend (Node.js)
```
backend/
├── controllers/     # Request handlers
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic services
├── middleware/      # Express middleware
└── utils/           # Utility functions
```

### Folder Responsibilities
- **components/**: Reusable UI components with clear interfaces
- **config/**: Environment and application configuration
- **controllers/**: HTTP request handling and response formatting
- **models/**: Database schema and data access methods
- **services/**: Business logic and data processing
- **utils/**: Pure utility functions and helpers

## Architecture Decisions

### Expo Framework Selection
Expo was chosen to simplify React Native development and deployment. It provides:
- Simplified build process and deployment
- Consistent development environment across platforms
- Built-in camera and media handling capabilities
- Reduced native code complexity

### Heuristic Analysis Approach
Analysis is intentionally heuristic and speculative because:
- Real biometric APIs require expensive licensing
- Educational context prohibits production-grade biometric processing
- Demonstrates how proxy data creates biased outcomes
- Highlights ethical concerns in algorithmic systems

### Backend-Admin Separation
Backend and admin dashboard are separated to:
- Maintain clear API boundaries
- Enable independent development and testing
- Demonstrate microservices architecture principles
- Provide distinct user interfaces for different roles

## Tooling and Workflow

### Git Usage
- **Branch naming**: `feature/`, `fix/`, `docs/` prefixes required
- **Commit messages**: Conventional commit format mandatory
- **Pull requests**: Required for all changes except trivial fixes
- **Code review**: All changes must be reviewed before merge

### Docker Standards
- **Multi-service setup**: Use Docker Compose for orchestration
- **Consistent base images**: Use official base images where possible
- **Environment configuration**: All environment variables must be externalized
- **Health checks**: Services must implement health check endpoints

### Development Environment
- **Node version consistency**: Use .nvmrc for version management
- **Dependency management**: Use package-lock.json for reproducible builds
- **Linting**: ESLint configuration must be consistent across projects
- **Testing**: Unit tests for all utility functions and services

## Explicit Limitations

### Biometric Accuracy
- **No scientific accuracy**: Analysis results are not scientifically validated
- **Heuristic processing**: All analysis uses deterministic, heuristic algorithms
- **Educational purpose**: Results are designed to demonstrate bias, not accuracy

### Bias and Repetition
- **Intentional bias**: System is designed to produce biased, repetitive outcomes
- **Proxy data reliance**: Analysis depends on indirect behavioral and contextual data
- **Stereotype reinforcement**: Results may reinforce demographic stereotypes

### Scope and Applicability
- **Educational use only**: Project is not suitable for real-world applications
- **No decision-making capability**: Results must not be used for actual decisions
- **Limited scalability**: Architecture is designed for demonstration, not production

### Ethical Boundaries
- **No real biometric processing**: System does not perform actual face recognition
- **Privacy preservation**: No personal identification is attempted or claimed
- **Transparency requirement**: All limitations must be clearly documented and communicated