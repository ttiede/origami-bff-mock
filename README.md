# Origami BFF Mock -- Sandbox de Demonstracao

Servidor GraphQL mock que replica os 26 datasources do BFF utilizado pelo app **Origami Beneficios**. Estado mutavel em memoria com auto-reset, 12 usuarios de teste pre-configurados e cobertura completa de queries e mutations.

**URL Online:** https://origami-bff-mock.onrender.com

---

## Endpoints

| Endpoint   | Metodo     | Descricao                                       |
|------------|------------|--------------------------------------------------|
| `/`        | GET        | Landing page com documentacao e credenciais      |
| `/graphql` | POST / GET | GraphQL endpoint (Yoga GraphiQL incluso)         |
| `/health`  | GET        | Health check, uptime e proximo reset             |
| `/reset`   | GET        | Reseta estado para dados iniciais (seeds)        |
| `/status`  | GET        | Resumo do estado atual do sandbox (contadores)   |

---

## Credenciais de Teste

| # | Nome | CPF | Senha | Observacao |
|---|------|-----|-------|------------|
| 1 | Lucas Oliveira Silva | `611.512.751-31` | `Origami1` | Usuario principal, 8 carteiras, 3 cartoes |
| 2 | Maria Santos Ferreira | `722.533.250-31` | `Origami2!` | Gerente RH, 3 carteiras |
| 3 | Joao Pedro Costa | `853.107.850-43` | `Origami3!` | Analista Financeiro |
| 4 | Carlos Eduardo Mendes | `719.651.035-61` | *(null)* | Primeiro acesso |
| 5 | Ana Carolina Lima | `805.873.100-57` | `Origami5!` | 2 tentativas falhas |
| 6 | Roberto Almeida | `761.272.610-66` | `Origami6!` | Bloqueio definitivo |
| 7 | Fernanda Rocha Barbosa | `663.923.321-54` | `Origami7!` | Estagiaria, saldo baixo |
| 8 | Diego Nascimento Santos | `468.819.736-59` | `Origami8!` | Executivo, 7 carteiras, 4 cartoes |
| 9 | Patricia Vieira Duarte | `993.563.272-54` | `Origami9!` | Bloqueio temporario (4 tentativas) |
| 10 | Thiago Martins Ribeiro | `951.817.560-85` | *(null)* | Primeiro acesso |
| 11 | Juliana Campos Neto | `480.635.817-76` | `Origami11!` | Saldo quase zerado |
| 12 | Rafael Souza Pereira | `839.705.232-14` | `Origami12!` | Desligado, bloqueio definitivo |

> **Autenticacao:** O token de acesso segue o formato `origami-mock-{userId}`. Envie no header `Authorization: Bearer origami-mock-1` para atuar como o usuario 1.

---

## Operacoes GraphQL

### Queries (27)

| Dominio | Operacoes |
|---------|-----------|
| Auth | `findByCpf`, `sessions`, `securityActivity` |
| Wallets | `wallets`, `transactions`, `balancesByCategory`, `validatePixKey`, `nextDeposits`, `canPixCashOut`, `pixCashOutReceipt` |
| Cards | `cards`, `cardDelivery`, `revealCard` |
| Notifications | `notifications`, `notificationPreferences` |
| Partners | `partners`, `nearbyPartners`, `partner`, `favoritePartners` |
| Disputes | `disputes`, `reimbursements` |
| Balance Requests | `balanceRequests` |
| Approvals | `approvals`, `approvalsPendingCount` |
| KYC | `kycStatus` |
| Benefits | `externalBenefits`, `rewardsSummary` |
| Home | `productBanners`, `digitalWalletCards`, `faqs` |
| Expenses | `expenses`, `advances`, `expenseReports` |
| Vouchers | `availableVouchers`, `myVouchers` |
| Geofencing | `geofenceZones` |

### Mutations (45)

