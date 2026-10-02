# React head singleton suspended hydration 공개 보고

Topic: frameworks/react
Version: Reported react-dom 19.2.8 and 19.3.0-canary-6c0e1047-20260908
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/react/react/issues/37551

<!-- evidence-sha256: b4323449fa4a22856886935b6ba448fc6fd5038bc224c3f23bb20fc2bf3ce1ba -->

## 보고와 진단

2026-09-09 열린 보고는 동일 server/client markup이라고 주장하면서 head 자식의 늦은 thenable과 transition에서 hydration replay 오류를 제시한다. cursor 재진입과 저장값 덮어쓰기는 보고자의 원인 가설이다.

보고된 canary 비교에서는 head+transition 실패, body+transition 및 head 동기 경로 성공이다. stable 19.2.8에서는 세 경로 모두 오류라고 보고하므로 동기 경로를 일반 해결책으로 기록하지 않는다. Next.js가 포함한 React canary와 직접 react-dom 버전도 구분해야 한다.

증거: 실제 lockfile 버전, head/body 위치, suspension 시점, transition 여부, 최초 DOM과 오류 stack. 확인 방법은 같은 fixture의 버전별 비교이며 본 저장소에서 실행하지 않았다. 이슈는 Open, 수정 PR 및 릴리스 확인은 미완료다.

## 범위

실제 공개 보고 분석이다. 가상 SFT 예제, 독립 재현, 모델 가중치 학습과 구별한다.
