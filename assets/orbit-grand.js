/* Orbit Grand — 112-square two-front spherical chess. An original experimental variant.
   Eight latitudinal ranks × fourteen longitudinal files. Files wrap at a/n; polar ranks end.
   Each side starts with eight majors on an opposite meridian and sixteen pawns advancing
   on two different longitude fronts. No castling; king safety, EP, promotion and draws apply. */
(()=>{'use strict';
const TAU=Math.PI*2, COLS=14, ROWS=8, STEP=TAU/COLS, LATMAX=1.10;
const alphabet='abcdefghijklmn', MOD=(n,m=COLS)=>(n%m+m)%m;
const ir=i=>Math.floor(i/COLS), ic=i=>i%COLS, at=(r,c)=>r*COLS+MOD(c), sqName=i=>alphabet[ic(i)]+(8-ir(i));
const E=id=>document.getElementById(id),root=E('grandChess'),canvas=E('grandCanvas'); if(!root||!canvas)return;
const ctx=canvas.getContext('2d',{alpha:false});
const color=p=>p==='.'?0:p===p.toUpperCase()?1:-1;
const PIECES={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'\u265F\uFE0E'};
const SCORE={p:100,n:325,b:355,r:510,q:990,k:25000};
function initial(){
 const b=Array(ROWS*COLS).fill('.'), pd=Array(ROWS*COLS).fill(0), back='rnbqkbnr';
 for(let r=0;r<ROWS;r++){
  b[at(r,0)]=back[r]; b[at(r,7)]=back[r].toUpperCase();
  for(const [c,p,d] of [[1,'p',1],[13,'p',-1],[6,'P',-1],[8,'P',1]]){const i=at(r,c);b[i]=p;pd[i]=d;}
 }
 return {b,pd,t:1,ep:-1,epVictim:-1,half:0,full:1};
}
const mk=(f,t,p='',flag='')=>({f,t,p,flag});
function pseudo(s,attacks=false){
 const out=[],seen=new Set();
 const add=(f,t,p='',flag='')=>{const key=f+'_'+t+'_'+p+'_'+flag;if(!seen.has(key)){seen.add(key);out.push(mk(f,t,p,flag));}};
 for(let f=0;f<s.b.length;f++){
  const pc=s.b[f];if(color(pc)!==s.t)continue;
  const r=ir(f),c=ic(f),p=pc.toLowerCase();
  if(p==='p'){
   const step=s.pd[f];if(step!==1&&step!==-1)continue;
   const nc=MOD(c+step),destFile=s.t===1?0:7,promote=nc===destFile;
   for(const dr of [-1,1]){
    const nr=r+dr;if(nr<0||nr>=ROWS)continue;
    const to=at(nr,nc),enemy=color(s.b[to])===-s.t;
    const ep=(to===s.ep&&s.b[to]==='.'&&s.epVictim>=0&&s.b[s.epVictim].toLowerCase()==='p'&&color(s.b[s.epVictim])===-s.t);
    if(attacks||enemy||ep){if(promote&&!attacks){for(const q of ['q','r','b','n'])add(f,to,q,ep?'ep':'');}else add(f,to,'',ep&&!attacks?'ep':'');}
   }
   if(attacks)continue;
   const to=at(r,nc);if(s.b[to]==='.'){
    if(promote){for(const q of ['q','r','b','n'])add(f,to,q);}
    else add(f,to);
    const origin=s.t===1?(step===-1?6:8):(step===1?1:13);
    if(c===origin&&!promote&&s.b[at(r,c+2*step)]==='.')add(f,at(r,c+2*step));
   }
  }else if(p==='n'){
   for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
    let nr=r+dr;if(nr<0||nr>=ROWS)continue;const to=at(nr,c+dc);
    if(attacks||color(s.b[to])!==s.t)add(f,to);
   }
  }else{
   let dirs=[];
   if(['b','q','k'].includes(p))dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
   if(['r','q','k'].includes(p))dirs.push([0,-1],[0,1],[-1,0],[1,0]);
   for(const [dr,dc] of dirs){
    for(let n=1;n<COLS;n++){
     const nr=r+dr*n;if(nr<0||nr>=ROWS)break;
     const to=at(nr,c+dc*n);if(to===f)break;
     if(attacks||color(s.b[to])!==s.t)add(f,to);
     if(p==='k'||s.b[to]!=='.')break;
    }
   }
  }
 }
 return out;
}
function attacked(s,i,by){return pseudo({...s,t:by},true).some(m=>m.t===i);}
function inCheck(s,who=s.t){const king=s.b.indexOf(who===1?'K':'k');return king<0||attacked(s,king,-who);}
function apply(s,m){
 const b=s.b.slice(),pd=s.pd.slice(),pc=b[m.f],victim=b[m.t];let ep=-1,epVictim=-1;
 const dir=pd[m.f];b[m.f]='.';pd[m.f]=0;b[m.t]=m.p?(s.t===1?m.p.toUpperCase():m.p):pc;pd[m.t]=m.p?0:dir;
 if(m.flag==='ep'&&s.epVictim>=0){b[s.epVictim]='.';pd[s.epVictim]=0;}
 if(pc.toLowerCase()==='p'&&MOD(ic(m.t)-ic(m.f))===MOD(2*dir)){ep=at(ir(m.f),ic(m.f)+dir);epVictim=m.t;}
 return {b,pd,t:-s.t,ep,epVictim,half:pc.toLowerCase()==='p'||victim!=='.'||m.flag==='ep'?0:s.half+1,full:s.full+(s.t===-1?1:0)};
}
function legal(s){return pseudo(s).filter(m=>s.b[m.t].toLowerCase()!=='k'&&!inCheck(apply(s,m),s.t));}
function key(s){const ep=s.ep>=0&&legal(s).some(m=>m.flag==='ep')?s.ep:-1;return s.b.join('')+'|'+s.pd.join('')+'|'+s.t+'|'+ep;}
function insufficient(s){const others=[];for(let i=0;i<s.b.length;i++){let p=s.b[i].toLowerCase();if(p!=='.'&&p!=='k')others.push({p,cell:(ir(i)+ic(i))%2});}
 return others.length===0||(others.length===1&&['n','b'].includes(others[0].p))||(others.every(z=>z.p==='b')&&new Set(others.map(z=>z.cell)).size===1);}
function result(s,history){const moves=legal(s);if(!moves.length)return inCheck(s)?(s.t===1?'Black':'White')+' wins by checkmate':'Draw by stalemate';
 if(insufficient(s))return 'Draw: insufficient material';if(s.half>=150)return 'Draw: 75-move rule';const k=key(s);
 if(history.filter(h=>key(h)===k).length>=5)return 'Draw: fivefold repetition';return '';}
const rand=e=>Math.random()*e;
function evaluate(s){let total=0;
 for(let i=0;i<s.b.length;i++){
  const pc=s.b[i];if(pc==='.')continue;const who=color(pc),p=pc.toLowerCase();let value=SCORE[p]||0;
  if(p==='p'){
   const dir=s.pd[i],c=ic(i),start=who===1?(dir===-1?6:8):(dir===1?1:13);
   const advanced=dir===1?MOD(c-start):MOD(start-c);value+=Math.min(8,advanced)*12;
  }
  if(p==='n'||p==='b'){value+=(3.5-Math.abs(3.5-ir(i)))*5;}
  total+=(who===-1?value:-value);
 }
 return total;
}
function movePriority(s,m){let p=s.b[m.t],priority=p!=='.'?(SCORE[p.toLowerCase()]||0):0;
 if(m.flag==='ep')priority+=100;if(m.p)priority+=900;
 const next=apply(s,m);if(inCheck(next))priority+=75;
 return priority;
}
function bestMove(s,depth){const options=legal(s);if(!options.length)return null;
 const choices=options.map(m=>({m,prio:movePriority(s,m)+rand(9)})).sort((a,b)=>b.prio-a.prio);
 let best=-Infinity,winner=[];
 for(const {m} of (depth>1?choices.slice(0,Math.min(22,choices.length)):choices)){
  let after=apply(s,m),replies=legal(after),score=evaluate(after);
  if(!replies.length)score=inCheck(after)?1e7:0;
  else if(depth>1){
   const answers=replies.map(h=>({m:h,prio:movePriority(after,h)})).sort((a,b)=>b.prio-a.prio).slice(0,28);
   let worst=Infinity;
   for(const {m:reply} of answers){const next=apply(after,reply);const nextMoves=legal(next);
    let val=nextMoves.length?evaluate(next):inCheck(next)?-1e7:0;
    if(val<worst)worst=val;if(worst<best-4000)break;
   }
   score=worst;
  }
  score+=rand(4);
  if(score>best+.1){best=score;winner=[m];}else if(Math.abs(score-best)<.1)winner.push(m);
 }
 return winner[Math.floor(rand(winner.length))]||choices[0].m;
}
function describe(s,m){const p=s.b[m.f].toUpperCase(),capture=s.b[m.t]!=='.'||m.flag==='ep';
 return(p==='P'?(capture?alphabet[ic(m.f)]:''):p)+(capture?'×':'')+sqName(m.t)+(m.p?'='+m.p.toUpperCase():'');}
let session=null,history=[],notation=[],selected=-1,targets=[],lastMove=null,busy=false,autoFollow=true,returnView=true,opponent='bot',level=2;
let camera={yaw:0,pitch:0.03,goalYaw:0,goalPitch:0.03}, fx=null,aiPhase='',timers=[],active=false,noticeText='',noticeUntil=0;
const later=(f,ms)=>{const h=setTimeout(()=>{timers=timers.filter(x=>x!==h);f();},ms);timers.push(h);return h;};
function cancel(){for(const t of timers)clearTimeout(t);timers=[];busy=false;fx=null;aiPhase='';}
function viewOf(i){return{yaw:-(ic(i)-6.5)*STEP,pitch:(3.5-ir(i))*LATMAX*2/8};}
function approach(value,target){return value+(target-value)*.11;}
function point(lat,lon){let x=Math.cos(lat)*Math.sin(lon),y=Math.sin(lat),z=Math.cos(lat)*Math.cos(lon);
 const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),xx=x*cy+z*sy,zz=-x*sy+z*cy,cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
 return {x:xx,y:y*cp-zz*sp,z:y*sp+zz*cp};}
