# Docker build cache 입력·회전·무효화

Topic: tooling/docker/build-cache
Version: Living Docker official cache-invalidation guide read 2026-10-02; builder release unspecified; no image build
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.docker.com/build/cache/invalidation/

<!-- evidence-sha256: 746bb16fa23f7f9a554aabf005409e94eca07b9f488f3af770a92f8a84071765 -->

## 공식 계약과 범위

mtime만의 변화는 COPY checksum 무효화에 포함되지 않는다. RUN 명령 cache는 외부 package 저장소의 내용 변화까지 자동 추적하지 않는다. build secret 내용은 cache 입력이 아니며 회전 시 비밀이 아닌 CACHEBUST 등을 검토한다. secret 값을 build argument·위키에 넣지 않는다. SOURCE_DATE_EPOCH이 build 사이 바뀌면 WORKDIR 및 이후 instruction의 cache가 무효화된다. 앞선 모든 layer가 무효화되는 뜻은 아니다. 단계 순서도 후속 cache 재사용에 영향을 준다. cache 무효화가 보안 업데이트 성공·검증과 같다는 뜻은 아니다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-DOCKER-CACHE-001 | touch 후 COPY 재사용 | mtime·실제 파일 변경 | mtime checksum 제외 | 실제 입력 변경으로 검사 | cache hit 비교 |
| SYN-DOCKER-CACHE-002 | RUN 설치 결과 오래됨 | layer hit·명령 | 외부 package 변경 미감지 | 대상 stage no-cache-filter 검토 | 실행·package 버전 확인 |
| SYN-DOCKER-CACHE-003 | secret 교체 후 RUN 재사용 | 회전 여부·cache hit | secret 내용은 cache 입력 아님 | 비밀 아닌 CACHEBUST 검토 | RUN 재실행 확인 |
| SYN-DOCKER-CACHE-004 | 소스 변경 후 후속층 재빌드 | Dockerfile 단계 순서 | 잦은 입력이 앞층 무효화 | 안정 단계 먼저 구성 | layer reuse 비교 |
| SYN-DOCKER-CACHE-005 | commit마다 WORKDIR 무효화 | SOURCE_DATE_EPOCH 변화 | 값 변화의 cache 영향 | provenance 목적에 맞게 선택 | WORKDIR 이전·이후 cache 확인 |
