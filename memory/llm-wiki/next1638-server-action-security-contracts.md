# Next.js Server Action 권한·배포 보안 경계

Topic: frameworks/nextjs/server-action-security
Version: Next.js docs display 16.3.8, updated 2026-08-25; local deployment untested
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://nextjs.org/docs/app/guides/data-security

<!-- evidence-sha256: 77ffc6fbd6bb397333dcddc52967ce9cb0ae3ebd46e441e72a0c6be715a823ba -->

## 공식 계약과 범위

생성된 action endpoint는 UI를 거치지 않는 POST를 고려해야 한다. action마다 인증·권한과 입력을 검증하고 최소 DTO를 반환한다. 원문은 unused action의 빌드 제거도 설명하므로 모든 export가 항상 노출되거나 unused라 안전하다고 단정하지 않는다. closure encryption은 권한 검사를 대신하지 않는다. 다중 instance의 키 일관성과 Origin/Host 관계는 별도 배포 계약이다. 실제 key·사용자 정보는 수집하지 않았으며 보안 검증을 실행한 결과가 아니다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-NEXT-ACT-001 | UI 우회 변경 | 직접 POST·인증 검사 | 페이지 검사만 수행 | action 내부 인증·권한 확인 | 비권한 변경 거절 |
| SYN-NEXT-ACT-002 | 다른 사용자 자원 수정 | 입력 ID·소유권 | client 입력 신뢰 | 입력 검증·소유권 확인 | 교차 사용자 요청 거절 |
| SYN-NEXT-ACT-003 | 응답 내부 필드 노출 | 직렬화 필드 | DB 레코드 직접 반환 | 최소 DTO 반환 | 허용 필드만 확인 |
| SYN-NEXT-ACT-004 | instance별 action 실패 | 빌드·키 설정 식별 | 암호화 키 불일치 후보 | 값 노출 없이 배포 일관성 검토 | 노드 교차 호출 검사 |
| SYN-NEXT-ACT-005 | proxy 경유 요청 거절 | Origin·Host 관계 | origin 검사 불일치 | 안전한 허용 origin 검토 | 허용·거절 경로 확인 |
