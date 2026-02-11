# Workflow de Desenvolvimento - Moderno Saúde (Multidisciplinar) 🏥🚀

Este documento serve como guia mestre para a construção da plataforma **Moderno Saúde**. O sistema é projetado para atender dentistas, médicos, psicólogos e outros profissionais.

---

## Fase 1: Fundação & Infraestrutura (Data & Auth)
**Objetivo:** Configurar o backend agnóstico e a base de autenticação.
- [ ] **Configuração Supabase:** Criar projeto e tabelas (`profiles`, `appointments`, `availability_slots`, `reviews`).
- [ ] **Mapeamento de Categorias:** Garantir que a tabela `profiles` suporte diferentes tipos de profissionais (dentista, médico, etc.).
- [ ] **Segurança (RLS):** Implementar Row Level Security para multi-tenancy.
- [ ] **Autenticação:** Configurar Auth com OTP (WhatsApp/Email) e Magic Links.

## Fase 2: Identidade & Perfis Sociais
**Objetivo:** Permitir que qualquer profissional de saúde tenha sua vitrine.
- [ ] **Onboarding Flexível:** Cadastro adaptativo conforme a especialidade (ex: CRM para médicos, CRO para dentistas).
- [ ] **Perfil Público (Multidisciplinar):** Visualização dinâmica de especialidades e galeria.
- [ ] **Feed Social:** Sistema de posts educativos (texto/imagem).
- [ ] **Área do Paciente:** Dashboard para gerenciar consultas em diferentes especialidades.

## Fase 3: Marketplace & Busca Semântica
**Objetivo:** Fazer o paciente encontrar o profissional certo em qualquer área.
- [ ] **Home Page:** Busca por "Tipo de Profissional" + "Especialidade" + "Local".
- [ ] **Geolocalização:** Sugestão baseada em proximidade.
- [ ] **Mapa Interativo:** Pins de localização para consultórios diversos.
- [ ] **Filtros de Especialidade:** Taxonomia dinâmica para filtrar médicos, psicólogos, etc.

## Fase 4: Booking Engine (Motor de Reservas)
**Objetivo:** Conversão universal de consultas.
- [ ] **Slot Locking:** Mecanismo de trava de 10min no Supabase.
- [ ] **Fluxo de Agendamento Universal:** Checkout unificado independente da especialidade.
- [ ] **Confirmação & Webhooks:** Notificações instantâneas para os profissionais.

## Fase 5: Dashboards de Gestão
**Objetivo:** Ferramentas para profissionais integrados e independentes.
- [ ] **Painel Administrativo Profissional:** Gestão manual de horários e leads.
- [ ] **Carteira do Paciente:** Histórico unificado (ex: consulta com dentista e consulta com médico).

## Fase 6: Confiança & Reviews (Prova Social)
**Objetivo:** Validar a qualidade multidisciplinar.
- [ ] **Avaliação Auditada:** Formulário pós-consulta com selo "Paciente Comprovado".
- [ ] **Moderação & Respostas:** Ferramenta para o profissional gerenciar sua reputação.

## Fase 7: Monetização & Ecossistema SaaS
**Objetivo:** Receita e integração técnica.
- [ ] **Integração Asaas:** Planos de assinatura recorrente.
- [ ] **SaaS Sync (Multi-SaaS):** 
    - Conexão nativa com "Dentista Moderno".
    - Preparação para integrações com prontuários médicos/psicologia.
- [ ] **Selos de Tecnologia:** Identificação de profissionais digitalizados.

## Fase 8: SEO, Notificações & Launch
- [ ] **SEO Vertical:** Landings específicas como `/psicologos/rio-de-janeiro`.
- [ ] **Notificações Automáticas:** WhatsApp/Email para lembretes e marketing.
- [ ] **Deploy & Lançamento:** Finalização na Vercel.
