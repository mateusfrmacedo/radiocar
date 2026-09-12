const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
// Compile the real functions from the inline script without running page startup.
function source(name){
  const match=new RegExp(`^(?:async )?function ${name}\\(`,'m').exec(html);
  assert.ok(match,`Missing function ${name}`);
  let end=html.indexOf('\n',match.index);
  while(end!==-1){
    const candidate=html.slice(match.index,end);
    try{new vm.Script(candidate);return candidate;}catch{}
    end=html.indexOf('\n',end+1);
  }
  throw new Error(`Incomplete function ${name}`);
}
class Element{
  constructor(){this.children=[];this.dataset={};this.style={};this.className='';this.writes=0;this.classList={add:(c)=>this.className+=' '+c,remove:()=>{},toggle:()=>{},contains:c=>this.className.split(' ').includes(c)};}
  set textContent(v){this.text=v;this.writes++;} get textContent(){return this.text||'';}
  set innerHTML(v){this.children=[];this.html=v;} get innerHTML(){return this.html||'';}
  appendChild(c){this.children.push(c);} append(c){this.children.push(c);}
  insertBefore(c,b){this.children.splice(this.children.indexOf(b),0,c);}
  replaceChildren(){this.children=[];} setAttribute(){}
}
const names=['loadPlaylists','playableTracks','loadSavedTracks','loadTracks','activateRadioCar','startSpotifyPlayback','assertPlayback','runPlayback','playTrack','togglePlay','getState','applyPlaybackState','applySDKState','pollPlayback','setLcdMarquee','lcdText'];
function harness(){
  const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
  const ctx=vm.createContext({console,Date,Set,JSON,encodeURIComponent,token:'test',player:null,deviceId:'radio',poweredOff:false,playbackBusy:false,playbackRevision:0,stateRevision:0,pendingPlayback:null,currentTrackUri:null,playlistsLoadId:0,libraryLoadId:0,lastRemotePoll:0,pollBusy:false,tracks:[],plId:null,playbackContext:'none',screenMode:'track',localStorage:{getItem:()=> 'playlist-read-collaborative user-read-recently-played'},document:{getElementById:get,createElement:()=>new Element(),querySelectorAll:()=>[],createTextNode:t=>({text:t})},delay:async()=>{},bootSDK:()=>{},connectSpotify:()=>{},showTrackScreen:()=>{},requireConnection:()=>true,togglePower:async()=>{ctx.poweredOff=false;},renderTracks:()=>{},setDisp:(...a)=>{ctx.display=a;},setStatus:(...a)=>{ctx.status=a;},hiTrack:()=>{},updIco:()=>{},checkTrackCompletion:()=>{},showAuthError:e=>{ctx.error=e;}});
  vm.runInContext(names.map(source).join('\n'),ctx);
  return {ctx,get};
}
const ok=(data={},status=200)=>({ok:status<300,status,json:async()=>data});
const track=(id='song')=>({uri:`spotify:track:${id}`,type:'track',name:id,artists:[{name:'Artist'}],duration_ms:200000});
const sdk=(id='song',paused=false)=>({track_window:{current_track:track(id)},position:12345,duration:200000,paused,shuffle:false,repeat_mode:0});
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('all inline scripts parse',()=>{for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);});
test('loads more than 50 playlists, skips nulls and duplicates',async()=>{
  const {ctx,get}=harness(),urls=[];
  ctx.api=async url=>{urls.push(url);return ok(url.endsWith('offset=0')?{items:Array.from({length:50},(_,i)=>({id:String(i),name:`P${i}`})),next:'next'}:{items:[null,{id:'49',name:'Duplicate'},{id:'50',name:'P50'}],next:null});};
  await ctx.loadPlaylists();assert.equal(urls.length,2);assert.match(urls[1],/offset=50/);assert.equal(get('chips').children.filter(c=>/^P\d+$/.test(c.textContent)).length,51);
});
test('partial playlist failures remain visible with a retry',async()=>{
  const {ctx,get}=harness();let count=0;ctx.api=async()=>++count===1?ok({items:[{id:'1',name:'First'}],next:'next'}):ok({},429);
  await ctx.loadPlaylists();assert.ok(get('chips').children.some(c=>c.textContent==='First'));const status=get('chips').children.at(-1);assert.match(status.textContent,/ALGUMAS/);assert.equal(status.children[0].onclick,ctx.loadPlaylists);
});
test('older authorization offers reconnect',async()=>{
  const {ctx,get}=harness();ctx.localStorage.getItem=()=>null;ctx.api=async()=>ok({items:[]});await ctx.loadPlaylists();assert.ok(get('chips').children.some(c=>/Reconectar/.test(c.textContent)));
});
test('unavailable items keep original playlist offsets; accepts old and new payloads',()=>{
  const {ctx}=harness();const result=ctx.playableTracks([{item:track('a')},null,{item:{...track('local'),is_local:true}},{track:track('b')},{item:{...track('bad'),is_playable:false}}]);
  assert.deepEqual(Array.from(result,t=>[t.name,t.playlistPosition]),[['a',0],['b',3]]);
});
test('slow playlist response cannot replace a newer selection',async()=>{
  const {ctx}=harness();let release;ctx.api=url=>url.includes('/old/')?new Promise(r=>release=r):Promise.resolve(ok({items:[{item:track('new')}]}));
  const old=ctx.loadTracks('old','Old',new Element());await ctx.loadTracks('new','New',new Element());release(ok({items:[{item:track('old')}]}));await old;assert.equal(ctx.tracks[0].name,'new');
});
test('slow liked page cannot append tracks into another playlist',async()=>{
  const {ctx}=harness();let release;ctx.api=async url=>url.includes('/playlists/')?ok({items:[{item:track('new')}]}):url.endsWith('offset=0')?ok({items:[{track:track('liked')}],next:'next'}):new Promise(r=>release=r);
  const saved=ctx.loadSavedTracks(new Element());await flush();await ctx.loadTracks('new','New',new Element());release(ok({items:[{track:track('late')}]}));await saved;assert.equal(ctx.tracks.length,1);assert.equal(ctx.tracks[0].name,'new');
});
test('song selection targets device directly with the original offset, without transfer',async()=>{
  const {ctx}=harness(),calls=[];ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{}};ctx.tracks=[{...track(),playlistPosition:7}];ctx.plId='list';ctx.api=async(url,opts)=>{calls.push([url,JSON.parse(opts.body)]);return ok();};
  await ctx.playTrack('spotify:track:song',0);assert.equal(calls.length,1);assert.equal(calls[0][0],'/me/player/play?device_id=radio');assert.equal(calls[0][1].offset.position,7);
});
test('404 device recovery transfers once and retries the same selection',async()=>{
  const {ctx}=harness(),calls=[];ctx.api=async(url,opts)=>{calls.push([url,opts.body]);return ok({},calls.length===1?404:204);};await ctx.startSpotifyPlayback({uris:['spotify:track:song']});assert.equal(calls.length,3);assert.equal(calls[1][0],'/me/player');assert.equal(calls[0][1],calls[2][1]);
});
test('rate limits do not trigger transfer or repeated play',async()=>{
  const {ctx}=harness();let calls=0;ctx.api=async()=>{calls++;return ok({},429);};const r=await ctx.startSpotifyPlayback({uris:['spotify:track:song']});assert.equal(calls,1);assert.equal(r.status,429);
});
test('play transfers existing Spotify session with play true, preserving its queue and position',async()=>{
  const {ctx}=harness(),calls=[];ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{},getCurrentState:async()=>null};ctx.api=async(url,opts)=>{calls.push([url,opts]);return ok(opts?{}:{item:track(),progress_ms:65432,is_playing:false});};
  await ctx.togglePlay();assert.equal(calls.length,2);assert.equal(calls[1][0],'/me/player');assert.equal(JSON.parse(calls[1][1].body).play,true);assert.equal(ctx.error,'');
});
test('expired session falls back to the last history track',async()=>{
  const {ctx}=harness(),calls=[];ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{},getCurrentState:async()=>null};ctx.api=async(url,opts)=>{calls.push([url,opts]);if(url==='/me/player')return ok({},204);if(url.includes('recently-played'))return ok({items:[{track:track('recent')} ]});return ok();};
  await ctx.togglePlay();assert.deepEqual(JSON.parse(calls.at(-1)[1].body),{uris:['spotify:track:recent'],position_ms:0});
});
test('failed state lookup does not replace the current session with history',async()=>{
  const {ctx}=harness(),urls=[];ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{},getCurrentState:async()=>null};ctx.api=async url=>{urls.push(url);return ok({},503);};await ctx.togglePlay();assert.deepEqual(urls,['/me/player']);assert.match(ctx.error,/consultar/);assert.equal(ctx.playbackBusy,false);
});
test('local pause/resume uses SDK and explicit media play never toggles to pause',async()=>{
  const {ctx}=harness();let resumed=0,paused=0;ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{},getCurrentState:async()=>sdk(),resume:async()=>resumed++,pause:async()=>paused++};ctx.api=async()=>{throw new Error('Unexpected API');};
  await ctx.togglePlay(true);assert.equal(resumed,1);assert.equal(paused,0);ctx.pendingPlayback=null;await ctx.togglePlay();assert.equal(paused,1);
});
test('pending selection ignores stale track and transient pause events',()=>{
  const {ctx}=harness();ctx.pendingPlayback={uri:'spotify:track:new',playing:true,until:Date.now()+8000};ctx.applySDKState(sdk('old'));assert.equal(ctx.display,undefined);ctx.applySDKState(sdk('new',true));assert.equal(ctx.display,undefined);ctx.applySDKState(sdk('new'));assert.equal(ctx.display[0],'new');assert.equal(ctx.pendingPlayback,null);
});
test('poll results started before a command are discarded',async()=>{
  const {ctx}=harness();let release;ctx.player={getCurrentState:()=>new Promise(r=>release=r)};const polling=ctx.pollPlayback();ctx.playbackRevision++;release(sdk('old'));await polling;assert.equal(ctx.display,undefined);
});
test('idle local SDK still reads Spotify remote playback',async()=>{
  const {ctx}=harness();ctx.player={getCurrentState:async()=>null};ctx.api=async()=>ok({item:track('phone'),progress_ms:75000,is_playing:true});await ctx.pollPlayback();assert.equal(ctx.display[0],'phone');assert.equal(ctx.display[2],75000);
});
test('unchanged title leaves marquee DOM intact between progress updates',()=>{
  const {ctx,get}=harness();ctx.setLcdMarquee('Music — Artist');const writes=get('lcdTitle').writes;ctx.setLcdMarquee('Music — Artist');assert.equal(get('lcdTitle').writes,writes);ctx.setLcdMarquee('Other');assert.equal(get('lcdTitle').writes,writes+1);
});
test('repeated song clicks cannot send overlapping playback requests',async()=>{
  const {ctx}=harness();let release,calls=0;ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{}};ctx.tracks=[track()];ctx.plId='list';ctx.api=()=>{calls++;return new Promise(r=>release=r);};
  const first=ctx.playTrack('spotify:track:song',0);await flush();await ctx.playTrack('spotify:track:song',0);assert.equal(calls,1);release(ok());await first;assert.equal(ctx.playbackBusy,false);
});
test('missing history permission gives reconnect guidance without starting music',async()=>{
  const {ctx}=harness(),urls=[];ctx.pollPlayback=async()=>{};ctx.player={activateElement:async()=>{},getCurrentState:async()=>null};ctx.api=async url=>{urls.push(url);return ok({},url==='/me/player'?204:403);};await ctx.togglePlay();assert.equal(urls.length,2);assert.match(ctx.error,/Reconecte/);assert.equal(ctx.pendingPlayback,null);
});
test('unconfirmed playback times out visibly even when Spotify returns no state',async()=>{
  const {ctx}=harness();ctx.player={getCurrentState:async()=>null};ctx.api=async()=>ok({},204);ctx.pendingPlayback={uri:'spotify:track:song',playing:true,until:Date.now()-1};await ctx.pollPlayback();assert.equal(ctx.pendingPlayback,null);assert.match(ctx.error,/não confirmou/);
});