function world(i){return point((3.5-ir(i))*LATMAX*2/8,(ic(i)-6.5)*STEP);}
function focus(i){const angle=viewOf(i);camera.goalYaw+=((angle.yaw-camera.goalYaw+Math.PI)%TAU+TAU)%TAU-Math.PI;camera.goalPitch=angle.pitch;}
function home(){focus(at(3,7));camera.goalPitch=.04;}
function reset(){cancel();session=initial();history=[session];notation=[];selected=-1;targets=[];lastMove=null;update();home();}
function statusText(){let end=result(session,history);if(end)return end;return session.t===1?'White to move'+(inCheck(session)?' — CHECK!':''):'Black to move'+(inCheck(session)?' — CHECK!':'');}
function update(){if(!session)return;const end=result(session,history);E('grandStatus').textContent=end||statusText();E('grandInstruction').textContent=busy?aiPhase:opponent==='bot'&&session.t===-1?'Computer is thinking…':selected>=0?`Selected ${sqName(selected)}. Tap a highlighted tile or rotate toward it.`:'Drag to rotate • Tap a piece, then a highlighted square';
 E('grandGlobeInfo').textContent=busy?'Camera follows computer':opponent==='bot'?'White vs Computer':'Local two-player';
 E('grandMoveList').innerHTML=notation.length?notation.slice(-18).map((m,j)=>`<div class="orbit-move-row"><b>${Math.floor((notation.length-notation.slice(-18).length+j)/2)+1}${(notation.length-notation.slice(-18).length+j)%2?'…':'.'}</b><span>${m}</span></div>`).join(''):'<div class="empty">Moves appear here. Two pawn fronts wrap around the globe.</div>';
 E('grandUndo').disabled=!notation.length||busy;updateMap();E('grandStatus').setAttribute('data-done',end?'true':'false');}
