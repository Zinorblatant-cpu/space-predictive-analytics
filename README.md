# 🛸 Space Predictive Analytics
### Global Solution 2026.1 — Cross-Platform Application Development | FIAP

```
 ___  ____   __    ___  ____     __   __ _   __   __    _  _  ____  __  ___  ____
/ __)(  _ \ / _\  / __)(  __)   / _\ (  ( \ / _\ (  )  ( \/ )(_  _)(  )/ __)/ ___)
\__ \ ) __//    \( (__  ) _)   /    \/    //    \/ (_/\ )  /   )(   )(( (__ \___ \
(___/(__)  \_/\_/ \___)(____)  \_/\_/\_)__)\_/\_/\____/(__/   (__) (__)\___)(____/
```

> Plataforma inteligente de análise preditiva para monitoramento de sistemas espaciais e operações orbitais simuladas.

---

## Descrição

**Space Predictive Analytics** é um aplicativo mobile desenvolvido com React Native + Expo que simula o monitoramento em tempo real de uma missão orbital. A solução coleta, organiza e processa dados baseados no dataset C-MAPSS NASA (FD001), apresentando dashboards analíticos de sensores, energia e comunicação, com geração automática de alertas críticos, notificações push e rastreamento da ISS via API externa — aproximando os estudantes das plataformas utilizadas em operações aeroespaciais modernas.

---

## Equipe

| Nome | RM |
|------|----|
| Leonardo Lopes Oliveira | RM565437 |
| Felipe Krzyzanovski dos Santos Menezes | RM564878 |
| Lucas Ferrari Lima | RM 563119|


---

## Telas do Aplicativo

### Login — Acesso à Missão
![Login](<./img/WhatsApp Image 2026-06-09 at 3.04.52 PM.jpeg>)
Tela de autenticação com validação de e-mail e senha, persistência via AsyncStorage.

### Cadastro — Novo Astronauta
![Cadastro](<./img/WhatsApp Image 2026-06-09 at 3.04.51 PM.jpeg>)
Formulário com validação de nome, e-mail e senha com confirmação.

### Home — Dashboard Principal
![Home](<./img/WhatsApp Image 2026-06-09 at 3.29.44 PM.jpeg>)
Status geral da missão, posição ao vivo da ISS e cards de visão geral dos sistemas.

### Dashboard de Sensores
![Sensores](<./img/WhatsApp Image 2026-06-09 at 3.29.44 PM(1).jpeg>)
Gráficos de linha em tempo real simulado com histórico de temperatura, pressão, vibração e umidade derivados do dataset C-MAPSS.

### Dashboard de Energia
![Energia](<./img/WhatsApp Image 2026-06-09 at 3.29.44 PM(2).jpeg>)
Indicadores gauge de bateria, saída solar e eficiência. Histórico de consumo e saúde orbital (RUL).

### Dashboard de Comunicação
![Comunicação](<./img/WhatsApp Image 2026-06-09 at 3.29.45 PM(1).jpeg>)
Status do link de telemetria, latência e qualidade do sinal. Posição ao vivo da ISS via Open Notify API.

### Alertas
![Alertas](<./img/WhatsApp Image 2026-06-09 at 3.29.45 PM(2).jpeg>)
Lista de alertas ativos gerados automaticamente com filtro por severidade (crítico / atenção), counters e acknowledge.

### Configurações
![Configurações 1](<./img/WhatsApp Image 2026-06-09 at 3.29.44 PM(3).jpeg>)
![Configurações 2](<./img/WhatsApp Image 2026-06-09 at 3.29.45 PM.jpeg>)
Formulário de configuração com validação completa: nome da missão, intervalo de atualização, notificações e limiares de alerta ajustáveis por tipo.

---

## Funcionalidades

