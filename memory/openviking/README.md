# OpenViking 개발 지식 리소스

이 폴더의 `resources/developer-knowledge/`는 공개 개발 위키를 OpenViking의 **리소스 계층**에 맞춰 재구성한, Git으로 검토 가능한 가져오기 원본이다. 논리 루트는 `viking://resources/developer-knowledge/`다. 사용자 기억·세션·스킬 자료는 포함하지 않는다.

## 현재 상태

- [생성 manifest](manifest.json)에 사례 370건(언어 130, CNCF 120, 프레임워크 120), CNCF Landscape 항목 2,425개, 개념 가이드 18개, 사례 공식 URL 265개와 파일별 SHA-256이 기록된다.
- 각 주제 디렉터리의 `.abstract.md`는 L0, `.overview.md`는 L1, 일반 Markdown은 L2 상세 자료다. 공식 OpenViking의 [계층 설명](https://github.com/volcengine/OpenViking/blob/main/docs/en/concepts/03-context-layers.md)을 따른다.
- 이 폴더는 **서버의 AGFS·벡터 인덱스가 아니다**. 실제 OpenViking 저장 완료는 서버에 가져온 뒤 task 완료, `viking://` 원문 읽기, 검색 결과를 각각 확인해야 한다. 현재 서버·CLI·모델 설정이 확인되지 않아 네이티브 저장 상태는 `UNAVAILABLE`이다.
- 사례는 진단 가설이고, Landscape 항목은 고정 스냅샷의 메타데이터다. URL 접근 성공은 원인·해결 검증이 아니다.

## 오프라인 재생성과 검증

```powershell
node C:\PRJ\apps\info\memory\build-openviking-resources.mjs --build
node C:\PRJ\apps\info\memory\build-openviking-resources.mjs --check
node C:\PRJ\apps\info\memory\probe-openviking-sources.mjs --check
```

`--build`는 위키와 고정 Landscape에서 리소스를 결정적으로 생성한다. 새 사례 파일을 추가해도 ID가 L/C/F 계열이면 자동으로 포함한다. `--check`는 manifest, 파일 해시, 누락·초과 파일을 검사한다. 별도 [URL 점검 기록](source-probe-report.json)은 HTTP 상태만 다루며 연결 차단 시 확인 시각을 새로 쓰지 않는다.

## 네이티브 OpenViking 연결 후

1. 공식 [서버 설정](https://docs.openviking.ai/en/configuration/01-server)에 따라 `storage.workspace`를 의도한 로컬 저장소로 지정하고 임베딩 모델과 VLM의 실제 연결을 점검한다. 계정 키나 모델 설정은 이 Git 저장소에 넣지 않는다.
2. 공식 [리소스 가져오기](https://github.com/volcengine/OpenViking/blob/main/docs/en/api/02-resources.md)의 로컬 디렉터리 import로 이 `resources/developer-knowledge/`를 `viking://resources/developer-knowledge/`에 가져온다. 공식 Python SDK `openviking-sdk`가 연결된 환경에서는 [가져오기 스크립트](../import-openviking-native.py)를 실행한다. 이 스크립트는 전체 원본 해시를 먼저 확인하고, 디렉터리 구조 보존·`parse_mode=no_split`·정상 semantic/vector 처리를 요청한다. 서버·모델 상태에 따라 대량 처리는 오래 걸릴 수 있다.
3. 반환된 task ID가 완료됐는지 확인한다. 리소스 트리의 사례 파일 하나와 CNCF 항목 하나를 `read`로 다시 읽고, 언어·CNCF·프레임워크 질의를 각각 `find`로 검색한다. 가져오기 실패 파일과 벡터 큐 실패를 별도로 기록한다.
4. 원본이 달라지면 `--build`와 `--check` 후 해당 리소스를 다시 가져온다. OpenViking의 [Watch](https://github.com/volcengine/OpenViking/blob/main/docs/en/api/02-resources.md)는 URL·Git처럼 서버가 다시 읽을 수 있는 소스에 적용한다. 로컬 디렉터리를 업로드한 스냅샷은 재수집이 필요하다.

파일의 L0/L1은 오프라인 탐색을 위해 준비한 요약이다. 네이티브 `semantic_and_vectors` 처리에서는 서버가 요약을 재생성할 수 있고, `vectors_only`에서는 새 요약을 생성하지 않는다. 서버 처리 결과를 읽어 확인하기 전에는 이 파일들이 네이티브 인덱스라고 간주하지 않는다.

서버에 가져온 뒤에는 `OPENVIKING_URL`과 필요한 경우 `OPENVIKING_API_KEY`를 프로세스 환경 변수로 지정하고 아래 명령을 실행한다. [검증 스크립트](../verify-openviking-native.mjs)는 manifest에 연결된 대표 사례 3건의 원문과 영역별 검색을 확인한다. 성공 보고서 `native-verification.json`은 **표본 검증**이며 전체 3,380개 파일의 적재 완료를 뜻하지 않는다. 전체 적재 완료 여부는 가져오기 결과의 실패 목록과 queue 오류로 별도로 확인해야 한다. 서버가 없거나 확인에 실패하면 성공 보고서를 새로 쓰지 않는다.

```powershell
node C:\PRJ\apps\info\memory\verify-openviking-native.mjs
```

## 재수집 범위와 출처

기존 위키의 자체 설명과 VOC를 상세 리소스로 바꾸고, CNCF의 CC BY 4.0 고정 Landscape 색인을 항목별로 보존했다. `sources/catalog.md`는 사례에 연결된 공식 문서 URL을 모은 것이다. 외부 원문을 대량 복제하지 않으며, 새 자료는 출처·버전·실제 확인 상태를 분리해 추가한다. 사용자의 프로젝트, 회사 자료, 스킬 내용은 수집 대상이 아니다.
