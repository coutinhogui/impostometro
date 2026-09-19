import {validateEvents,filterEvents,calculateIR,validateRules,safeSource} from './core.js';
const $ = id => document.getElementById(id);
const brl = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const date = value => value.split('-').reverse().join('/');
const el = (tag,text,className) => { const n=document.createElement(tag); if(text) n.textContent=text; if(className)n.className=className; return n; };
let events=[], topic='', rules=null, visibleCount=12;
const theme=$('theme');
let dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
try { const saved=localStorage.getItem('theme'); if(saved) dark=saved==='dark'; } catch {}
function paintTheme(){document.body.classList.toggle('dark',dark);theme.textContent=dark?'Tema claro':'Tema escuro';theme.setAttribute('aria-label',dark?'Ativar tema claro':'Ativar tema escuro');theme.setAttribute('aria-pressed',String(dark));}
paintTheme();theme.onclick=()=>{dark=!dark;paintTheme();try{localStorage.setItem('theme',dark?'dark':'light');}catch{}};
function state(){return {q:$('q').value,topic,sphere:$('sphere').value,status:$('status').value,order:$('order').value,year:$('year').value};}
function readURL(){const p=new URLSearchParams(location.search);$('q').value=p.get('q')||'';topic=p.get('topic')||'';for(const k of ['sphere','status','order','year']){const v=p.get(k)|| (k==='order'?'desc':'');$(k).value=[...$(k).options].some(o=>o.value===v)?v:(k==='order'?'desc':'');}if(!events.some(e=>e.topic===topic))topic='';$('advanced').open=!!($('sphere').value||$('status').value||$('year').value||$('order').value==='asc');}
function syncURL(){const u=new URL(location.href);u.search='';for(const [k,v] of Object.entries(state()))if(v && !(k==='order'&&v==='desc'))u.searchParams.set(k,v);history.replaceState(null,'',u);}
function paragraph(label,value){const p=el('p');p.append(el('strong',label+' '),document.createTextNode(value));return p;}
function card(e){const c=el('article',null,'card');c.id=e.id;
 const badges=el('div');badges.append(el('span',e.legalStatus,'badge'),el('span',e.impact,'badge'));c.append(badges);
 const h=el('h3'),a=el('a',e.title);a.href='#'+e.id;h.append(a);c.append(h,el('p',e.summary));
 if(e.legalStatus!=='Marco histórico'){const comparison=el('div',null,'comparison');for(const [label,text] of [['ANTES',e.before],['DEPOIS',e.after]]){const d=el('div');d.append(el('strong',label),el('p',text));comparison.append(d);}c.append(comparison);}c.append(paragraph('Para quem:',e.affected),paragraph('Quando:',e.dateNote),el('p',e.spheres.join(' · ')+' · '+e.instrument,'meta'));
 const detail=el('details'),summary=el('summary','Fontes, limites e conferência');detail.append(summary,paragraph('Limites:',e.limitation));const ul=el('ul');
 for(const s of e.sources){if(!safeSource(s.url))continue;const li=el('li'),link=el('a',s.title+' ↗');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';li.append(link,el('p','Trecho consultado: '+s.section,'small'));ul.append(li);}detail.append(ul,el('p','Conferido em '+date(e.reviewedAt)+'. '+e.reviewMethod,'small'));const permalink=el('a','Link deste registro');permalink.href='?registro='+encodeURIComponent(e.id)+'#'+e.id;detail.append(permalink);c.append(detail);return c;}
function render(updateURL=true,keepPage=false){
 if(!keepPage)visibleCount=12;
 for(const b of $('topics').children)b.setAttribute('aria-pressed',String(b.dataset.topic===topic));
 const filtered=filterEvents(events,state()),out=$('timeline');out.replaceChildren();
 $('more').hidden=filtered.length<=visibleCount;
 $('result-status').textContent='Exibindo '+Math.min(visibleCount,filtered.length)+' de '+filtered.length+' registro(s) nesta seleção • '+($('order').value==='asc'?'mais antigos primeiro':'mais recentes primeiro');
 if(!filtered.length){const box=el('div',null,'empty');box.append(el('h3','Nenhum registro nesta seleção'),el('p','Isso não significa que não exista uma regra sobre o assunto. Nossa cobertura ainda é limitada.'));const b=el('button','Limpar filtros');b.onclick=reset;box.append(b);out.append(box);}
 let lastYear,grid;
 for(const e of filtered.slice(0,visibleCount)){if(e.year!==lastYear){const group=el('details',null,'year');group.open=true;group.append(el('summary',String(e.year)));grid=el('div',null,'cards');group.append(grid);out.append(group);lastYear=e.year;}grid.append(card(e));}
 if(updateURL)syncURL();
}
function reset(){for(const k of ['q','sphere','status','year'])$(k).value='';$('order').value='desc';topic='';render();}
$('more').onclick=()=>{visibleCount+=12;render(false,true);};
$('filters').onsubmit=e=>e.preventDefault();$('q').oninput=()=>render();for(const k of ['sphere','status','order','year'])$(k).onchange=()=>render();$('reset').onclick=reset;
window.addEventListener('popstate',()=>{readURL();render(false);});
async function loadEvents(){
 $('retry').hidden=true;$('result-status').textContent='Carregando informações…';$('timeline').replaceChildren();
 try{const r=await fetch('data/events.json');if(!r.ok)throw Error();const data=await r.json();events=validateEvents(data);
 $('year').replaceChildren(new Option('Todos os anos',''));for(const year of [...new Set(events.map(e=>e.year))].sort((a,b)=>b-a))$('year').add(new Option(String(year),String(year))); $('coverage').textContent=events.length+' registros conferidos • Revisão: '+date(data.reviewedAt)+' • '+data.coverage;
 $('topics').replaceChildren();for(const value of ['',...new Set(events.map(e=>e.topic))]){const b=el('button',value||'Todos os assuntos');b.type='button';b.dataset.topic=value;b.onclick=()=>{topic=value;render();};$('topics').append(b);}readURL();render(false);
 const id=new URLSearchParams(location.search).get('registro')||location.hash.slice(1);if(events.some(e=>e.id===id)){for(const k of ['q','sphere','status','year'])$(k).value='';topic='';const position=filterEvents(events,state()).findIndex(e=>e.id===id);visibleCount=Math.ceil((position+1)/12)*12;render(false,true);$(id)?.scrollIntoView();}
 }catch{events=[];$('coverage').textContent='Cobertura indisponível no momento.';$('result-status').textContent='Não foi possível carregar a seleção conferida. Tente novamente.';$('retry').hidden=false;}
}
$('retry').onclick=loadEvents;
function parseAmount(text){if(!/^\d+(?:[,.]\d{1,2})?$/.test(text.trim()))throw Error('Use valores como 6000,00, sem separadores de milhar.');return Number(text.trim().replace(',','.'));}
$('ir-form').onsubmit=e=>{e.preventDefault();const out=$('ir-result');out.replaceChildren();try{
 if(!rules)throw Error('A tabela oficial não está disponível para esta simulação.');
 const income=parseAmount($('income').value),deductions=parseAmount($('deductions').value);const result=calculateIR(income,deductions,rules);const box=el('div',null,'result');box.append(el('p','IR mensal estimado • 2026','eyebrow'),el('div',brl(result.tax),'result-total'),el('p',result.effectiveRate.toFixed(2).replace('.',',')+'% dos rendimentos informados.','small'));const dl=el('dl');
 for(const [label,value] of [['Dedução utilizada',brl(result.deduction)],['Base de cálculo',brl(result.base)],['Alíquota da faixa',(result.rate*100).toFixed(1).replace('.',',')+'%'],['Imposto antes da redução',brl(result.beforeReduction)],['Redução de 2026',brl(result.reduction)]])dl.append(el('dt',label),el('dd',value));box.append(dl,el('p',result.method+'. Estimativa limitada à situação descrita acima.','small'));out.append(box);
 }catch(error){out.append(el('p',error.message,'error'));}};
for(const k of ['income','deductions'])$(k).oninput=()=>$('ir-result').replaceChildren();
async function loadRules(){try{const r=await fetch('data/ir-2026.json');if(!r.ok)throw Error();rules=validateRules(await r.json());$('calculate').disabled=false;$('rules-date').textContent='Tabela conferida em '+date(rules.reviewedAt)+'.';}catch{$('rules-date').textContent='Simulação indisponível: não foi possível validar a tabela. Recarregue a página para tentar novamente.';}}
loadEvents();loadRules();
