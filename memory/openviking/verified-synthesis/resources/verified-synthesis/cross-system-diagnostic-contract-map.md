# 시스템 간 진단 계약과 증거 연결

Topic: cross-system/diagnostic-contracts
Version: Cross-source synthesis; each linked page retains its own product/version applicability
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.python.org/3.13/library/asyncio-task.html
- https://learn.microsoft.com/en-us/dotnet/core/diagnostics/debug-threadpool-starvation
- https://docs.cilium.io/en/stable/operations/troubleshooting/
- https://www.rabbitmq.com/docs/confirms
- https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html

<!-- evidence-sha256: 383847e80a414dcfdf4780d6e5c45b6d56b73a96ad7722f4e18307d932ac94e7 -->

## 취소·대기·완료를 구분하기

[Python 태스크](python-asyncio-cancellation.md)와 [취소 실험](python313-timeout-shield-contracts.md)은 취소 요청, 작업 종료, 정리를 구분한다. [.NET TAP](dotnet-tap-completion-boundaries.md)의 완료 역시 성공만을 뜻하지 않는다. [.NET ThreadPool](dotnet9-threadpool-evidence-contracts.md)은 비동기 API에 동기 대기를 걸면 thread가 막힐 수 있음을 설명한다. 한 언어의 해결 코드를 그대로 옮기지 말고 실제 상태 전이와 자원 소유자를 확인한다.

## 제어 상태·통신·초기화를 구분하기

[Cilium](cilium120-state-capacity-contracts.md)의 기존 datapath와 신규 identity 전파는 kvstore 의존성이 다르다. [Karpenter](karpenter-scheduling-readiness-contracts.md)의 Ready와 초기화도 같은 판정이 아니다. [Kubernetes Service](kubernetes-service-evidence-boundaries.md)는 endpoint와 실제 포트 경로를 확인한다. 정상 지표 하나로 전체 경로를 정상이라고 판단하지 않는다.

## 메시지 확인과 저장 경로 구분하기

[RabbitMQ ack/confirm](rabbitmq43-ack-confirm-boundaries.md)은 consumer 처리 확인과 publisher 확인을 구분한다. [DLX](rabbitmq43-deadletter-contracts.md)는 재게시에도 대상 가용성과 전달 모드가 적용됨을 설명한다. [Celery](celery56-task-ack-boundaries.md)의 ack 시점을 broker의 전체 전달 보장으로 일반화하지 않는다.

## 캐시 범위와 실행 계약 구분하기

[Django](django52-cache-backend-contracts.md)의 process별 저장, [Spring](spring-cache-reactive-provider-contracts.md)의 provider와 reactive 완료, [Next.js](next-cache-model-boundaries.md)의 cache model을 구분한다. 모두 캐시라는 이유로 만료·분산·streaming 계약이 같다고 판단하지 않는다.

## 검증 범위

이 연결 문서는 별도 장애 사례 수를 늘리지 않는다. 제품별 공식 계약을 비교한 해석이며, 모든 버전의 동작 또는 운영 재현을 증명하지 않는다. 개별 페이지의 버전·Sources·실행 결과를 확인한다.