function move(m){let old=session,next=apply(session,m);history.push(next);session=next;lastMove={f:m.f,t:m.t};selected=-1;targets=[];notation.push(describe(old,m));let ending=result(session,history);if(!ending&&inCheck(session))flash('CHECK!');if(ending)flash(ending);update();}
function flash(t){noticeText=t;noticeUntil=performance.now()+1700;}
function playHuman(m){if(result(session,history))return;
 if(m.p){const promos=legal(session).filter(v=>v.f===m.f&&v.t===m.t);if(promos.length>1){E('grandPromotion').hidden=false;E('grandPromotionChoices').replaceChildren();for(const x of promos){const el=document.createElement('button');el.textContent=PIECES[x.p.toUpperCase()]||x.p.toUpperCase();el.title=x.p.toUpperCase();el.onclick=()=>{E('grandPromotion').hidden=true;move(x);queueComputer();};E('grandPromotionChoices').appendChild(el);}return;}}
 move(m);queueComputer();}
function queueComputer(){if(opponent!=='bot'||session.t!==-1||result(session,history)||!active)return;busy=true;aiPhase='Computer planning on two fronts';update();later(()=>{if(!active||!busy)return;const candidate=bestMove(session,level);if(!candidate){busy=false;update();return;}const moveNotation=describe(session,candidate);if(autoFollow){aiPhase='Computer focuses on '+sqName(candidate.f)+'…';focus(candidate.f);update();later(()=>{if(!active)return;fx={m:candidate,piece:session.b[candidate.f],from:world(candidate.f),start:performance.now(),end:performance.now()+670};aiPhase='Computer plays '+moveNotation+' on the globe';move(candidate);focus(candidate.t);busy=true;update();later(()=>{fx=null;aiPhase='';busy=false;update();if(returnView)later(()=>{if(active&&!busy)home();},320);},790);},830);}else{move(candidate);busy=false;update();}},opponent==='bot'?330:0);}
function trySelect(i){if(!active||busy||result(session,history)||opponent==='bot'&&session.t===-1)return;let pc=session.b[i];if(color(pc)===session.t){selected=selected===i?-1:i;targets=selected>=0?legal(session).filter(m=>m.f===selected).map(m=>m.t):[];if(selected>=0)flash(`${sqName(selected)} selected`);update();return;}
 if(selected>=0){let options=legal(session).filter(m=>m.f===selected&&m.t===i);if(options.length){playHuman(options[0]);return;}}
 flash('Select one of your pieces, then its highlighted destination.');}

