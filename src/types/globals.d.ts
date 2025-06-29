export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
      verificationStatus: 'UNVERIFIED' | 'VERIFICATION_REQUEST' | 'DECLINED' | 'VERIFIED'
      isSuspended: boolean
    }
    private: {
      payloadID: number //payload user id
      role: ('USER' | 'USER_BUSINESS' | 'ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN')[]
      cartID: number //user cart
      agriCartID: number //user agri cart
    }
  }
}
