# 100555 · Collab Studio Plugins

Part of **collab.codes**.

`100555` is the **plugin set of the Studio**. Each folder under `l2/` is one
plugin — a self-contained set of `.ts` / `.html` / `.less` / `.defs.ts` files
loaded by the Studio core ([`100554`](../mls-100554)).

## Plugins

| plugin | area |
|---|---|
| `pluginSystem` | user, theme and language preferences |
| `pluginProject` / `pluginModule` / `pluginNewFile` | project, module and file management |
| `pluginExplore` / `pluginView` / `pluginArchitecture` | code exploration, views and architecture navigation |
| `pluginEditL3` / `pluginStyle` | L3 text/content editing and styling |
| `pluginPreview` | live preview of the project being edited |
| `pluginGit` | git operations from inside the Studio |
| `pluginTester` / `pluginVerify` | running and verifying tests |
| `pluginLink` | links between artifacts |
| `pluginSiteMonitorDashboard` | site monitor dashboard |

`l2/utils/` holds helpers shared between plugins; `l2/designSystem.ts` the local
design system.

## Notes

- Single language (`en`) in `l5/project.json`.
- Plugins are loaded by the Studio, not executed on their own.
