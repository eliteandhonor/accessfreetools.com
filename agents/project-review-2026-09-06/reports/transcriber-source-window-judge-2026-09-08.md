# Transcriber Source-Window Judge - 2026-09-08

## Findings And Verdict

No required-change finding was confirmed in the reviewed source-window helper and worker integration. This is a narrow code-review result, not implementation-task approval or release approval. Confidence is high for the exercised integer PCM indexing, sequential orchestration, request identity, and rejection behavior; real recognizer behavior and browser execution remain unverified by this judge.

The approach structurally prevents the installed pipeline from receiving multiple source windows in one recognition call. It does not prove that actual transcription now preserves every utterance. The parent's built-application evidence and known overlap failure must be judged separately, as recorded below.

Optional coverage follow-up, owned by the parent/transcriber implementer: extend the existing pure protocol tests with a multiwindow request that fails on its second recognition call. Acceptance: exactly one completed-window progress event and one request-tagged error, no third call, no `transcribed` event, preserved `AbortError`/`TimeoutError` names, and no stale request progress accepted by the waiter. This judge exercised those cases in memory; the existing on-disk test source does not yet retain all of them. No product or test file was edited for this recommendation.

## Authority And Snapshot

- Review time: 2026-09-08, approximately 21:02 Australia/Brisbane (+10:00).
- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
- T branch: `codex/browser-transcriber-pilot`; HEAD: `90d6dcab0580a91ca66382f2414d95e8817469e5`.
- R: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06`.
- R repository branch: `codex/gpt6-review-implementation`; HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`.
- T is dirty, with the reviewed transcriber helper, worker, and associated tests untracked. HEAD alone does not identify the reviewed implementation. SHA-256 values below bind this review to the working files, not to a built bundle.
- Read T `AGENTS.md`, R repository `AGENTS.md` (including its difference from T), R `AGENTS.md`, campaign context and TR-01/TR-02/TR-03/RJ-02 entries, and `C:/Users/chamb/.codex/skills/code-review-and-quality/SKILL.md`.
- Campaign snapshot: TR-01 `in_progress`, TR-02 `evidence_ready`, TR-03 `blocked`, RJ-02 `blocked`. None was changed or approved by this review.
- Only this report was written. Existing product/test files, manifests, campaign state, worklogs, dependencies, caches, builds, and parent-owned evidence were not intentionally written or altered.

Parent-supplied context, not a measurement reproduced by this judge: the prior actual first-300-second diagnostic placed the first three words at 0.82..1.78 seconds and the fourth at 31.76 seconds, with 127 chunks / 705 characters against 140 expected words. This motivated avoiding upstream cross-window lexical stitching. No real transcript content is included here.

Parent update received during this review: the actual built Chrome first-300-second run was intentionally stopped after its first checkpoint and matched 10/10 speech bursts. Its 23 cues include a conflict at 150 seconds, and export nonoverlap fails. Evidence location supplied by the parent: [first-block report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/first-block-check/2026-09-08T10-55-45-536Z-chrome-hour-mp3/report.json). This judge did not inspect or reproduce that runtime report. The known uncertain-overlap/export gate remains open and is not overridden by the helper verdict. The directory name does not imply a completed full-hour run.

The parent also reported correcting malformed synthetic PCM fixtures, forwarding progress in the native-worker test harness, and updating a static call-chain check; 117 mounted/content tests passed, with the current full check still running with FFmpeg imports. These are parent-reported results, not checks run or independently accepted by this judge. No full-check outcome or full-hour rerun is claimed.

## Exact Code Review

### Window Indexing And PCM Bounds

