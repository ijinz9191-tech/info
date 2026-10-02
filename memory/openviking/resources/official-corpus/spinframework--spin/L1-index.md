# spinframework/spin

Official upstream snapshot `32d1fe703588622f7ea098cb3ebea057464c9d25`. 67 documents; 10 code files.

Topics: cncf/Wasm/Application Frameworks.

## Provenance and limits

Retrieved: 2026-10-01T15:30:14.978113+00:00

License: UPSTREAM_NOTICES_CAPTURED_PER_FILE_REVIEW_REQUIRED

This overview is a deterministic index, not an LLM-generated technical summary. Raw upstream content is preserved; version applicability and solutions require review.

## Files

- [AGENTS.md](L2-00000.md#doc-a54ff182c7e8acf56acfd6e4) — official-document
- [CODE_OF_CONDUCT.md](L2-00000.md#doc-ffdbe3a1e7ee93cacfc080b6) — official-document
- [CONTRIBUTING.md](L2-00000.md#doc-eca12c0a30e25b4b46522ebf) — official-document
- [GOVERNANCE.md](L2-00000.md#doc-b60c6a93e9f74ee52e71bf33) — official-document
- [LICENSE](L2-00000.md#doc-c693279643b8cd5d248172d9) — license
- [MAINTAINERS.md](L2-00000.md#doc-39da3bd6270d44ea37b6ed50) — official-document
- [README.md](L2-00000.md#doc-b335630551682c19a781afeb) — official-document
- [ROADMAP.md](L2-00000.md#doc-683343bdf93f55ed3cada861) — official-document
- [SECURITY.md](L2-00000.md#doc-f6ed156e4bf5c79168066246) — official-document
- [crates/capabilities/deny-adapter/README.md](L2-00000.md#doc-8eaee309e8bdb90dc91a6ff6) — official-document
- [crates/componentize/README.md](L2-00000.md#doc-3e6a88f2aa9b3dc1119f23bd) — official-document
- [crates/componentize/adapters/README.md](L2-00000.md#doc-ec03f29bc6e5a93afa3389b9) — official-document
- [crates/componentize/tests/README.md](L2-00000.md#doc-03098d58849cb82413afa408) — official-document
- [crates/http/src/wagi/LICENSE.wagi](L2-00000.md#doc-0cce1dc7d61c5eb17136e015) — license
- [crates/plugins/tests/README.md](L2-00000.md#doc-ffdfff7d5a8ae3af4017dc4e) — official-document
- [crates/test-codegen-macro/README.md](L2-00000.md#doc-7d30b50cf5ecf8b4310dc2b3) — official-document
- [cross/README.md](L2-00000.md#doc-77f253591ec452fab382ee3d) — official-document
- [deploy/README.md](L2-00000.md#doc-0db16276644fc4f21eae05d7) — official-document
- [docs/README.md](L2-00000.md#doc-0b5ca119d2be595aa307d345) — official-document
- [docs/content/index.md](L2-00000.md#doc-bfbfbb5dfefd97e7ea568f8d) — official-document
- [docs/content/release-notes-template.md](L2-00000.md#doc-8ade61afbda1bce1fe504cb8) — official-document
- [docs/content/release-process.md](L2-00000.md#doc-c81ca86152e7d9db4536d475) — official-document
- [docs/content/sips/001-spin-deploy.md](L2-00000.md#doc-973505e65ebce3255e7d7deb) — official-document
- [docs/content/sips/002-app-config.md](L2-00000.md#doc-b8837f81f302379fa7b66908) — official-document
- [docs/content/sips/003-trigger-executors.md](L2-00000.md#doc-2d6806aa026b535e102050fd) — official-document
- [docs/content/sips/004-spin-build.md](L2-00000.md#doc-fb768384f9bb3978018e7b12) — official-document
- [docs/content/sips/005-manifest-redesign.md](L2-00000.md#doc-e9295cab00d0a0f64658fac6) — official-document
- [docs/content/sips/006-spin-plugins.md](L2-00000.md#doc-35c5d685cfa0843e5950f906) — official-document
- [docs/content/sips/007-deployment-auth.md](L2-00000.md#doc-e4500c2a1213a22c59c4dff8) — official-document
- [docs/content/sips/008-using-oci-registries.md](L2-00000.md#doc-b43e43f156d6931309237514) — official-document
- [docs/content/sips/009-auditing-third-party-dependencies.md](L2-00000.md#doc-e574a66d62de889b83357310) — official-document
- [docs/content/sips/010-key-value.md](L2-00000.md#doc-946c67c7523ab496b643243e) — official-document
- [docs/content/sips/011-component-versioning.md](L2-00000.md#doc-33af006ddd768557e1d91a3a) — official-document
- [docs/content/sips/012-signing-spin-releases.md](L2-00000.md#doc-bd1987d13b24e849420cd0ef) — official-document
- [docs/content/sips/013-sqlite.md](L2-00000.md#doc-ca32de36476e52e252bc922f) — official-document
- [docs/content/sips/014-cloud-plugin.md](L2-00000.md#doc-76fd6827c295b54c09cc9593) — official-document
- [docs/content/sips/015-llm.md](L2-00000.md#doc-a9afc7d92b8927690a292495) — official-document
- [docs/content/sips/016-inbound-websockets.md](L2-00000.md#doc-e67113f7b052d8d9a45032e1) — official-document
- [docs/content/sips/017-service-chaining.md](L2-00000.md#doc-8ff188d446d9d87f1d2c90a2) — official-document
- [docs/content/sips/018-adding-otel-tracing-to-spin.md](L2-00000.md#doc-f005df917c3f646527d8d970) — official-document
- [docs/content/sips/019-governance.md](L2-00000.md#doc-f97801595571bb8c712f45a0) — official-document
- [docs/content/sips/020-component-dependencies.md](L2-00000.md#doc-773a21b456021ebd76927894) — official-document
- [docs/content/sips/021-spin-factors.md](L2-00000.md#doc-93ec01c2df7ed82110087fa1) — official-document
- [docs/content/sips/022-build-profiles.md](L2-00000.md#doc-475017c40bcdda0226a9984d) — official-document
- [docs/content/sips/023-fine-grained-capability-inheritance.md](L2-00000.md#doc-d46335f09fc05dffc56f94ee) — official-document
- [docs/content/sips/024-spin-deps-cli-dx.md](L2-00000.md#doc-4c69cc3d6820eba8df43083f) — official-document
- [docs/content/sips/025-validate-target-environment.md](L2-00000.md#doc-114f972a35f89198a436f81d) — official-document
- [docs/content/sips/index.md](L2-00000.md#doc-700222529d591b753661a8ac) — official-document
- [examples/README.md](L2-00000.md#doc-49aaa2819e35a856818ecec8) — official-document
- [examples/http-cpp/README.md](L2-00000.md#doc-02ed6079dac31b3159b641c5) — official-document
- [examples/http-cpp/lib.cpp](L2-00000.md#doc-0b4bf3981fe4af818cac1f3e) — upstream-example-code
- [examples/http-middleware/animal-fact/src/lib.rs](L2-00000.md#doc-9728d7c1c576bdae6e953499) — upstream-example-code
- [examples/http-middleware/app/src/lib.rs](L2-00000.md#doc-08c60228277bd339ceb24951) — upstream-example-code
- [examples/http-middleware/yelling/src/lib.rs](L2-00000.md#doc-298df94dc91666ae3fb06689) — upstream-example-code
- [examples/http-rust/src/lib.rs](L2-00000.md#doc-b372b7067b1c0d598f94c421) — upstream-example-code
- [examples/open-ai-rust/src/lib.rs](L2-00000.md#doc-55a2ab1eb7609ae961268b42) — upstream-example-code
- [examples/spin-timer/README.md](L2-00000.md#doc-7142c605f96aedc290881f2b) — official-document
- [examples/spin-timer/app-example/src/lib.rs](L2-00000.md#doc-e163270ab5750cf48a2f1cb8) — upstream-example-code
- [examples/spin-timer/src/lib.rs](L2-00000.md#doc-1fb8603d5f4137a9b818f85e) — upstream-example-code
- [examples/spin-timer/src/main.rs](L2-00000.md#doc-cdf5fe032146cf4cedf46758) — upstream-example-code
- [examples/vault-variable-test/README.md](L2-00000.md#doc-12078a95c7e3de55e9033b65) — official-document
- [examples/vault-variable-test/src/lib.rs](L2-00000.md#doc-1f27fd7c2ffb679f1c4f874c) — upstream-example-code
- [tests/README.md](L2-00000.md#doc-dacac2ebf9792f0d23c0f922) — official-document
- [tests/manual/pg-ssl-root-certs/setup.md](L2-00000.md#doc-d7c005d79eae717cbf1e7c6d) — official-document
- [tests/runtime-tests/README.md](L2-00000.md#doc-cd087a1d9af9c8740f567ef3) — official-document
- [tests/test-components/README.md](L2-00000.md#doc-26ae3c3188953ec66544c990) — official-document
- [tests/test-components/components/key-value-simple/README.md](L2-00000.md#doc-be97042df7b3d89fc1a1df72) — official-document
- [tests/test-components/components/key-value/README.md](L2-00000.md#doc-da3f1b12af16e247ce6fe9ce) — official-document
- [tests/test-components/components/outbound-mysql/README.md](L2-00000.md#doc-a86ff2fe193bd29d9082aad6) — official-document
- [tests/test-components/components/outbound-postgres/README.md](L2-00000.md#doc-b4d34cd6e38f13ccf7065047) — official-document
- [tests/test-components/components/sqlite/README.md](L2-00000.md#doc-6729571df4a42d41b9495040) — official-document
- [tests/test-components/components/tcp-sockets/README.md](L2-00000.md#doc-976456f5efcc93aa0e1361e9) — official-document
- [tests/test-components/components/variables/README.md](L2-00000.md#doc-3060dbe2985e022816adee79) — official-document
- [tests/test-components/components/wasi-config/README.md](L2-00000.md#doc-60a54171ddc360cec706bb28) — official-document
- [tests/test-components/components/wasi-http-v0.2.0-rc-2023-11-10/README.md](L2-00000.md#doc-597af211f8292a5160c7494f) — official-document
- [tests/test-components/components/wasi-key-value/README.md](L2-00000.md#doc-0c8cc4c48a95922ec410c509) — official-document
- [tests/testcases/legacy-apps-test/README.md](L2-00000.md#doc-6ff305d27609a1e9adcc6eaf) — official-document
- [tests/testcases/plugin/README.md](L2-00000.md#doc-675ad51c89cef377a276fecf) — official-document
- [tests/testing-framework/README.md](L2-00000.md#doc-b4cbce2ba6cb312274b41ba1) — official-document
