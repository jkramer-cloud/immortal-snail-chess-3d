/* Orbital Chess add-on. Pure rules are independent of original Snail/Classic chess modes.
   This is a house-rule spherical variant, not FIDE chess. Files A-H wrap; ranks 1-8 end at the poles. */
(()=>{'use strict';
const TAU=Math.PI*2, STEP=TAU/8, LATMAX=1.10, sqName=i=>'abcdefgh'[i%8]+(8-Math.floor(i/8));
const E=id=>document.getElementById(id), root=E('orbitChess'), canvas=E('orbitCanvas');if(!root||!canvas)return;
const ctx=canvas.getContext('2d',{alpha:false});
const MOD=(n,m=8)=>(n%m+m)%m, ir=(i)=>Math.floor(i/8),ic=(i)=>i%8,at=(r,c)=>r*8+MOD(c),color=p=>p==='.'?0:p===p.toUpperCase()?1:-1;
const PIECES={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'\u265F\uFE0E'};
const SCORE={p:100,n:320,b:330,r:520,q:940,k:25000};
const initial=()=>{let b=Array(64).fill('.'),back='rnbqkbnr';for(let c=0;c<8;c++){b[c]=back[c];b[8+c]='p';b[48+c]='P';b[56+c]=back[c].toUpperCase();}return{b,t:1,c:15,ep:-1,half:0,full:1};};
const mk=(f,t,p='',flag='')=>({f,t,p,flag});
function pseudo(s,attacks=false){
 const out=[],seen=new Set(),add=(f,t,p='',flag='')=>{const k=f+'_'+t+'_'+p+'_'+flag;if(!seen.has(k)){seen.add(k);out.push(mk(f,t,p,flag));}};
 for(let f=0;f<64;f++){
  let piece=s.b[f];if(color(piece)!==s.t)continue;const r=ir(f),c=ic(f),p=piece.toLowerCase();
  if(p==='p'){
   let dr=s.t===1?-1:1,nr=r+dr;
   if(nr<0||nr>7)continue;
   for(let dc of [-1,1]){let to=at(nr,c+dc),enemy=color(s.b[to])===-s.t,ep=to===s.ep&&s.b[to]==='.'&&s.b[at(r,c+dc)]===(s.t===1?'p':'P');
    if(attacks||enemy||ep){if(!attacks&&!enemy&&!ep)continue;if(nr===0||nr===7){for(let v of ['q','r','b','n'])add(f,to,v,ep?'ep':'');}else add(f,to,'',ep?'ep':'');}}
   if(attacks)continue;
   let to=at(nr,c);if(s.b[to]==='.'){
    if(nr===0||nr===7){for(let v of ['q','r','b','n'])add(f,to,v);}else add(f,to);
    if(r===(s.t===1?6:1)&&s.b[at(r+dr*2,c)]==='.')add(f,at(r+dr*2,c));
   }
  }else if(p==='n'){
   for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
    const nr=r+dr;if(nr<0||nr>7)continue;let to=at(nr,c+dc);if(attacks||color(s.b[to])!==s.t)add(f,to);
   }
  }else {
   const dirs=[];if(['b','q','k'].includes(p))dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
   if(['r','q','k'].includes(p))dirs.push([0,-1],[0,1],[-1,0],[1,0]);
   for(const [dr,dc] of dirs){
    for(let n=1;n<=(p==='k'?1:7);n++){
     const nr=r+dr*n;if(nr<0||nr>7)break;const to=at(nr,c+dc*n);if(to===f)break;
     if(attacks||color(s.b[to])!==s.t)add(f,to);
     if(p==='k'||s.b[to]!=='.')break;
    }
   }
  }
 }
 return out;
}
function attacked(s,i,by){const tmp={...s,t:by};return pseudo(tmp,true).some(m=>m.t===i);}
function inCheck(s,player=s.t){const king=s.b.indexOf(player===1?'K':'k');return king<0||attacked(s,king,-player);}
function apply(s,m){const b=s.b.slice(),pc=b[m.f],targ=b[m.t];b[m.f]='.';
 b[m.t]=m.p?(s.t===1?m.p.toUpperCase():m.p):pc;
 if(m.flag==='ep')b[at(ir(m.f),ic(m.t))]='.';
 if(m.flag==='castle'){const rookFrom=m.t>m.f?m.f+3:m.f-4,rookTo=m.t>m.f?m.f+1:m.f-1;b[rookTo]=b[rookFrom];b[rookFrom]='.';}
 let rights=s.c;
 if(pc==='K')rights&=~3;if(pc==='k')rights&=~12;
 if(pc==='R'){if(m.f===63)rights&=~1;if(m.f===56)rights&=~2;}
 if(pc==='r'){if(m.f===7)rights&=~4;if(m.f===0)rights&=~8;}
 if(targ==='R'){if(m.t===63)rights&=~1;if(m.t===56)rights&=~2;}
 if(targ==='r'){if(m.t===7)rights&=~4;if(m.t===0)rights&=~8;}
 const dr=ir(m.t)-ir(m.f),ep=pc.toLowerCase()==='p'&&Math.abs(dr)===2?at(ir(m.f)+dr/2,ic(m.f)):-1;
 return{b,t:-s.t,c:rights,ep,half:pc.toLowerCase()==='p'||targ!=='.'||m.flag==='ep'?0:s.half+1,full:s.full+(s.t===-1?1:0)};
}
function legal(s){let out=pseudo(s).filter(m=>s.b[m.t].toLowerCase()!=='k'&&!inCheck(apply(s,m),s.t));
 const king=s.t===1?60:4,rook=s.t===1?'R':'r',mask=s.t===1?[1,2]:[4,8];
 if(s.b[king]===(s.t===1?'K':'k')&&!inCheck(s)){
  if((s.c&mask[0])&&s.b[king+3]===rook&&s.b[king+1]==='.'&&s.b[king+2]==='.'&&!attacked(s,king+1,-s.t)&&!attacked(s,king+2,-s.t))out.push(mk(king,king+2,'','castle'));
  if((s.c&mask[1])&&s.b[king-4]===rook&&s.b[king-1]==='.'&&s.b[king-2]==='.'&&s.b[king-3]==='.'&&!attacked(s,king-1,-s.t)&&!attacked(s,king-2,-s.t))out.push(mk(king,king-2,'','castle'));
 }
 return out;
}
function key(s){return s.b.join('')+':'+s.t+':'+s.c+':'+(s.ep>=0&&legal(s).some(m=>m.flag==='ep')?s.ep:-1);}
function insufficient(s){let a=[];for(let i=0;i<64;i++){let p=s.b[i].toLowerCase();if(p!=='.'&&p!=='k')a.push({p,cell:(ir(i)+ic(i))%2});}return !a.length||(a.length===1&&['b','n'].includes(a[0].p))||(a.every(z=>z.p==='b')&&new Set(a.map(z=>z.cell)).size===1);}
function result(s,history){let lm=legal(s);if(!lm.length)return inCheck(s)?(s.t===1?'Black':'White')+' wins by checkmate':'Draw by stalemate';if(insufficient(s))return 'Draw: insufficient material';if(s.half>=150)return 'Draw: 75-move rule';let k=key(s);if(history.filter(h=>key(h)===k).length>=5)return 'Draw: fivefold repetition';return '';}
const rand=e=>Math.random()*e;
function evaluate(s){let points=0;for(let i=0;i<64;i++){const p=s.b[i];if(p==='.')continue;const side=color(p);points+=(side===-1?1:-1)*(SCORE[p.toLowerCase()]||0);const r=ir(i),c=ic(i);if(p.toLowerCase()==='p')points+=(side===-1?1:-1)*(side===-1?(r-1):(6-r))*9;points+=(side===-1?1:-1)*(3.5-Math.abs(3.5-r))*1.3;}
 return points;
}
function bestMove(s,depth){const options=legal(s);if(!options.length)return null;let alpha=-1e9,best=[],v=-1e9;
 const ordered=options.map(m=>({m,priority:(s.b[m.t]!=='.'?SCORE[s.b[m.t].toLowerCase()]:0)+(m.p?900:0)+rand(12)})).sort((a,b)=>b.priority-a.priority);
 for(const o of ordered){const m=o.m,next=apply(s,m),reply=legal(next);let score=evaluate(next)+(m.flag==='castle'?12:0);
  if(!reply.length){score=inCheck(next)?1e7:0;}
  else if(depth>1){let replyBest=1e9;for(const h of reply){let n=apply(next,h),r=legal(n),p=r.length?evaluate(n):inCheck(n)?-1e7:0;if(p<replyBest)replyBest=p;if(replyBest<=alpha)break;}score=replyBest;}
  score+=rand(5);if(score>v+.1){v=score;best=[m];}else if(Math.abs(score-v)<.1)best.push(m);alpha=Math.max(alpha,v);
 }
 return best[Math.floor(rand(best.length))]||ordered[0].m;
}
function describe(s,m){let p=s.b[m.f].toUpperCase();let cap=s.b[m.t]!=='.'||m.flag==='ep';if(m.flag==='castle')return m.t>m.f?'O-O':'O-O-O';return (p==='P'?(cap?'abcdefgh'[ic(m.f)]:''):p)+(cap?'×':'')+sqName(m.t)+(m.p?'='+m.p.toUpperCase():'');}
let session=null,history=[],notation=[],selected=-1,targets=[],lastMove=null,busy=false,autoFollow=true,returnView=true,opponent='bot',level=2;
let camera={yaw:0,pitch:0.03,goalYaw:0,goalPitch:0.03}, fx=null,aiPhase='',timers=[],active=false,noticeText='',noticeUntil=0;
const later=(f,ms)=>{const h=setTimeout(()=>{timers=timers.filter(x=>x!==h);f();},ms);timers.push(h);return h;};
function cancel(){for(const t of timers)clearTimeout(t);timers=[];busy=false;fx=null;aiPhase='';}
function viewOf(i){return{yaw:-(ic(i)-3.5)*STEP,pitch:(3.5-ir(i))*LATMAX*2/8};}
function approach(value,target){return value+(target-value)*.11;}
function point(lat,lon){let x=Math.cos(lat)*Math.sin(lon),y=Math.sin(lat),z=Math.cos(lat)*Math.cos(lon);
 const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),xx=x*cy+z*sy,zz=-x*sy+z*cy,cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
 return {x:xx,y:y*cp-zz*sp,z:y*sp+zz*cp};}
