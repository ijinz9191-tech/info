# OpenViking 검토 리소스 사용

Verified: 2026-10-02

검토 리소스는 openviking/verified-synthesis/manifest.json과 resources/verified-synthesis에 보관한다. 각 저장소는 로컬 사본으로 사용한다.

## 수동 최신화

공식 자료 수집 → 실제 원문 검토 → LLM-wiki ingest와 lint → 학습 데이터 분할·중복 검토 → 리소스 생성·해시 검사 → 소유자별 merge와 검증 순서다. 예약 실행은 하지 않는다.

## 네이티브 가져오기

해당 저장소 루트에서 아래 명령으로 먼저 로컬 원본을 검사한다.

```powershell
python import-openviking-native.py --verified-synthesis --verify-source-only
```

info 저장소에서는 memory/import-openviking-native.py 경로를 사용한다. 서버·SDK·임베딩/VLM 연결이 확인된 환경에서 --verify-source-only를 제외하면 검토 리소스를 제출한다. 실행 성공만으로 전체 네이티브 검증 완료가 아니다. task 완료와 원문 readback, 실제 서버 검색을 따로 확인한다. 서버 주소·인증값은 이 문서에 저장하지 않는다.

helper의 import 명령은 curated, official corpus와 존재하는 verified-synthesis 묶음을 순서대로 제출한다. 검토 리소스만 제출할 때는 위의 --verified-synthesis 선택을 사용한다. 네이티브 실행 상태는 현재 UNAVAILABLE이다.
