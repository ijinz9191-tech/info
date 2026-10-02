# Django 캐시 범위·만료·middleware 계약

Topic: frameworks/django-cache
Version: Django 5.2 official documentation; backend-specific behavior
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.djangoproject.com/en/5.2/topics/cache/

<!-- evidence-sha256: b7f27f0936fed6340ca327b7a15d9da4000bf7b9bf1f4f7453255234b2d92b9f -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-DJCACHE-001 | worker별 캐시 값 다름 | LocMemCache·process 수 | process별 별도 저장 | 공유 필요성에 맞춰 backend 선택 | worker 간 조회 |
| SYN-DJCACHE-002 | set 이후 항상 miss | DummyCache backend | 무저장 인터페이스 | 환경별 backend 확인 | set/get 비교 |
| SYN-DJCACHE-003 | 즉시 만료 | TIMEOUT=0 | 즉시 만료 계약 | 필요 만료값 선택 | 0·None·양수 비교 |
| SYN-DJCACHE-004 | 캐시 middleware 오동작 | MIDDLEWARE 순서 | update/fetch 배치 오류 | update 처음·fetch 마지막 | 응답·hit 확인 |
| SYN-DJCACHE-005 | 사이트 간 키 충돌 | 공유 cache와 prefix | 동일 key namespace | 고유 site prefix | 사이트별 값 분리 |
| SYN-DJCACHE-006 | cache 파일 노출 | cache LOCATION·공개 파일 경로 | MEDIA/STATIC 내부 저장 | 공개 경로 밖 보관 | 파일 접근과 권한 확인 |
| SYN-DJCACHE-007 | 대량 파일에서 지연 | 파일 수·backend 지연 | filesystem 비용 증가 | backend·culling 측정 | 같은 부하 latency 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
