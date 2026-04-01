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
    scheduledDate: String
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
    scheduledDate: String
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

  input AcceptTermsInput {
    version: String!
  }

  input RegisterPixKeyInput {
    type: String!
    key: String!
  }

  input CreateSavingsGoalInput {
    name: String!
    targetAmount: Float!
    deadline: String
    walletId: ID
  }

  input SavingsGoalDepositInput {
    goalId: ID!
    amount: Float!
  }

  input SavingsGoalWithdrawInput {
    goalId: ID!
    amount: Float!
  }

  input SendChatMessageInput {
    message: String!
    category: String
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

  # #078: PIX devolution (refund) input
  input PixDevolutionInput {
    transactionId: ID!
    amount: Float!
    reason: String
  }

  # #082: PIX key portability input
  input PixKeyPortabilityInput {
    keyType: String!
    key: String!
    originBank: String!
  }

  # #062: Per-card spending limits input
  input CardSpendingLimitInput {
    cardId: ID!
    dailyLimit: Float
    monthlyLimit: Float
    singleTransactionLimit: Float
  }

  # #165: Email update verification
  input SendEmailVerificationInput {
    newEmail: String!
  }
  input ConfirmEmailChangeInput {
    code: String!
  }

  # #166: Phone update verification
  input SendPhoneVerificationInput {
    newPhone: String!
  }
  input ConfirmPhoneChangeInput {
    code: String!
  }

  # #174: Document signature
  input SignDocumentInput {
    documentId: ID!
    signatureBase64: String
  }

  # #175: Per-query error simulation
  input ErrorSimulationInput {
    queryName: String!
    errorCode: String!
    errorMessage: String
    rate: Float
  }

  # #064: Card order input
  input CardOrderInput {
    tipo: String!
    bandeira: String!
    walletIds: [String!]!
    deliveryAddress: String
  }

  # #075: Card linked wallet update input
  input CardLinkedWalletInput {
    cardId: ID!
    carteirasVinculadas: [String!]!
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
    me: AuthUser
    findByCpf(cpf: String!): AuthUser
    sessions: [AuthSession!]!
    securityActivity: [SecurityEvent!]!

    # Wallet
    wallets: [Wallet!]!
    transactions(walletId: ID, dateFrom: String, dateTo: String, categoria: String, direcao: String, search: String, limit: Int, offset: Int): [Transaction!]!
    balancesByCategory: [CategoryBalance!]!
    validatePixKey(chavePix: String!, tipoChave: String!): PixKeyInfo
    validateBoleto(barcode: String!): BoletoValidation
    nextDeposits(walletId: ID): [NextDeposit!]!
    canPixCashOut(walletId: ID!): Boolean!
    pixCashOutReceipt(transactionId: ID!): Transaction
    spendInsights(months: Int): SpendInsights
    statementHome(limit: Int): [Transaction!]!

    # Cards
    cards: [BenefitCard!]!
    cardDelivery(id: ID!): CardDelivery
    revealCard(id: ID!): CardSensitiveData
    cardSpendingLimits(cardId: ID!): CardSpendingLimits

    # PIX Keys
    myPixKeys: [PixRegisteredKey!]!

    # Notifications
    notifications(limit: Int, offset: Int): [AppNotification!]!
    notificationPreferences: NotificationPreferences!
    notificationUnseenCount: Int!
    inbox: [InboxMessage!]!
    surveys: [Survey!]!

    # Partners
    partners(category: String, benefit: String, search: String): [Partner!]!
    nearbyPartners(lat: Float!, lng: Float!, radiusKm: Float): [Partner!]!
    partner(id: ID!): Partner
    favoritePartners: [Partner!]!
    partnerLandingPage(partnerId: ID!): Partner

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
    chatHistory: [ChatMessage!]!

    # Documents
    documents: [UserDocument!]!

    # Copilot AI
    copilotAdvice: CopilotAdvice

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

    # HR
    timeSheet(date: String!): TimeSheet
    timeSheetRange(from: String!, to: String!): [TimeSheet!]!
    hourBank: HourBank
    vacationBalance: VacationBalance
    vacationHistory: [VacationPeriod!]!
    payslips(year: Int!): [Payslip!]!
    hrEvents(month: Int!, year: Int!): [HrEvent!]!
    getEvents(month: Int!, year: Int!): [HrEvent!]!
    clockLocks: [ClockLock!]!
    holidays(year: Int!): [Holiday!]!

    # Banks (for TED/Cash Out)
    banks: [Bank!]!

    # Mobile Carriers (for Recharge)
    mobileCarriers: [MobileCarrier!]!

    # Marketplace / Clube de Vantagens
    marketplaceOffers: [MarketplaceOffer!]!

    # Savings Goals
    savingsGoals: [SavingsGoal!]!

    # Transport Cards
    transportCards: [TransportCard!]!

    # Spending Challenge
    spendingChallenge: SpendingChallenge

    # Achievements & Referrals
    achievements: [Achievement!]!
    referrals: [Referral!]!

    # Credit
    requiredCreditFiles(type: String!): [RequiredFile!]!
    loans: [Loan!]!
    loanDetail(id: ID!): Loan
    creditSimulation(amount: Float!, installments: Int!, type: String!): CreditSimulation
    creditEligibility: CreditEligibility
    earlyPayoffSimulation(loanId: ID!): EarlyPayoffSimulation

    # Travel
    travels: [TravelRequest!]!
    travelDetail(id: ID!): TravelRequest
    travelPolicy: TravelPolicy
    perDiem(destination: String!): PerDiem
    flightTickets: [FlightTicket!]!
    flightTicket(id: ID!): FlightTicket

    # #164: CEP lookup
    queryCep(cep: String!): CepResult

    # #168: App version check
    appVersion: AppVersionInfo

    # #169: Feature flags
    featureFlags: [FeatureFlag!]!

    # #170: Changelog / whats-new
    changelog: [ChangelogEntry!]!

    # Detail queries (replace hardcoded mock data in Flutter screens)
    statementFuture: [FutureTransaction!]!
    pixCashInQr(amount: Float, walletId: ID): PixQrCode!
    expenseDetail(id: ID!): ExpenseDetail
    advanceDetail(id: ID!): AdvanceDetail
    reportDetail(id: ID!): ReportDetail
    approvalDetail(id: ID!): ApprovalDetail
    paymentMethods: [PaymentMethod!]!
    reportApprovers: [Approver!]!
    searchAddresses(query: String!): [AddressResult!]!
  }

  # ─── Mutations ──────────────────────────────────────────────────────
  type Mutation {
    # Auth
    login(input: LoginInput!): TokenPair
    refreshToken(refreshToken: String!): TokenPair
    acceptTerms(input: AcceptTermsInput!): MutationResult!
    logout(sessionId: ID): MutationResult!
    forgotPassword(cpf: String!, method: String): MutationResult!
    verifyOtp(cpf: String!, otp: String!): VerifyOtpResult!
    resetPassword(input: ResetPasswordInput!): MutationResult!
    updatePassword(input: UpdatePasswordInput!): MutationResult!
    validateCode(code: String!): MutationResult!
    validateDeviceToken(token: String!): DeviceValidationResult!
    terminateSession(sessionId: ID!): MutationResult!
    updateProfile(nome: String, email: String, telefone: String): MutationResult!
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

    # PIX Keys
    registerPixKey(input: RegisterPixKeyInput!): PixRegisteredKey
    pixDevolution(input: PixDevolutionInput!): Transaction
    requestPixKeyPortability(input: PixKeyPortabilityInput!): MutationResult!

    # Cards
    blockCard(id: ID!, reason: String): BenefitCard!
    unblockCard(id: ID!): BenefitCard!
    createVirtualCard: BenefitCard!
    activateCard(id: ID!): BenefitCard
    validateCardPin(id: ID!, pin: String!): MutationResult!
    changeCardPin(id: ID!, newPin: String!): MutationResult!
    requestCardReplacement(id: ID!, reason: String!): MutationResult!
    toggleInternationalMode(id: ID!, enabled: Boolean!): Boolean!
    toggleContactless(id: ID!, enabled: Boolean!): BenefitCard!
    toggleContactlessMode(id: ID!, enabled: Boolean!): BenefitCard!
    setCardSpendingLimits(input: CardSpendingLimitInput!): CardSpendingLimits!
    orderCard(input: CardOrderInput!): BenefitCard!
    updateCardLinkedWallets(input: CardLinkedWalletInput!): BenefitCard!

    # Notifications
    markNotificationRead(id: ID!): MutationResult!
    markAllNotificationsRead: MutationResult!
    updateNotificationPreferences(input: NotificationPreferencesInput!): NotificationPreferences!
    deleteNotification(id: ID!): MutationResult!

    # Partners
    toggleFavoritePartner(partnerId: ID!): Boolean!
    updatePartnerBenefitAcceptance(partnerId: ID!, benefits: [String!]!): Partner

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

    # Support Chat
    sendChatMessage(input: SendChatMessageInput!): ChatMessage

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

    # HR
    discardClockEntry(id: ID!): Boolean!
    restoreClockEntry(id: ID!): Boolean!
    clockIn(latitude: Float, longitude: Float): ClockEntry
    clockOut: ClockEntry
    manualClockEntry(date: String!, timeIn: String!, timeOut: String!, reason: String!): ClockEntry
    scheduleVacation(startDate: String!, endDate: String!): VacationPeriod
    approveManualClockEntry(id: ID!, approved: Boolean!): ClockEntry
    confirmEventAttendance(eventId: ID!): HrEvent
    requestHourBankCompensation(minutes: Int!, date: String!, reason: String!): HourBankCompensation

    # Credit
    uploadCreditFile(loanId: ID!, fileType: String!, fileName: String!): RequiredFile!
    createCreditConsent(simulationId: ID!): Boolean
    executeCreditOperation(consentId: ID!): Boolean
    simulateCredit(input: SimulateCreditInput!): CreditSimulation

    # Savings Goals
    createSavingsGoal(input: CreateSavingsGoalInput!): SavingsGoal
    depositSavingsGoal(input: SavingsGoalDepositInput!): SavingsGoal
    withdrawSavingsGoal(input: SavingsGoalWithdrawInput!): SavingsGoal

    # Travel
    addTravelExpense(travelId: ID!, type: String!, description: String!, amount: Float!, date: String!, receiptUrl: String): TravelExpense!
    createTravel(destination: String!, startDate: String!, endDate: String!, purpose: String!): TravelRequest
    submitTravel(id: ID!): TravelRequest
    cancelTravel(id: ID!): Boolean
    approveTravel(id: ID!): TravelRequest
    rejectTravel(id: ID!, reason: String!): TravelRequest

    # #165: Email update with verification
    sendEmailVerification(input: SendEmailVerificationInput!): MutationResult!
    confirmEmailChange(input: ConfirmEmailChangeInput!): MutationResult!

    # #166: Phone update with SMS verification
    sendPhoneVerification(input: SendPhoneVerificationInput!): MutationResult!
    confirmPhoneChange(input: ConfirmPhoneChangeInput!): MutationResult!

    # #172: Feedback with NPS dedup
    submitNpsFeedback(score: Int!, comment: String): MutationResult!

    # #174: Document signature
    signDocument(input: SignDocumentInput!): DocumentSignature

    # #175: Per-query error simulation
    setErrorSimulation(input: ErrorSimulationInput!): MutationResult!
    clearErrorSimulation(queryName: String!): MutationResult!

    # #186: Random null fields stress test
    toggleNullableStress(enabled: Boolean!): MutationResult!
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
    bloqueioAte: String
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

  # ─── Boleto Validation type ─────────────────────────────────────────
  type BoletoValidation {
    valid: Boolean!
    barcode: String!
    amount: Float
    dueDate: String
    beneficiary: String
    bank: String
    errorMessage: String
    juros: Float
    multa: Float
    totalComEncargos: Float
    discount: Float
    authenticationNumber: String
  }

  # ─── Spend Insights type ──────────────────────────────────────────
  type SpendInsightCategory {
    category: String!
    total: Float!
    count: Int!
    percentOfTotal: Float!
  }

  type SpendInsights {
    month: String!
    totalSpent: Float!
    categories: [SpendInsightCategory!]!
    topMerchant: String
    averageTransaction: Float!
    comparedToPreviousMonth: Float
  }

  # ─── PIX Registered Key type ──────────────────────────────────────
  type PixRegisteredKey {
    id: ID!
    type: String!
    key: String!
    createdAt: String!
    status: String!
  }

  # ─── Inbox / Messaging type ───────────────────────────────────────
  type InboxMessage {
    id: ID!
    from: String!
    subject: String!
    body: String!
    date: String!
    read: Boolean!
    category: String!
  }

  # ─── Survey type ──────────────────────────────────────────────────
  type Survey {
    id: ID!
    title: String!
    description: String!
    questions: [SurveyQuestion!]!
    expiresAt: String!
    completed: Boolean!
  }

  type SurveyQuestion {
    id: ID!
    text: String!
    type: String!
    options: [String!]
  }

  # ─── Chat Message type ────────────────────────────────────────────
  type ChatMessage {
    id: ID!
    sender: String!
    message: String!
    timestamp: String!
    category: String
  }

  # ─── User Document type ───────────────────────────────────────────
  type UserDocument {
    id: ID!
    title: String!
    type: String!
    url: String!
    issuedAt: String!
    expiresAt: String
  }

  # ─── Copilot AI type ──────────────────────────────────────────────
  type CopilotAdvice {
    summary: String!
    tips: [String!]!
    savingsOpportunity: Float
    topCategory: String
    monthlyBudgetStatus: String
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
    e2eid: String
    scheduledDate: String
    pixDescription: String
    boletoAuthNumber: String
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
    feeTier: String
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
    internationalMode: Boolean
    lockReason: String
    spendingLimits: CardSpendingLimits
  }

  # #062: Per-card spending limits
  type CardSpendingLimits {
    cardId: ID!
    dailyLimit: Float!
    monthlyLimit: Float!
    singleTransactionLimit: Float!
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
    discountExpiresAt: String
    isOpen: Boolean!
    lat: Float
    lng: Float
    description: String
    phone: String
    hours: String
    locations: [PartnerLocation!]
    landingPageUrl: String
  }

  # #151: Partner multiple locations
  type PartnerLocation {
    id: ID!
    address: String!
    lat: Float!
    lng: Float!
    isOpen: Boolean!
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

  # ─── HR types ──────────────────────────────────────────────────────────
  type ClockEntry {
    id: ID!
    employeeId: String!
    timestamp: String!
    type: String!
    reason: String
    latitude: Float
    longitude: Float
    approved: Boolean
    approvalStatus: String
  }

  type TimeSheet {
    date: String!
    entries: [ClockEntry!]!
    workedMinutes: Int!
    extraMinutes: Int!
    nightMinutes: Int!
    breakMinutes: Int!
  }

  type HourBank {
    balanceMinutes: Int!
    monthlyExtract: [HourBankEntry!]!
  }

  type HourBankEntry {
    month: String!
    creditedMinutes: Int!
    debitedMinutes: Int!
    balanceMinutes: Int!
  }

  type VacationBalance {
    totalDays: Int!
    usedDays: Int!
    availableDays: Int!
    accrualStart: String!
    accrualEnd: String!
  }

  type VacationPeriod {
    id: ID!
    startDate: String!
    endDate: String!
    daysCount: Int!
    status: String!
    approver: String
  }

  type Payslip {
    id: ID!
    month: Int!
    year: Int!
    grossSalary: Float!
    netSalary: Float!
    deductions: [PayslipItem!]!
    benefits: [PayslipItem!]!
    pdfUrl: String
  }

  type PayslipItem {
    description: String!
    amount: Float!
  }

  type HrEvent {
    id: ID!
    title: String!
    description: String!
    date: String!
    type: String!
    attendees: [String!]!
    rsvpStatus: String
  }

  # #111: Brazilian holidays
  type Holiday {
    date: String!
    name: String!
    type: String!
  }

  # #109: Hour bank compensation
  type HourBankCompensation {
    id: ID!
    minutes: Int!
    date: String!
    status: String!
    reason: String!
  }

  type ClockLock {
    id: ID!
    name: String!
    type: String!
    active: Boolean!
    range: String
  }

  # ─── Credit types ─────────────────────────────────────────────────────
  input SimulateCreditInput {
    amount: Float!
    installments: Int!
    type: String!
  }

  type CreditSimulation {
    id: ID!
    type: String!
    amount: Float!
    installments: Int!
    monthlyPayment: Float!
    interestRate: Float!
    totalCost: Float!
    iofTax: Float!
  }

  type RequiredFile {
    id: ID!
    type: String!
    label: String!
    description: String!
    required: Boolean!
    accepted: Boolean!
  }

  type Loan {
    id: ID!
    type: String!
    originalAmount: Float!
    remainingBalance: Float!
    installmentsPaid: Int!
    installmentsTotal: Int!
    monthlyPayment: Float!
    nextPaymentDate: String!
    status: String!
    nextInstallments: [LoanInstallment!]
  }

  type LoanInstallment {
    number: Int!
    dueDate: String!
    amount: Float!
    status: String!
  }

  # #116: Credit eligibility
  type CreditEligibility {
    eligible: Boolean!
    score: Int!
    maxConsignado: Float!
    maxPessoal: Float!
    reasons: [String!]
  }

  # #119: Credit consent with terms
  type CreditConsent {
    id: ID!
    simulationId: String!
    termsText: String!
    expiresAt: String!
    accepted: Boolean!
  }

  # #121: Loan early payoff simulation
  type EarlyPayoffSimulation {
    loanId: String!
    currentBalance: Float!
    discount: Float!
    earlyPayoffAmount: Float!
    savedInterest: Float!
  }

  # #124: Credit denial
  type CreditDenial {
    eligible: Boolean!
    reasons: [String!]!
    suggestions: [String!]!
  }

  # ─── Travel types ─────────────────────────────────────────────────────
  type TravelRequest {
    id: ID!
    destination: String!
    startDate: String!
    endDate: String!
    purpose: String!
    status: String!
    totalBudget: Float!
    expenses: [TravelExpense!]
    approver: String
    approvedAt: String
  }

  # #133: Per-diem by destination
  type PerDiem {
    destination: String!
    dailyMeal: Float!
    dailyHotel: Float!
    dailyTransport: Float!
  }

  type TravelExpense {
    id: ID!
    travelId: String!
    type: String!
    description: String!
    amount: Float!
    date: String!
    receiptUrl: String
  }

  type TravelPolicy {
    maxDailyMeal: Float!
    maxHotelNight: Float!
    requiresPreApproval: Boolean!
    advanceDays: Int!
  }

  # ─── Detail types (replace hardcoded mock data) ─────────────────────

  type FutureTransaction {
    id: ID!
    description: String!
    amount: Float!
    date: String!
    category: String!
    type: String!
    recurring: Boolean
  }

  type PixQrCode {
    code: String!
    imageBase64: String
    expiresAt: String
    pixKey: String!
    amount: Float
  }

  type ExpenseDetail {
    id: ID!
    description: String!
    amount: Float!
    category: String
    date: String!
    status: String!
    timeline: [StatusTimelineEntry!]
    location: String
    receiptUrl: String
  }

  type StatusTimelineEntry {
    status: String!
    date: String!
    actor: String
    note: String
  }

  type AdvanceDetail {
    id: ID!
    amount: Float!
    description: String!
    status: String!
    requestDate: String!
    approvalHistory: [StatusTimelineEntry!]
  }

  type ReportDetail {
    id: ID!
    title: String!
    totalAmount: Float!
    status: String!
    expenses: [ExpenseDetail!]
    advances: [AdvanceDetail!]
    submittedAt: String
  }

  type ApprovalDetail {
    id: ID!
    type: String!
    requester: String!
    department: String!
    amount: Float!
    status: String!
    description: String
    documents: [DocumentRef!]
    history: [StatusTimelineEntry!]
  }

  type DocumentRef {
    name: String!
    type: String!
    url: String!
    size: String
  }

  type PaymentMethod {
    id: ID!
    type: String!
    label: String!
    balance: Float
    lastFour: String
    brand: String
  }

  type Approver {
    id: ID!
    name: String!
    role: String!
    department: String!
    email: String
  }

  type AddressResult {
    id: ID!
    name: String!
    address: String!
    latitude: Float!
    longitude: Float!
    category: String
  }

  # ─── Flight Tickets ──────────────────────────────────────────────────
  type FlightTicket {
    id: ID!
    airline: String!
    flightNumber: String!
    departure: String!
    arrival: String!
    departureTime: String!
    arrivalTime: String!
    seatClass: String!
    price: Float!
    bookingRef: String!
  }

  # ─── Banks ───────────────────────────────────────────────────────────
  type Bank {
    code: String!
    name: String!
    ispb: String
  }

  # ─── Mobile Carriers ────────────────────────────────────────────────
  type MobileCarrier {
    id: ID!
    name: String!
    icon: String
    amounts: [Float!]!
  }

  # ─── Marketplace / Clube de Vantagens ───────────────────────────────
  type MarketplaceOffer {
    id: ID!
    merchantName: String!
    category: String!
    discount: String!
    description: String
    couponCode: String
    validUntil: String
    imageUrl: String
  }

  # ─── Savings Goals ──────────────────────────────────────────────────
  type SavingsGoal {
    id: ID!
    name: String!
    targetAmount: Float!
    currentAmount: Float!
    deadline: String
    walletId: ID
    createdAt: String!
  }

  # ─── Transport Cards ───────────────────────────────────────────────
  type TransportCard {
    id: ID!
    type: String!
    number: String!
    balance: Float!
    lastUsed: String
    status: String!
  }

  # ─── Achievements ───────────────────────────────────────────────────
  type Achievement {
    id: ID!
    name: String!
    icon: String!
    description: String
    unlocked: Boolean!
    unlockedAt: String
  }

  # ─── Spending Challenge ────────────────────────────────────────────
  type SpendingChallenge {
    id: ID!
    title: String!
    target: Float!
    current: Float!
    category: String!
  }

  # ─── Referrals ─────────────────────────────────────────────────────
  type Referral {
    id: ID!
    name: String!
    date: String!
    status: String!
    reward: Float
  }

  # #164: CEP lookup result
  type CepResult {
    cep: String!
    rua: String!
    bairro: String!
    cidade: String!
    uf: String!
  }

  # #168: App version info
  type AppVersionInfo {
    minVersion: String!
    currentVersion: String!
    updateUrl: String!
    forceUpdate: Boolean!
  }

  # #169: Feature flag
  type FeatureFlag {
    feature: String!
    enabled: Boolean!
  }

  # #170: Changelog entry
  type ChangelogEntry {
    version: String!
    date: String!
    changes: [String!]!
  }

  # #174: Document signature result
  type DocumentSignature {
    documentId: ID!
    signedAt: String!
    signatureHash: String!
  }
`
