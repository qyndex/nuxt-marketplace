<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Create an account</h1>
        <p class="mt-2 text-sm text-gray-600">Join the marketplace today</p>
      </div>

      <div v-if="errorMsg" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" role="status" class="rounded-md bg-green-50 p-3 text-sm text-green-700">
        {{ successMsg }}
      </div>

      <form class="space-y-4" @submit.prevent="handleSignup">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            aria-label="Email address"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            aria-label="Password"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            aria-label="Confirm password"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          aria-label="Create account"
          class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {{ loading ? "Creating account..." : "Sign Up" }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-indigo-600 hover:underline">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function handleSignup() {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match";
    return;
  }
  loading.value = true;
  errorMsg.value = "";
  successMsg.value = "";
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) {
    errorMsg.value = error.message;
    loading.value = false;
    return;
  }
  successMsg.value = "Account created! Check your email to confirm your address.";
  loading.value = false;
}
</script>
