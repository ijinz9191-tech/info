# 독립 OpenViking 런타임

공개 개발 지식 원본은 `C:\PRJ\apps\info\memory`에 있다. 이 디렉터리는 OpenViking 서버를 시작하고 원본을 가져오는 운영 파일만 보관한다. 실행 환경, 모델, AGFS·벡터 데이터베이스와 로그는 Git 밖의 `C:\PRJ\apps\info\.ov-runtime`에 둔다. 개인·회사·스킬 자료는 가져오지 않는다.

## 고정 구성

- 서버: OpenViking 0.4.22, 공식 Python SDK
- 로컬 모델 서비스: Ollama 0.35.0, `127.0.0.1:11434`
- 임베딩: `qwen3-embedding:0.6b` (실측 1,024차원)
- 의미 처리 모델: `qwen3-vl:2b-instruct`
- OpenViking: `127.0.0.1:1933`, 대상 `viking://resources/developer-knowledge/`
- 공개 위키 상태와 네이티브 저장 완료 상태는 [원본 설명](../memory/openviking/README.md)에서 구별한다.

기본 설정은 [예시 파일](ov.conf.example)에 있다. 실제 파일은 `.ov-runtime\ov.conf`에 저장한다. API 키를 설정에 직접 기록하지 않는다. 모델 파일을 다운로드한 뒤에는 일반 검색·가져오기가 로컬에서 동작해야 하지만, 새로운 공개 자료 확인과 모델·패키지 업데이트에는 인터넷이 필요하다.

## 실행 및 확인

```powershell
& C:\PRJ\apps\info\openviking\start.ps1
& C:\PRJ\apps\info\openviking\status.ps1
```

`start.ps1`은 이미 응답하는 로컬 서비스는 다시 시작하지 않는다. 새 프로세스를 시작할 때 창은 숨기고 로그를 `.ov-runtime`에 쓴다. 서버 모델과 저장소 상태는 `openviking-server doctor`로 다시 확인한다.

## 지식 가져오기

```powershell
& C:\PRJ\apps\info\openviking\sync.ps1
```

`sync.ps1`은 위키 검사를 통과한 뒤 공개 원본을 서버에 등록하고, 서버 task ID를 다시 확인한다. 초기 전체 적재는 이 PC의 성능을 고려해 `vectors_only`로 진행한다. 작업 중에는 중복 업로드하지 않고 상태만 확인하며, 완료 뒤 대표 사례 읽기·검색을 검증한다. 3,385개 파일 중 점 파일 `.abstract.md`·`.overview.md` 568개는 OpenViking import가 건너뛰므로 네이티브 L0/L1 생성은 별도 단계다. `native-import-report.json`과 `native-verification.json`이 실제 성공을 기록하기 전까지 전체 네이티브 저장 완료로 표시하지 않는다. 위키 내용이 바뀌면 먼저 `node C:\PRJ\apps\info\memory\build-openviking-resources.mjs --build`로 가져오기 원본을 갱신한다.

## 출처

- [OpenViking 서버 설정](https://docs.openviking.ai/en/configuration/01-server)
- [OpenViking 리소스 가져오기](https://docs.openviking.ai/en/api/02-resources)
- [Ollama Windows 독립 CLI](https://github.com/ollama/ollama/blob/main/docs/windows.mdx)
- [Ollama 임베딩 모델](https://ollama.com/library/qwen3-embedding), [비전 언어 모델](https://ollama.com/library/qwen3-vl/tags)
