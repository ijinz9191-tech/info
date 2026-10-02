# TypeScript narrowing과 falsy 값의 업무 의미

Topic: TypeScript narrowing
Version: 현재 Handbook; tsconfig·컴파일러 버전은 현장 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html

<!-- evidence-sha256: f8fac3c8ec50ed82c743b3a4893355a33b094d35e39d6229817af1dc772de8c7 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-TS-001 | 빈 문자열 입력이 처리되지 않음 | truthy guard와 입력 분기 | 존재 여부와 참·거짓 의미 혼동 | null·undefined를 명시적으로 제외 | 빈 문자열·정상 문자열·null 검사 |
| SYN-TS-002 | 0 값이 누락된 입력으로 처리 | Boolean 변환과 숫자 경계값 | falsy인 0을 결측으로 오해 | 결측 정책과 값 범위를 분리 | 0·음수·undefined 경계 테스트 |
| SYN-TS-003 | typeof object 이후 null iterable 오류 | null 입력과 object 분기 | typeof null도 object라는 JS 계약 | null 검사 후 배열·객체 구분 | null·배열·일반 객체 각각 검사 |
| SYN-TS-004 | 타입 좁히기 성공을 모든 업무 분기 처리로 오해 | 미처리 입력의 return·else 경로 | 타입 안전성과 업무 완전성 혼동 | 요구되는 입력 분기를 명시 | 모든 합법 입력별 기대 결과 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
