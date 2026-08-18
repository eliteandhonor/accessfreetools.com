# Security And Privacy Tasks

- [x] Remove upload endpoints, job secrets, server storage, and remote inference from the design.
- [x] Remove file parsing and keep a 10,000-character paste limit plus browser-worker lifecycle boundaries.
- [x] Mask all input, job, and download surfaces from Clarity.
- [x] Audit npm dependencies and the vendored helper attribution.
- [ ] Run encoder, network-failure, memory-failure, cancellation, and worker-unload tests.
- [x] Prove with browser network inspection that input text is never transmitted.
