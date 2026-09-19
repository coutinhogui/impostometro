# Impostômetro

Portal estático de informação tributária com seleção documental conferida, busca acessível, fontes, limites e simulação de IR mensal de 2026. Nenhuma dependência de produção ou CDN.

## Verdade e cobertura

A seleção inicial contém cinco registros, não toda a história tributária. Conferência documental assistida por IA em 19/09/2026, sem revisão independente de especialista. Cada registro identifica fonte, seção consultada, data, público e limites. A data não implica atualização automática.

A base anterior (131 registros, 22 repetições exatas) está preservada em `_editorial/base-legada-nao-validada.json`. O arquivo `revisao-legado.json` dá destino a cada entrada: pendente, duplicada, contradita ou substituída. Não reutilize esses textos como fatos. Apenas três marcos foram reescritos e dois registros de 2026 adicionados; os demais aguardam conferência.

## Desenvolvimento e publicação

Requisitos: Node 22+ e Python 3. Não precisa instalar pacotes.

```
node --test
python3 scripts/build.py
python3 -m http.server 8000 --directory dist
```

Abra http://localhost:8000. Para um Node fora do PATH, defina `NODE_BINARY` para o caminho do executável antes de executar o build.

Publique **somente `dist/`**. O build valida os dados e testes e copia uma lista explícita de arquivos públicos; `_editorial` não é incluído. As páginas antigas redirecionam para a consulta atual. O histórico original continua no Git.

O workflow `check.yml` gera um artefato de prévia em cada PR. `pages.yml` publica `dist` somente na main; no GitHub, configure Pages com origem GitHub Actions antes da primeira publicação por esse fluxo. Abrir PR não publica a alteração.

## Revisão de conteúdo

1. Ler a fonte primária atualizada, não apenas resultados de busca.
2. Conferir cada afirmação, alcance territorial, período e situação. Não inventar informação ausente.
3. Registrar fonte HTTPS, seção e data; separar história, transição e aplicação.
4. Registrar a correção no histórico e no destino do item legado, quando houver.
5. Submeter à revisão editorial. A validação automática detecta problemas estruturais, não comprova verdade jurídica.
6. Executar os testes e conferir a interface em celular, desktop e teclado antes de publicar.

Fontes oficiais fora de gov.br/leg.br exigem ajuste consciente da política de URLs e nova revisão. Não usar domínios genéricos para contornar a validação.

## Simulação

A fórmula e os parâmetros ficam separados em `assets/core.js` e `data/ir-2026.json`. A estimativa cobre apenas rendimentos tributáveis sujeitos à tabela mensal de uma fonte pagadora. Não calcula INSS, declaração anual, várias fontes, 13º ou investimentos. Compara deduções legais fornecidas com desconto simplificado, calcula pela tabela e aplica a redução. Não coleta nem persiste valores; não coloca renda na URL. Testes usam os exemplos 3 e 4 da Receita e fronteiras das faixas.

## Próximas ampliações

Revisar os registros pendentes com evidência individual; acrescentar território preciso para normas locais. Calculadoras de importação, consumo, contribuições e regimes específicos só devem entrar após verificação de regras e testes próprios. Não há estimativa nacional genérica nem publicação automática de texto gerado por IA.
