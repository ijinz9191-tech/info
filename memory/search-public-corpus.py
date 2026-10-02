#!/usr/bin/env python3
"""Read local source records without a server or vector index."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('query')
parser.add_argument('--repo', default='')
parser.add_argument('--content', action='store_true', help='Read source text, instead of just paths/topics')
parser.add_argument('--incidents', action='store_true', help='Search upstream error-section pointers')
parser.add_argument('--limit', type=int, default=30, help='Display limit only; does not limit stored data')
args = parser.parse_args()
matches = 0
query = args.query.casefold()
repo_filter = args.repo.casefold()
if args.incidents:
    for shard in sorted((ROOT / 'training').glob('incident-sections-*.jsonl')):
        for row in shard.open(encoding='utf-8'):
            item = json.loads(row)
            if repo_filter not in item['repo'].casefold():
                continue
            if query not in (item['title'] + ' ' + item['preview'] + ' ' + item['upstreamPath']).casefold():
                continue
            matches += 1
            if matches <= args.limit:
                print(json.dumps(item, ensure_ascii=False))
else:
    for file in sorted((ROOT / 'corpus' / 'repositories').glob('*.json')):
        record = json.loads(file.read_text(encoding='utf-8'))
        if repo_filter not in record['repo'].casefold():
            continue
        for item in record['files']:
            target = record['repo'] + ' ' + item['path'] + ' ' + ' '.join(record['topics'])
            local = (ROOT / 'corpus' / item['localPath']).resolve()
            if not local.is_relative_to((ROOT / 'corpus').resolve()):
                raise RuntimeError('source path escaped corpus')
            if args.content:
                target += '\n' + local.read_text(encoding='utf-8-sig')
            if query not in target.casefold():
                continue
            matches += 1
            if matches <= args.limit:
                print(json.dumps({'repo': record['repo'], 'commit': record['commit'], **item, 'absolutePath': str(local)}, ensure_ascii=False))
print(json.dumps({'matches': matches, 'displayed': min(matches, max(0, args.limit)), 'networkUsed': False}))
