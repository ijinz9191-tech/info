# Sentry Java scope lock 대기와 서비스 정지 공개 보고

Topic: frameworks/spring
Version: Reported Sentry 8.25.0, Java 24, Boot 3.5
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/getsentry/sentry-java/issues/4872
- https://docs.spring.io/spring-boot/3.5/reference/features/spring-application.html

<!-- evidence-sha256: 3a4d945788193b5691435a92b8118ed625b2bd5d9ac079190973560eb2f58780 -->

## 보고와 진단

Kubernetes MVC 환경에서 Java agent와 Boot starter를 함께 사용한 보고다. thread dump에 ReentrantLock 대기, SynchronizedQueue.toArray, Scope.clone, SentryContextWrapper.forkCurrentScope와 Poller 대기가 제시됐다. 이는 보고된 정지 현상이며 lock cycle을 독립 증명하지 않았다.

보고자의 Boot 3.5 가상 스레드 기본 활성화 주장은 공식 문서의 spring.threads.virtual.enabled=true 활성화 안내와 구분한다. 실제 effective 설정을 확인하며 버전명만으로 활성화를 추정하지 않는다.

진단 후보는 동일 부하에서 agent 유무와 sampling을 한 변수씩 비교하고 thread dump, 지연, 처리량을 함께 측정하는 것이다. sampling 감소나 agent 제거는 본문에서 조사 후보이며 입증된 해결책이 아니다. Closed 상태만으로 수정 버전을 확정하지 않는다. 로컬 실행 및 운영 해결은 미확인.

## 범위

실제 공개 보고 분석이다. 가상 SFT 예제, 독립 재현, 모델 가중치 학습과 구별한다.
