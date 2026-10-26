// Panel 5: Generate 12 avatars in a perfect circle
(function(){
  const ring = document.getElementById('p5ring');
  if (!ring) return;
  const cx=120, cy=118, r=98;
  const images=['assets/people/spinner/s1.png',
  'assets/people/spinner/s2.png',
  'assets/people/spinner/s3.png',
  'assets/people/spinner/s4.png',
  'assets/people/spinner/s5.png',
  'assets/people/spinner/s6.png',
  'assets/people/spinner/s7.png',
  'assets/people/spinner/s8.png',
  'assets/people/spinner/s9.png',
  'assets/people/spinner/s10.png',
  'assets/people/spinner/s11.png',
  'assets/people/spinner/s12.png',
  ];
  for(let i=0;i<12;i++){
    const angle=(i*30-90)*Math.PI/180;
    const x=cx+r*Math.cos(angle)-20;
    const y=cy+r*Math.sin(angle)-20;
    const rot=i*30;
    const d=document.createElement('div');
    d.className='p5-av';
    d.style.cssText=`left:${x}px;top:${y}px;transform:rotate(${rot}deg);background:url(${images[i]});`;
    ring.appendChild(d);
  }
})();

// Panel 3: static layered pill positions
(function(){
  const el=document.getElementById('panel3');
  if(!el)return;
  const pA=el.querySelector('[data-pill="a"]');
  const pB=el.querySelector('[data-pill="b"]');
  const pC=el.querySelector('[data-pill="c"]');
  if(!pA||!pB||!pC)return;
  const P={
    front:{top:69,w:288,h:56,z:5,ts:1},
    mid:{top:100,w:246,h:42,z:4,ts:.855},
    back:{top:118,w:204,h:38,z:3,ts:.708}
  };
  function set(p,v){
    p.style.top=v.top+'px';p.style.width=v.w+'px';
    p.style.height=v.h+'px';p.style.zIndex=v.z;
    const txt=p.querySelector('.p3-pill-text');
    if(txt)txt.style.transform='scale('+v.ts+')';
    const ico=p.querySelector('.p3-pill-icon');
    if(ico)ico.style.transform='scale('+v.ts+')';
  }
  set(pA,P.front);set(pB,P.mid);set(pC,P.back);
})();
