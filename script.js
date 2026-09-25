const burger=document.querySelector('.burger'), links=document.querySelector('.navlinks');
burger.addEventListener('click',()=>links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const sections=[...document.querySelectorAll('section[id]')], navs=[...document.querySelectorAll('.navlinks a')];
window.addEventListener('scroll',()=>{
  let cur='accueil';
  sections.forEach(s=>{ if(scrollY>=s.offsetTop-140) cur=s.id; });
  navs.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
});

// état du serveur FiveM, via la petite route proxy /api/status
async function loadServerStatus(){
  const dot=document.getElementById('status-dot');
  const text=document.getElementById('status-text');
  const online=document.getElementById('players-online');
  const max=document.getElementById('players-max');
  try{
    const res=await fetch('/api/status');
    const data=await res.json();
    if(data.online){
      dot.classList.remove('offline');
      text.textContent='Serveur en ligne';
      online.textContent=data.players ?? '—';
      max.textContent=data.maxPlayers ?? '—';
    } else {
      dot.classList.add('offline');
      text.textContent='Serveur hors ligne';
      online.textContent='—';
      max.textContent='—';
    }
  }catch(e){
    dot.classList.add('offline');
    text.textContent='Statut indisponible';
  }
}
loadServerStatus();
setInterval(loadServerStatus, 30000);
