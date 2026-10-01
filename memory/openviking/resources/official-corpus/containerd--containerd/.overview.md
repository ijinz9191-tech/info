# containerd/containerd

Official upstream snapshot `df742f8d7ee7f57ddba3c475497c032fe9486391`. 79 documents; 5 code files.

Topics: cncf/Runtime/Container Runtime.

## Provenance and limits

Retrieved: 2026-10-01T15:16:13.018591+00:00

License: UPSTREAM_NOTICES_CAPTURED_PER_FILE_REVIEW_REQUIRED

This overview is a deterministic index, not an LLM-generated technical summary. Raw upstream content is preserved; version applicability and solutions require review.

## Files

- [ADOPTERS.md](L2-00000.md#doc-12e0a48d6c5f2a58f4caa284) — official-document
- [AGENTS.md](L2-00000.md#doc-a54ff182c7e8acf56acfd6e4) — official-document
- [BUILDING.md](L2-00000.md#doc-f1355fd54329147c830843ab) — official-document
- [CLAUDE.md](L2-00000.md#doc-6ebdb617a8104a7756d0cf36) — official-document
- [CONTRIBUTING.md](L2-00000.md#doc-eca12c0a30e25b4b46522ebf) — official-document
- [LICENSE](L2-00000.md#doc-c693279643b8cd5d248172d9) — license
- [NOTICE](L2-00000.md#doc-dfb14fbb9e7d095209ec4cfd) — license
- [README.md](L2-00000.md#doc-b335630551682c19a781afeb) — official-document
- [RELEASES.md](L2-00000.md#doc-4a00447b47c36ebd3ded7732) — official-document
- [ROADMAP.md](L2-00000.md#doc-683343bdf93f55ed3cada861) — official-document
- [SCOPE.md](L2-00000.md#doc-232847d7bce0ee80595653fc) — official-document
- [code-of-conduct.md](L2-00000.md#doc-f1a69a41a835b5265e1c58e1) — official-document
- [contrib/README.md](L2-00000.md#doc-549baf4b2300e19b6400b465) — official-document
- [contrib/ansible/README.md](L2-00000.md#doc-2d4536dcf725f9c2a01d83b6) — official-document
- [core/runtime/v2/README.md](L2-00000.md#doc-dc5d002cabe2a56e1f32ca8f) — official-document
- [core/runtime/v2/example/README.md](L2-00000.md#doc-8fa60e207d115fb81c43c4ee) — official-document
- [core/runtime/v2/example/cmd/main.go](L2-00000.md#doc-dd726f5ff1601187aa96f33f) — upstream-example-code
- [core/runtime/v2/example/example.go](L2-00000.md#doc-de29424067c76475165342ee) — upstream-example-code
- [core/runtime/v2/example/sandbox/README.md](L2-00000.md#doc-3080423c8b32aab101ad45e2) — official-document
- [core/runtime/v2/example/sandbox/cmd/main.go](L2-00000.md#doc-3c2c23c7d168524450bb4fe7) — upstream-example-code
- [core/runtime/v2/example/sandbox/example.go](L2-00000.md#doc-d17ef10a31e85696fd6fca1b) — upstream-example-code
- [core/runtime/v2/example/sandbox/example_test.go](L2-00000.md#doc-e340ffb2203a4efcfd066c1b) — upstream-example-code
- [docs/NRI.md](L2-00000.md#doc-a71dab6ef9c720481d70b50e) — official-document
- [docs/PLUGINS.md](L2-00000.md#doc-a4b5186ca4937b26e09acd66) — official-document
- [docs/RUNC.md](L2-00000.md#doc-51e4b5135f99ae70c28c3f8a) — official-document
- [docs/client-opts.md](L2-00000.md#doc-a3ce103a5c3fee565793a6b5) — official-document
- [docs/containerd-2.0.md](L2-00000.md#doc-7490cc13f240569a77bf271b) — official-document
- [docs/content-flow.md](L2-00000.md#doc-b8ad6b5ea26e78730a00a889) — official-document
- [docs/cri/architecture.md](L2-00000.md#doc-b374c244bddfc993d32ca509) — official-document
- [docs/cri/config.md](L2-00000.md#doc-91d0a4c61f6d3523b5a19717) — official-document
- [docs/cri/crictl.md](L2-00000.md#doc-325b0e3876b9406cc93c527c) — official-document
- [docs/cri/decryption.md](L2-00000.md#doc-3dfdc21ddb649be11ed5be9b) — official-document
- [docs/cri/registry.md](L2-00000.md#doc-ad3ce646632d139915e549d7) — official-document
- [docs/cri/testing.md](L2-00000.md#doc-c6f6a31ee370ded9ae037ff8) — official-document
- [docs/features.md](L2-00000.md#doc-aff15ced1fe37506f41f2e1d) — official-document
- [docs/fsverity.md](L2-00000.md#doc-6d9d3ab013d08f7005171172) — official-document
- [docs/garbage-collection.md](L2-00000.md#doc-5edd17fa93e892d9b4c07f69) — official-document
- [docs/getting-started.md](L2-00000.md#doc-31bcba2ccafa41d46fbbd6d1) — official-document
- [docs/historical/cri/proposal.md](L2-00000.md#doc-f3217d968232f5cf54bffecb) — official-document
- [docs/historical/design/architecture.md](L2-00000.md#doc-ad0f305d44ee1bdb26f6469c) — official-document
- [docs/historical/design/data-flow.md](L2-00000.md#doc-cc9216127f50d80c574e150d) — official-document
- [docs/historical/design/lifecycle.md](L2-00000.md#doc-eda515a691dea941a19b76bc) — official-document
- [docs/historical/design/mounts.md](L2-00000.md#doc-8ece3c3ef2df2193edd51c44) — official-document
- [docs/historical/design/snapshots.md](L2-00000.md#doc-032a2cb51d372d5259ff1a0d) — official-document
- [docs/historical/reports/2017-01-13.md](L2-00000.md#doc-7671c036abfe56bca35d849a) — official-document
- [docs/historical/reports/2017-01-20.md](L2-00000.md#doc-8fbd3dc41171aedd513f8dd2) — official-document
- [docs/historical/reports/2017-01-27.md](L2-00000.md#doc-c10156244729c68a3f72c008) — official-document
- [docs/historical/reports/2017-02-10.md](L2-00000.md#doc-fafb779cf47d87c84e6d0a82) — official-document
- [docs/historical/reports/2017-02-24.md](L2-00000.md#doc-e26e92a6c5e5c845b12c960d) — official-document
- [docs/historical/reports/2017-03-10.md](L2-00000.md#doc-6b13b7414491035def842bdb) — official-document
- [docs/historical/reports/2017-03-17.md](L2-00000.md#doc-9e863f4e62261a7b4e7a51fe) — official-document
- [docs/historical/reports/2017-03-24.md](L2-00000.md#doc-0e0c31baf32e4055056f1de4) — official-document
- [docs/historical/reports/2017-04-28.md](L2-00000.md#doc-f0703e19ec7e4bac3e2b7d4f) — official-document
- [docs/historical/reports/2017-05-05.md](L2-00000.md#doc-dafad3c16ac2bc33b1bf64a5) — official-document
- [docs/historical/reports/2017-05-19.md](L2-00000.md#doc-7c7e432431b0e03b7a7ab01e) — official-document
- [docs/historical/reports/2017-05-26.md](L2-00000.md#doc-393449372edb7618842e39e3) — official-document
- [docs/historical/reports/2017-06-09.md](L2-00000.md#doc-8860e6b19174ce926049f371) — official-document
- [docs/historical/reports/2017-06-23.md](L2-00000.md#doc-b789a8c093080a293b7c069a) — official-document
- [docs/hosts.md](L2-00000.md#doc-f74a824d585fec15b5c33fa5) — official-document
- [docs/image-verification.md](L2-00000.md#doc-02c5c9d76e79f4d64f3bf01f) — official-document
- [docs/man/containerd-config.8.md](L2-00000.md#doc-20557e6cbd73c6eecc65e8aa) — official-document
- [docs/man/containerd-config.toml.5.md](L2-00000.md#doc-e810f6458689e3b2d795ca97) — official-document
- [docs/managed-opt.md](L2-00000.md#doc-b6bb7b988113bd9e529a38ca) — official-document
- [docs/mounts.md](L2-00000.md#doc-1962c8a34b98fb025d30208a) — official-document
- [docs/namespaces.md](L2-00000.md#doc-b8b064c3a7c8b3810404fd5c) — official-document
- [docs/ops.md](L2-00000.md#doc-f307db903341db35ddf198cb) — official-document
- [docs/rootless.md](L2-00000.md#doc-a1481814b47ad6f3e17c2a47) — official-document
- [docs/runtime-v2.md](L2-00000.md#doc-b4d86dd00e783b746a7e2046) — official-document
- [docs/sandbox-api.md](L2-00000.md#doc-329285aad0bb6620d5e467c6) — official-document
- [docs/security/OPERATOR_GUIDELINES.md](L2-00000.md#doc-61b865454ab2c7ac080fa4c4) — official-document
- [docs/security/THREAT_MODEL.md](L2-00000.md#doc-280fd006f2f5a49fa3ae895a) — official-document
- [docs/security/TRIAGE_GUIDE.md](L2-00000.md#doc-df7397d966645ede87804110) — official-document
- [docs/shim-capabilities.md](L2-00000.md#doc-206bb63e585d8c99e15a3e50) — official-document
- [docs/snapshotters/README.md](L2-00000.md#doc-46fc21922aad9928ea845d85) — official-document
- [docs/snapshotters/blockfile.md](L2-00000.md#doc-8536e991c16b02a8f4edcdbf) — official-document
- [docs/snapshotters/devmapper.md](L2-00000.md#doc-dcabd3e7860067e34874a8e9) — official-document
- [docs/snapshotters/erofs.md](L2-00000.md#doc-6fe84c33ab0bf07da643ced2) — official-document
- [docs/snapshotters/remote-snapshotter.md](L2-00000.md#doc-bd9cb94b73e904a58c676335) — official-document
- [docs/stream_processors.md](L2-00000.md#doc-74dc0fe5bc935440b24f63e3) — official-document
- [docs/tracing.md](L2-00000.md#doc-4fe19a5aa6df7475c7b02436) — official-document
- [docs/transfer.md](L2-00000.md#doc-f853230399e685e3d42e6529) — official-document
- [docs/user-namespaces/README.md](L2-00000.md#doc-fa58d8e2b53f10e50dd29109) — official-document
- [integration/failpoint/cmd/cni-bridge-fp/README.md](L2-00000.md#doc-59cf633bb07524d3732c808d) — official-document
- [integration/images/README.md](L2-00000.md#doc-9102bb2df121976dce985529) — official-document
- [releases/README.md](L2-00000.md#doc-c06e8f0d65e645e2d79dec3a) — official-document
- [script/vm/README.md](L2-00000.md#doc-61688f9a5ce3e3e76cc6abf1) — official-document
