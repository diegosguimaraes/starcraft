# Roadmap de Desenvolvimento - StarCraft: Explorando o Universo

Este documento descreve as funcionalidades e melhorias planejadas para o jogo, divididas em tarefas menores para facilitar o desenvolvimento incremental.

## 1. Sistema de Combate Aprofundado

**Objetivo:** Implementar um sistema de combate tático para encontros com naves hostis, adicionando risco e recompensa à exploração.

*   **Fase 1: Fundamentos do Combate**
    *   1.1: [x] **Definir Atributos de Combate:**
        *   [x] Adicionar `attackPower`, `defenseRating` às `ShipStats` e `ShipModuleEffects`.
        *   [x] Definir tipos de dano (ex: energia, cinético) e resistências.
    *   1.2: [x] **Mecânica de Turnos Simples (ou Tempo Real com Pausa):**
        *   [x] Desenvolver lógica básica para iniciativa e ordem de ação.
        *   [x] Criar estrutura para ações de combate (ex: Atirar, Defender, Usar Módulo Especial).
    *   1.3: [x] **Interface de Combate (Modal/View):**
        *   [x] Criar `CombatView.tsx`.
        *   [x] Exibir naves envolvidas (jogador e inimigo).
        *   [x] Mostrar status básicos (casco, escudos).
        *   [x] Adicionar botões para ações de combate.
*   **Fase 2: Armas e Módulos de Combate**
    *  2.1: [x] **Tipos de Armas:**
        *   [x] Implementar diferentes tipos de armas (lasers, mísseis, canhões cinéticos) como `ShipModule`.
        *   [x] Associar tipos de dano e eficácia contra escudos/casco.
    *  2.2: [x] **Módulos Defensivos e Utilitários:**
        *   [x] Expandir módulos de escudo com diferentes resistências/capacidades.
        *   [x] Criar módulos de reparo de combate ou buffs.
    *  2.3: [x] **Integração com Cálculo de Dano:**
        *   [x] Lógica para calcular acerto (ex: baseado em `attackPower` vs `defenseRating` + aleatoriedade).
        *   [x] Lógica para aplicar dano a escudos e depois ao casco.
*   **Fase 3: IA Inimiga e Recompensas**
    *  3.1: [x] **IA Inimiga Básica:**
        *   [x] Lógica para inimigos escolherem alvos e usarem armas/habilidades.
        *   [x] Definir comportamentos simples (agressivo, defensivo).
    *  3.2: [x] **Loot de Combate:**
        *   [x] Ao vencer, chance de dropar créditos, recursos ou módulos.
        *   [x] Adicionar lógica para gerar `loot` em `NPC` ou naves inimigas.
    *  3.3: [x] **Integração com Facções Piratas:**
        *   [x] Fazer encontros com "Sindicato K'Tharr (Piratas)" ativarem o combate.

## 2. Gerenciamento Avançado de Colônias

**Objetivo:** Tornar a colonização mais estratégica, recompensadora e com maior profundidade de gerenciamento.

*   **Fase 1: Novos Edifícios Coloniais**
    *   [x] **Definir Novos Tipos de Edifícios:**
        *   [x] `PlanetaryResearchLab`: Aumenta ganho de `researchPoints`.
        *   [x] `PlanetaryMine`: Aumenta extração de recursos específicos do planeta.
        *   [x] `PlanetaryShipyard`: Permite reparos ou construção de naves menores (escopo futuro).
        *   [x] `PlanetaryDefense`: Oferece proteção contra eventos hostis (escopo futuro).
    *   [x] **Interface para Construção:**
        *   [x] Atualizar `PlanetView.tsx` para permitir a construção desses edifícios.
        *   [x] Adicionar custos de construção (recursos, créditos).
    *   [x] **Efeitos Passivos dos Edifícios:**
        *   [x] Implementar a lógica para que os edifícios concedam seus bônus (ex: no `gameTick`).
*   **Fase 2: Eventos Coloniais (com LM Studio)**
    *   [x] **Sistema de Eventos:**
        *   [X] Criar `ColonyEvent` interface em `types.ts`.
        *   [X] Lógica no `gameTick` para acionar eventos aleatórios ou baseados em condições.
    *   [x] **Geração de Descrições de Eventos com LM Studio:**
        *   [x] Criar prompt para LM Studio gerar nome, descrição e possíveis resultados/escolhas para eventos (ex: "Boom de Recursos", "Falha de Equipamento", "Descoberta Científica Local").
        *   [x] Integrar `llmService.ts` para gerar esses eventos.
    *   [x] **Interface para Eventos Coloniais:**
        *   [x] Modal para exibir eventos e permitir que o jogador faça escolhas (se aplicável).
        *   [x] Aplicar efeitos dos eventos ao estado da colônia/jogador.
