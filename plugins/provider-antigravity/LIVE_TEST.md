# Live verification: provider-antigravity

Use the running ZCC instance. Keep `ZCC_SERVER_URL` and `ZCC_DATA_DIR`
pointed at the same instance (normally port 8780; dev uses 8781 and ~/.zcc-dev).
Do not change session credentials or edit installed-plugin records.

1. Run `zcc status --json`, then `zcc plugin install .` from this directory.
2. After edits run `zcc plugin dev --once`. It rebuilds the UI and reloads;
   a build or unhealthy reload must return a nonzero exit. Use
   `zcc plugin logs provider-antigravity -n 50` to diagnose backend failures.
3. Exercise a contributed CLI command or RPC through the running app. Verify the actual response, including an error case.
4. Change a backend response, reload, and verify the new response. Skill changes are checked in a fresh thread.
5. Verify stored data survives the reload and disposal leaves no duplicate service or timer.

Use only test data you create. Keep a user's requested plugin installed; remove
an explicitly disposable probe with `zcc plugin remove provider-antigravity` when finished.
If UI control or the app is unavailable, report that limit instead of claiming
the panel passed. Record the command results and visible behavior in your handoff.