- [browserTranscriberWindows.ts:18](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberWindows.ts:18) rejects nonfinite, negative-start, nonpositive, empty, and sample-count-inconsistent inputs before calling recognition. The count formula agrees with the resampler's absolute output grid at [browserTranscriber.ts:172](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:172).
- [browserTranscriberWindows.ts:23](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberWindows.ts:23) uses the existing block builder with 30-second windows and 5-second overlap. Starts advance by 25 seconds, not by upstream's 20-second two-sided-stride jump. Exact 30 seconds uses one call; 30 seconds plus one sample uses a 30-second call followed by 5 seconds plus one sample. A 300-second outer block uses 12 calls: eleven 30-second windows and a final 25-second window.
- The 132 bounded indexing cases exercised one-sample edges around window/step boundaries, source starts 0/295/295.00003125/3295, and a PCM view with a nonzero backing-buffer offset. Every nonempty slice stayed within the supplied view, was at most 480,000 samples, covered the final sample, and overlapped its predecessor by exactly 80,000 samples. The upstream `prepareAudios` implementation returns a Float32Array view unchanged; it does not expand it back to the full backing buffer.
- Absolute alignment bounds are offset once at [browserTranscriberWindows.ts:32](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberWindows.ts:32), and the final bound is clamped to `block.end`. For a fractional source origin, the nominal origin can differ from the rounded resampler grid by at most half a sample. Normal application block starts are on the integer-second grid; no cumulative window-index drift was found.
- `subarray` shares the outer PCM buffer and does not itself copy the complete recording per window. Recognition is sequential. This is an allocation/control-flow observation, not a measured browser or GPU memory result.

### Installed Upstream Context

- Installed package metadata reports Transformers.js `4.2.0`; no package was imported for real inference.
- Worker [transcriber-asr.worker.ts:103](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/workers/transcriber-asr.worker.ts:103) captures the loaded recognizer, creates the existing word-timestamp options, and invokes it separately for each helper window. Unexpected batched results fail instead of being silently accepted.
- Installed `src/pipelines/automatic-speech-recognition.js:233-252` breaks its internal chunk loop when `offset + window >= aud.length`. For the configured 16 kHz, <=30-second calls, the sole chunk is both first and last and has zero left/right stride. Its tokenizer call at lines 302-306 receives one pipeline chunk.
- Installed `src/models/whisper/tokenization_whisper.js:74-75` initializes accumulated tokens per `_decode_asr` invocation; its `findLongestCommonSequence` at lines 346-430 can compare lexical subsequences across accumulated sequences without requiring identical source intervals. Independent calls remove the specific opportunity to merge separate helper windows there. This does not establish correctness of within-window tokenization, alignment, or model generation.

### Progress, Identity, Failure, And Cancellation

- [browserTranscriberWindows.ts:30](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberWindows.ts:30) awaits each recognition call. Progress is emitted only after alignment and merge succeed, and advances as completed windows / total windows. It is work-unit progress, not exact recognized source duration or durable checkpoint progress.
- [transcriber-asr.worker.ts:117](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/workers/transcriber-asr.worker.ts:117) closes over each request's identity. All multiwindow progress, success, and errors retained that identity, including request ID zero; late load callbacks retained their original load ID. Progress need not include a block index because the waiter's unique request ID associates it with the pending block.
- First, second, third, and twelfth recognition failures stop the helper. There is no success return or later call after rejection. The actual worker, with a fake recognizer, also emits no `transcribed` event after a later-window error. [transcriber-asr.worker.ts:131](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/workers/transcriber-asr.worker.ts:131) preserves recognized control-error names while sanitizing the message.
- The helper does not accept an AbortSignal and must not be treated as independently cancellable. In the existing application, Stop/Reset/replacement/unmount abort the waiter and terminate the ASR worker, via [AudioVideoTranscriber.tsx:189](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:189). The caller does not use concurrent worker `dispose` messages as cancellation. This integration makes an extra helper cancellation parameter unnecessary for the current call path. Actual browser worker termination was not exercised.
- [browserTranscriberLifecycle.ts:86](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberLifecycle.ts:86) rejects stale operations and filters request/stage/block identity. Synthetic abort and replacement settled once and ignored late progress/results. Advancing progress refreshed the idle limit; stale or repeated progress could not keep a job alive indefinitely. The 300-second idle limit and 1,200-second absolute outer-block deadline remained effective under a fake clock.
- At [AudioVideoTranscriber.tsx:345](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:345), stale/aborted operations and `AbortError`/`TimeoutError` cannot trigger WASM fallback. An ordinary WebGPU error retries the outer block through the existing one-retry path, with freshly decoded PCM. This was statically traced, not rerun as a React/browser test.
- Partial inner-window results remain private to the helper until the outer block succeeds. The checkpoint advances only at [AudioVideoTranscriber.tsx:410](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:410). A failure after, for example, 11/12 progress loses that incomplete outer block's work and leaves earlier completed outer blocks intact. Retry starts the failed outer block again. This is the existing outer-block checkpoint contract, not 30-second resumability.

### Alignment Handoff Only

