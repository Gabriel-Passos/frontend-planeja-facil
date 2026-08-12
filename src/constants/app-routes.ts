export const AppRoutes = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  RESET_PASSWORD: "/reset-password",
  FORGOT_PASSWORD: "/forgot-password",
  CONFIRM_ACCOUNT: "/confirm-account",

  // Home
  DASHBOARD: "/dashboard",

  // My Plans
  MY_PLANNING: "/my-plans",

  MY_PLANNING_MONTHS: "/my-plans/:yearId/month-cards",

  MY_PLANNING_MONTHS_PLANNING: "/my-plans/:yearId/month-cards/:cardId",

  // Trash
  TRASH: "/trash",

  // Profile
  PROFILE: "/profile",
} as const;
