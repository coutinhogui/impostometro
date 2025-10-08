
(function(){
  const q = document.getElementById('q');
  const nivel = document.getElementById('nivel');
  const statusSel = document.getElementById('status');
  const decada = document.getElementById('decada');
  const timeline = document.getElementById('timeline');
  const stats = document.getElementById('stats');

  const minYear = 1950;
  const maxYear = window.CURRENT_YEAR || new Date().getFullYear();
  for(let y = Math.floor(minYear/10)*10; y <= maxYear; y += 10){
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = y + 's';
    decada.appendChild(opt);
  }

  function matchFilters(item){
    const term = (q.value || '').trim().toLowerCase();
    const nivelV = nivel.value;
    const statusV = statusSel.value;
    const decadaV = decada.value;

    const textBlob = (item.nome + ' ' + (item.descricao||'') + ' ' + (item.fundamento_legal||'') + ' ' + (item.observacoes||'')).toLowerCase();
    if(term && !textBlob.includes(term)) return false;
    if(nivelV && item.nivel !== nivelV) return false;
    if(statusV){
      const s = (item.status||'').toLowerCase();
      const needle = statusV.toLowerCase();
      if(!s.includes(needle)) return false;
    }
    if(decadaV){
      const start = parseInt(decadaV, 10);
      const end = start + 9;
      const year = item.ano_criacao || (item.date_criacao ? Number(item.date_criacao.slice(0,4)) : 0);
      if(!(year >= start && year <= end)) return false;
    }
    return true;
  }

  function groupByDecade(items){
    const groups = {};
    items.forEach(item => {
      const year = item.ano_criacao || (item.date_criacao ? Number(item.date_criacao.slice(0,4)) : 0);
      const d = Math.floor(year / 10) * 10;
      if(!groups[d]) groups[d] = [];
      groups[d].push(item);
    });
    return Object.entries(groups)
      .sort((a,b)=> Number(a[0]) - Number(b[0]))
      .map(([d, arr]) => [Number(d), arr.sort((x,y)=> {
        const dx = x.date_criacao || (x.ano_criacao + '-01-01');
        const dy = y.date_criacao || (y.ano_criacao + '-01-01');
        return dx.localeCompare(dy) || x.nome.localeCompare(y.nome);
      })]);
  }

  function render(){
    const filtered = (window.TRIBUTOS || []).filter(matchFilters);
    const groups = groupByDecade(filtered);
    timeline.innerHTML = "";
    if(groups.length === 0){
      timeline.innerHTML = '<p class="meta">Nada encontrado. Ajuste os filtros.</p>';
    } else {
      for(const [dec, items] of groups){
        const g = document.createElement('section');
        g.className = 'group';
        g.innerHTML = '<div class="decade">' + dec + 's</div>';
        const list = document.createElement('div');
        list.className = 'items';
        for(const it of items){
          const when = it.date_criacao ? it.date_criacao : (it.ano_criacao ? `${it.ano_criacao}` : '');
          const badgeTipo = it.tipo ? `<span class="badge ${it.tipo === 'aumento' ? 'up' : (it.tipo === 'reducao' ? 'down' : 'new')}">${it.tipo === 'aumento' ? 'Aumento (🔺)' : (it.tipo === 'reducao' ? 'Redução (🔻)' : 'Nova taxa (🆕)')}</span>` : '';
          const card = document.createElement('article');
          card.className = 'card';
          card.innerHTML = `
            <div class="row">
              <span class="name">${it.nome}</span>
              <span class="badge">${it.nivel}</span>
              ${badgeTipo}
              <span class="badge ${it.status && it.status.toLowerCase().includes('vigente') ? 'ok' : 'warn'}">${it.status || ''}</span>
              <span class="meta">${when}</span>
            </div>
            <div class="desc">${it.descricao || ''}</div>
            ${it.fundamento_legal ? `<div class="legal"><strong>Fundamento:</strong> ${it.fundamento_legal}</div>` : ''}
            ${it.fonte_url ? `<div class="legal"><a href="${it.fonte_url}" target="_blank" rel="noopener">Saiba mais</a></div>` : ''}
          `;
          list.appendChild(card);
        }
        g.appendChild(list);
        timeline.appendChild(g);
      }
    }

    const total = (window.TRIBUTOS || []).length;
    const shown = filtered.length;
    const extintos = filtered.filter(x => (x.status||'').toLowerCase().includes('extinto')).length;
    const vigentes  = filtered.filter(x => (x.status||'').toLowerCase().includes('vigente')).length;
    stats.innerHTML = `Exibindo <strong>${shown}</strong> de ${total} itens • Vigentes: <strong>${vigentes}</strong> • Extintos/temporários: <strong>${extintos}</strong>`;
  }

  q.addEventListener('input', render);
  nivel.addEventListener('change', render);
  statusSel.addEventListener('change', render);
  decada.addEventListener('change', render);

  render();
})();
