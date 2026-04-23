/**
 * Auth middleware — redirects unauthenticated users away from protected pages.
 * Apply to pages with: definePageMeta({ middleware: "auth" })
 */
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo("/auth/login");
  }
});
