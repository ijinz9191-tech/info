#!/usr/bin/env python3
"""Update source-snapshot numbers without changing technical review dates."""
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parent
snapshot = json.loads((root / 'public-data/cncf-landscape-index.json').read_text(encoding='utf-8'))
count = len(snapshot['items'])
projects = sum(bool(item.get('project')) for item in snapshot['items'])
source_date = datetime.fromisoformat(snapshot['retrievedAt'].replace('Z', '+00:00')).astimezone(timezone(timedelta(hours=9))).date().isoformat()
changed = []
for relative in ('cncf-deep-dive.md', 'coverage.md', 'openviking/README.md', 'public-data/README.md'):
    path = root / relative
    original = path.read_text(encoding='utf-8')
    text = re.sub(r'\d[\d,]*개(?= (?:Landscape )?항목)', f'{count:,}개', original)
    text = re.sub(r'\d[\d,]*개(?= 제품의 기능)', f'{count:,}개', text)
    text = re.sub(r'\d+개(?= 프로젝트 목록)', f'{projects}개', text)
    if relative == 'cncf-deep-dive.md':
        text = re.sub(r'Landscape 원문 수집: \d{4}-\d{2}-\d{2}', 'Landscape 원문 수집: ' + source_date, text)
        text = re.sub(r'커밋 `[0-9a-f]{40}`로 고정', f"커밋 `{snapshot['commit']}`로 고정", text)
        text = re.sub(r'`project` 필드가 있는 \d+개', f'`project` 필드가 있는 {projects}개', text)
    if text != original:
        path.write_text(text, encoding='utf-8')
        changed.append(relative)
print(json.dumps({'status': 'SNAPSHOT_NOTES_CURRENT', 'changed': changed, 'sourceDate': source_date, 'items': count, 'projects': projects}))
