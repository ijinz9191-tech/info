# React DOM nesting과 SSR hydration 공개 보고

Topic: frameworks/react
Version: Reported React 17.0.2, 18.0.0, 18.1.0
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/react/react/issues/24519

<!-- evidence-sha256: b3be016020b19becb3879bc64063dd0ed35a6116e6a2c69a80d082df0fc3649c -->

## 보고와 진단

보고자는 Next.js SSR에서 validateDOMNesting과 hydration 실패, client rendering 전환을 제시했다. nested paragraph와 tbody 없는 table은 브라우저 HTML 파싱 후 구조가 서버 문자열과 달라질 수 있는 비교 대상이다. 보고자가 paragraph 예제 설명을 정정한 사실도 반영한다.

증거는 응답 HTML, JavaScript 없이 파싱한 DOM, 초기 client tree를 구분해 확보한다. 잘못된 nesting이나 implicit tbody 차이를 먼저 확인하고 유효한 동일 구조로 비교한다. 해결 검증은 같은 입력에서 hydration 경고와 client fallback이 없어지는지 확인하는 것이다.

Closed / unconfirmed이며 수정 릴리스나 로컬 재현은 확인하지 않았다. 기존 hydration 진단 페이지와 같은 경로의 공개 증거이므로 독립 장애 총수에 단순 합산하지 않는다.

## 범위

실제 공개 보고 분석이다. 가상 SFT 예제, 독립 재현, 모델 가중치 학습과 구별한다.