function world(i){return point((3.5-ir(i))*LATMAX*2/8,(ic(i)-3.5)*STEP);}
function focus(i){const angle=viewOf(i);camera.goalYaw+=((angle.yaw-camera.goalYaw+Math.PI)%TAU+TAU)%TAU-Math.PI;camera.goalPitch=angle.pitch;}
function home(){camera.goalYaw+=((0-camera.goalYaw+Math.PI)%TAU+TAU)%TAU-Math.PI;camera.goalPitch=.04;}
function reset(){cancel();session=initial();history=[session];notation=[];selected=-1;targets=[];lastMove=null;update();home();}
function statusText(){let end=result(session,history);if(end)return end;return session.t===1?'White to move'+(inCheck(session)?' — CHECK!':''):'Black to move'+(inCheck(session)?' — CHECK!':'');}
function update(){if(!session)return;const end=result(session,history);E('orbitStatus').textContent=end||statusText();E('orbitInstruction').textContent=busy?aiPhase:opponent==='bot'&&session.t===-1?'Computer is thinking…':selected>=0?`Selected ${sqName(selected)}. Tap a highlighted tile or rotate toward it.`:'Drag to rotate • Tap a piece, then a highlighted square';
 E('orbitGlobeInfo').textContent=busy?'Camera follows computer':opponent==='bot'?'White vs Computer':'Local two-player';
 E('orbitMoveList').innerHTML=notation.length?notation.slice(-18).map((m,j)=>`<div class="orbit-move-row"><b>${Math.floor((notation.length-notation.slice(-18).length+j)/2)+1}${(notation.length-notation.slice(-18).length+j)%2?'…':'.'}</b><span>${m}</span></div>`).join(''):'<div class="empty">Moves appear here. Files wrap around the globe.</div>';
 E('orbitUndo').disabled=!notation.length||busy;E('orbitStatus').setAttribute('data-done',end?'true':'false');}
