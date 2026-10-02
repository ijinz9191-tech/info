# Lua 5.4 protected call·C API 경계

Topic: lua54-protected-call-contracts
Version: Lua 5.4 reference manual
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.lua.org/manual/5.4/manual.html

<!-- evidence-sha256: 08b3557652d893a92cd98af01f794946869087045870ce6e3e47014f70aa6a3f -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-LUA-PROTECTED-001 | 호스트 프로세스 abort | C API 보호 경계 | 보호 밖 오류로 panic | 오류 가능한 호출 보호 검토 | 통제된 오류 status 확인 |
| SYN-LUA-PROTECTED-002 | traceback 정보 소실 | msgh·stack unwind | pcall 반환 뒤 trace 수집 | message handler에서 수집 | 오류 시점 stack 확인 |
| SYN-LUA-PROTECTED-003 | 메모리 오류 handler 미호출 | LUA_ERRMEM | 할당 오류는 handler 예외 | status별 별도 처리 | 해당 분기 처리 검토 |
| SYN-LUA-PROTECTED-004 | C 경계 yield 오류 | 호출 API·continuation | 비지원 호출 경계 yield | yieldk·callk·pcallk 계약 검토 | 중단·재개 순서 확인 |
| SYN-LUA-PROTECTED-005 | pcall 실패 결과를 값으로 사용 | 첫 boolean·error object | 성공 여부를 무시 | status 확인 후 결과 사용 | 성공·실패 입력 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
