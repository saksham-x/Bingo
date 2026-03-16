<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRoom } from '@/composables/useRoom'

const { user, logout } = useAuth()
const { createRoom, joinRoom, error, loading } = useRoom()

const gridSize = ref(5)
const joinCode = ref('')
const activeTab = ref('create')

async function handleCreate() {
  await createRoom(gridSize.value)
}

async function handleJoin() {
  if (!joinCode.value.trim()) {
    error.value = 'Please enter a room code'
    return
  }
  await joinRoom(joinCode.value)
}

async function handleLogout() {
  await logout()
  window.location.href = '/login'
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="480" elevation="8" rounded="xl">
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="primary" class="mr-2">mdi-dice-multiple</v-icon>
        <span class="text-h5 font-weight-bold">BINGO Online</span>
        <v-spacer />
        <v-chip v-if="user" variant="tonal" size="small">
          <v-avatar start size="24">
            <v-img :src="user.photoURL || ''" />
          </v-avatar>
          {{ user.displayName }}
        </v-chip>
        <v-btn icon="mdi-logout" variant="text" size="small" @click="handleLogout" class="ml-2" />
      </v-card-title>

      <v-divider />

      <!-- Tabs -->
      <v-tabs v-model="activeTab" grow>
        <v-tab value="create">Create Room</v-tab>
        <v-tab value="join">Join Room</v-tab>
      </v-tabs>

      <v-card-text class="pa-6">
        <!-- Error Alert -->
        <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">
          {{ error }}
        </v-alert>

        <!-- Create Room Tab -->
        <div v-if="activeTab === 'create'">
          <p class="text-body-1 mb-4">Choose a grid size and create a new game room.</p>

          <v-select
            v-model="gridSize"
            :items="[
              { title: '2×2 (Quick — 2 lines to win)', value: 2 },
              { title: '3×3 (Short — 3 lines to win)', value: 3 },
              { title: '4×4 (Medium — 4 lines to win)', value: 4 },
              { title: '5×5 (Classic — 5 lines to win)', value: 5 },
            ]"
            item-title="title"
            item-value="value"
            label="Grid Size"
            variant="outlined"
            class="mb-4"
          />

          <v-btn
            color="primary"
            size="large"
            block
            :loading="loading"
            @click="handleCreate"
          >
            <v-icon start>mdi-plus-circle</v-icon>
            Create Room
          </v-btn>
        </div>

        <!-- Join Room Tab -->
        <div v-if="activeTab === 'join'">
          <p class="text-body-1 mb-4">Enter a 6-character room code to join an existing game.</p>

          <v-text-field
            v-model="joinCode"
            label="Room Code"
            placeholder="e.g. XK92BF"
            variant="outlined"
            maxlength="6"
            class="mb-4"
            :rules="[
              (v: string) => v.length === 6 || 'Code must be 6 characters',
            ]"
            @keyup.enter="handleJoin"
            style="text-transform: uppercase; letter-spacing: 4px; font-size: 1.2rem;"
          />

          <v-btn
            color="secondary"
            size="large"
            block
            :loading="loading"
            :disabled="joinCode.trim().length !== 6"
            @click="handleJoin"
          >
            <v-icon start>mdi-login</v-icon>
            Join Room
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>