# Contributing to Social Hub

Thank you for your interest in contributing to Social Hub! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/social-media.git
   cd social-hub
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Abhinav4005/social-media.git
   ```
4. **Install dependencies** for both backend and frontend (see main README.md)
5. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch (if applicable)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Branch Naming Convention

```
feature/add-user-profile-editing
fix/chat-message-duplication
docs/update-api-documentation
refactor/optimize-post-queries
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Coding Standards

### JavaScript/React Style Guide

#### General Principles

- Use **ES6+ syntax** (arrow functions, destructuring, template literals)
- Prefer **functional components** with hooks over class components
- Keep components **small and focused** (single responsibility)
- Use **meaningful variable names** (avoid single letters except in loops)

#### File Naming

- **Components:** PascalCase (e.g., `UserProfile.jsx`, `PostCard.jsx`)
- **Utilities:** camelCase (e.g., `formatDate.js`, `apiClient.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

#### Code Formatting

```javascript
// Good
const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Bad
const fetchUserData = async (userId) => {
    try{
        const response=await axios.get('/user/'+userId)
        return response.data
    }catch(error){
        console.error(error)
        throw error
    }
}
```

#### React Component Structure

```jsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// 2. Component
const UserProfile = ({ userId, onUpdate }) => {
  // 3. Hooks
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);

  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [userId]);

  // 5. Handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 6. Render
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
};

// 7. PropTypes
UserProfile.propTypes = {
  userId: PropTypes.number.isRequired,
  onUpdate: PropTypes.func,
};

// 8. Export
export default UserProfile;
```

### Styling Guidelines

#### Tailwind CSS Best Practices

1. **Use the centralized theme system**:
   ```jsx
   // Good - Uses theme colors
   <button className="bg-primary-600 hover:bg-primary-700">Click</button>
   
   // Bad - Hardcoded colors
   <button className="bg-blue-600 hover:bg-blue-700">Click</button>
   ```

2. **Group related classes**:
   ```jsx
   // Good
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
   
   // Bad
   <div className="flex p-4 items-center bg-white justify-between rounded-lg shadow-md">
   ```

3. **Extract repeated patterns** into reusable components:
   ```jsx
   // Create a Button component instead of repeating classes
   const Button = ({ children, variant = 'primary', ...props }) => (
     <button 
       className={`px-4 py-2 rounded-lg font-medium transition ${
         variant === 'primary' ? 'bg-primary-600 hover:bg-primary-700 text-white' : ''
       }`}
       {...props}
     >
       {children}
     </button>
   );
   ```

### Backend Best Practices

#### Controller Structure

```javascript
// controllers/user.controller.js
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Business logic (preferably in service layer)
    const user = await userService.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Success response
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
```

#### Database Queries

- Use **Prisma** for all database operations
- Always handle errors gracefully
- Use **transactions** for related operations
- Add **indexes** for frequently queried fields

```javascript
// Good - Using transaction
const createPostWithNotification = async (postData, userId) => {
  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({ data: postData });
    await tx.notification.create({
      data: {
        type: 'POST',
        userId,
        postId: post.id,
      },
    });
    return post;
  });
};
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

#### Examples

```
feat(auth): add password reset functionality

Implemented email-based password reset with token expiration.
Users can now request a password reset link via email.

Closes #123
```

```
fix(chat): resolve message duplication in group chats

Fixed issue where messages were being duplicated when
multiple users sent messages simultaneously.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Run linters** and fix any issues
4. **Ensure no console errors** in browser/terminal
5. **Rebase on latest main** branch

### PR Title Format

```
[Type] Brief description of changes
```

Examples:
- `[Feature] Add user profile editing`
- `[Fix] Resolve chat message duplication`
- `[Docs] Update API documentation`

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
```

### Review Process

1. **Automated checks** must pass (linting, builds)
2. **At least one approval** from maintainers required
3. **Address review comments** promptly
4. **Squash commits** if requested before merging

## Project Structure Guidelines

### Adding New Features

#### Frontend

1. Create component in appropriate directory:
   - Shared UI components → `src/components/ui/`
   - Feature-specific → `src/components/[Feature]/`
   - Pages → `src/pages/`

2. Add route in `src/App.jsx`

3. Create Redux slice if needed in `src/store/`

#### Backend

1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Add route to `src/routes/index.route.js`
4. Update Prisma schema if database changes needed
5. Run migration: `npx prisma migrate dev`

### File Organization

```
Feature: User Profile Editing

Frontend:
- src/components/Users/UpdateProfile.jsx (component)
- src/store/userSlice.js (state management)

Backend:
- src/controllers/user.controller.js (add updateProfile function)
- src/routes/user.route.js (add PUT /profile route)
- src/middleware/validation.js (add profile validation)
```

## Reporting Bugs

When reporting bugs, include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Screenshots** - If applicable
6. **Environment** - OS, browser, Node version, etc.

## Suggesting Features

When suggesting features, include:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other solutions considered
4. **Additional Context** - Mockups, examples, etc.

## Questions?

- Open an issue with the `question` label
- Check existing issues and documentation first

## Thank You!

Your contributions make Social Hub better for everyone. We appreciate your time and effort!

---

Happy coding!
