# Spring 시작 단계 가상 스레드 pinning 공개 보고

Topic: frameworks/spring
Version: Reported Boot 3.4.0 versus 3.3.6; Corretto 21.0.5
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/spring-projects/spring-framework/issues/33958

<!-- evidence-sha256: 744e4f9a42e9fdd09e7460a2b5646cb9d618734e5e6bec25670823758d8db3f3 -->

## 보고와 진단

보고자는 lazy initialization과 가상 스레드를 함께 켠 MVC 시작 단계에서 반복 health 요청과 pinning 로그를 관찰했다. 비교 환경은 Ubuntu 24.04.1, Gradle 8.11.1이다. Closed / not planned 상태는 수정 릴리스 증거가 아니다.

확인할 증거: 실제 effective 설정, 시작 시각과 health 요청 시각, -Djdk.tracePinnedThreads=full 출력, 동일 부하의 이전 버전 비교. 시작 단계 lazy bean 초기화와 동기화 경로는 원인 후보이며 독립 재현하지 않았다.

진단 후보: 통제 환경에서 lazy 설정과 시작 중 probe 요청을 각각 바꿔 비교한다. 이는 이 문서의 제안이고 확인된 우회책이 아니다. 성공 판단은 동일 workload에서 pinning과 지연 감소, 정상 readiness 전환 및 요청 처리다. 코드 수정·운영 해결·수정 버전은 미확인.

## 범위

실제 공개 보고 분석이다. 가상 SFT 예제, 독립 재현, 모델 가중치 학습과 구별한다.
