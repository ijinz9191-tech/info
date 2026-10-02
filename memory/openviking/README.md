# OpenViking 개발 지식 리소스

이 폴더의 `resources/developer-knowledge/`는 공개 개발 위키를 OpenViking의 **리소스 계층**에 맞춰 재구성한, Git으로 검토 가능한 가져오기 원본이다. 논리 루트는 `viking://resources/developer-knowledge/`다. 사용자 기억·세션·스킬 자료는 포함하지 않는다.

## 현재 상태

- [생성 manifest](manifest.json)에 사례 373건(언어 130, CNCF 121, 프레임워크 122), CNCF Landscape 항목 2,427개, 개념 가이드와 사례 공식 URL 및 파일별 SHA-256이 기록된다.
- 각 주제 디렉터리의 `.abstract.md`는 L0, `.overview.md`는 L1, 일반 Markdown은 L2 상세 자료다. 공식 OpenViking의 [계층 설명](https://github.com/volcengine/OpenViking/blob/main/docs/en/concepts/03-context-layers.md)을 따른다.
- 이 폴더는 **서버의 AGFS·벡터 인덱스가 아니다**. 별도 `C:\PRJ\apps\info\.ov-runtime`에서 OpenViking 0.4.22와 로컬 Ollama 모델을 실행하고, 단일 사례와 디렉터리 표본의 벡터 처리·원문 읽기·검색을 확인했다. 전체 가져오기는 [작업 보고서](native-import-report.json)의 서버 task ID로 추적한다. task 완료와 대표 원문 읽기·검색이 모두 확인될 때까지 전체 네이티브 저장을 완료로 표시하지 않는다.
- 사례는 진단 가설이고, Landscape 항목은 고정 스냅샷의 메타데이터다. URL 접근 성공은 원인·해결 검증이 아니다.

## 오프라인 재생성과 검증

```powershell
node C:\PRJ\apps\info\memory\build-openviking-resources.mjs --build
node C:\PRJ\apps\info\memory\build-openviking-resources.mjs --check
node C:\PRJ\apps\info\memory\probe-openviking-sources.mjs --check
```

`--build`는 위키와 고정 Landscape에서 리소스를 결정적으로 생성한다. 새 사례 파일을 추가해도 ID가 L/C/F 계열이면 자동으로 포함한다. `--check`는 manifest, 파일 해시, 누락·초과 파일을 검사한다. 별도 [URL 점검 기록](source-probe-report.json)은 HTTP 상태만 다루며 연결 차단 시 확인 시각을 새로 쓰지 않는다.

## 네이티브 OpenViking 연결 후

1. [분리된 런타임](../../openviking/README.md)의 설정과 시작·상태 스크립트로 서버와 로컬 모델을 점검한다. 실제 모델·벡터 저장소·로그는 Git에 넣지 않는다.
2. [동기화 스크립트](../../openviking/sync.ps1)는 전체 원본 해시를 검사하고, 공식 [리소스 가져오기](https://docs.openviking.ai/en/api/02-resources)의 로컬 디렉터리 import로 `viking://resources/developer-knowledge/`에 업로드한다. 현재 대량 초기 적재는 `vectors_only`로 시작한다. 원본은 이미 사람이 작성한 계층 설명을 포함하지만 네이티브 의미 요약 생성은 별도 단계다.
3. [작업 확인 스크립트](../../openviking/monitor.mjs)로 반환된 task ID의 완료, 실패 파일과 큐 오류를 확인한다. 완료 뒤 사례 원문 3건을 `read`로 다시 읽고 언어·CNCF·프레임워크 질의를 각각 `find`로 검색한다.
4. 원본이 달라지면 `--build`와 `--check` 후 해당 리소스를 다시 가져온다. OpenViking의 [Watch](https://github.com/volcengine/OpenViking/blob/main/docs/en/api/02-resources.md)는 URL·Git처럼 서버가 다시 읽을 수 있는 소스에 적용한다. 로컬 디렉터리를 업로드한 스냅샷은 재수집이 필요하다.

파일의 L0/L1은 오프라인 탐색을 위해 준비한 요약이다. 표본 가져오기에서 OpenViking은 `.abstract.md`와 `.overview.md`를 점 파일로 건너뛰었다. 현재 568개 보조 파일은 원본으로 보관되지만 `vectors_only` 적재만으로는 네이티브 L0/L1에 들어가지 않는다. 네이티브 요약 생성과 전체 계층 반영은 후속 처리로 검증해야 한다.

서버에 가져온 뒤에는 `OPENVIKING_URL`과 필요한 경우 `OPENVIKING_API_KEY`를 프로세스 환경 변수로 지정하고 아래 명령을 실행한다. [검증 스크립트](../verify-openviking-native.mjs)는 기존 자체 위키 manifest에 연결된 대표 사례 3건의 원문과 영역별 검색을 확인한다. 성공 보고서 `native-verification.json`은 **표본 검증**이며 전체 파일이나 새 공개 원문 리소스의 적재 완료를 뜻하지 않는다. 전체 적재 완료 여부는 가져오기 결과의 실패 목록과 queue 오류로 별도로 확인해야 한다. 서버가 없거나 확인에 실패하면 성공 보고서를 새로 쓰지 않는다.

```powershell
node C:\PRJ\apps\info\memory\verify-openviking-native.mjs
```

## 재수집 범위와 출처

기존 위키의 자체 설명과 VOC를 상세 리소스로 바꾸고, CNCF의 고정 Landscape 색인을 항목별로 보존했다. `sources/catalog.md`는 사례에 연결된 공식 문서 URL을 모은 것이다. 별도 공개 원문 리소스에는 실제 문서와 코드 및 라이선스를 대량 보존하며 출처·버전·실제 확인 상태를 분리한다. 사용자의 프로젝트, 회사 자료, 스킬 내용은 수집 대상이 아니다.

## 별도 공개 원문 리소스

[official-corpus 탐색](resources/official-corpus/README.md)은 `viking://resources/official-corpus/`로 가져올 수 있는 별도 스냅샷이다. [manifest](official-corpus-manifest.json)는 분할 파일 목록의 해시를 기록하며 각 목록은 개별 리소스 해시를 가진다. 모든 본문은 원본 SHA와 URL을 명시하고 라이선스 파일도 보관한다. 현재는 가져오기 원본 준비 상태이며 네이티브 서버 적재는 수행하지 않았다.

```powershell
python C:\PRJ\apps\info\memory\build-training-corpus.py --build
python C:\PRJ\apps\info\memory\build-training-corpus.py --check
python C:\PRJ\apps\info\memory\import-openviking-native.py --official --verify-source-only
```

별도 서버와 모델 연결을 확인한 환경에서만 마지막 명령의 `--verify-source-only`를 빼서 네이티브 가져오기를 실행한다. 작업량이 크므로 충분한 서버 자원과 모델 처리 예산이 필요하다. 스케줄이나 서버 시작을 이 명령에 연결하지 않는다. `OPENVIKING_WAIT=0`이면 대기 없이 제출하며 제출은 완료가 아니다. 작업의 완료·실패 파일·원문 readback·검색을 검증한 뒤에만 완료로 표시한다. 기존 사례 검증기는 이 새 원문 리소스를 검증하지 않는다.

원문 리소스의 L0/L1은 자동 탐색 색인이다. 점 파일이 생략되어도 `L0-index.md`와 `L1-index.md`로 파일 목록을 읽을 수 있으나 이는 네이티브 계층 요약을 생성했다는 의미는 아니다. 학습 텍스트는 [training](../training/README.md)에 별도로 저장된다.
