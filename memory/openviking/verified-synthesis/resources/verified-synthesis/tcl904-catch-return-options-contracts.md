# Tcl catch 반환 코드·구조화 오류 계약

Topic: languages/tcl/catch-options
Version: Tcl9.0.4 official catch manual snapshot 2026-10-02; no Tcl execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.tcl-lang.org/man/tcl9.0/TclCmd/catch.html

<!-- evidence-sha256: f26c7f26595eb1daa0cabe321b969e02c258276a50f198e780d84b2e56bf0e7c -->

## 공식 계약과 범위

catch의 0은 정상, 1은 error, 2/3/4는 return/break/continue다. 확장 package는 다른 정수 code를 반환할 수 있다. resultVar에는 정상 결과도 들어간다. -code/-level은 항상 존재하지만 error 전용 key는 해당 오류에서만 기대한다. -errorinfo는 사람용이며 프로그램 처리는 -errorcode/-errorstack의 구조를 대조한다. nonzero를 전부 error로 세지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-TCL-CATCH-001 | return을 오류로 기록 | catch code 2 | 모든 nonzero를 error로 혼동 | 코드별 분기 | 정상·error·control 비교 |
| SYN-TCL-CATCH-002 | 정상 결과값을 오류로 기록 | code·resultVar | 정상 결과도 같은 변수 | code와 result 함께 해석 | 0·1의 값 비교 |
| SYN-TCL-CATCH-003 | errorinfo 접근 실패 | code·옵션 key | error 전용 key 가정 | 존재·code 확인 | 모든 반환 유형 검사 |
| SYN-TCL-CATCH-004 | stack 문자열 parsing 깨짐 | errorinfo·errorstack | 사람용 형식 의존 | 구조화 정보 사용 | token pair 검사 |
| SYN-TCL-CATCH-005 | return level 오해 | code·level | TCL_RETURN 별도 의미 | return 옵션 계약 확인 | nested procedure 전달 검사 |
| SYN-TCL-CATCH-006 | custom code 누락 | package·반환 정수 | 0–4만 가정 | 확장 code 정책 확인 | custom 반환 보존 검사 |
