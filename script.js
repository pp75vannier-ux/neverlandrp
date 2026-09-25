const burger=document.querySelector('.burger'), links=document.querySelector('.navlinks');
burger.addEventListener('click',()=>links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const sections=[...document.querySelectorAll('section[id]')], navs=[...document.querySelectorAll('.navlinks a')];
window.addEventListener('scroll',()=>{
  let cur='accueil';
  sections.forEach(s=>{ if(scrollY>=s.offsetTop-140) cur=s.id; });
  navs.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
});