*   **Fase 3: Necessidades da População e Felicidade (Simplificado)**
    *   [x] **Consumo de Recursos Específicos:**
        *   [x] Adicionar `advancedConsumption: Record<string, number>` à interface `Planet` (para colônias de jogadores).
        *   [x] Definir que certos níveis populacionais ou edifícios demandam recursos específicos (ex: 'Bens de Consumo', 'Alimentos Processados').
    *   [x] **Moral/Felicidade (Simplificado):**
        *   [x] Adicionar `colonyMorale: number` (0-100) à `Planet`.
        *   [x] Moral afeta produtividade ou crescimento populacional.
        *   [x] Falta de recursos consumidos ou certos edifícios diminui a moral.

## 3. Pesquisa e Fabricação Expandidos

**Objetivo:** Adicionar profundidade à progressão tecnológica e à economia do jogo.

*   **Fase 1: Componentes de Fabricação**
    *   [ ] **Definir Componentes:**
        *   [ ] Adicionar `type: 'component'` à interface `Item`.
        *   [ ] Criar novos itens que são componentes (ex: "Circuitos Avançados", "Emissores de Campo").
    *   [ ] **Atualizar Receitas:**
        *   [ ] Modificar `craftingRecipe` de módulos e itens avançados para requerer componentes em vez de apenas recursos brutos.
        *   [ ] Componentes, por sua vez, têm suas próprias receitas de fabricação.
    *   [ ] **Atualizar Interface de Fabricação:**
        *   [ ] `CraftingView.tsx` deve mostrar receitas de componentes e itens finais.
*   **Fase 2: Engenharia Reversa de Artefatos**
    *   [ ] **Desbloqueio de Tecnologia/Receitas:**
        *   [ ] Modificar `handleAnalyzeArtifact` em `App.tsx`.
        *   [ ] Além de `researchPointsYield`, artefatos podem ter um `unlocksTechId?: string` ou `unlocksCraftingRecipeId?: string`.
        *   [ ] Ao analisar, adicionar a tecnologia à `playerState.unlockedTechs` ou o item à lista de `CRAFTABLE_ITEMS` (ou uma lista de receitas desbloqueadas).
    *   [ ] **Feedback Visual:**
        *   [ ] Notificação informando qual tecnologia ou receita foi desbloqueada.

## 4. Tripulação da Nave (Simplificado)

**Objetivo:** Adicionar outra camada de personalização da nave e progressão.

*   [ ] **Definir Tipos de Tripulantes:**
    *   [ ] Interface `CrewMember` em `types.ts` (id, name, role: 'Pilot' | 'Engineer' | 'TacticalOfficer', skillDescription, cost, passiveBonus: `Partial<ShipStats>`).
    *   [ ] Adicionar `playerState.hiredCrew: CrewMember[]`.
*   [ ] **Contratação em Estações:**
    *   [ ] Adicionar serviço 'crew_quarters' a algumas `SpaceStation`.
    *   [ ] Nova view/modal para contratar tripulação.
    *   [ ] Limitar número de tripulantes baseado no casco da nave (novo atributo `maxCrewSlots` em `ShipHull`).
*   [ ] **Aplicar Bônus Passivos:**
    *   [ ] Modificar `calculateShipStats` para incluir bônus da tripulação.

## 5. Mercado Negro e Contrabando

**Objetivo:** Criar um novo loop de risco/recompensa e interações econômicas.

*   [ ] **Itens de Contrabando:**
    *   [ ] Adicionar `isContraband?: boolean` à interface `Item` e `Resource`.
    *   [ ] Definir alguns itens/recursos como contrabando.
*   [ ] **Mercados Negros:**
    *   [ ] Estações Piratas (`ktharr_syndicate`) ou algumas estações independentes podem ter uma seção de "Mercado Negro".
    *   [ ] Preços de compra e venda de contrabando são voláteis e geralmente lucrativos.
*   [ ] **Risco de Detecção:**
    *   [ ] Ao viajar para sistemas de facções legalistas (ex: Terran Directorate, Hypatian Alliance) com contrabando, chance de ser escaneado.
    *   [ ] Se detectado: multa, perda de carga, perda de reputação. (Pode ser um evento simples por enquanto).

## 6. Melhorias Visuais e Animações (Baseado no Roteiro do Usuário)

**Objetivo:** Aumentar o apelo visual e a interatividade do jogo através de animações e efeitos gráficos.

