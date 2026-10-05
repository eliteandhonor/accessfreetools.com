# Private build-source evidence

`npm run build` records sanitized diagnostics from the same before/after source observations used by the public `_build.json`. The public marker schema and strict source verification predicate are unchanged. Dirty, unavailable, redirected or changing source remains unverified.

The diagnostic contains only validated timestamps, commit IDs, booleans, Node major, fixed operation/reason codes and bounded status/index-flag counts. No file contents, filenames, working paths, environment values, remote URLs or raw Git errors are retained. Counts refer to porcelain records; untracked directories can be grouped and staged/unstaged or hidden-flag counts can overlap. Failed observations have null counts.

The build clears its own previous record before Astro, then writes one bounded JSON record after the static mirror and the final source observation. It is exclusively in `dist/server/.build-evidence/source-status.json`, with a 16 KiB limit, atomic replacement and Linux modes 0700 for the directory and 0600 for the file. A write failure fails the build with a fixed message. The helper rejects symlinked output directories.

There is no public endpoint. The Astro Node adapter serves the client directory; the artifact must never be copied into `public`, `dist/client` or the distribution root. Dotfile names and modes alone do not prove provider-level HTTP privacy. Before relying on a production record, verify the provider retains it, preserves permissions, denies direct/encoded/traversal HTTP access, and serves the matching public marker.

Use an existing authorized SSH connection to retrieve only the bounded record from the currently promoted build. Match its identity exactly with both public marker copies before interpreting it. Missing/stale/malformed records remain unavailable evidence. Keep connection metadata and credentials outside this repository. Each provider-managed build version has at most one final record; historical retention follows the provider lifecycle.

Focused source/collector/writer tests and the release judge cover dirty/restored source, changing commits, hidden flags, failed capture, schema redaction, publication/cleanup errors, mirror exclusion and stale record invalidation. Linux CI exercises actual POSIX modes and symlink rejection; Windows checks do not establish Linux permission behavior.
