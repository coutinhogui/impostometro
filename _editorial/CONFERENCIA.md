# Conferência documental — 19/09/2026

Conferência realizada pelo assistente por leitura das páginas indicadas, sem parecer de especialista independente. O selo `verified` significa apenas que a afirmação limitada publicada foi comparada ao documento listado. Não certifica toda a legislação correlata nem elimina a possibilidade de correção.

## Evidência de correção

- `criacao-ir-1922`: artigo 31 e assinatura da [Lei 4.625/1922 na Câmara](https://www2.camara.leg.br/legin/fed/lei/1920-1929/lei-4625-31-dezembro-1922-566495-republicacao-90061-pl.html). Substitui a atribuição incorreta a Epitácio Pessoa por Arthur Bernardes. Não reutiliza as alíquotas históricas.
- `transparencia-nota-2012`: artigos 1º e 2º da [Lei 12.741/2012](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12741.htm). Corrige agrupamento em 2011 e explicita aproximação dos valores.
- `simplificacao-2023`: artigos 1º e 2º da [LC 199/2023](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp199.htm). O assunto é simplificação de obrigações acessórias, não incentivos da Zona Franca.
- Alegação sobre unificação do ISS na Lei 15.234/2025: contradita pelo [texto da lei federal](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15234.htm), que trata de alteração penal no ECA. O número de eventual lei municipal não foi inferido.

## Novas informações e simulação

- `ir-mensal-2026`: [tabela oficial de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), seções de incidência mensal e redução. Fórmula comparada com os [exemplos 3 e 4](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/exemplos-de-aplicacao-da-lei-15-270-2025). Parâmetros numéricos separados em JSON. Não estender a outras hipóteses sem revisão.
- `reforma-teste-2026`: seção Transição da [explicação oficial da Receita](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda). O link antigo de orientações de 2026 redirecionou para login nesta sessão; não foi utilizado para a evidência nova. Nenhuma projeção de preço final foi feita.

## Destinação integral da base antiga

Os 131 objetos originais foram preservados sem alteração. Cada posição tem um registro em `revisao-legado.json`. Os 22 objetos idênticos excedentes têm referência ao primeiro exemplar. Os itens ainda pendentes não foram declarados falsos: apenas não atingiram o critério de evidência desta edição. A seleção pública não é uma validação retroativa da base antiga.

## Verificação técnica

Testes: esquema e evidências obrigatórias, bloqueio de pendentes, duplicação, URLs seguras, busca sem acentos, ordenação, exemplos de IR, limites de faixas e dados de entrada inválidos. Inspeção da interface em 390 × 844 e 1440 × 1000, temas claro/escuro, filtros, resultado vazio, persistência da pesquisa na URL e link individual. Sem erros de console observados. Esses testes não substituem revisão jurídica.

## Ampliação da seleção: 82 marcos

Foram acrescentadas 77 fichas, documentadas individualmente em `conferencia-ampliacao.json`. A leitura abrange os dispositivos citados, não certifica todas as disposições da norma nem toda sua jurisprudência. Textos compilados foram usados com atenção às marcações de alteração; as fichas históricas não apresentam as alíquotas originais como atuais. Os resumos foram reescritos, não aprovados em lote a partir das descrições legadas.

Correções adicionais: Lei 10.684 é de 2003; Lei 13.137 é de 2015; LC 160 é de 2017; Fistel não foi criado pela LGT de 1997; a LC 192/2022 disciplina monofasia do ICMS. LC 199/2023 não trata de incentivo da Zona Franca. A suposta notícia de tributação de remessas foi substituída pelo art. 32 da Lei 14.902/2024, com limite explícito de aplicação histórica. As mudanças de 2025/2026 acrescentadas se restringem ao objeto documentado, sem inventar alíquotas ou efeitos sobre preços.

Cobertura: seleção de normas nacionais/federais e marcos constitucionais; não há inventário completo de legislação estadual, distrital e municipal. Permanecem pendentes 43 itens da base antiga. Não apresentar a contagem como número de impostos, de aumentos ou como carga tributária.

Publicação: utilizar o Pages existente a partir de `main`, com exclusões explícitas em `_config.yml`. O fluxo separado de publicação proposto antes foi removido para não disputar a publicação com o fluxo já configurado. O arquivo editorial permanece acessível no repositório para auditoria, mas não no site.

Validação desta ampliação: 10 testes automatizados passaram; paginação 12→24, filtro de ano 2024 (3 resultados), busca sem acento (1 resultado), link de 1922 fora do primeiro bloco e exemplo de IR de R$ 382,88 conferidos no navegador. Em 390 × 844, largura de conteúdo igual à janela, sem transbordamento horizontal; nenhum erro de console observado.
