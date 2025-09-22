# Copilot Instructions for ManuDocs Frontend

## Project Overview
- This is a React 19 app (Create React App) for document management and AI agent features.
- Main features: authentication (Supabase), document upload, AI agent chatbot, and landing page.
- Key directories:
  - `src/components/`: Contains all major UI components, grouped by feature (Auth, LandingPage, Upload, AIAgent).
  - `src/components/AIAgent/`: AI agent and chatbot components (JS, TSX supported).
  - `src/contexts/`: React context providers (e.g., `UserContext.js`).

## Architecture & Data Flow
- Routing is managed via a `currentPage` state in `App.js` (not React Router).
- Page transitions use `onPageChange` callbacks, passed to headers and components.
- Auth state is managed with Supabase; user info is passed as props.
- AI Agent integration: `AIAgentPage` is rendered for the `ai-agent` route, with user and navigation props.

## Developer Workflows
- **Start dev server:** `npm start` (port 3000)
- **Run tests:** `npm test` (Jest, React Testing Library)
- **Build:** `npm run build`
- **Supabase:** Requires `.env` with `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
- **Tailwind CSS:** Configured via `tailwind.config.js` and `postcss.config.js`.

## Conventions & Patterns
- Components are function-based, use hooks for state/effects.
- Props for navigation: always pass `onPageChange`, `user`, and `onLogout` where needed.
- New features should be added as new subfolders in `src/components/`.
- For AI agent/chatbot, use `AIAgentPage`, `TemplateChatbot.js`, or `template-chatbot.tsx` as entry points.
- TypeScript components (TSX) are supported but require proper React type setup (see below).

## Integration Points
- **Supabase:** Used for authentication and user session management.
- **AI Agent:** Integrated via `AIAgentPage` and related components. Bind to main app by updating `App.js` routing logic.
- **Header Navigation:** Add new routes by updating navigation buttons in `Header.js` and handling in `App.js`.

## TypeScript Notes
- If using TSX, ensure React types are installed (`npm install --save-dev @types/react @types/react-dom`).
- If you see JSX typing errors, check your `tsconfig.json` includes `jsx: "react-jsx"` and has the correct type roots.

## Example: Adding a New Page
1. Create a new folder in `src/components/`.
2. Add your component, export as default.
3. Update `App.js` switch logic to render your component for a new route.
4. Add navigation button in `Header.js`.

## References
- See `README.md` for build/test instructions.
- See `App.js` for routing and integration patterns.
- See `Header.js` for navigation logic.
- See `AIAgentPage.js` and `template-chatbot.tsx` for AI agent integration.

---
For questions or unclear patterns, ask for clarification or review recent commits for examples.
