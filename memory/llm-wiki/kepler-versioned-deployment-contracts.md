# Kepler 버전별 배포와 센서 진단

Topic: cncf/kepler
Version: 0.10.0+ rewrite; main README observed 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://raw.githubusercontent.com/sustainable-computing-io/kepler/main/README.md

<!-- evidence-sha256: 1007ab8ddf05d660d813259127d37d2501a7a5df683b058eb06fe2f1871f9aaf -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-KEPLER-001 | 배포 후 probe 실패로 CrashLoop | 이미지 태그와 manifest checkout, probe 경로 비교 | main manifest와 이전 이미지 혼합 | 동일 release 태그의 manifest와 이미지 적용 | 해당 버전 probe 성공과 재시작 감소 확인 |
| SYN-KEPLER-002 | 0.9 설정을 새 버전에 사용 | 실제 이미지 버전과 설정 형식 확인 | 0.10 재작성으로 구버전 계약 불일치 | 새 버전 설정으로 이전 계획 수립 | 설정 로드와 예상 지표 확인 |
| SYN-KEPLER-003 | 구버전에서 수정이 제공되지 않음 | 사용 태그와 archived 상태 확인 | 0.9 계열 유지보수 종료 | 0.10+ 이전 가능성 평가 | 버전 변경 후 해당 증상 재검증 |
| SYN-KEPLER-004 | 센서 접근 권한 지침이 서로 다름 | README의 readonly proc/sys와 설치 문서 privileged 예제 대조 | 문서 버전 또는 배포 방식 차이 가능 | 선택한 release의 코드·manifest로 요구 권한 확인 | 최소 요구 권한에서 센서 수집 확인; 무조건 privileged 처방 금지 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