The helper passes each window's absolute interval and original text/chunks into the existing alignment/merge functions. Synthetic checks retained three identical utterances at three separate source times while removing the one genuinely shared positive-duration utterance, offset point timestamps once without expanding them, and bounded uncertain text to its own window (including a fractional final tail). These are integration probes only. The point-alignment merge algorithm, ambiguity rules, sentence splitting, and its separate judge's verdict were not independently re-adjudicated here.

## Executed Verification

Node: `v24.20.0`. No Vitest run, browser, model, worker thread, build, full check, installation, or network request was needed. Existing pure window/protocol/lifecycle tests were read as context; alignment tests were read only for the handoff contract. Component test names were inspected, but the component suite was not run.

Two PowerShell here-strings were piped to `node --input-type=module` in T. They used `node:module` synchronous hooks and `stripTypeScriptTypes` to load the actual TypeScript sources in memory. No harness file or compiled module was written. The worker probe intercepted `@huggingface/transformers` with an in-memory fake pipeline; its fake model method throws if real generation is attempted. Timer changes in the lifecycle probe were confined to that disposable Node process and restored in `finally`.

| Probe | Result |
| --- | --- |
| PCM edges and view offsets | PASS: 132 cases, 784 fake recognizer calls, 1..4,880,000 input samples, backing-view offset 19 samples |
| Invalid source bounds | PASS: 10 cases rejected before recognition |
| Alignment handoff | PASS: 4 synthetic cases; limited to offsets, source overlap, and bounded fallback |
| Recognizer rejection | PASS: 12 cases (4 failure positions x Error/AbortError/TimeoutError) |
| Callback rejection / serial await | PASS: 1 callback failure stops iteration; 1 deferred first call prevents concurrent next calls/progress |
| Actual worker, fake recognizer | PASS: multiwindow offsets/options/progress/result identity, late load ID, ID zero |
| Worker errors | PASS: 3 second-window error kinds, batched result rejection, inconsistent PCM rejection; no partial success |
| Actual waiter, fake worker/clock | PASS: abort, replacement, stale-ID timeout, duplicate-progress timeout, absolute deadline, wrong-block result filtering |

Both probe processes exited 0. Only warning: Node reports `stripTypeScriptTypes` as experimental. Probe A command output ID: `94bbfe`; Probe B: `071f0b`. These are execution-record identifiers, not separate disk artifacts.

Read-only command families executed: `Get-Content` with bounded line selection; `rg`/`rg --files`; `Get-Item`; `Get-FileHash ... -Algorithm SHA256`; `git status --short --branch --untracked-files=normal`; `git rev-parse HEAD`; `git branch --show-current`; `git diff --no-index -- <T/AGENTS.md> <review-repo/AGENTS.md>`; `node --version`; `Test-Path`; `Get-Date -Format o`. The AGENTS comparison exited 1 because the files differ. Initial literal Windows wildcard and obsolete upstream tokenizer-path lookups were corrected to explicit observed paths; these were lookup errors, not failing product tests.

### Probe A Reproduction