| Dominio | Operacoes |
|---------|-----------|
| Auth | `login`, `logout`, `forgotPassword`, `verifyOtp`, `resetPassword`, `updatePassword`, `validateCode`, `validateDeviceToken`, `terminateSession`, `setTransactionPin`, `validateTransactionPin`, `toggle2FA`, `verify2FACode`, `requestDataDeletion`, `validatePhone`, `recoverTransactionPin`, `updateTransactionPin` |
| Wallets | `pixTransfer`, `processQrPayment`, `payBoleto`, `mobileRecharge`, `reallocateBenefit`, `scheduleDeposit`, `updateWalletLimit`, `reclassifyTransaction`, `cashOut`, `pixCashOutPreview`, `executePixCashOut`, `statementExport` |
| Cards | `blockCard`, `unblockCard`, `createVirtualCard`, `activateCard`, `validateCardPin`, `changeCardPin`, `requestCardReplacement`, `toggleInternationalMode` |
| Notifications | `markNotificationRead`, `markAllNotificationsRead`, `updateNotificationPreferences` |
| Partners | `toggleFavoritePartner` |
| Disputes | `submitDispute`, `submitReimbursement` |
| Balance Requests | `createBalanceRequest`, `updateBalanceRequest` |
| Digital Wallet | `addToGooglePay`, `addToSamsungPay`, `removeFromDigitalWallet` |
| KYC | `validateCpfBigDataCorp`, `submitKycDocuments`, `submitCertifaceSelfie` |
| Approvals | `approveAction`, `rejectAction` |
| Expenses | `createExpense`, `deleteExpense`, `ocrReceipt` |
| Advances | `createAdvance` |
| Reports | `createExpenseReport`, `submitExpenseReport` |
| Vouchers | `buyVoucher`, `analyseVoucher` |
| Geofencing | `addGeofenceZone`, `removeGeofenceZone`, `toggleGeofenceZone` |
| Benefits | `activateBenefit` |
| Rewards | `redeemReward` |
| Feedback | `submitFeedback` |
| Flow Tokens | `startFlow`, `validateFlowToken` |

---

## Exemplos de Requisicao

### Login

```bash
curl -X POST https://origami-bff-mock.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(input: { cpf: \"61151275131\", senha: \"Origami1\" }) { accessToken refreshToken expiresIn } }"}'
```

### Listar carteiras

```bash
curl -X POST https://origami-bff-mock.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer origami-mock-1" \
  -d '{"query":"{ wallets { id nome tipo saldo limiteDisponivel } }"}'
```

### PIX Transfer

```bash
curl -X POST https://origami-bff-mock.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer origami-mock-1" \
  -d '{"query":"mutation { pixTransfer(input: { walletId: \"w1\", chavePix: \"email@test.com\", tipoChave: \"email\", valor: 50.00, descricao: \"Test\" }) { id valor status } }"}'
```

### Verificar status do sandbox

```bash
curl https://origami-bff-mock.onrender.com/status
```

### Resetar sandbox

```bash
curl https://origami-bff-mock.onrender.com/reset
```

---

## Auto-Reset

O sandbox e resetado automaticamente a cada **1 hora**. Isso significa que:

- Todas as mutacoes (transferencias, bloqueios, etc.) sao revertidas
- Os 12 usuarios voltam ao estado original
- Saldos, cartoes e notificacoes sao restaurados
- O contador de mutacoes e zerado

Para resetar manualmente a qualquer momento, acesse `GET /reset`.

---

## Dados Iniciais (Seeds)

O sandbox inicia com dados realistas pre-configurados:

- **12 usuarios** com perfis variados (executivo, estagiaria, desligado, bloqueado, etc.)
- **30 carteiras** de diferentes tipos (flexivel, refeicao, transporte, cultura, saude, educacao, home office)
- **15+ cartoes** fisicos e virtuais (Visa, Mastercard, Elo) com status variados
- **Transacoes** de debito e credito com categorias e merchants reais
- **Notificacoes** de diferentes tipos (pix, compra, beneficio, seguranca)
- **Aprovacoes** pendentes, aprovadas e rejeitadas
- **Disputas**, **reembolsos** e **solicitacoes de saldo**
- **Despesas**, **adiantamentos** e **relatorios**
- **Vouchers** disponiveis e comprados
- **Zonas de geofencing** configuradas
- **Cartoes em carteiras digitais** (Google Pay, Samsung Pay)
- **Parceiros** com categorias e filtros por beneficio

---

## Desenvolvimento Local

```bash
# Instalar dependencias
npm install

# Modo desenvolvimento (hot reload)
npm run dev

# Modo producao
npm start

# Servidor roda em http://localhost:8080
# GraphiQL disponivel em http://localhost:8080/graphql
```

Requisitos: **Node.js >= 20**

---

## Deploy

### Render.com (recomendado)

1. Push para GitHub
2. Render.com > New > Web Service
3. Root Directory: `backend/bff-mock`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Plan: Free

> Free tier: spin down apos 15 min de inatividade. Cold start de ~30s.

### Railway.app

1. Railway.app > New Project > Deploy from GitHub
2. Root Directory: `backend/bff-mock`
3. Variavel de ambiente: `PORT=8080`

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

```bash
docker build -t origami-bff-mock .
docker run -p 8080:8080 origami-bff-mock
```
