# 유명 오픈소스에서 배울 설계 패턴

확인일: 2026-09-30. 아래 의사코드는 이 위키에서 작성한 설명용 예제다. 원본 저장소의 코드를 옮긴 것이 아니다. 각 프로젝트의 실제 구현은 [GitHub 코드 읽기](github-code.md)에서 버전과 커밋을 정해 확인한다.

## 1. 원하는 상태를 향해 반복 조정하기

[Kubernetes 컨트롤러](https://kubernetes.io/docs/concepts/architecture/controller/)는 선언된 원하는 상태와 실제 상태를 비교해 차이를 줄이는 제어 루프다.

```text
on_resource_change(key):
    desired = read_desired(key)
    actual  = read_actual(key)
    if desired == actual:
        return
    action = smallest_safe_change(desired, actual)
    apply(action)
    enqueue_for_recheck(key)
```

설계할 때는 같은 키를 여러 번 처리해도 안전해야 하고, 일부 조치가 실패한 뒤 다시 실행할 수 있어야 한다. 실제 상태가 늦게 관측되므로 한 번의 성공 응답을 최종 일치로 보지 않는다. 삭제·소유권·경합을 명확히 한다. 이 방식은 배포 조정뿐 아니라 백그라운드 작업 복구에도 유용하다.

## 2. 로그에 기록하고 소비 위치를 분리하기

[Kafka 설계](https://kafka.apache.org/design/)에서 생산은 파티션 로그에 기록하고, 소비자는 자기 위치를 따라 읽는다. 소비자가 느리거나 재시작하면 아직 처리하지 않은 기록을 다시 읽을 수 있다.

```text
record = poll()
if already_applied(record.id):
    commit_consumption_position(record)
else:
    validate(record)
    apply_business_change_and_dedupe_marker_atomically(record)
    commit_consumption_position(record)
```

업무 변경과 중복 방지 표식이 같은 트랜잭션에 있어야 재시작 때 안전하다. 소비 위치를 업무 변경보다 먼저 확정하면 처리 누락이 생길 수 있다. 실제 전달 보장은 Kafka 버전·설정과 외부 저장소 경계에 따라 달라진다.

## 3. 계산과 화면 반영을 구별하기

[React의 렌더와 커밋](https://react.dev/learn/render-and-commit)은 상태 갱신에 따라 컴포넌트 계산을 수행하고, 결과 차이가 있을 때 DOM에 반영하는 흐름을 설명한다.

```text
event -> update_state -> compute_view(state) -> compare -> commit_changes
```

`compute_view`는 같은 입력에서 같은 결과를 내고 외부 상태를 바꾸지 않아야 예측 가능하다. 네트워크 요청·구독·타이머 같은 부작용은 화면 계산과 분리하고 수명 종료 때 정리한다. 단순히 컴포넌트 함수가 다시 실행됐다고 DOM 전체가 다시 작성된 것은 아니다.

## 4. 공개 API, 내부 구현, 테스트를 함께 읽기

언어 런타임 저장소인 [CPython](https://github.com/python/cpython), [OpenJDK](https://github.com/openjdk/jdk), [.NET Runtime](https://github.com/dotnet/runtime), [Go](https://github.com/golang/go), [Rust](https://github.com/rust-lang/rust)는 API 문서와 실제 구현의 경계를 보여준다. 내부 구현을 앱의 보장된 API로 착각하지 않는다.

```text
공식 사용 계약 → 공개 API 진입 → 내부 자료구조/상태 전이
              → 오류·취소 경로 → 테스트 → 성능 측정
```

내부 함수 이름과 경로는 버전마다 바뀔 수 있다. 버그를 추적할 때는 커밋 SHA, 빌드 플래그, 플랫폼, 테스트를 함께 고정한다.

## 5. 읽기 지도를 질문으로 만들기

- **정합성:** 재시작·중복 요청·순서 역전에서 같은 결과가 나오는가?
- **수명:** 객체, 연결, 구독, goroutine/thread를 누가 종료하는가?
- **오류:** 실패가 호출자에게 어떻게 전달되고, 되돌리기는 어디에서 하는가?
- **성능:** 자료구조 선택, 캐시, 배치, 락, I/O 경계의 비용은 어디인가?
- **관측:** 운영자가 실패를 구별할 수 있는 로그·메트릭·trace가 있는가?

이 질문을 실제 코드와 테스트로 답한 뒤에만 “이 프로젝트는 이렇게 동작한다”는 결론을 기록한다.