function move(m){let old=session,next=apply(session,m);history.push(next);session=next;lastMove={f:m.f,t:m.t};selected=-1;targets=[];notation.push(describe(old,m));let ending=result(session,history);if(!ending&&inCheck(session))flash('CHECK!');if(ending)flash(ending);update();}
function flash(t){noticeText=t;noticeUntil=performance.now()+1700;}
function playHuman(m){if(result(session,history))return;
 if(m.p){const promos=legal(session).filter(v=>v.f===m.f&&v.t===m.t);if(promos.length>1){E('orbitPromotion').hidden=false;E('orbitPromotionChoices').replaceChildren();for(const x of promos){const el=document.createElement('button');el.textContent=PIECES[x.p.toUpperCase()]||x.p.toUpperCase();el.title=x.p.toUpperCase();el.onclick=()=>{E('orbitPromotion').hidden=true;move(x);queueComputer();};E('orbitPromotionChoices').appendChild(el);}return;}}
 move(m);queueComputer();}
function queueComputer(){if(opponent!=='bot'||session.t!==-1||result(session,history)||!active)return;busy=true;aiPhase='Computer calculating a move';update();later(()=>{if(!active||!busy)return;const candidate=bestMove(session,level);if(!candidate){busy=false;update();return;}const moveNotation=describe(session,candidate);if(autoFollow){aiPhase='Computer focuses on '+sqName(candidate.f)+'…';focus(candidate.f);update();later(()=>{if(!active)return;fx={m:candidate,piece:session.b[candidate.f],from:world(candidate.f),start:performance.now(),end:performance.now()+670};aiPhase='Computer plays '+moveNotation+' on the globe';move(candidate);focus(candidate.t);busy=true;update();later(()=>{fx=null;aiPhase='';busy=false;update();if(returnView)later(()=>{if(active&&!busy)home();},320);},790);},830);}else{move(candidate);busy=false;update();}},opponent==='bot'?330:0);}
function trySelect(i){if(!active||busy||result(session,history)||opponent==='bot'&&session.t===-1)return;let pc=session.b[i];if(color(pc)===session.t){selected=selected===i?-1:i;targets=selected>=0?legal(session).filter(m=>m.f===selected).map(m=>m.t):[];if(selected>=0)flash(`${sqName(selected)} selected`);update();return;}
 if(selected>=0){let options=legal(session).filter(m=>m.f===selected&&m.t===i);if(options.length){playHuman(options[0]);return;}}
 flash('Select one of your pieces, then its highlighted destination.');}
