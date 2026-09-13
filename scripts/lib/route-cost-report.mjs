export function summarizeRouteResources(entries, origin) {
  let invalidEntries = 0;
  let externalEntries = 0;
  const resources = entries.map((entry) => {
    let path = '[external-or-invalid]';
    try {
      const url = new URL(entry.name);
      if (url.origin === origin) path = url.pathname;
      else externalEntries += 1;
    } catch { externalEntries += 1; }
    const valid = ['transferSize', 'encodedBodySize', 'decodedBodySize']
      .every(key => Number.isSafeInteger(entry[key]) && entry[key] >= 0);
    if (!valid) invalidEntries += 1;
    return { path, initiator: entry.initiatorType ?? 'unknown', valid,
      transferBytes: valid ? entry.transferSize : null,
      encodedBodyBytes: valid ? entry.encodedBodySize : null,
      decodedBodyBytes: valid ? entry.decodedBodySize : null };
  });
  const total = key => invalidEntries ? null : resources.reduce((sum, row) => sum + row[key], 0);
  return { completedEntries: resources.length, invalidEntries, externalEntries,
    transferBytes: total('transferBytes'), encodedBodyBytes: total('encodedBodyBytes'), decodedBodyBytes: total('decodedBodyBytes'),
    zeroTransferBodyEntries: resources.filter(row => row.valid && row.transferBytes === 0 && row.decodedBodyBytes > 0).length, resources };
}
