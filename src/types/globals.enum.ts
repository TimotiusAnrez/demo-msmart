export enum APIRoute {
  CLERK_WEBHOOK = '/api/webhooks(.*)',
}

export enum NavigationLink {
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
  ONBOARDING = '/onboarding',
  PROFILE = '/profile',
  ADMIN = '/admin',
  HOME = '/',
}

export enum ClerkNavigationLink {
  PROFILE = NavigationLink.PROFILE + '(.*)',
  ADMIN = NavigationLink.ADMIN + '(.*)',
  ONBOARDING = NavigationLink.ONBOARDING,
  SIGN_IN = NavigationLink.SIGN_IN,
  SIGN_UP = NavigationLink.SIGN_UP,
}

export enum AdminRole {
  USER_BUSINESS = 'USER_BUSINESS',
  ADMIN = 'ADMIN_MS',
  ADMIN_AGRI = 'ADMIN_MSAGRI',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum PublicRole {
  USER = 'USER',
}

export enum DefaultAssets {
  PRODUCT = 'https://www.flaticon.com/free-icons/box',
}
