# July 29 Search Recovery Handoff

## Three Wins

1. Google impressions increased 47% in the latest fixed 28-day comparison: 9,276 versus 6,292.
2. Bing clicks increased 120% in the latest fixed 28-day comparison: 44 versus 20. Kawaii calculator queries remain the strongest Bing cluster.
3. The CrawlScout sample fell from 124 to 118 rows. Seven previously affected URLs are now confirmed indexed.

## Three Issues

1. Google clicks fell from 25 to 12 despite the impression increase.
2. Mileage recrawl confirmation is still missing; Date Calculator remains a watch item.
3. The Hostinger Sydney CDN path returns intermittent or persistent 504 responses to fresh automated checks even though Chrome, independent external fetches, and the completed Node 24 deployment are healthy.

## Best Next Action

Allow the regional CDN path to cool down, then rerun the production sitemap and Ask audit once. Escalate to Hostinger with request IDs if it still fails; do not rewrite pages or roll back to the vulnerable dependency tree.

## Do Not Repeat

- Do not edit or resubmit the seven recovered URLs.
- Do not rewrite `/gallery/converters/` before the August 11 watch date.
- Do not change the Kawaii Calculator cluster without contrary evidence.
- Do not bundle the unfinished Browser AI article into this campaign release.
