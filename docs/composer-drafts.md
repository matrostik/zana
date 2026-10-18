# Composer drafts

Composer sessions are window-local and memory-only. Leaving a chat, visiting
another destination, closing a launcher, or switching launch modes does not
discard unsent content. Reloading or closing the application still clears them.

## Ownership

`apps/app/src/components/composer/composer-session.ts` owns prompt JSON, image
Files and previews, restored attachments, selection, and configuration overrides.
`ComposerDraftProvider` binds a logical surface to that session; unkeyed providers
remain instance-local. Existing chats use a thread identity, launchers use their
global/project identity, and plugin panels include plugin, panel, and view identity.
Home, New Thread, and plugin authoring have separate identities.

Launch modes share content but namespace settings. Existing thread overrides
take precedence over asynchronously arriving thread defaults. Global remembered
provider/model and permission preferences remain defaults, not draft ownership.
Restoration never grants permissions or validates filesystem access: existing
main/server authorization and launch preflight remain authoritative.

## Sending and cleanup

Every submission captures a content revision before asynchronous work. Success
clears only that revision, even after unmount; edits made meanwhile survive.
Configuration changes do not change the content revision. Failure does not clear
the draft. Successful sends retain configuration. Image URLs belong to the
session and are released on removal, clear, or disposal, not on navigation.

Storage retains at most 100 sessions and admits at most 128 MiB of retained image
data. Inactive empty sessions are reclaimed first; unsent drafts are never silently
evicted. At session capacity a new surface warns that navigation cannot retain its
draft. An unavailable explicitly selected model, role, or permission policy must
be resolved before sending instead of silently replacing the user's choice.

Squad source capability selections deliberately remain mount-local: capability
IDs are authority-bearing and project-scoped, and there is no renderer revalidation
API. Users must reattach these sources after leaving the surface. Squad title,
summary, coordination, team selection, prompt, and image drafts are retained.
Unidentified generic embedded panels remain instance-local to avoid leaking
prompts across unrelated pages.

## Regression checks

- `apps/app/src/components/composer/ComposerDraft.test.tsx`
- `apps/app/src/components/composer/composer-session.test.ts`
- `apps/app/src/components/thread/pickers/useThreadComposerOptions.test.ts`
- `apps/app/src/components/thread/pickers/useThreadPermissionMode.test.ts`
- `e2e/composer-navigation-drafts.spec.ts`

Run `pnpm verify:fast`, the built-Electron draft spec, and the launch/memory/team
verification triggers listed in `AGENTS.md` when changing composer configuration.
