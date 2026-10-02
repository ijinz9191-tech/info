# PyTorch GPU 메모리·worker 진단

Topic: frameworks/ml
Version: 2.14 FAQ; GPU 재현 미실행
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.pytorch.org/docs/2.14/notes/faq.html

<!-- evidence-sha256: 10bcb1354c68a926ee4c8caeba7c9775d5ac38e9b63e62510a38df3a140f566e -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-TORCH-001 | 반복마다 GPU 메모리 증가 | loss 누적 graph 확인 | 통계 Tensor가 history 유지 | 통계 detach 또는 scalar | 반복 memory 추이 |
| SYN-SYN-TORCH-002 | 임시 Tensor 해제 지연 | 참조·scope 확인 | local 참조 유지 | 불필요 참조 해제 | live Tensor memory 확인 |
| SYN-SYN-TORCH-003 | except 안에서 OOM 재발 | exception frame 확인 | frame이 Tensor 참조 유지 | except 밖에서 복구 | 작은 batch 실행 |
| SYN-SYN-TORCH-004 | nvidia-smi와 사용량 다름 | allocator·live Tensor 비교 | caching allocator 예약 | 예약·실사용 구분 | allocator 지표 확인 |
| SYN-SYN-TORCH-005 | fork worker 난수 동일 | 외부 RNG seed 확인 | fork 난수 상태 복제 | worker_init_fn seed 설계 | worker별 난수 비교 |
| SYN-SYN-TORCH-006 | DataParallel packed RNN shape 오류 | 장치별 unpack 길이 확인 | 지역 최대 길이 다름 | total_length 지정 | gather shape 검증 |
| SYN-SYN-TORCH-007 | 긴 RNN sequence OOM | sequence·graph 크기 확인 | BPTT memory 증가 | truncated BPTT 검토 | gradient 경계·메모리 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
