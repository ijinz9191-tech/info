# Spring Boot external config 우선순위

Topic: springboot411-config-precedence-contracts
Version: Spring Boot 4.1.1 reference snapshot 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.spring.io/spring-boot/reference/features/external-config.html

<!-- evidence-sha256: 611547e0c1cf1dc9ef70b7d2797678bfa3f3dcb2357d1f51713bd27f2d6daa53 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-BOOT-CONFIG-001 | 파일 설정이 적용 안 됨 | property source 순서 | 환경·CLI 등의 override | 민감값 제외 출처 확인 | 기대 source 선택 확인 |
| SYN-BOOT-CONFIG-002 | JSON null로 기존 값 제거 안 됨 | JSON·lower source | null은 missing 취급 | 명시 값·설정 설계 변경 | 최종 해석 값 확인 |
| SYN-BOOT-CONFIG-003 | logging 설정 시점 늦음 | PropertySource 등록 시점 | context refresh 이후 제공 | 초기 사용 source로 이동 | 초기 로그 설정 확인 |
| SYN-BOOT-CONFIG-004 | 기본 파일 탐색 사라짐 | config.location | default locations 대체 | additional-location 의도 검토 | 탐색 source 목록 확인 |
| SYN-BOOT-CONFIG-005 | 필수 config 누락 startup 실패 | location·exception | ConfigDataLocationNotFound | 정말 선택적일 때 optional | 필수·선택 누락 분리 검사 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
