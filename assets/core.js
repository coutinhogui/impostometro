export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function safeSource(url) {
  try { const u = new URL(url); return u.protocol === 'https:' && !u.username && !u.password && (u.hostname.endsWith('.gov.br') || u.hostname.endsWith('.leg.br')); } catch { return false; }
}
export function validateEvents(data) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.events) || !data.events.length) throw Error('Base indisponível');
  const ids = new Set();
  const legalStatuses = ['Em aplicação em 2026', 'Em transição', 'Marco histórico'];
  for (const e of data.events) {
    if (!/^[a-z0-9-]+$/.test(e.id) || ids.has(e.id) || e.verificationStatus !== 'verified' || !Number.isInteger(e.year)) throw Error('Registro não aprovado');
    ids.add(e.id);
    for (const key of ['title','topic','instrument','summary','before','after','affected','dateNote','limitation','reviewMethod','impact']) if (typeof e[key] !== 'string' || !e[key].trim()) throw Error(`Campo ausente: ${key}`);
    if (!legalStatuses.includes(e.legalStatus) || !Array.isArray(e.spheres) || !e.spheres.length || e.spheres.some(s => !['Federal','Estadual','Municipal'].includes(s))) throw Error('Classificação inválida');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.reviewedAt) || !e.sources?.length || e.sources.some(s => !safeSource(s.url) || !s.title || !s.section || s.accessedAt !== e.reviewedAt)) throw Error('Evidência ausente');
  }
  return data.events;
}
export function filterEvents(events, {q='', topic='', sphere='', status='', order='desc'}={}) {
  return events.filter(e => e.verificationStatus === 'verified' && (!topic || e.topic === topic) && (!sphere || e.spheres.includes(sphere)) && (!status || e.legalStatus === status) && normalize([e.title,e.summary,e.instrument,e.before,e.after,e.affected,e.topic].join(' ')).includes(normalize(q)))
    .sort((a,b) => (order === 'asc' ? a.year-b.year : b.year-a.year) || a.id.localeCompare(b.id));
}
export function validateRules(r) {
  if (r?.year !== 2026 || !r.sources?.length || r.sources.some(s=>!safeSource(s.url)) || r.brackets?.length !== 5 || !Number.isFinite(r.simplifiedDeduction)) throw Error('Regras inválidas');
  let previous = -1;
  r.brackets.forEach((b,i) => { if (!Number.isFinite(b.rate) || b.rate < 0 || b.rate > 1 || !Number.isFinite(b.deduction) || b.deduction < 0 || (i < 4 ? !Number.isFinite(b.upTo) || b.upTo <= previous : b.upTo !== null)) throw Error('Faixas inválidas'); previous=b.upTo; });
  if (!r.reduction || Object.values(r.reduction).some(v=>!Number.isFinite(v) || v<0) || r.reduction.zeroUntil >= r.reduction.partialUntil) throw Error('Redução inválida');
  return r;
}
const money = n => Math.round((n + Number.EPSILON) * 100) / 100;
export function calculateIR(income, legalDeductions, rules) {
  validateRules(rules);
  if (![income,legalDeductions].every(Number.isFinite) || income < 0 || legalDeductions < 0 || legalDeductions > income || income > 100000000) throw Error('Informe valores válidos; as deduções não podem superar os rendimentos.');
  const deduction = Math.max(legalDeductions, rules.simplifiedDeduction);
  const base = money(Math.max(0, income - deduction));
  const bracket = rules.brackets.find(b => b.upTo === null || base <= b.upTo);
  const beforeReduction = money(Math.max(0, base * bracket.rate - bracket.deduction));
  const r = rules.reduction;
  const reduction = money(Math.min(beforeReduction, income <= r.zeroUntil ? r.maxZeroReduction : income < r.partialUntil ? Math.max(0,r.intercept-r.slope*income) : 0));
  const tax = money(Math.max(0,beforeReduction-reduction));
  return {deduction,base,rate:bracket.rate,beforeReduction,reduction,tax,effectiveRate: income ? tax/income*100 : 0,method:legalDeductions > rules.simplifiedDeduction ? 'Deduções legais informadas' : 'Desconto simplificado mensal'};
}
