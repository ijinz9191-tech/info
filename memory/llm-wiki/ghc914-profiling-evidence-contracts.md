# Haskell GHC 프로파일의 CPU·할당·비용 귀속

Topic: languages
Version: GHC 9.14.1 users guide
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://downloads.haskell.org/ghc/latest/docs/users_guide/profiling.html

<!-- evidence-sha256: 959320218c291775f9ce509d444df3f9daf3e88c9327d1878249a1ae781cb0ff -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-GHC-PROFILE-001 | prof 파일 없음 | -prof·RTS -p·빌드설정 | 프로파일 실행 준비 누락 | 프로파일 빌드와 RTS 옵션 점검 | 해당 실행의 prof 생성 |
| SYN-GHC-PROFILE-002 | 벽시계 지연인데 CPU 비용 작음 | safe foreign call·벽시계 | 프로파일러가 safe foreign call 시간을 추적하지 않음 | FFI와 외부시간 별도 관측 | CPU·전체 지연 비교 |
| SYN-GHC-PROFILE-003 | total alloc 크기로 live heap 오판 | 누적 할당·heap profile | 서로 다른 메모리 지표 | live memory를 heap profile로 관측 | 같은 입력의 피크 생존량 비교 |
| SYN-GHC-PROFILE-004 | 개별 함수 비용 오판 | individual·inherited·스택 | 하위호출 비용 혼동 | 비용 귀속 구분 | 호출트리와 비용 비교 |
| SYN-GHC-PROFILE-005 | 계측 후 성능 크게 변화 | SCC 수·최적화·빌드 | 과다 annotation이 최적화 방해 | 필요한 비용센터로 좁힘 | 비계측 기준과 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
