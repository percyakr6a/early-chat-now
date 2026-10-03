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

- Keep the projects overview in the projects.index leaf and the projects parent rendering Outlet; individual project URLs are children and must not be covered by the overview.
- Keep project-specific presentations within the shared project detail route and branch by slug; this preserves existing project URLs and leaves other projects on the generic template.
- Do not infer a CPR trained count from registrations; only display a verified attendance figure when supplied, because sign-ups are not completed training.
