<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const { user, loading, signInWithGoogle } = useAuth()
const router = useRouter()

watch(user, (newUser) => {
  if (newUser) {
    router.push('/lobby')
  }
})

async function handleLogin() {
  try {
    await signInWithGoogle()
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="pa-8 text-center" elevation="8" rounded="xl">
      <v-icon size="64" color="primary" class="mb-4">mdi-dice-multiple</v-icon>
      <v-card-title class="text-h4 font-weight-bold mb-2">
        BINGO Online
      </v-card-title>
      <v-card-subtitle class="text-body-1 mb-6">
        Real-time multiplayer bingo
      </v-card-subtitle>

      <v-btn
        color="white"
        size="large"
        block
        variant="outlined"
        :loading="loading"
        @click="handleLogin"
      >
        <v-icon start>mdi-google</v-icon>
        Sign in with Google
      </v-btn>
    </v-card>
  </v-container>
</template>