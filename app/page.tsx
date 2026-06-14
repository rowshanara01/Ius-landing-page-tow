"use client";
import { useEffect, useRef, useState } from "react";

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const inv   = (v: number, lo: number, hi: number) => clamp((v - lo) / (hi - lo), 0, 1);
const ease  = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

type Phase = "hero" | "services" | "contact";

export default function IUSPage() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef    = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef(0);
  const smoothRef = useRef(0);
  const rafRef    = useRef(0);

  const [phase, setPhase]       = useState<Phase>("hero");
  const [agreed, setAgreed]     = useState(false);
  const [mob, setMob]           = useState(false);
  const [cardsKey, setCardsKey] = useState(0);

  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (phase === "services") {
      const id = setTimeout(() => setCardsKey(k => k + 1), 80);
      return () => clearTimeout(id);
    }
  }, [phase]);

  useEffect(() => {
    const fn = () => {
      const el = wrapRef.current;
      if (!el) return;
      scrollRef.current = clamp(window.scrollY / (el.scrollHeight - window.innerHeight), 0, 1);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let globeRot = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(), y: Math.random() * 0.85,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.6 + 0.1,
      sp: Math.random() * 0.005 + 0.001,
    }));

    let t = 0;

    const drawRocket = (c: CanvasRenderingContext2D, cx: number, cy: number, size: number, alpha: number, time: number) => {
      c.save(); c.globalAlpha = alpha;
      c.translate(cx + Math.cos(time*0.5)*1.8, cy + Math.sin(time*0.8)*3.5);
      c.rotate(-0.74);
      c.scale(1, 0.6);
      const s = size;
      const exG = c.createRadialGradient(0,s*0.55,0,0,s*0.55,s*0.55);
      exG.addColorStop(0,`rgba(120,180,255,${0.55*alpha})`); exG.addColorStop(0.4,`rgba(80,120,255,${0.22*alpha})`); exG.addColorStop(1,"rgba(40,60,200,0)");
      c.fillStyle=exG; c.beginPath(); c.ellipse(0,s*0.55,s*0.28,s*0.55,0,0,Math.PI*2); c.fill();
      const bG=c.createLinearGradient(-s*0.18,-s*0.5,s*0.18,-s*0.5);
      bG.addColorStop(0,"rgba(200,210,230,0.95)"); bG.addColorStop(0.35,"rgba(230,235,245,0.98)"); bG.addColorStop(0.65,"rgba(200,210,228,0.95)"); bG.addColorStop(1,"rgba(160,175,200,0.90)");
      c.fillStyle=bG; c.beginPath(); c.roundRect(-s*0.17,-s*0.46,s*0.34,s*0.80,s*0.17); c.fill();
      c.strokeStyle="rgba(140,155,180,0.60)"; c.lineWidth=0.8; c.beginPath(); c.roundRect(-s*0.17,-s*0.46,s*0.34,s*0.80,s*0.17); c.stroke();
      const nG=c.createLinearGradient(-s*0.12,-s*0.88,s*0.12,-s*0.88);
      nG.addColorStop(0,"rgba(180,195,220,0.90)"); nG.addColorStop(0.5,"rgba(220,228,242,0.96)"); nG.addColorStop(1,"rgba(170,185,210,0.88)");
      c.fillStyle=nG; c.beginPath(); c.moveTo(-s*0.17,-s*0.44); c.bezierCurveTo(-s*0.17,-s*0.70,-s*0.06,-s*0.90,0,-s*0.92); c.bezierCurveTo(s*0.06,-s*0.90,s*0.17,-s*0.70,s*0.17,-s*0.44); c.closePath(); c.fill();
      const wG=c.createRadialGradient(-s*0.03,-s*0.16,0,0,-s*0.12,s*0.11);
      wG.addColorStop(0,"rgba(180,210,255,0.95)"); wG.addColorStop(0.5,"rgba(100,150,230,0.80)"); wG.addColorStop(1,"rgba(40,80,180,0.70)");
      c.fillStyle=wG; c.beginPath(); c.arc(0,-s*0.12,s*0.10,0,Math.PI*2); c.fill();
      c.strokeStyle="rgba(160,190,240,0.70)"; c.lineWidth=1.0; c.beginPath(); c.arc(0,-s*0.12,s*0.10,0,Math.PI*2); c.stroke();
      c.fillStyle="rgba(255,255,255,0.70)"; c.beginPath(); c.arc(-s*0.03,-s*0.16,s*0.03,0,Math.PI*2); c.fill();
      const fG=c.createLinearGradient(-s*0.40,s*0.22,0,s*0.22); fG.addColorStop(0,"rgba(160,175,205,0.80)"); fG.addColorStop(1,"rgba(210,218,235,0.92)");
      c.fillStyle=fG; c.beginPath(); c.moveTo(-s*0.17,s*0.18); c.lineTo(-s*0.42,s*0.38); c.lineTo(-s*0.32,s*0.34); c.lineTo(-s*0.17,s*0.34); c.closePath(); c.fill();
      const fG2=c.createLinearGradient(0,s*0.22,s*0.40,s*0.22); fG2.addColorStop(0,"rgba(210,218,235,0.92)"); fG2.addColorStop(1,"rgba(160,175,205,0.78)");
      c.fillStyle=fG2; c.beginPath(); c.moveTo(s*0.17,s*0.18); c.lineTo(s*0.42,s*0.38); c.lineTo(s*0.32,s*0.34); c.lineTo(s*0.17,s*0.34); c.closePath(); c.fill();
      const nzG=c.createLinearGradient(-s*0.14,s*0.32,s*0.14,s*0.32); nzG.addColorStop(0,"rgba(140,155,185,0.90)"); nzG.addColorStop(0.5,"rgba(190,200,220,0.96)"); nzG.addColorStop(1,"rgba(130,145,175,0.88)");
      c.fillStyle=nzG; c.beginPath(); c.moveTo(-s*0.13,s*0.33); c.lineTo(-s*0.17,s*0.50); c.lineTo(s*0.17,s*0.50); c.lineTo(s*0.13,s*0.33); c.closePath(); c.fill();
      const fh=s*0.42*(0.85+0.15*Math.sin(time*18));
      const flG=c.createLinearGradient(0,s*0.50,0,s*0.50+fh);
      flG.addColorStop(0,`rgba(200,230,255,${0.95*alpha})`); flG.addColorStop(0.25,`rgba(140,190,255,${0.80*alpha})`); flG.addColorStop(0.60,`rgba(80,120,255,${0.55*alpha})`); flG.addColorStop(1,"rgba(40,60,200,0)");
      c.fillStyle=flG; c.beginPath(); c.moveTo(-s*0.14,s*0.50); c.bezierCurveTo(-s*0.10,s*0.50+fh*0.5,-s*0.06,s*0.50+fh*0.85,0,s*0.50+fh); c.bezierCurveTo(s*0.06,s*0.50+fh*0.85,s*0.10,s*0.50+fh*0.5,s*0.14,s*0.50); c.closePath(); c.fill();
      c.strokeStyle="rgba(170,185,215,0.35)"; c.lineWidth=0.7;
      [-s*0.02,s*0.06,s*0.16].forEach(yy=>{c.beginPath();c.moveTo(-s*0.15,yy);c.lineTo(s*0.15,yy);c.stroke();});
      c.restore();
    };

    const drawPlanet = (cx: number, cy: number, r: number, alpha: number) => {
      if(alpha<0.01)return;
      ctx.save(); ctx.globalAlpha=alpha;
      const atm=ctx.createRadialGradient(cx,cy,r*0.8,cx,cy,r*1.4);
      atm.addColorStop(0,"rgba(100,55,210,0.18)"); atm.addColorStop(0.5,"rgba(55,15,140,0.07)"); atm.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=atm; ctx.beginPath(); ctx.arc(cx,cy,r*1.4,0,Math.PI*2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
      const body=ctx.createRadialGradient(cx-r*0.28,cy-r*0.22,r*0.02,cx+r*0.1,cy+r*0.1,r*1.1);
      body.addColorStop(0,"#ffffff"); body.addColorStop(0.12,"#e8e8e8"); body.addColorStop(0.35,"#c0c0c0"); body.addColorStop(0.6,"#909090"); body.addColorStop(1,"#404040");
      ctx.fillStyle=body; ctx.fillRect(cx-r,cy-r,r*2,r*2);
      [{x:cx-r*0.08,y:cy-r*0.18,rx:r*0.32,ry:r*0.21,a:0.18},{x:cx+r*0.28,y:cy+r*0.10,rx:r*0.22,ry:r*0.16,a:0.14},
       {x:cx-r*0.32,y:cy+r*0.26,rx:r*0.18,ry:r*0.13,a:0.11},{x:cx+r*0.06,y:cy+r*0.30,rx:r*0.25,ry:r*0.11,a:0.12},
       {x:cx-r*0.20,y:cy-r*0.36,rx:r*0.15,ry:r*0.09,a:0.08}].forEach(pp=>{
        const g=ctx.createRadialGradient(pp.x,pp.y,0,pp.x,pp.y,pp.rx);
        g.addColorStop(0,`rgba(200,200,200,${pp.a})`); g.addColorStop(1,"rgba(140,140,140,0)");
        ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(pp.x,pp.y,pp.rx,pp.ry,0.4,0,Math.PI*2); ctx.fill();
      });
      const dark=ctx.createRadialGradient(cx+r*0.5,cy+r*0.3,r*0.05,cx+r*0.5,cy+r*0.3,r*1.2);
      dark.addColorStop(0,"rgba(0,0,10,0.78)"); dark.addColorStop(0.35,"rgba(0,0,10,0.48)"); dark.addColorStop(1,"rgba(0,0,10,0)");
      ctx.fillStyle=dark; ctx.fillRect(cx-r,cy-r,r*2,r*2); ctx.restore();
      const rim=ctx.createRadialGradient(cx,cy,r*0.92,cx,cy,r*1.08);
      rim.addColorStop(0,"rgba(180,150,255,0.22)"); rim.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=rim; ctx.beginPath(); ctx.arc(cx,cy,r*1.08,0,Math.PI*2); ctx.fill();
      ctx.restore();
    };

    const drawGlobe = (cx: number, cy: number, r: number, alpha: number) => {
      if(alpha<0.01)return;
      ctx.save(); ctx.globalAlpha=alpha;
      const glow=ctx.createRadialGradient(cx,cy,r*0.9,cx,cy,r*1.35);
      glow.addColorStop(0,`rgba(140,90,255,${0.18*alpha})`); glow.addColorStop(0.6,`rgba(80,30,200,${0.05*alpha})`); glow.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(cx,cy,r*1.35,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.strokeStyle=`rgba(255,255,255,${0.20*alpha})`; ctx.lineWidth=0.9; ctx.stroke();
      for(let i=0;i<12;i++){
        const angle=(i/12)*Math.PI+globeRot; const xScale=Math.cos(angle); const front=xScale>0;
        ctx.beginPath(); ctx.strokeStyle=front?`rgba(255,255,255,${0.26*alpha})`:`rgba(255,255,255,${0.06*alpha})`; ctx.lineWidth=front?0.85:0.45;
        for(let s=0;s<=64;s++){const tt=-Math.PI/2+(Math.PI/64)*s;const x=cx+r*xScale*Math.cos(tt);const y=cy+r*Math.sin(tt);s===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.stroke();
      }
      [-0.65,-0.38,0,0.38,0.65].forEach(lat=>{
        const py=cy+r*lat; const pr=r*Math.sqrt(1-lat*lat); if(pr<3)return;
        ctx.beginPath(); ctx.strokeStyle=lat===0?`rgba(255,255,255,${0.32*alpha})`:`rgba(255,255,255,${0.11*alpha})`; ctx.lineWidth=lat===0?1.0:0.55;
        ctx.ellipse(cx,py,pr,pr*0.13,0,0,Math.PI*2); ctx.stroke();
      });
      ctx.restore();
    };

    const frame = () => {
      const p=smoothRef.current+=(scrollRef.current-smoothRef.current)*0.072;
      const W=window.innerWidth; const H=window.innerHeight; const isMob=W<768;
      ctx.clearRect(0,0,W,H); t+=0.016; globeRot+=0.004;
      ctx.fillStyle="#07070f"; ctx.fillRect(0,0,W,H);

      const hGA=1-inv(p,0.20,0.42);
      if(hGA>0){const g=ctx.createRadialGradient(W*0.5,H*1.05,0,W*0.5,H*1.05,H*0.95);g.addColorStop(0,`rgba(60,10,155,${0.70*hGA})`);g.addColorStop(0.45,`rgba(35,6,100,${0.24*hGA})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
      const sGA=inv(p,0.38,0.52)*(1-inv(p,0.65,0.76));
      if(sGA>0){const g=ctx.createRadialGradient(W*0.5,H*0.75,0,W*0.5,H*0.75,H*0.65);g.addColorStop(0,`rgba(70,15,175,${0.50*sGA})`);g.addColorStop(0.45,`rgba(38,7,110,${0.14*sGA})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
      const cGA=inv(p,0.72,0.90);
      if(cGA>0){const g=ctx.createRadialGradient(W*0.5,H*1.08,0,W*0.5,H*1.08,H*0.95);g.addColorStop(0,`rgba(88,15,215,${0.78*cGA})`);g.addColorStop(0.42,`rgba(50,8,145,${0.32*cGA})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}

      for(const s of stars){const a=s.a*(0.4+0.6*Math.sin(t*s.sp*55+s.x*10));ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.fill();}

      const morph=ease(inv(p,0.25,0.52));
      const baseR=isMob?Math.min(W,H)*0.28:Math.min(W,H)*0.43;

      // Moon: button bottom + 50px gap, same all devices
      const btnEl=btnRef.current;
      const btnBottom=btnEl?btnEl.getBoundingClientRect().bottom:H*0.42;
      const hcx=W*0.5;
      const hcy=btnBottom+50+baseR;  // 50px gap then radius
      const hgr=baseR;

      // Services: wireframe sits right beside heading (top-right)
      const headEl = headingRef.current;
      const headRect = headEl ? headEl.getBoundingClientRect() : null;
      const sgr = baseR * (isMob ? 0.42 : 0.50);
      const scx = isMob ? W * 0.82 : W * 0.77;
      // center Y = middle of heading element
      const scy = headRect
        ? headRect.top + headRect.height * 0.5
        : (isMob ? H * 0.14 : H * 0.28);

      // Contact: globe left — closer to form
      const ccx=isMob?W*0.22:W*0.35-90;
      const ccy=isMob?H*0.43:H*0.48;
      const cgr=baseR*(isMob?0.62:0.66);

      let gcx:number,gcy:number,gr:number;
      if(p<0.28){gcx=hcx;gcy=hcy;gr=hgr;}
      else if(p<0.52){const e=ease(inv(p,0.28,0.52));gcx=lerp(hcx,scx,e);gcy=lerp(hcy,scy,e);gr=lerp(hgr,sgr,e);}
      else if(p<0.68){gcx=scx;gcy=scy;gr=sgr;}
      else if(p<0.84){const e=ease(inv(p,0.68,0.84));gcx=lerp(scx,ccx,e);gcy=lerp(scy,ccy,e);gr=lerp(sgr,cgr,e);}
      else{gcx=ccx;gcy=ccy;gr=cgr;}

      drawPlanet(gcx,gcy,gr,1-morph);
      drawGlobe(gcx,gcy,gr,morph);

      // Rocket: smaller height, right of moon
      const rA=1-inv(p,0.22,0.38);
      if(rA>0.01){
        const rSz=gr*(isMob?0.32:0.30);  // smaller rocket
        drawRocket(ctx,gcx+gr*1.35,gcy-gr*0.10-50,rSz,rA,t);
      }

      const np:Phase=p<0.40?"hero":p<0.72?"services":"contact";
      setPhase(prev=>prev!==np?np:prev);
      rafRef.current=requestAnimationFrame(frame);
    };

    rafRef.current=requestAnimationFrame(frame);
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener("resize",resize);};
  },[]);

  return (
    <>
      <style>{`
        @keyframes flyFromLeft {
          from { opacity:0; transform: rotate(-8deg) translate(-180px, 60px); }
          to   { opacity:1; transform: rotate(-8deg) translate(0,0); }
        }
        @keyframes flyFromBottom {
          from { opacity:0; transform: rotate(1deg) translateY(200px); }
          to   { opacity:1; transform: rotate(1deg) translateY(0); }
        }
        @keyframes flyFromRight {
          from { opacity:0; transform: rotate(7deg) translate(180px, 60px); }
          to   { opacity:1; transform: rotate(7deg) translate(0,0); }
        }
        .ius-btn {
          border:1px solid rgba(255,255,255,0.26); border-radius:9999px;
          background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.90);
          cursor:pointer; font-family:inherit; letter-spacing:0.02em;
          transition:background 0.22s,border-color 0.22s;
        }
        .ius-btn:hover{background:rgba(255,255,255,0.11);border-color:rgba(255,255,255,0.45);}
        input:focus{border-color:rgba(110,65,220,0.80)!important;}
      `}</style>

      <div ref={wrapRef} style={{height:"420vh",background:"#07070f"}}>
        <div style={{position:"sticky",top:0,width:"100%",height:"100vh",overflow:"hidden"}}>
          <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}}/>

          {/* Navbar */}
          <nav style={{
            position:"absolute",top:0,left:0,right:0,zIndex:50,
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:mob?"16px 20px":"24px 48px",
          }}>
            <span style={{fontSize:mob?"15px":"17px",fontWeight:700,letterSpacing:"0.08em",color:"#fff"}}>IUS</span>
            <button className="ius-btn" style={{padding:mob?"6px 14px":"8px 22px",fontSize:mob?"11px":"12px"}}>Consultation</button>
          </nav>

          {/* ══ HERO ══════════════════════════════════════════════════════════ */}
          <Section visible={phase==="hero"}>
            <div style={{
              position:"absolute", top:mob?"12%":"15%",
              left:0,right:0, textAlign:"center",
              padding:mob?"0 24px":"0 48px",
            }}>
              <p style={{fontSize:mob?"10px":"11px",color:"rgba(255,255,255,0.40)",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:mob?"8px":"12px"}}>
                Digital Legal Services
              </p>
              <h1 style={{
                fontSize:mob?"clamp(26px,7.5vw,36px)":"clamp(32px,5vw,62px)",
                fontWeight:300,letterSpacing:"-0.03em",lineHeight:1.08,color:"#fff",
                marginBottom:mob?"12px":"16px",
              }}>Digital Law<br/>on your side</h1>
              <p style={{
                fontSize:mob?"12px":"14px",color:"rgba(255,255,255,0.44)",lineHeight:1.80,
                maxWidth:mob?"280px":"420px",margin:`0 auto ${mob?"18px":"26px"}`,
              }}>
                Obtaining IT benefits, business support,<br/>
                program registration &amp; complex contracts
              </p>
              <button ref={btnRef} className="ius-btn" style={{padding:mob?"8px 22px":"10px 28px",fontSize:mob?"12px":"13px"}}>
                Get services
              </button>
            </div>
          </Section>

          {/* ══ SERVICES ══════════════════════════════════════════════════════ */}
          <Section visible={phase==="services"}>
            <div style={{
              position:"absolute",inset:0,
              display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"flex-start",
              padding:mob?"150px 14px 0":"80px 48px 0",
            }}>
              {/* Heading — on mobile sits right side leaves space for wireframe top-right */}
              <div style={{width:"100%",maxWidth:"860px",textAlign:"center",marginBottom:mob?"20px":"20px"}}>
                <h2 ref={headingRef} style={{
                  fontSize:mob?"clamp(15px,4vw,20px)":"clamp(24px,3.4vw,42px)",
                  fontWeight:300,lineHeight:1.22,color:"#fff",
                  letterSpacing:"-0.02em",marginBottom:mob?"6px":"10px",
                  textAlign:"center",
                }}>
                  Legal support for IT:<br/>protecting your business in the digital sphere
                </h2>
                <p style={{
                  fontSize:mob?"12px":"15px",
                  color:"rgba(255,255,255,0.42)",lineHeight:1.70,
                  maxWidth:mob?"300px":"480px",
                  margin:"0 auto",
                  textAlign:"center",
                }}>
                  We account for the specifics of IT companies and help clients minimize risks and avoid legal problems.
                </p>
              </div>

              {/* ── Cards ── */}
              <div key={cardsKey} style={{
                position:"relative",
                width:"100%",maxWidth:"860px",
                height:mob?"148px":"252px",
                overflow:"visible",
              }}>
                {/* Purple glow behind cards */}
                <div style={{
                  position:"absolute",
                  top:"20%",left:"10%",right:"10%",bottom:"-10%",
                  background:"radial-gradient(ellipse at center, rgba(90,20,200,0.45) 0%, rgba(55,10,140,0.20) 50%, rgba(0,0,0,0) 80%)",
                  zIndex:0,pointerEvents:"none",
                  filter:"blur(18px)",
                }}/>

                {/* Card 1 — violet glow from RIGHT side */}
                <div style={{
                  position:"absolute",bottom:0,left:mob?"0%":"0%",
                  width:mob?"44%":"37%",height:mob?"128px":"232px",zIndex:1,
                  opacity:0,
                  animation:`flyFromLeft 0.65s cubic-bezier(.22,.68,0,1.2) 0ms forwards`,
                }}>
                  <div style={{
                    width:"100%",height:"100%",
                    borderRadius:mob?"13px":"20px",
                    padding:mob?"10px 11px 12px":"20px 20px 22px",
                    display:"flex",flexDirection:"column",justifyContent:"space-between",
                    background:"linear-gradient(270deg, rgba(100,30,220,0.70) 0%, rgba(60,15,160,0.40) 40%, rgba(8,4,24,0.95) 100%)",
                    border:"1px solid rgba(90,40,200,0.30)",
                    backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
                    boxShadow:"4px 0 30px rgba(90,20,200,0.25)",
                  }}>
                    <button className="ius-btn" style={{padding:mob?"3px 8px":"5px 13px",fontSize:mob?"8px":"11px",alignSelf:"flex-start"}}>Learn more</button>
                    <div>
                      <h3 style={{fontSize:mob?"10.5px":"16px",fontWeight:500,color:"#fff",lineHeight:1.25,marginBottom:mob?"3px":"7px"}}>Clear and automated documentation</h3>
                      <p style={{fontSize:mob?"8px":"11px",color:"rgba(255,255,255,0.36)",lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:mob?2:3,WebkitBoxOrient:"vertical",overflow:"hidden"} as React.CSSProperties}>
                        You do not have to understand terminology — structured documents are ready for you
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 — violet glow from TOP-LEFT corner */}
                <div style={{
                  position:"absolute",bottom:0,left:mob?"28%":"31.5%",
                  width:mob?"44%":"37%",height:mob?"128px":"232px",zIndex:3,
                  opacity:0,
                  animation:`flyFromBottom 0.65s cubic-bezier(.22,.68,0,1.2) 110ms forwards`,
                }}>
                  <div style={{
                    width:"100%",height:"100%",
                    borderRadius:mob?"13px":"20px",
                    padding:mob?"10px 11px 12px":"20px 20px 22px",
                    display:"flex",flexDirection:"column",justifyContent:"space-between",
                    background:"linear-gradient(135deg, rgba(110,35,240,0.80) 0%, rgba(70,20,180,0.55) 30%, rgba(8,4,28,0.95) 70%, rgba(8,4,24,0.98) 100%)",
                    border:"1px solid rgba(110,55,230,0.50)",
                    backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
                    boxShadow:"-6px -6px 28px rgba(100,30,230,0.35)",
                  }}>
                    <button className="ius-btn" style={{padding:mob?"3px 8px":"5px 13px",fontSize:mob?"8px":"11px",alignSelf:"flex-start"}}>Learn more</button>
                    <div>
                      <h3 style={{fontSize:mob?"10.5px":"16px",fontWeight:500,color:"#fff",lineHeight:1.25,marginBottom:mob?"3px":"7px"}}>Guaranteed answer to your question</h3>
                      <p style={{fontSize:mob?"8px":"11px",color:"rgba(255,255,255,0.36)",lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:mob?2:3,WebkitBoxOrient:"vertical",overflow:"hidden"} as React.CSSProperties}>
                        No need to search for solutions — our clients have expert answers available instantly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 — violet glow from BOTTOM-LEFT corner */}
                <div style={{
                  position:"absolute",bottom:0,left:mob?"56%":"63%",
                  width:mob?"44%":"37%",height:mob?"128px":"232px",zIndex:2,
                  opacity:0,
                  animation:`flyFromRight 0.65s cubic-bezier(.22,.68,0,1.2) 220ms forwards`,
                }}>
                  <div style={{
                    width:"100%",height:"100%",
                    borderRadius:mob?"13px":"20px",
                    padding:mob?"10px 11px 12px":"20px 20px 22px",
                    display:"flex",flexDirection:"column",justifyContent:"space-between",
                    background:"linear-gradient(315deg, rgba(8,4,24,0.98) 0%, rgba(8,4,24,0.95) 40%, rgba(80,20,190,0.55) 70%, rgba(100,30,230,0.75) 100%)",
                    border:"1px solid rgba(80,35,190,0.35)",
                    backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
                    boxShadow:"6px -6px 28px rgba(90,20,210,0.30)",
                  }}>
                    <button className="ius-btn" style={{padding:mob?"3px 8px":"5px 13px",fontSize:mob?"8px":"11px",alignSelf:"flex-start"}}>Learn more</button>
                    <div>
                      <h3 style={{fontSize:mob?"10.5px":"16px",fontWeight:500,color:"#fff",lineHeight:1.25,marginBottom:mob?"3px":"7px"}}>Making profitable decisions</h3>
                      <p style={{fontSize:mob?"8px":"11px",color:"rgba(255,255,255,0.36)",lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:mob?2:3,WebkitBoxOrient:"vertical",overflow:"hidden"} as React.CSSProperties}>
                        Never miss an opportunity to save money, gain benefits and make the right legal choice.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Section>

          {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
          <Section visible={phase==="contact"}>
            <div style={{
              position:"absolute",inset:0,
              display:"flex",alignItems:mob?"flex-start":"center",justifyContent:"flex-end",
              padding:mob?"78px 20px 24px":"60px 60px 60px 60px",
            }}>
              <div style={{width:mob?"100%":"50%",maxWidth:mob?"100%":"460px"}}>
                <p style={{fontSize:mob?"9.5px":"11px",color:"rgba(255,255,255,0.36)",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:mob?"8px":"12px",textAlign:mob?"center":"left"}}>Get in touch</p>
                <h2 style={{
                  fontSize:mob?"clamp(16px,4.5vw,22px)":"clamp(20px,2.6vw,32px)",
                  fontWeight:300,color:"#fff",lineHeight:1.28,
                  letterSpacing:"-0.02em",marginBottom:mob?"16px":"28px",
                  textAlign:mob?"center":"left",
                }}>
                  Your Partner in Law:<br/>
                  Reliable Legal Support<br/>
                  for Your Business
                </h2>
                <div style={{display:"flex",flexDirection:"column",gap:mob?"8px":"12px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:mob?"6px":"10px"}}>
                    <Field label="Name" placeholder="Your name" mob={mob}/>
                    <Field label="Surname" placeholder="Your surname" mob={mob}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:mob?"6px":"10px"}}>
                    <Field label="E-mail" placeholder="hello@example.com" type="email" mob={mob}/>
                    <div>
                      <Lbl mob={mob}>Phone</Lbl>
                      <div style={{display:"flex",gap:"4px"}}>
                        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"8px",padding:mob?"5px 6px":"8px 9px",display:"flex",alignItems:"center",gap:"3px",cursor:"pointer",flexShrink:0}}>
                          <span style={{fontSize:mob?"11px":"13px"}}>🇺🇦</span>
                          <span style={{color:"rgba(255,255,255,0.28)",fontSize:"8px"}}>▾</span>
                        </div>
                        <input type="tel" placeholder="+380" style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"8px",padding:mob?"5px 8px":"8px 11px",color:"#fff",fontSize:mob?"11px":"12px",outline:"none",transition:"border-color 0.2s"}}
                          onFocus={e=>e.target.style.borderColor="rgba(110,65,220,0.80)"}
                          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.10)"}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}} onClick={()=>setAgreed(a=>!a)}>
                    <div style={{width:mob?"13px":"15px",height:mob?"13px":"15px",borderRadius:"4px",flexShrink:0,border:agreed?"1px solid rgba(110,65,220,0.80)":"1px solid rgba(255,255,255,0.28)",background:agreed?"rgba(90,40,210,0.85)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s"}}>
                      {agreed&&<span style={{color:"#fff",fontSize:mob?"8px":"9px",lineHeight:1}}>✓</span>}
                    </div>
                    <span style={{fontSize:mob?"10px":"11px",color:"rgba(255,255,255,0.38)",lineHeight:1.4}}>
                      I agree to the <span style={{color:"rgba(140,100,250,0.95)"}}>Privacy Policy</span>
                    </span>
                  </div>
                  <button style={{
                    width:"100%",padding:mob?"10px":"13px",
                    background:"linear-gradient(135deg,#5a28b8 0%,#3e18a0 100%)",
                    border:"1px solid rgba(120,70,240,0.40)",borderRadius:"9px",color:"#fff",
                    fontSize:mob?"12px":"13px",fontWeight:500,cursor:"pointer",
                    letterSpacing:"0.03em",transition:"opacity 0.2s,transform 0.15s",fontFamily:"inherit",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.opacity="0.88";e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}
                  >Send Request</button>
                </div>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}

function Section({visible,children}:{visible:boolean;children:React.ReactNode}){
  return(
    <div style={{position:"absolute",inset:0,zIndex:10,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"opacity 0.50s cubic-bezier(.4,0,.2,1),transform 0.50s cubic-bezier(.4,0,.2,1)",pointerEvents:visible?"auto":"none"}}>
      {children}
    </div>
  );
}

function Lbl({children,mob}:{children:React.ReactNode;mob:boolean}){
  return <label style={{display:"block",fontSize:mob?"9.5px":"11px",color:"rgba(255,255,255,0.40)",marginBottom:mob?"3px":"5px",letterSpacing:"0.03em"}}>{children}</label>;
}

function Field({label,placeholder,type="text",mob}:{label:string;placeholder:string;type?:string;mob:boolean}){
  return(
    <div>
      <Lbl mob={mob}>{label}</Lbl>
      <input type={type} placeholder={placeholder} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:"8px",padding:mob?"5px 9px":"9px 12px",color:"#fff",fontSize:mob?"11px":"12px",outline:"none",transition:"border-color 0.2s",fontFamily:"inherit"}}
        onFocus={e=>e.target.style.borderColor="rgba(110,65,220,0.80)"}
        onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.10)"}
      />
    </div>
  );
}
