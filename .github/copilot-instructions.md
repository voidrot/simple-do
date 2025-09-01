## Copilot Project Instructions: simple-do (Nuxt To-Do App)

### Accessibility Testing
- Regularly run accessibility audits (e.g., Accessibility Insights, axe) and manually test keyboard navigation and screen reader support.

### Internationalization (i18n)
- If supporting multiple languages, use Nuxt i18n and ensure all UI text is translatable.

### Error Logging
- Log server-side errors to a designated file, service, or console as appropriate. Ensure sensitive data is not exposed in logs.
- Error Handling: Always provide user-friendly error messages and log errors server-side.

### API Rate Limiting & Security
- If the API is public or multi-user, implement rate limiting and protection against brute force or abuse.

### Performance Monitoring
- Integrate performance monitoring tools (e.g., Web Vitals, server metrics) to track and optimize application performance.

### Code Review Checklist
- For every pull request, verify:
	- Accessibility (forms, navigation, feedback)
	- Security (OWASP, input validation, access control)
	- Performance (bundle size, lazy loading, caching)
	- Tests (unit, e2e)
	- Documentation (README, code comments)

### Documentation
- Update README and in-code documentation for new features or architectural changes. Ensure instructions are clear for future maintainers.


### Project Overview
- Framework: Nuxt 4 (Vue 3, TypeScript)
- Purpose: To-do app for creating, editing, deleting, and completing tasks.
- Task Types: Supports both one-off tasks and scheduled (recurring) tasks.

### Coding Standards
- Follow Nuxt 4 and Vue 3 best practices. Use the Composition API and TypeScript for all new code.
- Accessibility: All UI must be built with accessibility in mind (see a11y instructions). Use semantic HTML, ARIA roles, and ensure keyboard navigation.
- Performance: Optimize for fast load times and responsive UI. Use lazy loading for components and images, and minimize bundle size.
- Security: Apply OWASP Top 10 guidelines. Never expose sensitive data in the frontend. Validate and sanitize all user input.
- Self-Explanatory Code: Write code that is clear and maintainable. Only comment to explain non-obvious logic or business rules.

### Task Model
- One-off Task: A single, non-repeating to-do item.
- Scheduled Task: A task that recurs on a schedule (e.g., daily, weekly). Use clear naming and structure to distinguish these in code and UI.
- CRUD Operations: Implement create, read, update, delete, and complete actions for both task types. Ensure all actions are accessible and provide feedback to the user.

### UI/UX
- Forms: All forms must have proper labels, error messages, and accessible validation.
- Navigation: Provide a skip link for keyboard users. Use consistent navigation order.
- Feedback: Show clear status for completed, scheduled, and pending tasks. Use icons and text, not just color, to indicate status.

### Data & API
- Database: Use Drizzle ORM for all database interactions. Prefer parameterized queries.
- API: All server endpoints must validate input and enforce access control. Use server-side checks for task ownership and permissions.

### Testing
- Playwright: Write end-to-end tests for all major features, focusing on accessibility and user-facing interactions.
- Unit Tests: Cover core business logic, especially around task scheduling and completion.

### File Organization
- Components: Place reusable UI components in `app/components/`.
- Pages: Use Nuxt pages for routing. Each major feature should have its own page.
- Server Logic: API routes and business logic go in `server/api/` and `server/lib/`.

### Special Instructions
- Scheduled Tasks: When implementing scheduling, use a clear, extensible structure (e.g., cron-like or ISO 8601 recurrence rules). Document any custom scheduling logic.
- Task Completion: Mark completed tasks visually and in the database. Allow users to undo completion if needed.
- Error Handling: Always provide user-friendly error messages and log errors server-side.