Run this JavaScript through `node --input-type=module` from T. It is the in-memory helper probe executed for this review.

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { createHash } from 'node:crypto';
registerHooks({
  resolve(s,c,n) { return n(s.startsWith('.') && !/\.[a-z]+$/i.test(s) ? s + '.ts' : s,c); },
  load(u,c,n) { return u.endsWith('.ts') ? { format:'module', source:stripTypeScriptTypes(readFileSync(new URL(u),'utf8')), shortCircuit:true } : n(u,c); }
});
const { transcribeWhisperWindows: run } = await import('./src/lib/browserTranscriberWindows.ts');
const rate=16000, max=305*rate, pcm=Float32Array.from({length:max+38},(_,i)=>i);
const empty=()=>({text:'',chunks:[]});
const counts=new Set([1,159,160,161,25*rate,30*rate,55*rate,60*rate,300*rate,305*rate]);
for (const seconds of [25,30,50,55,60,275,280,295,300,305]) for(const d of [-1,0,1]) if(seconds*rate+d<=max) counts.add(seconds*rate+d);
let coverage=0, calls=0;
for (const length of counts) for(const base of [0,295,295.00003125,3295]) {
  const first=Math.round(base*rate), end=(first+length)/rate;
  const audio=pcm.subarray(19,19+length), seen=[], progress=[];
  assert.deepEqual(await run(audio,{start:base,end},async chunk=>{
    const offset=(chunk.byteOffset-audio.byteOffset)/4;
    assert.equal(offset,seen.length*25*rate);
    assert.ok(chunk.length>0 && chunk.length<=30*rate);
    assert.ok(offset+chunk.length<=audio.length);
    assert.equal(chunk.buffer,audio.buffer);
    assert.equal(chunk[0],19+offset); assert.equal(chunk.at(-1),18+offset+chunk.length);
    if(seen.length) assert.equal(seen.at(-1)[0]+seen.at(-1)[1]-offset,5*rate);
    seen.push([offset,chunk.length]); calls++; await Promise.resolve(); return empty();
  },p=>progress.push(p)),[]);
  assert.equal(seen.at(-1)[0]+seen.at(-1)[1],length);
  assert.deepEqual(progress,seen.map((_,i)=>(i+1)/seen.length));
  coverage++;
}
console.log(JSON.stringify({group:'PCM-boundaries',cases:coverage,recognizerCalls:calls,minSamples:1,maxSamples:max,nonzeroBackingOffset:19,result:'PASS'}));
let invalid=0;
for(const block of [{start:NaN,end:1},{start:0,end:NaN},{start:Infinity,end:1},{start:0,end:Infinity},{start:-1,end:1},{start:1,end:0},{start:0,end:0},{start:0,end:1-1/rate},{start:0,end:1+1/rate}]) {
  let called=0; await assert.rejects(run(pcm.subarray(0,rate),block,async()=>{called++;return empty()}),RangeError);assert.equal(called,0);invalid++;
}
await assert.rejects(run(new Float32Array(0),{start:0,end:1},async()=>{throw Error('must not call')}),RangeError); invalid++;
console.log(JSON.stringify({group:'invalid-bounds',cases:invalid,result:'PASS'}));
const words=(chunks)=>({text:chunks.map(c=>c.text).join(''),chunks});
const replies=[words([{text:'Again.',timestamp:[1,2]},{text:' Again.',timestamp:[26,27]}]),words([{text:'Again.',timestamp:[1,2]},{text:' Again.',timestamp:[6,7]}])];
const repeated=await run(pcm.subarray(0,40*rate),{start:295,end:335},async()=>replies.shift());
assert.deepEqual(repeated.map(s=>[s.start,s.end]),[[296,297],[321,322],[326,327]]);
assert.deepEqual(repeated.map(s=>s.text),Array(3).fill('Again.'));
assert.deepEqual(repeated.flatMap(s=>s.words).map(w=>[w.start,w.end]),[[296,297],[321,322],[326,327]]);
const points=await run(pcm.subarray(0,31*rate),{start:295,end:326},async()=>words([{text:'A',timestamp:[1,1]},{text:' check.',timestamp:[1,2]}]));
assert.deepEqual(points.flatMap(s=>s.words).map(w=>[w.start,w.end]),[[296,296],[296,297],[321,321],[321,322]]);
const uncertain=await run(pcm.subarray(0,31*rate),{start:295,end:326},async()=>({text:'Synthetic.',chunks:[]}));
assert.deepEqual(uncertain.map(s=>[s.start,s.end,s.overlapNeedsReview]),[[295,325,true],[320,326,true]]);
const uncertainTail=await run(pcm.subarray(0,30*rate+1),{start:295,end:325+1/rate},async()=>words([{text:'Synthetic.',timestamp:[29,31]}]));
assert.deepEqual(uncertainTail.map(s=>[s.start,s.end]),[[295,325],[320,325+1/rate]]);
console.log(JSON.stringify({group:'alignment-handoff',cases:4,result:'PASS',scope:'offsets and window-bound fallback only; no point-merge adjudication'}));
let failedCases=0;
for(const failureAt of [0,1,2,11]) for(const name of ['Error','AbortError','TimeoutError']) {
  let invoked=0;const progress=[];const expected=Object.assign(new Error('synthetic'),{name});
  await assert.rejects(run(pcm.subarray(0,300*rate),{start:0,end:300},async()=>{if(invoked++===failureAt)throw expected;return empty()},p=>progress.push(p)),err=>err===expected);
  assert.equal(invoked,failureAt+1);assert.deepEqual(progress,Array.from({length:failureAt},(_,i)=>(i+1)/12));failedCases++;
}
let invoked=0;await assert.rejects(run(pcm.subarray(0,60*rate),{start:0,end:60},async()=>{invoked++;return empty()},()=>{throw Error('callback')}),/callback/);assert.equal(invoked,1);
let release;let inflight=0,peak=0;let invokedSerial=0;
const first=new Promise(resolve=>{release=resolve});const p=[];
const pending=run(pcm.subarray(0,60*rate),{start:0,end:60},async()=>{inflight++;peak=Math.max(peak,inflight);if(++invokedSerial===1)await first;inflight--;return empty()},v=>p.push(v));
await Promise.resolve();assert.equal(invokedSerial,1);assert.deepEqual(p,[]);release();await pending;assert.equal(peak,1);assert.equal(invokedSerial,3);
assert.equal(pcm[0],0);assert.equal(pcm.at(-1),max+37);
console.log(JSON.stringify({group:'failure-and-serial-progress',recognizerFailureCases:failedCases,callbackFailureCases:1,deferredCases:1,result:'PASS'}));
for(const file of ['src/lib/browserTranscriberWindows.ts','src/workers/transcriber-asr.worker.ts']) console.log(file,createHash('sha256').update(readFileSync(file)).digest('hex'));
```

### Probe B Reproduction

Run this JavaScript through `node --input-type=module` from T. The fake pipeline replaces the package import; it does not load a model.

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks, stripTypeScriptTypes } from 'node:module';
registerHooks({
 resolve(s,c,n){if(s==='@huggingface/transformers')return {url:'data:text/javascript,export const env={version:"4.2.0"};export const pipeline=(...a)=>globalThis.__pipeline(...a)',shortCircuit:true};return n(s.startsWith('.')&&!/\.[a-z]+$/i.test(s)?s+'.ts':s,c)},
 load(u,c,n){return u.endsWith('.ts')?{format:'module',source:stripTypeScriptTypes(readFileSync(new URL(u),'utf8')),shortCircuit:true}:n(u,c)}
});
let listener,loadProgress,reply,call=0,events=[],calls=[];
const empty=()=>({text:'',chunks:[]});
const fake=Object.assign(async(audio,options)=>{const index=call++;calls.push({length:audio.length,offset:audio.byteOffset,options:{...options}});return await reply(index)}, {dispose:async()=>{},model:{_generate_with_seek(){throw Error('INFERENCE FORBIDDEN')}}});
globalThis.__pipeline=async(_task,_model,options)=>{loadProgress=options.progress_callback;loadProgress({file:'synthetic',loaded:1,total:10});return fake};
globalThis.self={postMessage:event=>events.push(event),addEventListener:(_type,fn)=>{listener=fn}};
await import('./src/workers/transcriber-asr.worker.ts');
const dispatch=data=>listener({data});
await dispatch({type:'load',requestId:0,model:'english',backend:'wasm'});
assert.deepEqual(events.map(e=>[e.type,e.requestId]),[['load-progress',0],['ready',0]]);
const request=(requestId,samples=60*16000)=>({type:'transcribe',requestId,model:'english',language:'en',audio:new ArrayBuffer(samples*4),block:{index:7,start:295,end:295+samples/16000}});
reply=async()=>empty();events=[];calls=[];call=0;
await dispatch(request(42));
assert.deepEqual(calls.map(c=>[c.offset/4,c.length]),[[0,480000],[400000,480000],[800000,160000]]);
assert.ok(calls.every(c=>JSON.stringify(c.options)===JSON.stringify({chunk_length_s:30,force_full_sequences:false,return_timestamps:'word',stride_length_s:5})));
assert.deepEqual(events.map(e=>[e.type,e.requestId]),[['transcription-progress',42],['transcription-progress',42],['transcription-progress',42],['transcribed',42]]);
assert.deepEqual(events.slice(0,3).map(e=>e.progress),[1/3,2/3,1]);assert.equal(events.at(-1).blockIndex,7);
loadProgress({file:'synthetic',loaded:9,total:10});assert.equal(events.at(-1).requestId,0);
console.log(JSON.stringify({group:'actual-worker-stubbed-recognizer',success:1,lateLoadIdentity:1,zeroRequestId:1,result:'PASS'}));
for(const name of ['Error','AbortError','TimeoutError']){
 events=[];call=0;calls=[];reply=async index=>{if(index===1)throw Object.assign(new Error('private synthetic detail'),{name});return empty()};
 await dispatch(request(43));assert.equal(call,2);
 assert.deepEqual(events.map(e=>[e.type,e.requestId]),[['transcription-progress',43],['error',43]]);
 assert.equal(events[0].progress,1/3);assert.equal(events[1].stage,'transcribe');
 assert.equal(events[1].name,name==='Error'?undefined:name);assert.ok(!events[1].message.includes('private synthetic detail'));
}
events=[];call=0;reply=async()=>[];await dispatch(request(44));assert.equal(call,1);assert.deepEqual(events.map(e=>[e.type,e.stage,e.requestId]),[['error','transcribe',44]]);
events=[];call=0;reply=async()=>empty();const invalid=request(45);invalid.block.end++;await dispatch(invalid);assert.equal(call,0);assert.equal(events[0].requestId,45);assert.equal(events[0].type,'error');
console.log(JSON.stringify({group:'worker-midwindow-failure',errorKinds:3,batchedResult:1,invalidPcm:1,noPartialSuccess:true,result:'PASS'}));
const {waitForTranscriberReply,TRANSCRIBER_WAIT_LIMITS:limits}=await import('./src/lib/browserTranscriberLifecycle.ts');
class FakeWorker extends EventTarget {request;postMessage(data){this.request=data}send(data){this.dispatchEvent(new MessageEvent('message',{data:{requestId:this.request.requestId,...data}}))}}
const native={performance:globalThis.performance,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
let now=0,next=0;const timers=new Map();
globalThis.performance={now:()=>now};globalThis.setTimeout=(cb,ms)=>{const id=++next;timers.set(id,{cb,at:now+ms});return id};globalThis.clearTimeout=id=>timers.delete(id);
const advance=ms=>{const target=now+ms;for(;;){const entries=[...timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at);if(!entries.length)break;const [id,t]=entries[0];now=t.at;timers.delete(id);t.cb()}now=target};
const setup=()=>{const worker=new FakeWorker(),controller=new AbortController(),progress=[];const operation={signal:controller.signal,isCurrent:()=>true};const pending=waitForTranscriberReply(worker,request(999),'transcribed',operation,e=>progress.push(e));return {worker,controller,progress,operation,pending}};
try {
 let r=setup();let checked=assert.rejects(r.pending,{name:'AbortError'});r.worker.send({type:'transcription-progress',progress:1/3});r.controller.abort();r.worker.send({type:'transcribed',blockIndex:7,segments:[],text:''});r.worker.send({type:'transcription-progress',progress:1});await checked;assert.equal(r.progress.length,1);assert.equal(timers.size,0);
 r=setup();checked=assert.rejects(r.pending,{name:'AbortError'});r.operation.isCurrent=()=>false;r.worker.send({type:'transcription-progress',progress:2/3});await checked;assert.equal(r.progress.length,0);assert.equal(timers.size,0);
 r=setup();checked=assert.rejects(r.pending,{name:'TimeoutError'});advance(limits.transcribe.idleMs-1);r.worker.send({requestId:-1,type:'transcription-progress',progress:1});advance(1);await checked;assert.equal(r.progress.length,0);assert.equal(timers.size,0);
 r=setup();checked=assert.rejects(r.pending,{name:'TimeoutError'});advance(limits.transcribe.idleMs-1);r.worker.send({type:'transcription-progress',progress:1/12});advance(limits.transcribe.idleMs-1);r.worker.send({type:'transcription-progress',progress:1/12});advance(1);await checked;assert.equal(timers.size,0);
 r=setup();const start=now;checked=assert.rejects(r.pending,{name:'TimeoutError'});for(let i=1;i<=12;i++){advance(limits.transcribe.deadlineMs/12);r.worker.send({type:'transcription-progress',progress:i/12})}await checked;assert.equal(now-start,limits.transcribe.deadlineMs);assert.equal(r.progress.length,11);assert.equal(timers.size,0);
 r=setup();r.worker.send({type:'transcribed',blockIndex:8,segments:[]});r.worker.send({type:'transcribed',blockIndex:7,segments:[],text:''});await r.pending;assert.equal(timers.size,0);
 console.log(JSON.stringify({group:'pure-lifecycle-interaction',abort:1,replacement:1,staleIdentityTimeout:1,duplicateProgressTimeout:1,absoluteDeadline:1,blockIdentity:1,result:'PASS'}));
} finally {Object.assign(globalThis,native)}
```

