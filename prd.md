# PRD - Moderno Saúde: Marketplace & Rede Social de Saúde
**Versão:** 1.1 (Multidisciplinar)
**Stack:** Next.js (App Router), Supabase (Auth/DB/Storage), Asaas (Pagamentos).

## 1. Visão Geral
O **Moderno Saúde** (modernosaude.com.br) é uma plataforma agnóstica de conexão entre pacientes e profissionais de saúde (Dentistas, Médicos, Psicólogos, Fisioterapeutas, etc.). O foco central é a descoberta baseada em confiança (Reviews e Perfil Social) e a facilidade de conversão via agendamento online imediato.

## 2. Pilares do Produto
*   **Descoberta:** SEO potente e busca semântica por especialidade/localização.
*   **Confiança:** Rede social interna onde profissionais postam conteúdo educativo e pacientes deixam reviews auditados.
*   **Agendamento:** Motor de reserva com trava de horários (Slot Locking) e autenticação simplificada (OTP).
*   **Ecossistema:** Integração com softwares de gestão (SaaS), começando pelo "Dentista Moderno".

## 3. Arquitetura de Telas e Funcionalidades

### 3.1. Home (O Portal Multidisciplinar)
*   **Busca Dinâmica:** Filtros por "O que você procura?" (Especialidade/Procedimento) e "Onde?" (Bairro/Cidade).
*   **Categorias Rápidas:** Atalhos visuais para Odontologia, Medicina, Psicologia, etc.
*   **Geolocalização IP:** Sugestão de profissionais no raio de ação do usuário.
*   **Destaques:** Algoritmo de relevância baseado em avaliações e velocidade de resposta.

### 3.2. Listagem de Resultados
*   **Cards de Conversão:** Foto, especialidade, nota, selo "Verificado" e próximo horário disponível.
*   **Mapa Interativo:** Pins com localização e preço (opcional) via Mapbox/Google Maps.
*   **Refino:** Ordenação por preço, avaliação ou distância.

### 3.3. Perfil do Profissional (A Vitrine Social)
*   **Feed Social:** Espaço para postagens (texto/imagem) – Dicas de saúde, novidades, etc.
*   **Reviews Auditados:** Sistema de nota 1-5 estrelas com fotos.
*   **Selo "Paciente Comprovado":** Exibido apenas se o agendamento foi via plataforma.
*   **Galeria e Especialidades:** Exibição do consultório e áreas de atuação.

### 3.4. Fluxo de Agendamento (Booking Engine)
*   **Slot Locking:** Trava de 10 minutos para evitar agendamentos duplos (concorrência).
*   **Auth OTP:** Login sem senha via WhatsApp ou E-mail (Magic Link).
*   **Confirmação Instantânea:** Disparo de webhooks para o profissional.

### 3.5. Áreas Administrativas
*   **Paciente:** Histórico de consultas, gestão de avaliações e carteira de check-ups.
*   **Profissional (Independente):** Gestão de agenda manual para quem não usa SaaS integrado, painel de leads e métricas de perfil.

## 4. Requisitos Técnicos & Banco de Dados
*   **Multi-tenancy:** RLS (Row Level Security) rigoroso no Supabase.
*   **Tabelas Core:**
    *   `profiles`: (ID, Tipo [Dentista/Medico/Psico/etc], Nome, Bio, Localização).
    *   `appointments`: (ID_Paciente, ID_Profissional, Data, Status, Origem).
    *   `availability_slots`: (Horários configurados).
    *   `reviews`: (Nota, Comentário, Foto, Verificado).
    *   `posts`: (Conteúdo social do profissional).

## 5. Monetização e Regras de Negócio
*   **SaaS Integration:** Integração nativa com o "Dentista Moderno" (Selo de Tecnologia).
*   **Assinaturas:** Modelo recorrente (Asaas) para visibilidade e agenda ativa.
*   **Políticas:** Bloqueio de agendamento para abusos (No-shows recorrentes).
