# Raku CATCH·Failure·control 복구 흐름

Topic: languages/raku/exceptions
Version: Living Raku docs read 2026-10-02; X::Control role behavior describes Rakudo 2019.03+; no runtime test
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.raku.org/language/exceptions

<!-- evidence-sha256: c1c282221be1b29f5b5735d424bf337383a10c729ee4b3a36005cd029ec7abd9 -->

## 공식 계약과 범위

CATCH 처리 후 enclosing block을 벗어난다. resume은 발생 직후 안쪽 frame으로 돌아간다. try에 직접 CATCH를 제공하면 해당 handler에서 미처리한 예외는 재전파된다. namespace 이름만으로 control role을 판정하지 않는다. Failure는 사용 context에 따라 지연해서 throw할 수 있고 Boolean/definedness 확인은 처리된 것으로 간주된다. handler·resume·return의 실제 scope를 분리해 조사하며 업무 코드 실행은 하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-RAKU-CATCH-001 | handler 뒤 코드 미실행 | enclosing scope | 처리 후 block 탈출 | recovery 범위 설계 | inner·outer 흐름 비교 |
| SYN-RAKU-CATCH-002 | try인데 예외 전파 | 직접 CATCH·when | 해당 type 미처리 | 명시 처리 계약 확인 | matching·nonmatching 비교 |
| SYN-RAKU-CATCH-003 | 같은 namespace인데 미매칭 | exception role | 이름만 같고 role 없음 | 실제 role 확인 | typed match 검사 |
| SYN-RAKU-CATCH-004 | Failure 늦게 throw | 사용 context·수명 | 미처리 지연 예외 | 결과 즉시 판별 | sink·Boolean 비교 |
| SYN-RAKU-CATCH-005 | resume 후 대입 덮임 | innermost frame·return | 안쪽 함수 계속 실행 | resume 위치 검토 | 최종 return·state 비교 |
| SYN-RAKU-CATCH-006 | return이 일반 예외 됨 | Routine 밖·control | 미처리 control 변환 | 제어 범위 확인 | 합법 Routine과 비교 |
