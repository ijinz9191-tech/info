# Docker Engine 병렬 image config pull 충돌과 수정

Topic: tooling/docker/reported-image-config-pull
Version: Reported Engine20.10.2; historical Moby fix backported and released20.10.4 on2021-02-26; standalone BuildKit excluded; not reproduced
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/moby/buildkit/issues/1939
- https://github.com/moby/moby/pull/42035
- https://github.com/moby/moby/commit/bc6f4cc7032544553d2304a5b47ba235dbfe5b9c
- https://github.com/moby/moby/pull/42049
- https://docs.docker.com/engine/release-notes/20.10/

<!-- evidence-sha256: 3aa1b1eab51b0779bf67e92c6caad2cdfb3ad9cfecf3527a7e18035ab9360f1f -->

## 실제 보고된 증상

2021-01-11 BuildKit#1939 보고는 Docker Engine20.10.2 Windows/Linux에서 여러 외부 image의 COPY --from을 조합할 때 간헐적인 failed to compute cache key와 file 부재를 제시한다. 약19.03.10에서 동작했다는 것은 보고자 비교다. 모든 cache-key 오류가 이 회귀는 아니다.

## 실제 읽은 수정 코드와 릴리스

공개 API에서 #42035 pull.go patch와 merge metadata를 읽었다. 설명은 초기화 전 ref 기반 공유 동기화 key가 병렬 pull에서 충돌하는 경로를 제시한다. patch는 puller별 flightcontrol.Group, empty config 오류 처리, 불필요한 재해석 방지를 포함한다. 2021-02-18 merge commit은 bc6f4cc7032544553d2304a5b47ba235dbfe5b9c다.

20.10 backport#42049는 2021-02-23 merge commit f3d130d743664e3ef778caf2537d1a9f793ea2e0이며 공식20.10.4 release notes는 2021-02-26 공개 및 backport 포함을 명시한다. PR은 standalone BuildKit/buildx가 이 회귀 영향 밖이라고 설명한다.

## 적용과 해결 검증

해당 역사적 경로인지 Engine·builder mode·image 조합·digest를 먼저 확인한다. 수정이 포함된 지원 버전에서 동일 digest와 반복 build로 산출 파일을 대조하는 것이 검증 절차다. 오래된20.10.4를 현재 권장 version으로 제시하지 않는다. 코드 읽기·merge·release 포함을 확인했으며 Docker 실행·운영 재현·사용자 환경 해결은 수행하지 않았다.
