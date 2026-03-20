export const typeDefs = /* GraphQL */ `

  # ─── Input types ────────────────────────────────────────────────────
  input LoginInput {
    cpf: String!
    password: String!
    deviceId: String
    deviceInfo: String
  }

  input ResetPasswordInput {
    resetTicket: String!
    newPassword: String!
  }

  input UpdatePasswordInput {
    cpf: String!
    currentPassword: String!
    newPassword: String!
  }

  input PixTransferInput {
    walletId: ID!
    chavePix: String!
    tipoChave: String!
    amount: Float!
    description: String
  }

  input QrPaymentInput {
    walletId: ID!
    qrData: String!
    amount: Float!
  }

  input BoletoPaymentInput {
    walletId: ID!
    barcode: String!
    amount: Float!
  }

  input MobileRechargeInput {
    walletId: ID!
    phone: String!
    operator: String!
    amount: Float!
  }

  input ReallocateBenefitInput {
    fromWalletId: ID!
    toWalletId: ID!
    amount: Float!
  }

  input ScheduleDepositInput {
    walletId: ID!
    scheduledDate: String!
    amount: Float!
  }

  input UpdateWalletLimitInput {
    walletId: ID!
    newLimit: Float!
  }

  input CashOutInput {
    walletId: ID!
    amount: Float!
    bankCode: String!
    agency: String!
    accountNumber: String!
    accountType: String!
    ownerName: String!
    ownerCpf: String!
  }

  input PixCashOutPreviewInput {
    walletId: ID!
    chavePix: String!
    tipoChave: String!
    amount: Float!
  }

  input PixCashOutInput {
    walletId: ID!
    chavePix: String!
    tipoChave: String!
    amount: Float!
    description: String
  }

  input ExportStatementInput {
    walletId: ID!
    format: String!
    inicio: String
    fim: String
  }

  input ReclassifyTransactionInput {
    transactionId: ID!
    newCategory: String!
  }

  input CreateBalanceRequestInput {
    walletId: ID!
    amount: Float!
    justificativa: String
  }

  input UpdateBalanceRequestInput {
    requestId: ID!
    status: String!
    rejectionReason: String
  }

  input KycDocumentInput {
    cpf: String!
    documentFrontBase64: String!
    documentBackBase64: String
  }

  input CreateExpenseInput {
    description: String!
    amount: Float!
    date: String!
    category: String!
    receiptUrl: String
    lat: Float
    lng: Float
    merchant: String
  }

  input CreateAdvanceInput {
    amount: Float!
    reason: String!
  }

  input CreateReportInput {
    title: String!
    period: String!
    expenseIds: [ID!]!
  }

  input BuyVoucherInput {
    voucherId: ID!
    walletId: ID!
  }

  input GeoZoneInput {
    id: ID!
    name: String!
    description: String
    latitude: Float!
    longitude: Float!
    radiusMeters: Float!
    isActive: Boolean
    partnerId: String
    type: String
  }

  type NotificationPreferences {
    pushEnabled: Boolean!
    emailEnabled: Boolean!
    smsEnabled: Boolean!
  }
  input NotificationPreferencesInput {
    pushEnabled: Boolean!
    emailEnabled: Boolean!
    smsEnabled: Boolean!
  }

  # ─── Queries ────────────────────────────────────────────────────────
  type Query {
    # Auth
    findByCpf(cpf: String!): AuthUser
    sessions: [AuthSession!]!
    securityActivity: [SecurityEvent!]!

    # Wallet
    wallets: [Wallet!]!
    transactions(walletId: ID, dateFrom: String, dateTo: String, categoria: String, direcao: String, search: String, limit: Int, offset: Int): [Transaction!]!
    balancesByCategory: [CategoryBalance!]!
    validatePixKey(chavePix: String!, tipoChave: String!): PixKeyInfo
    nextDeposits(walletId: ID): [NextDeposit!]!
    canPixCashOut(walletId: ID!): Boolean!
    pixCashOutReceipt(transactionId: ID!): Transaction

    # Cards
    cards: [BenefitCard!]!
    cardDelivery(id: ID!): CardDelivery
    revealCard(id: ID!): CardSensitiveData

    # Notifications
    notifications: [AppNotification!]!
    notificationPreferences: NotificationPreferences!

    # Partners
    partners(category: String, benefit: String, search: String): [Partner!]!
    nearbyPartners(lat: Float!, lng: Float!, radiusKm: Float): [Partner!]!
    partner(id: ID!): Partner
    favoritePartners: [Partner!]!

    # Disputes & Reimbursements
    disputes: [Dispute!]!
    reimbursements: [Reimbursement!]!

    # Balance Requests
    balanceRequests(walletId: ID): [BalanceRequest!]!

    # KYC
    kycStatus: KycResult

    # Approvals
    approvals(status: String): [Approval!]!
    approvalsPendingCount: Int!

    # External Benefits
    externalBenefits: [ExternalBenefit!]!
    explainBenefit(id: ID!): ExternalBenefit

    # Rewards
    rewardsSummary: RewardsSummary

    # Home
    productBanners: [Banner!]!

    # Digital Wallet
    digitalWalletCards: [DigitalWalletCard!]!

    # Help Center
    faqs: [Faq!]!

    # Expenses
    expenses: [Expense!]!

    # Advances
    advances: [Advance!]!

    # Reports
    expenseReports: [ExpenseReport!]!

    # Vouchers
    availableVouchers: [Voucher!]!
    myVouchers: [Voucher!]!

    # Geofencing
    geofenceZones: [GeofenceZone!]!
  }

  # ─── Mutations ──────────────────────────────────────────────────────
  type Mutation {
    # Auth
    login(input: LoginInput!): TokenPair
    logout(sessionId: ID): MutationResult!
    forgotPassword(cpf: String!, method: String): MutationResult!
    verifyOtp(cpf: String!, otp: String!): VerifyOtpResult!
    resetPassword(input: ResetPasswordInput!): MutationResult!
    updatePassword(input: UpdatePasswordInput!): MutationResult!
    validateCode(code: String!): MutationResult!
    validateDeviceToken(token: String!): DeviceValidationResult!
    terminateSession(sessionId: ID!): MutationResult!
    setTransactionPin(pin: String!): MutationResult!
    validateTransactionPin(pin: String!): MutationResult!
    toggle2FA(enabled: Boolean!): MutationResult!
    verify2FACode(code: String!): MutationResult!
    requestDataDeletion: DataDeletionResult!
    validatePhone(phone: String!): MutationResult!
    recoverTransactionPin(cpf: String!): MutationResult!
    updateTransactionPin(recoveryCode: String!, newPin: String!): MutationResult!

    # Wallet
    pixTransfer(input: PixTransferInput!): Transaction
    processQrPayment(input: QrPaymentInput!): Transaction
    payBoleto(input: BoletoPaymentInput!): Transaction
    mobileRecharge(input: MobileRechargeInput!): Transaction
    reallocateBenefit(input: ReallocateBenefitInput!): Boolean!
    scheduleDeposit(input: ScheduleDepositInput!): Boolean!
    updateWalletLimit(input: UpdateWalletLimitInput!): Wallet
    reclassifyTransaction(input: ReclassifyTransactionInput!): Boolean!
    cashOut(input: CashOutInput!): Transaction
    pixCashOutPreview(input: PixCashOutPreviewInput!): PixCashOutPreview
    executePixCashOut(input: PixCashOutInput!): Transaction
    statementExport(input: ExportStatementInput!): StatementExport

    # Cards
    blockCard(id: ID!): BenefitCard!
    unblockCard(id: ID!): BenefitCard!
    createVirtualCard: BenefitCard!
    activateCard(id: ID!): BenefitCard
    validateCardPin(id: ID!, pin: String!): MutationResult!
    changeCardPin(id: ID!, newPin: String!): MutationResult!
    requestCardReplacement(id: ID!, reason: String!): MutationResult!
    toggleInternationalMode(id: ID!, enabled: Boolean!): Boolean!

    # Notifications
    markNotificationRead(id: ID!): MutationResult!
    markAllNotificationsRead: MutationResult!
    updateNotificationPreferences(input: NotificationPreferencesInput!): NotificationPreferences!

    # Partners
    toggleFavoritePartner(partnerId: ID!): Boolean!

    # Disputes & Reimbursements
    submitDispute(transactionId: ID!, description: String!, amount: Float!, merchantName: String): Dispute!
    submitReimbursement(category: String!, amount: Float!, date: String!, description: String!, receiptUrl: String): Reimbursement!

    # Balance Requests
    createBalanceRequest(input: CreateBalanceRequestInput!): BalanceRequest
    updateBalanceRequest(input: UpdateBalanceRequestInput!): BalanceRequest

    # Digital Wallet
    addToGooglePay(cardId: ID!): Boolean!
    addToSamsungPay(cardId: ID!): Boolean!
    removeFromDigitalWallet(cardId: ID!, provider: String!): Boolean!

    # KYC
    validateCpfBigDataCorp(cpf: String!): Boolean!
    submitKycDocuments(input: KycDocumentInput!): KycResult!
    submitCertifaceSelfie(selfieBase64: String!): KycResult!

    # Approvals
    approveAction(id: ID!): Approval
    rejectAction(id: ID!, reason: String!): Approval

    # Feedback
    submitFeedback(score: Int!, tags: [String!], comment: String): MutationResult!

    # Rewards
    redeemReward(rewardId: ID!): MutationResult!

    # Expenses
    createExpense(input: CreateExpenseInput!): Expense
    deleteExpense(id: ID!): MutationResult!

    # Advances
    createAdvance(input: CreateAdvanceInput!): Advance

    # Reports
    createExpenseReport(input: CreateReportInput!): ExpenseReport
    submitExpenseReport(id: ID!): MutationResult!

    # Vouchers
    buyVoucher(input: BuyVoucherInput!): Voucher
    analyseVoucher(code: String!): Voucher

    # Geofencing
    addGeofenceZone(input: GeoZoneInput!): GeoZoneAddResult!
    removeGeofenceZone(id: String!): Boolean!
    toggleGeofenceZone(id: String!, active: Boolean!): Boolean!

    # External Benefits
    activateBenefit(id: ID!): MutationResult!

    # Flow Tokens
    startFlow(flowType: String!): FlowToken!
    validateFlowToken(token: String!): Boolean!

    # Expenses — OCR
    ocrReceipt(imageBase64: String!): OcrReceiptResult!
  }

  # ─── Flow Token types ──────────────────────────────────────────────
  type FlowToken {
    token: String!
    flowType: String!
    expiresAt: String!
  }

  # ─── Common result types ────────────────────────────────────────────
  type MutationResult {
    success: Boolean!
    message: String
  }

  type OcrReceiptResult {
    success: Boolean!
    merchant: String
    amount: Float
    date: String
    category: String
    confidence: Float
  }

  type VerifyOtpResult {
    success: Boolean!
    message: String
    resetTicket: String
  }

  type DeviceValidationResult {
    success: Boolean!
    message: String
    deviceTrusted: Boolean
  }

  type DataDeletionResult {
    success: Boolean!
    message: String
    protocol: String
  }

  # ─── Auth types ─────────────────────────────────────────────────────
  type AuthUser {
    id: ID!
    nome: String!
    cpf: String!
    email: String!
    telefone: String!
    empresa: String!
    departamento: String!
    cargo: String!
    primeiroAcesso: Boolean!
    bloqueioDefinitivo: Boolean!
    tentativasFalhas: Int!
  }

  type TokenPair {
    accessToken: String!
    refreshToken: String!
    expiresIn: Int!
    user: AuthUserInfo
  }

  type AuthUserInfo {
    id: ID!
    fullName: String!
    maskedCpf: String!
    email: String!
    roles: [String!]!
  }

  type AuthSession {
    id: ID!
    deviceName: String!
    deviceType: String!
    location: String!
    lastActive: String!
    isCurrent: Boolean!
  }

  type SecurityEvent {
    id: ID!
    descricao: String!
    dispositivo: String!
    data: String!
    tipo: String!
  }

  # ─── Wallet types ───────────────────────────────────────────────────
  type Wallet {
    id: ID!
    nome: String!
    tipo: String!
    saldo: Float!
    limiteDisponivel: Float!
    ativo: Boolean!
    ultimaAtualizacao: String!
    descricao: String!
    regrasDeUso: [String!]!
    gastoSugeridoPorDia: Float!
  }

  type Transaction {
    id: ID!
    descricao: String!
    valor: Float!
    data: String!
    direcao: String
    status: String!
    categoria: String
    estabelecimento: String
    walletId: String
    walletTipo: String
    nsu: String
    codigoAutorizacao: String
    cnpjEstabelecimento: String
    enderecoEstabelecimento: String
    cartaoFinal: String
    bandeira: String
    mcc: String
    mccDescricao: String
    parcelas: Int
    valorParcela: Float
    nomePortador: String
  }

  type CategoryBalance {
    walletId: String!
    walletNome: String!
    categoria: String!
    saldo: Float!
    limite: Float!
  }

  type PixKeyInfo {
    valid: Boolean!
    nomeTitular: String!
    banco: String!
    tipoConta: String!
    errorMessage: String
  }

  type PixCashOutPreview {
    chavePix: String
    tipoChave: String
    nomeTitular: String
    banco: String
    agencia: String
    conta: String
    amount: Float
    fee: Float
    totalDebited: Float
    previewId: String
  }

  type NextDeposit {
    walletId: String!
    amount: Float!
    scheduledDate: String!
    description: String
  }

  type StatementExport {
    url: String!
    format: String
  }

  # ─── Card types ─────────────────────────────────────────────────────
  type BenefitCard {
    id: ID!
    tipo: String!
    status: String!
    bandeira: String!
    ultimosDigitos: String!
    nomePortador: String!
    validade: String!
    carteirasVinculadas: [String!]!
    contactless: Boolean!
  }

  type CardDelivery {
    cardId: ID!
    status: String!
    carrier: String!
    trackingCode: String!
    estimatedDate: String!
    deliveryAddress: String!
    events: [CardDeliveryEvent!]!
  }

  type CardDeliveryEvent {
    description: String!
    date: String!
    location: String!
  }

  type CardSensitiveData {
    numeroCompleto: String!
    cvv: String!
  }

  # ─── Notification types ─────────────────────────────────────────────
  type AppNotification {
    id: ID!
    tipo: String!
    titulo: String!
    mensagem: String!
    data: String!
    lida: Boolean!
    actionUrl: String
  }

  # ─── Partner types ──────────────────────────────────────────────────
  type Partner {
    id: ID!
    name: String!
    category: String!
    address: String!
    distance: String
    rating: Float!
    acceptedBenefits: [String!]!
    discount: String
    isOpen: Boolean!
    lat: Float
    lng: Float
    description: String
    phone: String
    hours: String
  }

  # ─── Dispute & Reimbursement types ──────────────────────────────────
  type DisputeEvent {
    date: String!
    description: String!
    status: String!
  }

  type Dispute {
    id: ID!
    transactionId: String!
    description: String!
    amount: Float!
    merchantName: String!
    status: String!
    date: String!
    events: [DisputeEvent!]!
  }

  type Reimbursement {
    id: ID!
    category: String!
    amount: Float!
    date: String!
    description: String!
    status: String!
    receiptUrl: String
    resolvedAt: String
  }

  # ─── Balance Request types ──────────────────────────────────────────
  type BalanceRequest {
    id: ID!
    walletId: String!
    amount: Float!
    status: String!
    justificativa: String
    createdAt: String!
    updatedAt: String
    approvedBy: String
    rejectionReason: String
  }

  # ─── KYC types ──────────────────────────────────────────────────────
  type KycResult {
    id: ID
    status: String!
    cpfValid: Boolean
    documentValid: Boolean
    certifaceScore: Float
    rejectionReason: String
    submittedAt: String
    reviewedAt: String
  }

  # ─── Approval types ─────────────────────────────────────────────────
  type Approval {
    id: ID!
    type: String!
    status: String!
    requesterName: String!
    requesterEmail: String
    amount: Float
    description: String!
    createdAt: String!
    decidedAt: String
    decidedBy: String
    rejectionReason: String
  }

  # ─── External Benefit types ─────────────────────────────────────────
  type ExternalBenefit {
    id: ID!
    nome: String!
    categoria: String!
    descricao: String
    logoUrl: String
    siteUrl: String
    ativo: Boolean!
    valorMensal: String
    destaques: [String!]!
  }

  # ─── Rewards types ──────────────────────────────────────────────────
  type RewardsSummary {
    totalPoints: Int!
    level: Int!
    nextLevelPoints: Int!
    availableRewards: [Reward!]!
    history: [RewardHistoryEntry!]!
  }

  type Reward {
    id: ID!
    name: String!
    points: Int!
    category: String!
    description: String!
    iconName: String
  }

  type RewardHistoryEntry {
    id: ID!
    description: String!
    points: Int!
    date: String!
    type: String!
  }

  # ─── Home types ─────────────────────────────────────────────────────
  type Banner {
    id: ID!
    title: String!
    subtitle: String!
    gradientColors: [String!]!
    iconCodePoint: Int!
    route: String
  }

  # ─── Digital Wallet types ────────────────────────────────────────────
  type DigitalWalletCard {
    cardId: ID!
    cardLast4: String!
    cardBrand: String!
    cardNome: String!
    provider: String!
    isProvisioned: Boolean!
    tokenId: String
  }

  # ─── Help Center types ───────────────────────────────────────────────
  type Faq {
    question: String!
    answer: String!
    category: String!
  }

  # ─── Expense types ───────────────────────────────────────────────────
  type Expense {
    id: ID!
    description: String!
    amount: Float!
    date: String!
    category: String!
    receiptUrl: String
    lat: Float
    lng: Float
    merchant: String
  }

  # ─── Advance types ───────────────────────────────────────────────────
  type Advance {
    id: ID!
    amount: Float!
    reason: String!
    status: String!
    requestedAt: String!
    resolvedAt: String
    approverNote: String
  }

  # ─── Report types ────────────────────────────────────────────────────
  type ExpenseReport {
    id: ID!
    title: String!
    period: String!
    totalAmount: Float!
    expenseCount: Int!
    status: String!
    createdAt: String!
    submittedAt: String
    expenseIds: [ID!]!
  }

  # ─── Voucher types ───────────────────────────────────────────────────
  type Voucher {
    id: ID!
    merchantName: String!
    description: String!
    faceValue: Float!
    salePrice: Float!
    category: String!
    logoUrl: String
    expiresAt: String
    status: String!
    code: String
  }

  # ─── Geofence types ──────────────────────────────────────────────────
  type GeofenceZone {
    id: ID!
    name: String!
    description: String
    latitude: Float!
    longitude: Float!
    radiusMeters: Float!
    isActive: Boolean!
    partnerId: String
    type: String!
  }

  type GeoZoneAddResult {
    id: ID!
  }
`