## SHA-256 Evidence

Paths below are relative to T. Primary files were hashed before probing and checked again after report preparation. All 15 table entries matched their recorded hashes on the final comparison (execution output `4ef468`). Supporting hashes identify the inspected local context, not an upstream release attestation.

| File | SHA-256 |
| --- | --- |
| `src/lib/browserTranscriberWindows.ts` | `F9FA1A29B57A2F8C7D994A54FD82C51E275E6913B26A544AF256C99E32D01E00` |
| `src/workers/transcriber-asr.worker.ts` | `9A3C2BAC8E5665091ACCB0875ECFE3742020C7CE399922B95A63636F92E76F1E` |
| `src/lib/browserTranscriberWindows.test.ts` | `065CAB3DEC9B906C3D2274F5B968895A6C0BF876DA54A4DABB95D4441CCC04EA` |
| `src/lib/browserTranscriber.ts` | `C0FB96417E6A4AD6E7719ED998FE162AE2F04FCB8465333644ED7AC5B9443F84` |
| `src/lib/browserTranscriberAlignment.ts` | `6B8B598E12F1BBB2CF253BC69AF72EFD4B3443B6B49C1A17448B99022868AE2B` |
| `src/lib/browserTranscriberAlignment.test.ts` | `CE67A9CA5A3870B96494812148CF48504E327237E55183FB87DC545C49C03E57` |
| `src/lib/browserTranscriberLifecycle.ts` | `462369FBE194164E92483F3FED568C9FF8883125557DB3AB10A401511B89E179` |
| `src/lib/browserTranscriberWorkerTypes.ts` | `217719BDC453C039B901652B74108A20131B801E70D1415D9B20C588FCD521FB` |
| `src/lib/browserTranscriberProtocol.tr02.test.ts` | `3ABB86EEB96D1F25EC9AAB8A354FE34315647778E076F34B356608FA98FF8DE8` |
| `src/lib/browserTranscriberLifecycle.tr02.test.ts` | `B5F1CFD38FA57E393CC794077D2C68651A76CE4849EA5928273C464C0D4C2843` |
| `src/lib/whisperFrameBounds.ts` | `BD3338911FA2D21746E49A091B46D34EFF729D2FCE5E74CEAB9622A239633F5A` |
| `src/components/AudioVideoTranscriber.tsx` | `B17278F3F5E6E3EE0B784E80364C682C40F5942177D778B8675D870C6493876B` |
| `package-lock.json` | `300D08394C840F51BBF04DFC34CE61578F40064AF24158590C9CF3D02AC7CBBA` |
| `node_modules/@huggingface/transformers/src/pipelines/automatic-speech-recognition.js` | `1310BE8622712638B20921C822D107BC2016BE3D92557E171516EF1617053CC5` |
| `node_modules/@huggingface/transformers/src/models/whisper/tokenization_whisper.js` | `355420B3120D0442A38D7C6E7F2A6CB70309D83E7FCC84136CD55924D7E44B45` |

## Exact Exclusions And Remaining Gates

- No browser launched, attached, navigated, or controlled; no interference with the parent's frozen built-app first-block run.
- No model loading, download, inference, audio decoding, actual waveform/transcript fixture, or numerical reproduction of the reported first-300-second failure.
- No full check, build, full test suite, dependency install, package audit, generated test cache, source/test edit, commit, push, deployment, indexability change, or public action.
- No full-hour run or claim. A synthetic source offset of 3295 seconds tests arithmetic only; it is not evidence of a long recording completing.
- No new language/codec/device/browser compatibility, memory/GPU-throughput measurement, actual worker-termination timing, privacy-network, export, beta-stability, or deployed-build/source-identity proof.
- No independent point-alignment merge review beyond the helper handoff probes above; that remains with the separate judge.
- The frame-bound adapter was read to understand the worker load path, not re-approved. Passing a 1-sample fake-recognizer case proves helper slicing only, not that Whisper can recognize sub-frame audio.
- No standalone cancellation guarantee for this helper and no concurrent `load`/`dispose`/`transcribe` worker protocol guarantee. The traced application serializes work and cancels through worker termination.
- No TR-01, TR-02, TR-03, G4, or release approval. Parent runtime evidence and the remaining campaign acceptance gates remain required.
