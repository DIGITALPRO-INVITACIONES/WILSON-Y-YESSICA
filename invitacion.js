'use strict';
const byId = id => document.getElementById(id);
const music = byId('music');
const musicButton = byId('music-button');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let opening = false;
function musicState() {
  const playing = !music.paused;
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  musicButton.innerHTML = playing ? 'Ⅱ <span>Pausar</span>' : '♫ <span>Música</span>';
}
music.addEventListener('play', musicState);
music.addEventListener('pause', musicState);
musicButton.addEventListener('click', () => { if (music.paused) music.play().catch(() => { musicButton.title = 'Toca para volver a intentar reproducir la música'; }); else music.pause(); });
byId('open').addEventListener('click', () => {
  if (opening) return;
  opening = true;
  byId('open').disabled = true;
  music.volume = .65;
  music.play().catch(musicState);
  byId('cover').classList.add('opening');
  setTimeout(() => {
    byId('cover').hidden = true;
    byId('invitation').hidden = false;
    musicButton.hidden = false;
    window.scrollTo(0, 0);
    const heading = document.querySelector('.hero h2');
    heading.tabIndex = -1; heading.focus({preventScroll:true});
    if (!reduced.matches) startPetals();
    revealSections();
  }, reduced.matches ? 0 : 1200);
});
function startPetals() {
  for (let i=0;i<18;i++) {
    const petal=document.createElement('i');
    petal.style.cssText=`left:${Math.random()*100}%;animation-duration:${10+Math.random()*12}s;animation-delay:${-Math.random()*20}s;--drift:${Math.round(Math.random()*140-70)}px;--size:${8+Math.random()*8}px`;
    byId('petals').appendChild(petal);
  }
}
function revealSections() {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .08});
  document.querySelectorAll('.blessing > :not(.floral-divider), .date-section > :not(.floral-divider), .moments > h2, .event, .sponsor-grid > div, .love-note, .rsvp > h2').forEach(element => {
    element.classList.add('scroll-reveal');
    observer.observe(element);
  });
}
document.addEventListener('visibilitychange',()=>{ byId('petals').classList.toggle('paused',document.hidden); });
reduced.addEventListener('change',()=>{ byId('petals').replaceChildren(); if (!reduced.matches && opening) startPetals(); });
// December 2026 begins on Tuesday; Monday is the first column.
byId('calendar-days').appendChild(document.createElement('span'));
for (let day=1;day<=31;day++) {
  const cell=document.createElement('span');cell.textContent=day;
  if(day===19){cell.className='wedding-day';cell.setAttribute('aria-label','19 de diciembre, nuestra boda');}
  byId('calendar-days').appendChild(cell);
}
const date = new Date(window.BODA.fecha).getTime();
function updateCountdown(){
  const remaining=Math.max(0,Math.floor((date-Date.now())/1000));
  const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>byId(id).textContent=String(values[i]).padStart(2,'0'));
  if(!remaining) byId('count-label').textContent='¡Llegó el día de celebrar nuestro amor!';
}
updateCountdown();setInterval(updateCountdown,1000);
if(window.BODA.formulario && /^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/.test(window.BODA.formulario)) {
  byId('rsvp-link').href=window.BODA.formulario;byId('rsvp-link').hidden=false;byId('rsvp-pending').hidden=true;
}
