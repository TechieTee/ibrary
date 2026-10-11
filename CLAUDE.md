@AGENTS.md
# Ibrary RN app — conventions

- All colors/spacing/type come from src/theme — never hardcode hex values in a component.
- One component supports both light and dark via theme tokens — never two separate components.
- API types live in src/api/types.ts, matching the Ibrary backend contract.
- Screens compose from src/components — keep screen files thin.
- Use Zustand for state, functional components, TypeScript strict mode.
