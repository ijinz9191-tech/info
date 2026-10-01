# 유명 GitHub 코드 읽기 지도

코드 읽기 가이드 확인일: 2026-09-30. 아래는 **언어 런타임, 프레임워크, 분산 시스템, 운영체제의 설계 차이**를 비교하며 배울 수 있는 프로젝트다. 2026-10-02에 공개 저장소의 문서·예제·대표 구현을 커밋 SHA로 고정해 추가했다. 실제 원문 수집 범위와 미확보 원천은 [대량 원문 장부](corpus-overview.md), 파일별 탐색은 [OpenViking 원문 색인](openviking/resources/official-corpus/README.md)을 따른다. 전체 구현을 모두 복제하거나 실행 검증한 것은 아니다.

| 저장소 | 읽을 질문 | 시작 위치/검색어 |
|---|---|---|
| [python/cpython](https://github.com/python/cpython) | 파이썬 객체·인터프리터·표준 라이브러리는 어떻게 나뉘나? | `Objects/`, `Python/`, `Lib/`, `InternalDocs/` |
| [openjdk/jdk](https://github.com/openjdk/jdk) | Java API와 VM 구현의 경계는? | `src/java.base/`, `src/hotspot/`, `test/` |
| [dotnet/runtime](https://github.com/dotnet/runtime) | 라이브러리와 CLR, GC는 어떻게 분리되나? | `src/libraries/`, `src/coreclr/`, `src/tests/` |
| [golang/go](https://github.com/golang/go) | 컴파일러·런타임·표준 라이브러리는 어떻게 연결되나? | `src/cmd/compile/`, `src/runtime/`, `src/net/http/` |
| [rust-lang/rust](https://github.com/rust-lang/rust) | 컴파일러·표준 라이브러리·진단 테스트의 구조는? | `compiler/`, `library/`, `tests/` |
| [torvalds/linux](https://github.com/torvalds/linux) | 커널의 서브시스템과 아키텍처별 코드는 어떻게 분리되나? | `kernel/`, `mm/`, `fs/`, `net/`, `Documentation/` |
| [react/react](https://github.com/react/react) | UI 렌더링과 스케줄링, 공개 API는 어떻게 나뉘나? | `packages/`에서 `react`, `react-dom`, `react-reconciler` 검색 |
| [django/django](https://github.com/django/django) | ORM·요청 처리·폼·보안 기능은 어떻게 묶이나? | `django/db/`, `django/http/`, `django/core/`, `tests/` |
| [fastapi/fastapi](https://github.com/fastapi/fastapi) | 라우팅·의존성·입력 검증은 어디서 만나는가? | `fastapi/`, `tests/`에서 `APIRoute`, `Depends` 검색 |
| [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) | 자동 설정과 starter, 상태 점검은 어떻게 조직되나? | `spring-boot-project/`에서 `autoconfigure`, `actuator` 검색 |
| [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) | 선언 상태와 컨트롤러의 반복 조정은 어떻게 구현되나? | `pkg/controller/`, `cmd/`, `staging/` |
| [apache/kafka](https://github.com/apache/kafka) | 생산자·소비자·브로커의 분리와 전달 보장은? | `clients/`, `core/`, `streams/` |

## 추가 코드 탐색 대상

이 표는 시작할 **질문**을 제공한다. 디렉터리 구조와 구현은 저장소의 현재 커밋에서 확인하고 기록한다.

| 저장소 | 코드에서 추적할 질문 |
|---|---|
| [nodejs/node](https://github.com/nodejs/node) | JavaScript API, 네이티브 바인딩, 이벤트 루프는 어디서 연결되는가? |
| [microsoft/TypeScript](https://github.com/microsoft/TypeScript) | 파서·타입 검사·언어 서비스는 어떤 경계로 나뉘는가? |
| [vuejs/core](https://github.com/vuejs/core) | 반응성 변경이 렌더와 스케줄러에 어떻게 전달되는가? |
| [angular/angular](https://github.com/angular/angular) | DI·컴파일러·런타임의 계약은 무엇인가? |
| [vercel/next.js](https://github.com/vercel/next.js) | 라우팅·서버 렌더링·빌드 산출물의 경계는? |
| [flutter/flutter](https://github.com/flutter/flutter) | widget, render, framework 테스트는 어떻게 분리되는가? |
| [godotengine/godot](https://github.com/godotengine/godot) | 장면·렌더·물리·에디터의 모듈 경계는? |
| [llvm/llvm-project](https://github.com/llvm/llvm-project) | 프런트엔드, IR, 최적화, 백엔드가 어떻게 이어지는가? |
| [postgres/postgres](https://github.com/postgres/postgres) | 쿼리 계획, 실행, WAL, 잠금은 어떻게 분리되는가? |
| [redis/redis](https://github.com/redis/redis) | 명령 처리, 자료구조, 영속화의 경계는? |
| [apache/spark](https://github.com/apache/spark) | 논리 계획·물리 실행·분산 스케줄링이 어떻게 연결되는가? |
| [apache/flink](https://github.com/apache/flink) | 상태·체크포인트·이벤트 시간은 어디서 구현되는가? |
| [apache/airflow](https://github.com/apache/airflow) | DAG 정의, 스케줄러, 실행기의 책임은? |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | tensor 연산, autograd, CPU/GPU 백엔드의 경계는? |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | 그래프·실행·장치 커널을 어떻게 추적하는가? |
| [electron/electron](https://github.com/electron/electron) | main/renderer 프로세스와 IPC의 보안 경계는? |
| [hashicorp/terraform](https://github.com/hashicorp/terraform) | 설정, plan, state, provider 호출은 어떻게 분리되는가? |
| [moby/moby](https://github.com/moby/moby) | 컨테이너 API, 이미지, 네트워크, 저장소 경계는? |
| [ansible/ansible](https://github.com/ansible/ansible) | 선언 작업의 모듈 실행과 멱등성은 어디서 결정되는가? |
| [curl/curl](https://github.com/curl/curl) | 프로토콜 처리, 연결 재사용, 오류 표면은 어떻게 설계되는가? |

## 코드를 읽는 절차

1. README, 지원 버전, 빌드·테스트 문서를 읽고 질문을 하나 정한다. 예: “재시도 뒤 이벤트가 중복 처리되는가?”
2. 사용자가 호출하는 공개 API나 명령의 입구를 찾는다. 함수명 검색 결과를 모두 읽지 말고 호출 경로를 따라간다.
3. 성공 경로와 실패 경로를 함께 추적한다. 오류 반환, 취소, 롤백, 로그, 메트릭, 테스트를 연결한다.
4. 관련 테스트에서 기대 계약을 확인한다. 테스트는 의도를 보여주지만 모든 플랫폼의 동작을 증명하지 않는다.
5. 관찰한 내용을 `repo / commit SHA / 파일 경로 / 함수 / 입력 / 출력 / 실패 조건 / 내 해석` 형식으로 적는다.
6. 다른 프로젝트의 비슷한 문제와 비교한다. 예: Kafka의 재처리, HTTP API의 멱등성, UI 중복 클릭은 모두 재실행 문제지만 보장 경계가 다르다.

## 로컬에 복제해 볼 때

```sh
git rev-parse HEAD
rg -n "함수명|오류코드|테스트명" .
git blame -L 시작,끝 -- 경로/파일
git log --oneline -- 경로/파일
```

저장소에서 확인한 코드를 제품에 사용할 때는 해당 저장소의 라이선스, API 안정성, 보안 공지, 버전 호환성을 검토한다. 이 위키는 코드 복제를 통한 사용 허가를 제공하지 않는다.
