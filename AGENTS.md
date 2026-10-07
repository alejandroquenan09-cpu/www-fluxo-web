<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use one root ThemeProvider for client-side appearance state, persistent storage and all theme controls, including notifications, so public and signed-in views stay synchronized.
- Render the shared water image through LiquidBackground with global appearance tokens so both themes retain the same visual identity.
- Animate background bubbles with separate CSS rise and shape layers and honor reduced motion, keeping decorative motion isolated from interactive content.
- Mount the Floppy companion once in the root under AuthProvider; keep its audio and call owner mounted during section navigation so voice-guided navigation does not hang up.
- Live voice uses the shared relay and development adapter with authenticated startup, catalog-backed navigation tools, revision guards and immediate Stop cleanup; it never creates bookings directly.
