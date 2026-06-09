# CLAUDE.md — Space Predictive Analytics

Contexto local para o Claude Code. **Não commitado no GitHub** (listado no .gitignore).

## Stack
- React Native + Expo SDK 54.0.8 (React 19.0.0, RN 0.79.0)
- TypeScript ~5.8 estrito
- Expo Router ~5.1 (Stack + Tabs)

## Comandos principais
```bash
npx expo start            # inicia o Metro Bundler
npx expo start --web      # abre no navegador
npm test                  # roda os testes (jest-expo)
npm run test:coverage     # coverage report
npx expo install --fix    # alinha versões de pacotes ao SDK atual (rodar após npm install)
```

## Estrutura de pastas
```
app/                    # Expo Router — telas
  _layout.tsx           # root layout (Stack + providers)
  (auth)/               # rotas não autenticadas
    _layout.tsx
    login.tsx
    register.tsx
  (tabs)/               # rotas autenticadas com bottom tabs
    _layout.tsx
    home.tsx
    sensors.tsx
    energy.tsx
    communication.tsx
    alerts.tsx
  settings.tsx          # modal de configurações (Stack.Screen)
components/
  cards/
    AlertCard.tsx
    MetricCard.tsx
  charts/
    LineChart.tsx       # gráfico SVG via react-native-svg
  common/
    Header.tsx
context/
  AuthContext.tsx       # usuário logado, persistido via AsyncStorage
  MissionContext.tsx    # dados simulados por setInterval (refreshInterval s)
  AlertContext.tsx      # depende do MissionContext; chama alertEngine a cada tick
hooks/                  # useSimulatedData, useNotifications
services/
  alertEngine.ts        # calcula alertas a partir de SensorData + thresholds
  dataSimulator.ts      # adiciona jitter aleatório às linhas do C-MAPSS
  nasaApi.ts            # fetchISSPosition — polling ISS Open Notify API
  storage.ts            # wrappers AsyncStorage tipados
types/
  index.ts              # todas as interfaces (SensorData, Alert, ISSPosition…)
constants/
  colors.ts             # paleta escura (primary, surface, border, text…)
  thresholds.ts         # valores default de alerta (editáveis via Settings)
  sampleData.ts         # 20 linhas normalizadas do dataset C-MAPSS FD001
__tests__/
  components/
    MetricCard.test.tsx
  context/
    AlertContext.test.tsx
    AuthContext.test.tsx
  services/
    alertEngine.test.ts
    dataSimulator.test.ts
    storage.test.ts
__mocks__/
  @expo/vector-icons.js
  expo-font.js
  expo-router.js
```

## Dados simulados
Dataset base: **C-MAPSS NASA FD001** (`../orbital_test.csv`).
20 linhas extraídas e normalizadas em `constants/sampleData.ts`.
`services/dataSimulator.ts` adiciona jitter aleatório a cada tick do MissionContext.

## Contextos e dependências
```
AuthContext   ← armazena usuário logado via AsyncStorage
MissionContext ← gera dados simulados por setInterval (refreshInterval segundos)
AlertContext  ← depende do MissionContext; chama alertEngine a cada tick
```

Ordem dos providers em `app/_layout.tsx`: `AuthContext > MissionContext > AlertContext`.

## Alertas
Limiares configuráveis via tela Settings (persistidos em AsyncStorage).
Defaults em `constants/thresholds.ts`.
Notificações push via `expo-notifications` apenas para `severity === 'critical'`.

## API externa
Open Notify ISS — `http://api.open-notify.org/iss-now.json`
Usada na Home e no Dashboard de Comunicação. Polling a cada 10–30s.
Timeout implementado via `AbortController` manual (5000ms) — **não** usar `AbortSignal.timeout()` que não é suportado em todas as versões do Hermes.

## Testes
- 5 suites, 28 testes (services, components, AuthContext)
- AlertContext.test.tsx ainda não implementado
- Mock do AsyncStorage: stateful (mantém estado entre chamadas no mesmo teste)
- Reanimated plugin desabilitado em teste via `babel.config.js` (NODE_ENV=test)
- `transformIgnorePatterns` inclui `react-native-svg` e `expo-router`

## Dependências que precisam de atenção
- `expo-notifications` — requer permissão no dispositivo físico; API de scheduling mudou entre SDK 52 e 54
- `@react-native-async-storage/async-storage 2.1.0` — API idêntica à v1/v2
- `react-native-svg 15.8.0` — importar componentes individualmente (`Svg`, `Polyline`, `Line`…)
- `@expo/vector-icons ^14.0.0` — ícones via `Ionicons`, `MaterialIcons` etc.

## Histórico de decisões técnicas
- **09/06/2026**: Downgrade de SDK 56 → SDK 54 para alinhamento com ambiente de entrega
- **09/06/2026**: `AbortSignal.timeout()` substituído por `AbortController` + `setTimeout` manual para compatibilidade com Hermes do RN 0.79.x

## Prazo
**09/06/2026 às 23h55** — entrega no portal FIAP.