const dims=()=>{const dpr=Math.min(window.devicePixelRatio||1,2),bounds=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(bounds.width*dpr)),h=Math.max(1,Math.round(bounds.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const R=Math.min(w*.41,h*.398),cx=w*.5,cy=h*.52;return {w,h,cx,cy,R};};
function pick(px,py){let d=dims(),x=(px-d.cx)/d.R,y=-(py-d.cy)/d.R;if(x*x+y*y>=.98)return -1;const z=Math.sqrt(1-x*x-y*y),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch),oldY=y*cp+z*sp,oldZ=-y*sp+z*cp;
 const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),oldX=x*cy-oldZ*sy,oldZZ=x*sy+oldZ*cy;let lon=Math.atan2(oldX,oldZZ),lat=Math.asin(Math.max(-1,Math.min(1,oldY)));
 if(lat>LATMAX||lat< -LATMAX)return -1;let c=MOD(Math.floor(lon/STEP+4)),r=Math.max(0,Math.min(7,Math.floor((LATMAX-lat)/(LATMAX*2)*8)));return at(r,c);
}
function projected(p,d){return[d.cx+p.x*d.R,d.cy-p.y*d.R];}
function pathQuad(ctx,p1,p2,p3,p4,d){ctx.beginPath();let q=projected(p1,d);ctx.moveTo(q[0],q[1]);for(let p of [p2,p3,p4]){q=projected(p,d);ctx.lineTo(q[0],q[1]);}ctx.closePath();}
function draw(ts){requestAnimationFrame(draw);if(!active)return;let d=dims(),{w,h,R,cx,cy}=d;camera.yaw=approach(camera.yaw,camera.goalYaw);camera.pitch=approach(camera.pitch,camera.goalPitch);
 ctx.clearRect(0,0,w,h);let back=ctx.createRadialGradient(cx,cy-R*.5,4,cx,cy,R*1.9);back.addColorStop(0,'#295a65');back.addColorStop(.47,'#101a38');back.addColorStop(1,'#081228');ctx.fillStyle=back;ctx.fillRect(0,0,w,h);
 // Stars and orbit rings (no image/network dependency).
 const t=ts*.00018;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.23);ctx.strokeStyle='#a0ebd43f';ctx.lineWidth=Math.max(1,2*d.w/1000);ctx.beginPath();ctx.ellipse(0,0,R*1.23,R*.39,0,0,TAU);ctx.stroke();ctx.strokeStyle='#f6da9766';ctx.beginPath();ctx.ellipse(0,0,R*1.30,R*.48,0,0,TAU);ctx.stroke();ctx.restore();
 for(let j=0;j<110;j++){let a=Math.sin(j*39.21)*43758.5453,b=Math.sin(j*129.4)*9942.82,x=(a-Math.floor(a))*w,y=(b-Math.floor(b))*h;const rr=(j%6===0?1.8:1.0)*d.w/1000;ctx.fillStyle=j%5===0?'#ffdf9ab8':'#d9ffff96';ctx.globalAlpha=.55+.25*Math.sin(t+j);ctx.fillRect(x,y,rr,rr);}ctx.globalAlpha=1;
 const sh=ctx.createRadialGradient(cx+R*.08,cy+R*.18,R*.65,cx,cy,R*1.15);sh.addColorStop(0,'#030b1860');sh.addColorStop(1,'#00000000');ctx.fillStyle=sh;ctx.beginPath();ctx.ellipse(cx+R*.04,cy+R*.07,R*1.23,R*1.15,0,0,TAU);ctx.fill();
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.clip();const ocean=ctx.createRadialGradient(cx-R*.4,cy-R*.6,R*.03,cx+R*.22,cy+R*.25,R*1.38);ocean.addColorStop(0,'#4be8c6');ocean.addColorStop(.5,'#237b91');ocean.addColorStop(1,'#0b2047');ctx.fillStyle=ocean;ctx.fillRect(cx-R,cy-R,R*2,R*2);
 // Polar caps are deliberately outside playable latitudes.
 const tiles=[];const rowStep=LATMAX*2/8;
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){
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
 for(let c=0;c<8;c++){let lon=-Math.PI+c*STEP;ctx.beginPath();let drawing=false;for(let n=0;n<=60;n++){let p=point(-LATMAX+LATMAX*2*n/60,lon);if(p.z<.015){drawing=false;continue;}let q=projected(p,d);if(!drawing)ctx.moveTo(...q);else ctx.lineTo(...q);drawing=true;}ctx.strokeStyle='#07253b96';ctx.lineWidth=d.w/440;ctx.stroke();}
 let visible=[];for(let i=0;i<64;i++){const p=world(i);if(p.z<.045)continue;visible.push({i,p,z:p.z});}visible.sort((a,b)=>a.z-b.z);
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
function unitOf(i){return{lat:(3.5-ir(i))*LATMAX*2/8,lon:(ic(i)-3.5)*STEP};}
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
function enter(){document.getElementById('chooseModeBtn')?.click();document.getElementById('modeBackdrop').hidden=true;root.hidden=false;document.querySelector('.app')?.classList.add('orbit-playing');active=true;if(!session)reset();update();canvas.focus({preventScroll:true});}
function leave(openModes=false){cancel();active=false;root.hidden=true;document.querySelector('.app')?.classList.remove('orbit-playing');if(openModes){document.getElementById('chooseModeBtn')?.click();}else document.getElementById('resumeChess')?.click();}
E('orbitStart')?.addEventListener('click',enter);E('orbitQuick')?.addEventListener('click',enter);
E('orbitBack')?.addEventListener('click',()=>leave(false));E('orbitModes')?.addEventListener('click',()=>leave(true));
E('orbitNew')?.addEventListener('click',()=>{reset();});E('orbitUndo')?.addEventListener('click',()=>{if(busy||history.length<2)return;let n=opponent==='bot'&&session.t===1&&history.length>2?2:1;for(let j=0;j<n;j++){history.pop();notation.pop();}session=history[history.length-1];selected=-1;targets=[];lastMove=null;update();});
E('orbitHome')?.addEventListener('click',home);E('orbitFlip')?.addEventListener('click',()=>{camera.goalYaw+=Math.PI;});
E('orbitLeft')?.addEventListener('click',()=>{camera.goalYaw-=.45;});E('orbitRight')?.addEventListener('click',()=>{camera.goalYaw+=.45;});
E('orbitCenter')?.addEventListener('click',()=>{if(selected>=0)focus(selected);else flash('Select a piece to center it.');});
E('orbitOpponent')?.addEventListener('change',e=>{opponent=e.target.value;reset();});
E('orbitLevel')?.addEventListener('change',e=>{level=e.target.value==='casual'?1:2;});
E('orbitFollow')?.addEventListener('change',e=>{autoFollow=e.target.checked;});
E('orbitReturn')?.addEventListener('change',e=>{returnView=e.target.checked;});
E('orbitCancelPromo')?.addEventListener('click',()=>{E('orbitPromotion').hidden=true;});
document.querySelectorAll('[data-start],[data-lesson]').forEach(el=>el.addEventListener('click',()=>{if(active)leave(false);},{capture:true}));
window.orbitChessTest={initial,apply,legal,pseudo,attacked,inCheck,result,describe,key,insufficient,select:trySelect,playUci:(uci)=>{let found=legal(session).find(m=>sqName(m.f)+sqName(m.t)+(m.p||'')===uci);if(!found)return false;move(found);queueComputer();return true;},enter,leave,state:()=>session,view:()=>({...camera}),status:()=>statusText(),getActive:()=>active,getBusy:()=>busy,aiPreview:(depth=2)=>bestMove(session,depth),pick:(x,y)=>pick(x,y)};
requestAnimationFrame(draw);
})();
