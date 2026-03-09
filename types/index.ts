// ── Enums (mirrored from backend) ──

export enum UserType {
    ADMIN = 'admin',
    MERCHANT = 'merchant',
    PARTNER = 'partner',
    CUSTOMER = 'customer',
}

export enum MerchantCategory {
    STANDARD = 'standard',
    GOLD = 'gold',
    PREMIUM = 'premium',
}

export enum MerchantStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
}

export enum MerchantRank {
    STARTER = 'starter',
    BUILDER = 'builder',
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum',
    DIAMOND = 'diamond',
}

export enum PartnerStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum CommissionStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    PAID = 'paid',
    REVERSED = 'reversed',
}

export enum WithdrawalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    PROCESSING = 'processing',
    PAID = 'paid',
    REJECTED = 'rejected',
}

// ── Interfaces ──

export interface User {
    _id: string
    fullName: string
    email: string
    phone?: string
    userType: UserType
    role: string
    isActive: boolean
    isEmailVerified: boolean
    avatar?: string
    lastLogin?: string
    createdAt: string
    updatedAt: string
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface LoginResponse {
    data: {
        user: User
        tokens: AuthTokens
    }
}

export interface Merchant {
    _id: string
    userId: string | User
    merchantCode: string
    fullName: string
    phone: string
    email: string
    bankAccountDetails?: {
        bankName: string
        accountNumber: string
        accountName: string
    }
    category: MerchantCategory
    commissionRate: number
    status: MerchantStatus
    referralLink: string
    totalSalesValue: number
    totalOrdersReferred: number
    monthlySalesValue: number
    rank: MerchantRank
    agreedToTerms: boolean
    createdAt: string
    updatedAt: string
}

export interface Partner {
    _id: string
    userId: string | User
    partnerCode: string
    companyName: string
    contactPerson: string
    phone: string
    email: string
    bankAccountDetails?: {
        bankName: string
        accountNumber: string
        accountName: string
    }
    category: string
    commissionRate: number
    status: PartnerStatus
    referralLink: string
    totalSalesValue: number
    totalOrdersReferred: number
    agreedToTerms: boolean
    createdAt: string
    updatedAt: string
}

export interface Product {
    _id: string
    name: string
    description: string
    price: number
    compareAtPrice?: number
    images: string[]
    category: string | Category
    stock: number
    isActive: boolean
    sku?: string
    weight?: number
    tags: string[]
    slug: string
    totalSold: number
    avgRating: number
    reviewCount: number
    createdAt: string
    updatedAt: string
}

export interface Category {
    _id: string
    name: string
    slug: string
    description?: string
    image?: string
    parentCategory?: string
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export interface OrderItem {
    productId: string
    name: string
    price: number
    quantity: number
    image: string
}

export interface Order {
    _id: string
    orderNumber: string
    customerId: string | User
    items: OrderItem[]
    totalAmount: number
    shippingFee: number
    discount: number
    status: OrderStatus
    paymentStatus: PaymentStatus
    paymentProvider?: string
    paymentReference?: string
    merchantId?: string | Merchant
    partnerId?: string | Partner
    referralCode?: string
    shippingAddress?: {
        fullName: string
        phone: string
        address: string
        city: string
        state: string
        country: string
        zipCode: string
    }
    notes?: string
    completedAt?: string
    cancelledAt?: string
    cancellationReason?: string
    createdAt: string
    updatedAt: string
}

export interface Commission {
    _id: string
    orderId: string | Order
    merchantId?: string | Merchant
    partnerId?: string | Partner
    amount: number
    rate: number
    status: CommissionStatus
    paidAt?: string
    createdAt: string
    updatedAt: string
}

export interface Wallet {
    _id: string
    ownerId: string
    ownerType: string
    availableBalance: number
    pendingBalance: number
    totalEarned: number
    totalWithdrawn: number
}

export interface Withdrawal {
    _id: string
    walletId: string
    requestedBy: string
    amount: number
    bankDetails: any
    status: WithdrawalStatus
    processedBy?: string
    processedAt?: string
    rejectionReason?: string
    paymentReference?: string
    createdAt: string
    updatedAt: string
}

export interface Role {
    _id: string
    name: string
    description?: string
    permissions: string[]
    isSystem: boolean
    createdAt: string
    updatedAt: string
}

export interface AuditLog {
    _id: string
    userId: string | User
    action: string
    resource: string
    resourceId?: string
    details?: any
    ipAddress?: string
    userAgent?: string
    timestamp: string
}

export interface Notification {
    _id: string
    userId: string
    type: string
    title: string
    message: string
    isRead: boolean
    data?: any
    createdAt: string
}

export interface PaginationParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ApiResponse<T = any> {
    data?: T
    message?: string
    statusCode?: number
}
