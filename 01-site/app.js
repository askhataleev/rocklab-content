'use strict';
const data = window.presentation;
const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; };
document.getElementById('intro').textContent = data.intro;
let count = 0;
const videos = [];
for (const [g, group] of data.groups.entries()) {
  const overview = make('a', 'direction-link'); overview.href = `#${group.id}`;
  overview.append(make('span','direction-number',`0${g+1}`),make('h3','',group.title),make('p','',group.description),make('span','arrow','↗'));
  document.getElementById('directions').append(overview);
  const section = make('section','group'); section.id = group.id;
  const groupHead = make('div','group-head'); groupHead.append(make('span','eyebrow',`Направление 0${g+1}`), make('h2','',group.title)); section.append(groupHead);
  for (const idea of data.ideas.filter(i=>i.group===group.id)) {
    const card = make('article','idea'); card.id = idea.id;
    const mediaColumn = make('div','media-column');
    const frame = make('div','video-frame');
    const player = make('video'); player.controls = true; player.playsInline = true; player.preload = 'none'; player.src = idea.videos[0].src; player.poster = idea.videos[0].poster; player.setAttribute('aria-label',`Референс: ${idea.title}`);
    player.addEventListener('play',()=>videos.forEach(v=>{if(v!==player)v.pause();})); videos.push(player);
    frame.append(player); mediaColumn.append(frame);
    const caption=make('div','media-caption'); caption.append(make('span','','Видеореференс'),make('a','','Открыть видео ↗')); caption.lastChild.href=idea.videos[0].src; caption.lastChild.target='_blank'; mediaColumn.append(caption);
    player.addEventListener('error',()=>{caption.firstChild.textContent='Откройте видео отдельным файлом';});
    if(idea.videos.length>1){
      const tabs=make('div','video-tabs');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Выбор референса');
      idea.videos.forEach((source,i)=>{const button=make('button',i===0?'selected':'',`Референс ${i+1}`);button.type='button';button.setAttribute('aria-pressed',String(i===0));button.addEventListener('click',()=>{player.pause();player.src=source.src;player.poster=source.poster;player.load();caption.lastChild.href=source.src;[...tabs.children].forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});});tabs.append(button);});mediaColumn.append(tabs);
    }
    const copy=make('div','idea-copy');const meta=make('div','idea-meta');meta.append(make('span','eyebrow',`Идея ${String(++count).padStart(2,'0')}`));if(idea.tag)meta.append(make('span','tag',idea.tag));copy.append(meta,make('h3','',idea.title));
    idea.paragraphs.forEach((text,i)=>copy.append(make('p',i===0?'main-text':'',text)));
    if(idea.dialogue)copy.append(make('blockquote','',idea.dialogue));
    for(const variant of idea.variants||[]){const details=make('details','variant');details.append(make('summary','',variant.title));variant.paragraphs.forEach(text=>details.append(make('p','',text)));copy.append(details);}
    card.append(mediaColumn,copy);section.append(card);
  }
  document.getElementById('ideas-list').append(section);
}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();});},{threshold:0.05});videos.forEach(v=>observer.observe(v));
