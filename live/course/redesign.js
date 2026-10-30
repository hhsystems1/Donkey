(function(){
'use strict';
var key='ride-smart-progress-v1',loaded=null;
try{loaded=JSON.parse(localStorage.getItem(key)||'null');}catch(e){}
if(loaded&&Array.isArray(loaded.done)&&loaded.done.length===6){done=loaded.done.map(function(v){return v===true;});if(Number.isInteger(loaded.current)&&loaded.current>=0&&loaded.current<6)current=loaded.current;}
var originalShow=showLesson,originalUpdate=updateProgress;
function persist(){try{localStorage.setItem(key,JSON.stringify({done:done.map(Boolean),current:current}));}catch(e){document.getElementById('savedStatus').textContent='Progress lasts for this visit';}}
function outlines(){var select=document.getElementById('chapterJump');select.replaceChildren(new Option('Choose a topic',''));lessons.forEach(function(l,i){l.id='lesson-'+(i+1);});lessons[current].querySelectorAll('h3').forEach(function(h,i){h.id='topic-'+current+'-'+i;select.add(new Option(h.textContent.replace(/Listen.*$/,'').trim(),h.id));});stops.forEach(function(b,i){b.setAttribute('aria-current',i===current?'step':'false');});}
function focusLesson(){var h=lessons[current].querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true});lessons[current].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
showLesson=function(i){if(typeof stopNarration==='function')stopNarration();if(typeof stopSpeak==='function')stopSpeak();originalShow(i);document.body.classList.remove('family-view');syncTabs();outlines();persist();focusLesson();};
updateProgress=function(){originalUpdate();persist();};
function syncTabs(){var family=document.body.classList.contains('family-view');document.getElementById('learnTab').setAttribute('aria-pressed',String(!family));document.getElementById('familyTab').setAttribute('aria-pressed',String(family));}
function family(target){if(typeof stopNarration==='function')stopNarration();if(typeof stopSpeak==='function')stopSpeak();document.body.classList.add('family-view');syncTabs();requestAnimationFrame(function(){var el=document.querySelector(target||'.family-intro');if(el)el.scrollIntoView({block:'start'});});}
document.getElementById('familyTab').addEventListener('click',function(){family();history.replaceState(null,'','#family-tools');});
document.getElementById('learnTab').addEventListener('click',function(){showLesson(current);history.replaceState(null,'','#lesson-'+(current+1));});
document.getElementById('chapterJump').addEventListener('change',function(){var el=document.getElementById(this.value);if(el){el.tabIndex=-1;el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'smooth'});}});
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(['#family-tools','#recall-tool','#kit-tool','#parents-laws'].includes(id)){e.preventDefault();family(id);history.replaceState(null,'',id);}});});
var stopButton=document.createElement('button');stopButton.type='button';stopButton.textContent='Stop audio';stopButton.addEventListener('click',function(){if(typeof stopNarration==='function')stopNarration();if(typeof stopSpeak==='function')stopSpeak();});document.querySelector('.audio-bar').appendChild(stopButton);
var note=document.createElement('p');note.className='course-status';note.textContent='Lesson progress saves here. Names, bike details and quiz answers are not saved.';document.querySelector('.progress-card').appendChild(note);
var hash=location.hash;var match=/^#lesson-([1-6])$/.exec(hash);if(match)current=Number(match[1])-1;
originalShow(current);outlines();updateProgress();
if(['#family-tools','#recall-tool','#kit-tool','#parents-laws'].includes(hash))family(hash);
var reset=document.createElement('button');reset.type='button';reset.className='reset-progress';reset.textContent='Reset saved progress';reset.style.cssText='margin-top:14px;border:0;background:transparent;color:var(--green);text-decoration:underline;font-size:12px;padding:8px 0';var armed=false;reset.addEventListener('click',function(){if(!armed){armed=true;reset.textContent='Tap again to reset all 6 lessons';return;}done=[false,false,false,false,false,false];showLesson(0);updateProgress();reset.textContent='Progress reset';armed=false;});document.querySelector('.progress-card').appendChild(reset);
})();