- [x] Tela de Login com validação e persistência via AsyncStorage
- [x] Tela de Cadastro com validação de todos os campos (nome, email, RM, senha)
- [x] Animação da Terra com 3 satélites em órbita usando Animated API + react-native-svg
- [x] Dashboard de Sensores — temperatura, pressão, vibração, umidade (C-MAPSS)
- [x] Dashboard de Energia — bateria, solar, consumo, eficiência com gauges
- [x] Dashboard de Comunicação — sinal, latência, taxa de dados, qualidade do link
- [x] Integração com NASA / Open Notify API — posição ao vivo da ISS
- [x] Sistema de alertas automáticos baseados em limiares configuráveis
- [x] Notificações push via `expo-notifications` para alertas críticos
- [x] Context API para estado global da missão e alertas
- [x] AsyncStorage para persistência de usuários, configurações e histórico de alertas
- [x] Navegação com Expo Router (Stack + Tabs)
- [x] Formulário de configuração de limiares com validação e feedback de erro
- [x] TypeScript em todo o projeto — tipagem estrita
- [x] Dark Mode — tema espacial completo
- [x] Dados simulados com base no dataset C-MAPSS NASA FD001
- [x] Testes unitários e de integração (TDD) com Jest + Testing Library

---

## Tecnologias

- **React Native** + **Expo** ~52
- **Expo Router** v4 — navegação Stack + Tabs
- **AsyncStorage** — persistência local
- **Context API** — estado global (Auth, Mission, Alerts)
- **TypeScript** — tipagem estrita em todo o projeto
- **react-native-svg** — animação da Terra e gráficos personalizados
- **expo-notifications** — notificações push de alertas críticos
- **expo-linear-gradient** — gradientes visuais
- **Open Notify API** — rastreamento ao vivo da ISS
- **NASA C-MAPSS FD001** — dataset de base para simulação
- **Jest** + **Testing Library** — testes TDD
- **Expo Reanimated** — animações fluidas

---

## Como Executar

### Pré-requisitos
- Node.js ≥ 18 instalado
- `npm install -g expo-cli` ou usar `npx`
- Expo Go instalado no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Zinorblatant-cpu/space-predictive-analytics

# Acesse a pasta do projeto
cd space-predictive-analytics

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go para rodar no dispositivo físico.

Para rodar no navegador:
```bash
npx expo start --web
```

### Executar testes

```bash
# Todos os testes
npm test

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## Estrutura do Projeto

```
space-predictive-analytics/
├── app/                          # Expo Router — telas
│   ├── _layout.tsx               # Root layout + providers
│   ├── settings.tsx              # Tela de configurações (modal)
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/                   # Navegação por abas
│       ├── index.tsx             # Home — Terra + visão geral
│       ├── sensors.tsx           # Dashboard sensores
│       ├── energy.tsx            # Dashboard energia
│       ├── communication.tsx     # Dashboard comunicação + ISS
│       └── alerts.tsx            # Lista de alertas
├── components/
│   ├── earth/EarthAnimation.tsx  # Animação da Terra com satélites
│   ├── charts/                   # Gráficos SVG personalizados
│   ├── cards/                    # MetricCard, AlertCard, StatusCard
│   └── common/                   # Header, LoadingSpinner
├── context/                      # AuthContext, MissionContext, AlertContext
├── hooks/                        # useSimulatedData, useNotifications
├── services/                     # storage, dataSimulator, alertEngine, nasaApi
├── types/index.ts                # Tipagens TypeScript
├── constants/                    # colors, thresholds, sampleData (C-MAPSS)
└── __tests__/                    # Testes TDD (serviços, componentes, contextos)
```

---

## Dataset

Os dados simulados são derivados do **C-MAPSS NASA FD001** (Commercial Modular Aero-Propulsion System Simulation). Foram extraídas 20 linhas do subconjunto `orbital_test.csv` e mapeadas para métricas de missão espacial:

| Sensor C-MAPSS | Métrica Exibida |
|---|---|
| sensor_2 (641–644) | Temperatura (18–78°C) |
| sensor_3 (1570–1605) | Pressão (1.0–1.5 atm) |
| sensor_4 (1399–1424) | Vibração (0.8–4.5 m/s²) |
| sensor_7 (552–555) | Saída Solar (45–98%) |
| sensor_9 (9031–9073) | Altitude (398–412 km) |
| sensor_11 (47–48) | Qualidade do Sinal (25–92%) |
| RUL (28–168) | Saúde Orbital / RUL (10–100%) |

---

## Vídeo de Demonstração

[Clique aqui para assistir à demonstração](https://youtube.com/shorts/7sBYi53GMIY?feature=share)

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos — FIAP 2026.

---

