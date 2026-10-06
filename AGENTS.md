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
