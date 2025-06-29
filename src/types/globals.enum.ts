export enum APIRoute {
  CLERK_WEBHOOK = '/api/webhooks(.*)',
}

export enum NavigationLink {
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
  HOME = '/',
  TOURISM = '/destinations',
  ACTIVITY = '/activity',
  DESTINATIONS = '/destinations',
  FNB = '/fnb',
  SHOPPING = '/shopping',
  AGRICULTURE = '/agriculture',
  DISCUSSION = '/discussion',
  FACILITY = '/facility',
  REPORT = '/report',
  NEWS = '/news',
  PROFILE = '/profile',
}

export enum PrivateNavigationLink {
  CART = '/profile/cart',
  PROFILE = '/profile',
  ADMIN = '/admin',
  ONBOARDING = '/onboarding',
}

export enum ClerkNavigationLink {
  PROFILE = PrivateNavigationLink.PROFILE + '(.*)',
  ADMIN = PrivateNavigationLink.ADMIN + '(.*)',
  ONBOARDING = PrivateNavigationLink.ONBOARDING,
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