*   **1. Comece Simples:**
    *   [ ] **`animate-pulse` nos Recursos:**
        *   [ ] Onde: Ícones de recursos em `InventoryView`, `ColonyMarketView`, `PlanetView` (produção da colônia), `CraftingView` (receitas).
        *   [ ] Impacto: Torna os recursos mais "vivos" e chama a atenção sutilmente.
    *   [ ] **`transition-all` (ou `transition-colors`) nos Botões:**
        *   [ ] Onde: Botões genéricos em modais, botões de ação nas views (ex: "Escanear Recursos", "Interagir com Colônia", "Comprar/Vender").
        *   [ ] Impacto: Suaviza as transições de estado (hover, active, focus), tornando a interação mais agradável e polida.
*   **2. Efeitos Visuais:**
    *   [ ] **Gradientes e Sombras Coloridas:**
        *   [ ] Adicionar gradientes sutis a cabeçalhos de modais, fundos de painéis importantes.
        *   [ ] Usar sombras coloridas para elementos ativos/selecionados (ex: sistemas no mapa, itens de inventário).
*   **3. Feedback Visual:**
    *   [ ] **Sistema de Notificações Animadas:**
        *   [ ] Melhorar estilo do contêiner da notificação (ícones, bordas coloridas).
        *   [ ] Considerar animações de entrada/saída diferenciadas por tipo de notificação.
*   **4. Movimento:**
    *   [ ] **Animações Baseadas em Estado para Objetos em Movimento:**
        *   [ ] Indicação visual de trajetória da nave no mapa da galáxia durante viagens.
        *   [ ] Elementos da UI que deslizam ou aparecem suavemente com mudanças de estado.
*   **5. Partículas:**
    *   [ ] **Campo de Estrelas Animado (`GalaxyView`):**
        *   [ ] Substituir o fundo estático por um campo de estrelas com partículas em movimento lento.
    *   [ ] **Efeitos de Explosão (Combate):**
        *   [ ] Animações de explosão para naves destruídas.
        *   [ ] Efeitos de partículas para tiros e impactos.
*   **6. Refinamento:**
    *   [x] **Animações de Entrada/Saída para Modais (`Modal.tsx`):** (Implementado em interação anterior)
        *   [x] Fade-in/scale-up ao aparecer, fade-out/scale-down ao desaparecer.
        *   [x] Backdrop com fade-in e efeito blur.
        *   [x] Fechar modal clicando no backdrop.
    *   [ ] **Hover Effects Avançados:**
        *   [ ] Itens interativos (planetas, itens em listas) com hover mais pronunciado (ex: leve scale-up, brilho na borda).
    *   [ ] **Transições Avançadas de View:**
        *   [ ] Animação de entrada sutil (fade-in, slide-in) para views quando se tornam ativas (pode requerer bibliotecas como Framer Motion se Tailwind UI não for suficiente).

## 7. Integração Aprimorada com LM Studio

*   **Lore Dinâmico para Artefatos:**
    *   [ ] Em `handleAnalyzeArtifact`, após a análise, chamar LM Studio para gerar uma pequena entrada de lore única para o artefato analisado (1-2 frases).
    *   [ ] Exibir essa lore na UI, talvez na descrição do item analisado ou numa notificação.
    *   **Prompt para LM Studio:** "Gere uma breve e misteriosa descrição de lore (1-2 frases) para um artefato alienígena recém-analisado chamado '[Nome do Artefato]'. Ele parece ter [descrição original do artefato]."
*   **Diálogos de NPCs Mais Reativos (Pós-MVP):**
    *   [ ] Enviar mais contexto do `playerState` (ex: nave atual, créditos, última missão completada) para `generateNpcDialogue`.
    *   [ ] Modificar prompt do LM Studio para que NPCs possam comentar sutilmente sobre esses aspectos.

## Backlog / Ideias Futuras

*   [ ] Níveis de Dificuldade.
*   [ ] Mais tipos de Missões (ex: assassinato, escolta, exploração de locais específicos).
*   [ ] Eventos Aleatórios no Espaço (além de anomalias).
*   [ ] Personalização Visual da Nave.
*   [ ] Mineração interativa de asteroides/planetas.
*   [ ] Narrativa principal ou arcos de história mais longos.

---

**Como Usar este Roadmap:**
1.  Escolha uma tarefa pequena de uma das seções.
2.  Implemente a funcionalidade correspondente.
3.  Marque a tarefa como concluída (`[x]`).
4.  Submeta as alterações para revisão e merge.
5.  Repita!
    
Priorize as funcionalidades que agregam mais valor ou que são pré-requisitos para outras.
A ordem das seções principais é uma sugestão, pode ser alterada conforme a necessidade.