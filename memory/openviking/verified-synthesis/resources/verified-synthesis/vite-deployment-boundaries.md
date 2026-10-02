# Vite 배포·감시 경계

Topic: vite
Version: 2026-10-02 공식 가이드
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://vite.dev/guide/troubleshooting

<!-- evidence-sha256: 384f9784a875ba058110c7bd327a74cf49b90820d9c2bfd3f6a5f185d293529a -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-VITE-001 | Linux 빌드 ENOENT/HMR 누락 | 실제 파일명과 import 대소문자 비교 | 대소문자 불일치 | import 표기 통일 | 대소문자 구분 환경 빌드 |
| SYN-VITE-002 | 배포 후 동적 청크 실패 | 오래된 HTML·청크 URL·404 확인 | 배포 버전 불일치 | 이전 청크 유지와 오류 복구 설계 | 기존 탭에서 배포 전후 탐색 |
| SYN-VITE-003 | file 프로토콜 CORS | 주소창 프로토콜 확인 | HTTP 없이 빌드 HTML 실행 | HTTP 서버로 제공 | HTTP에서 모듈 로드 |
| SYN-VITE-004 | Linux ENOSPC 감시 실패 | 오류와 watcher 사용량 확인 | 파일 감시 한도 초과 | 불필요 감시 제외 또는 한도 조정 | 수정 이벤트 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