function updateMap(){
 const wrap=E('grandMapWrap'),board=E('grandFlatMap');if(!wrap||!board||wrap.hidden||!session)return;
 board.replaceChildren();
 const frag=document.createDocumentFragment(),valid=selected>=0?legal(session).filter(m=>m.f===selected).map(m=>m.t):[];
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
  const i=at(r,c),pc=session.b[i],btn=document.createElement('button');btn.type='button';
  btn.className='grand-map-cell'+((r+c)%2?' dark':' light')+(selected===i?' selected':'')+(valid.includes(i)?' target':'')+(lastMove&&(lastMove.f===i||lastMove.t===i)?' last':'');
  btn.textContent=PIECES[pc]||' ';btn.title=sqName(i)+' '+(pc==='.'?'empty':pc.toUpperCase())+(session.pd[i]?' pawn front '+(session.pd[i]>0?'east':'west'):'');
  btn.setAttribute('aria-label',btn.title);btn.onclick=()=>{if(busy)return;trySelect(i);};frag.appendChild(btn);
 }board.appendChild(frag);
}
const dims=()=>{const dpr=Math.min(window.devicePixelRatio||1,2),bounds=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(bounds.width*dpr)),h=Math.max(1,Math.round(bounds.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const R=Math.min(w*.41,h*.398),cx=w*.5,cy=h*.52;return {w,h,cx,cy,R};};
function pick(px,py){let d=dims(),x=(px-d.cx)/d.R,y=-(py-d.cy)/d.R;if(x*x+y*y>=.98)return -1;const z=Math.sqrt(1-x*x-y*y),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch),oldY=y*cp+z*sp,oldZ=-y*sp+z*cp;
 const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),oldX=x*cy-oldZ*sy,oldZZ=x*sy+oldZ*cy;let lon=Math.atan2(oldX,oldZZ),lat=Math.asin(Math.max(-1,Math.min(1,oldY)));
 if(lat>LATMAX||lat< -LATMAX)return -1;let c=MOD(Math.floor(lon/STEP+7)),r=Math.max(0,Math.min(7,Math.floor((LATMAX-lat)/(LATMAX*2)*8)));return at(r,c);
}
function projected(p,d){return[d.cx+p.x*d.R,d.cy-p.y*d.R];}
function pathQuad(ctx,p1,p2,p3,p4,d){ctx.beginPath();let q=projected(p1,d);ctx.moveTo(q[0],q[1]);for(let p of [p2,p3,p4]){q=projected(p,d);ctx.lineTo(q[0],q[1]);}ctx.closePath();}
function draw(ts){requestAnimationFrame(draw);if(!active)return;let d=dims(),{w,h,R,cx,cy}=d;camera.yaw=approach(camera.yaw,camera.goalYaw);camera.pitch=approach(camera.pitch,camera.goalPitch);
 ctx.clearRect(0,0,w,h);let back=ctx.createRadialGradient(cx,cy-R*.5,4,cx,cy,R*1.9);back.addColorStop(0,'#295a65');back.addColorStop(.47,'#101a38');back.addColorStop(1,'#081228');ctx.fillStyle=back;ctx.fillRect(0,0,w,h);
 // Stars and grand rings (no image/network dependency).
 const t=ts*.00018;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.23);ctx.strokeStyle='#a0ebd43f';ctx.lineWidth=Math.max(1,2*d.w/1000);ctx.beginPath();ctx.ellipse(0,0,R*1.23,R*.39,0,0,TAU);ctx.stroke();ctx.strokeStyle='#f6da9766';ctx.beginPath();ctx.ellipse(0,0,R*1.30,R*.48,0,0,TAU);ctx.stroke();ctx.restore();
 for(let j=0;j<110;j++){let a=Math.sin(j*39.21)*43758.5453,b=Math.sin(j*129.4)*9942.82,x=(a-Math.floor(a))*w,y=(b-Math.floor(b))*h;const rr=(j%6===0?1.8:1.0)*d.w/1000;ctx.fillStyle=j%5===0?'#ffdf9ab8':'#d9ffff96';ctx.globalAlpha=.55+.25*Math.sin(t+j);ctx.fillRect(x,y,rr,rr);}ctx.globalAlpha=1;
 const sh=ctx.createRadialGradient(cx+R*.08,cy+R*.18,R*.65,cx,cy,R*1.15);sh.addColorStop(0,'#030b1860');sh.addColorStop(1,'#00000000');ctx.fillStyle=sh;ctx.beginPath();ctx.ellipse(cx+R*.04,cy+R*.07,R*1.23,R*1.15,0,0,TAU);ctx.fill();
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.clip();const ocean=ctx.createRadialGradient(cx-R*.4,cy-R*.6,R*.03,cx+R*.22,cy+R*.25,R*1.38);ocean.addColorStop(0,'#4be8c6');ocean.addColorStop(.5,'#237b91');ocean.addColorStop(1,'#0b2047');ctx.fillStyle=ocean;ctx.fillRect(cx-R,cy-R,R*2,R*2);
 // Polar caps are deliberately outside playable latitudes.
 const tiles=[];const rowStep=LATMAX*2/8;
 for(let r=0;r<8;r++)for(let c=0;c<14;c++){
  const latTop=LATMAX-r*rowStep,latBot=latTop-rowStep,lo=-Math.PI+c*STEP,hi=lo+STEP,cent=point((latTop+latBot)/2,(lo+hi)/2);
  tiles.push({r,c,latTop,latBot,lo,hi,z:cent.z,i:at(r,c)});
 }
 // Project curved subdivisions so squares remain attached to the globe.
 for(const tile of tiles){let {r,c,latTop,latBot,lo,hi,i}=tile;
  for(let ri=0;ri<4;ri++)for(let ci=0;ci<5;ci++){
   const l0=latTop+(latBot-latTop)*(ri/4),l1=latTop+(latBot-latTop)*((ri+1)/4),a0=lo+(hi-lo)*(ci/5),a1=lo+(hi-lo)*((ci+1)/5),p1=point(l0,a0),p2=point(l0,a1),p3=point(l1,a1),p4=point(l1,a0);
   if([p1,p2,p3,p4].every(p=>p.z<.01))continue;const shade=.62+.38*Math.max(0,(p1.z+p2.z+p3.z+p4.z)/4);let base=(r+c)%2?'#367c80':'#c5e1b7';
   if(selected===i)base='#ffc75c';else if(lastMove&&(lastMove.f===i||lastMove.t===i))base='#adbc73';else if(targets.includes(i))base=session.b[i]==='.'?'#5bd0a5':'#f39087';
   ctx.globalAlpha=Math.max(.45,Math.min(1,shade));pathQuad(ctx,p1,p2,p3,p4,d);ctx.fillStyle=base;ctx.fill();ctx.globalAlpha=1;
   if(ci===0||ri===0){pathQuad(ctx,p1,p2,p3,p4,d);ctx.strokeStyle='#112d4077';ctx.lineWidth=Math.max(.7,d.w/1250);ctx.stroke();}
  }
 }
 // Ambient glossy light and dark limb.
 let lighting=ctx.createRadialGradient(cx-R*.48,cy-R*.53,R*.1,cx+R*.37,cy+R*.3,R*1.5);lighting.addColorStop(0,'#ffffff49');lighting.addColorStop(.52,'#ffffff05');lighting.addColorStop(1,'#020820be');ctx.fillStyle=lighting;ctx.fillRect(cx-R,cy-R,R*2,R*2);
 // Curved latitude / file lines bring out the globe geometry.
 for(let r=0;r<=8;r++){let lat=LATMAX-r*rowStep;ctx.beginPath();let drawing=false;for(let n=0;n<=140;n++){const p=point(lat,-Math.PI+TAU*n/140);if(p.z<.015){drawing=false;continue;}let q=projected(p,d);if(!drawing)ctx.moveTo(...q);else ctx.lineTo(...q);drawing=true;}ctx.strokeStyle='#071c3378';ctx.lineWidth=d.w/440;ctx.stroke();}
 for(let c=0;c<14;c++){let lon=-Math.PI+c*STEP;ctx.beginPath();let drawing=false;for(let n=0;n<=60;n++){let p=point(-LATMAX+LATMAX*2*n/60,lon);if(p.z<.015){drawing=false;continue;}let q=projected(p,d);if(!drawing)ctx.moveTo(...q);else ctx.lineTo(...q);drawing=true;}ctx.strokeStyle='#07253b96';ctx.lineWidth=d.w/440;ctx.stroke();}
 let visible=[];for(let i=0;i<112;i++){const p=world(i);if(p.z<.045)continue;visible.push({i,p,z:p.z});}visible.sort((a,b)=>a.z-b.z);
 for(let {i,p,z} of visible){const piece=session.b[i];const isTarget=targets.includes(i);if(isTarget){const q=projected(p,d);ctx.beginPath();ctx.arc(q[0],q[1],Math.max(7,R*.048),0,TAU);ctx.fillStyle=session.b[i]==='.'?'#0cf9aaaf':'#ff5949e3';ctx.fill();}
  if(piece==='.'||fx&&fx.m.t===i&&ts<fx.end)continue;
  drawPiece(piece,p,d,z,i===selected);
 }
 if(fx&&ts<fx.end){let frac=Math.max(0,Math.min(1,(ts-fx.start)/(fx.end-fx.start)));let a=unitOf(fx.m.f),b=unitOf(fx.m.t);let delta=b.lon-a.lon;if(delta>Math.PI)delta-=TAU;if(delta< -Math.PI)delta+=TAU;
  let pos=point(a.lat+(b.lat-a.lat)*frac,a.lon+delta*frac);if(pos.z>.03)drawPiece(fx.piece,pos,d,pos.z,true);
 }
 if(noticeUntil>ts){ctx.font=`900 ${Math.min(22,d.R*.074)}px system-ui,sans-serif`;ctx.textAlign='center';ctx.shadowColor='#031125';ctx.shadowBlur=14;ctx.fillStyle='#fff0b9';ctx.fillText(noticeText,cx,cy+R*.88);ctx.shadowBlur=0;}
 ctx.restore();const rim=ctx.createRadialGradient(cx,cy,R*.90,cx,cy,R*1.04);rim.addColorStop(0,'#e3ffed00');rim.addColorStop(.8,'#bbfff51f');rim.addColorStop(1,'#94fce999');ctx.strokeStyle='#c8ffe0ae';ctx.lineWidth=Math.max(2,R*.013);ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();ctx.fillStyle=rim;ctx.beginPath();ctx.arc(cx,cy,R*1.03,0,TAU);ctx.fill();
 // Camera center reticle for easier targeted rotation.
 ctx.strokeStyle='#fff5bc99';ctx.lineWidth=Math.max(1.2,d.w/800);ctx.beginPath();ctx.arc(cx,cy,R*.064,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-R*.098,cy);ctx.lineTo(cx-R*.079,cy);ctx.moveTo(cx+R*.079,cy);ctx.lineTo(cx+R*.098,cy);ctx.stroke();
}
function unitOf(i){return{lat:(3.5-ir(i))*LATMAX*2/8,lon:(ic(i)-6.5)*STEP};}
function drawPiece(pc,pos,d,z,selectedPiece){const [x,y]=projected(pos,d),size=Math.max(16,d.R*(.125+(z*.018)));
 ctx.save();ctx.shadowColor='#000b';ctx.shadowBlur=size*.32;ctx.shadowOffsetY=size*.12;
 const outer=ctx.createRadialGradient(x-size*.3,y-size*.37,size*.02,x,y,size*.70);if(color(pc)===1){outer.addColorStop(0,'#fff9cd');outer.addColorStop(.65,'#eedda4');outer.addColorStop(1,'#a7793d');}else{outer.addColorStop(0,'#4d7087');outer.addColorStop(.5,'#233654');outer.addColorStop(1,'#131a32');}
 ctx.fillStyle=outer;ctx.beginPath();ctx.ellipse(x,y,size*.55,size*.55,0,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle=selectedPiece?'#fff2a5':color(pc)===1?'#fff8cd':'#78c7c8';ctx.lineWidth=selectedPiece?4:1.8;ctx.stroke();
 ctx.fillStyle=color(pc)===1?'#172a43':'#fff1d4';ctx.strokeStyle=color(pc)===1?'#5d5972':'#0d132c';ctx.lineWidth=Math.max(1,size*.04);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${size*1.0}px 'DejaVu Sans','Segoe UI Symbol',Georgia,serif`;ctx.strokeText(PIECES[pc],x,y-size*.013);ctx.fillText(PIECES[pc],x,y-size*.013);ctx.restore();}
let drag=null;canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.lx,dy=e.clientY-drag.ly;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)drag.moved=true;if(drag.moved){camera.goalYaw+=dx*.007;camera.yaw=camera.goalYaw;camera.goalPitch=Math.max(-.85,Math.min(.85,camera.goalPitch+dy*.005));camera.pitch=camera.goalPitch;}drag.lx=e.clientX;drag.ly=e.clientY;});
canvas.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const was=drag.moved;drag=null;if(!was){let rect=canvas.getBoundingClientRect(),i=pick((e.clientX-rect.left)*canvas.width/rect.width,(e.clientY-rect.top)*canvas.height/rect.height);if(i>=0)trySelect(i);}});
canvas.addEventListener('pointercancel',()=>drag=null);
canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')camera.goalYaw-=.14;else if(e.key==='ArrowRight')camera.goalYaw+=.14;else if(e.key==='ArrowUp')camera.goalPitch=Math.min(.8,camera.goalPitch+.12);else if(e.key==='ArrowDown')camera.goalPitch=Math.max(-.8,camera.goalPitch-.12);else if(e.key.toLowerCase()==='h')home();else return;e.preventDefault();});
function enter(){if(window.orbitChessTest?.getActive())window.orbitChessTest.leave(false);document.getElementById('chooseModeBtn')?.click();document.getElementById('modeBackdrop').hidden=true;root.hidden=false;document.querySelector('.app')?.classList.add('grand-playing');active=true;if(!session)reset();update();canvas.focus({preventScroll:true});}
function leave(openModes=false){cancel();active=false;root.hidden=true;document.querySelector('.app')?.classList.remove('grand-playing');if(openModes){document.getElementById('chooseModeBtn')?.click();}else document.getElementById('resumeChess')?.click();}
E('grandStart')?.addEventListener('click',enter);E('grandQuick')?.addEventListener('click',enter);
E('grandBack')?.addEventListener('click',()=>leave(false));E('grandModes')?.addEventListener('click',()=>leave(true));
E('grandNew')?.addEventListener('click',()=>{reset();});E('grandUndo')?.addEventListener('click',()=>{if(busy||history.length<2)return;let n=opponent==='bot'&&session.t===1&&history.length>2?2:1;for(let j=0;j<n;j++){history.pop();notation.pop();}session=history[history.length-1];selected=-1;targets=[];lastMove=null;update();});
E('grandHome')?.addEventListener('click',home);E('grandFlip')?.addEventListener('click',()=>{camera.goalYaw+=Math.PI;});
E('grandLeft')?.addEventListener('click',()=>{camera.goalYaw-=.45;});E('grandRight')?.addEventListener('click',()=>{camera.goalYaw+=.45;});
E('grandCenter')?.addEventListener('click',()=>{if(selected>=0)focus(selected);else flash('Select a piece to center it.');});
E('grandOpponent')?.addEventListener('change',e=>{opponent=e.target.value;reset();});
E('grandLevel')?.addEventListener('change',e=>{level=e.target.value==='casual'?1:2;});
E('grandFollow')?.addEventListener('change',e=>{autoFollow=e.target.checked;});
E('grandReturn')?.addEventListener('change',e=>{returnView=e.target.checked;});
E('grandMapToggle')?.addEventListener('click',()=>{const panel=E('grandMapWrap');panel.hidden=!panel.hidden;E('grandMapToggle').setAttribute('aria-expanded',String(!panel.hidden));updateMap();});
E('grandCancelPromo')?.addEventListener('click',()=>{E('grandPromotion').hidden=true;});
document.querySelectorAll('[data-start],[data-lesson]').forEach(el=>el.addEventListener('click',()=>{if(active)leave(false);},{capture:true}));
window.grandChessTest={initial,apply,legal,pseudo,attacked,inCheck,result,describe,key,insufficient,select:trySelect,playUci:(uci)=>{let found=legal(session).find(m=>sqName(m.f)+sqName(m.t)+(m.p||'')===uci);if(!found)return false;move(found);queueComputer();return true;},enter,leave,state:()=>session,view:()=>({...camera}),status:()=>statusText(),getActive:()=>active,getBusy:()=>busy,chooseOpponent:(v)=>{opponent=v;reset();},setFollow:(v)=>{autoFollow=!!v;},aiPreview:(depth=2)=>bestMove(session,depth),pick:(x,y)=>pick(x,y)};
requestAnimationFrame(draw);
})();
