<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db, auth } from '@/firebase'
import {
  ref as dbRef,
  onValue,
  update,
  off,
} from 'firebase/database'
import { useRoom } from '@/composables/useRoom'

const route = useRoute()
const router = useRouter()
const roomCode = route.params.code as string
const { generateBoard } = useRoom()

const roomData = ref<any>(null)
const players = ref<Record<string, any>>({})
const loading = ref(true)
const resetting = ref(false)

const currentUserId = computed(() => auth.currentUser?.uid || '')
const isHost = computed(() => roomData.value?.hostId === currentUserId.value)
const gridSize = computed(() => roomData.value?.gridSize || 5)

// Winner info
const winnerId = computed(() => roomData.value?.winnerId || '')
const winner = computed(() => {
  if (!winnerId.value) return null
  return {
    uid: winnerId.value,
    ...players.value[winnerId.value],
  }
})

const isWinnerMe = computed(() => winnerId.value === currentUserId.value)

// BINGO letters based on grid size
const bingoLetters = computed(() => {
  const all = ['B', 'I', 'N', 'G', 'O']
  return all.slice(0, gridSize.value)
})

// Sorted player standings: winner first, then by letters earned (desc)
const standings = computed(() => {
  const list = Object.entries(players.value).map(([uid, data]: [string, any]) => ({
    uid,
    displayName: data.displayName || 'Anonymous',
    photoURL: data.photoURL || '',
    lettersEarned: data.lettersEarned || [],
    isWinner: data.isWinner || false,
    markedCount: (data.markedNumbers || []).length,
  }))

  // Sort: winner first, then by letters count desc
  list.sort((a, b) => {
    if (a.isWinner && !b.isWinner) return -1
    if (!a.isWinner && b.isWinner) return 1
    return b.lettersEarned.length - a.lettersEarned.length
  })

  return list
})

// Total numbers called
const totalCalled = computed(() => (roomData.value?.calledNumbers || []).length)

// Firebase listener
let roomListener: any = null

onMounted(() => {
  const roomRef = dbRef(db, `rooms/${roomCode}`)
  roomListener = onValue(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      router.push('/lobby')
      return
    }

    const data = snapshot.val()
    const { players: playersData, ...room } = data
    roomData.value = room
    players.value = playersData || {}

    // If room was reset back to waiting, go to waiting room
    if (room.status === 'waiting') {
      router.push(`/room/${roomCode}`)
    }

    loading.value = false
  })
})

onUnmounted(() => {
  if (roomListener) {
    off(dbRef(db, `rooms/${roomCode}`))
  }
})

// Play Again: reset room back to waiting state
async function playAgain() {
  if (!isHost.value) return
  resetting.value = true

  try {
    const updates: Record<string, any> = {
      [`rooms/${roomCode}/status`]: 'waiting',
      [`rooms/${roomCode}/turnOrder`]: [],
      [`rooms/${roomCode}/currentTurnIndex`]: 0,
      [`rooms/${roomCode}/turnExpiresAt`]: 0,
      [`rooms/${roomCode}/calledNumbers`]: [],
      [`rooms/${roomCode}/winnerId`]: null,
    }

    // Reset each player's game state with a fresh board
    for (const uid of Object.keys(players.value)) {
      updates[`rooms/${roomCode}/players/${uid}/markedNumbers`] = []
      updates[`rooms/${roomCode}/players/${uid}/lettersEarned`] = []
      updates[`rooms/${roomCode}/players/${uid}/isWinner`] = false
      updates[`rooms/${roomCode}/players/${uid}/board`] = generateBoard(gridSize.value)
    }

    await update(dbRef(db), updates)
    // Navigation handled by the watcher above when status changes to 'waiting'
  } catch (err) {
    console.error('Failed to reset room:', err)
  } finally {
    resetting.value = false
  }
}

// Leave: go back to lobby
function leaveLobby() {
  router.push('/lobby')
}

// Rank suffix
function getRankSuffix(index: number): string {
  const rank = index + 1
  if (rank === 1) return '1st'
  if (rank === 2) return '2nd'
  if (rank === 3) return '3rd'
  return `${rank}th`
}
</script>

<template>
  <v-container class="py-6 d-flex flex-column align-center">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 60vh">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <template v-else>
      <!-- Winner Announcement Card -->
      <v-card
        width="520"
        class="mb-6 text-center pa-8"
        elevation="8"
        rounded="xl"
      >
        <!-- Trophy Icon -->
        <v-icon size="72" color="warning" class="mb-4">mdi-trophy</v-icon>

        <!-- Winner Name -->
        <div class="text-h4 font-weight-bold mb-2">
          {{ isWinnerMe ? 'You Win!' : `${winner?.displayName} Wins!` }}
        </div>

        <div class="text-body-1 text-medium-emphasis mb-6">
          {{ isWinnerMe ? 'Congratulations! You completed BINGO first!' : 'Better luck next time!' }}
        </div>

        <!-- Winner Avatar + Letters -->
        <div v-if="winner" class="d-flex flex-column align-center mb-6">
          <v-avatar size="80" class="mb-3" style="border: 3px solid rgb(var(--v-theme-warning));">
            <v-img :src="winner.photoURL || ''" />
          </v-avatar>

          <div class="d-flex ga-2 mt-2">
            <v-chip
              v-for="letter in bingoLetters"
              :key="letter"
              color="success"
              variant="flat"
              size="large"
              class="font-weight-bold"
              style="font-size: 1.2rem;"
            >
              {{ letter }}
            </v-chip>
          </div>
        </div>

        <!-- Game Stats -->
        <div class="d-flex justify-center ga-6 text-medium-emphasis mb-2">
          <div class="text-center">
            <div class="text-h6 font-weight-bold text-primary">{{ totalCalled }}</div>
            <div class="text-caption">Numbers Called</div>
          </div>
          <div class="text-center">
            <div class="text-h6 font-weight-bold text-primary">{{ standings.length }}</div>
            <div class="text-caption">Players</div>
          </div>
          <div class="text-center">
            <div class="text-h6 font-weight-bold text-primary">{{ gridSize }}×{{ gridSize }}</div>
            <div class="text-caption">Grid Size</div>
          </div>
        </div>
      </v-card>

      <!-- Final Standings -->
      <v-card width="520" elevation="4" rounded="xl" class="mb-6">
        <v-card-title class="pa-4">
          <v-icon class="mr-2">mdi-podium</v-icon>
          Final Standings
        </v-card-title>

        <v-divider />

        <v-list>
          <v-list-item
            v-for="(player, index) in standings"
            :key="player.uid"
            :class="{
              'bg-warning-darken-2': player.isWinner,
            }"
          >
            <template #prepend>
              <div class="d-flex align-center mr-3">
                <!-- Rank -->
                <v-chip
                  :color="index === 0 ? 'warning' : index === 1 ? 'grey' : index === 2 ? 'brown' : 'default'"
                  :variant="index < 3 ? 'flat' : 'tonal'"
                  size="small"
                  class="font-weight-bold mr-3"
                  style="min-width: 40px; justify-content: center;"
                >
                  {{ getRankSuffix(index) }}
                </v-chip>

                <v-avatar size="36">
                  <v-img :src="player.photoURL || ''" />
                </v-avatar>
              </div>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ player.displayName }}
              <v-chip
                v-if="player.uid === currentUserId"
                size="x-small"
                color="info"
                variant="tonal"
                class="ml-1"
              >
                You
              </v-chip>
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ player.markedCount }} numbers marked
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex ga-1">
                <v-chip
                  v-for="letter in bingoLetters"
                  :key="letter"
                  :color="player.lettersEarned.includes(letter) ? 'success' : 'default'"
                  :variant="player.lettersEarned.includes(letter) ? 'flat' : 'outlined'"
                  size="x-small"
                  class="font-weight-bold"
                >
                  {{ letter }}
                </v-chip>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Action Buttons -->
      <v-card width="520" elevation="4" rounded="xl">
        <v-card-text class="pa-4 d-flex ga-4">
          <!-- Play Again (Host only) -->
          <v-btn
            v-if="isHost"
            color="success"
            size="large"
            variant="flat"
            class="flex-grow-1"
            :loading="resetting"
            @click="playAgain"
          >
            <v-icon start>mdi-refresh</v-icon>
            Play Again
          </v-btn>

          <!-- Waiting message for non-host -->
          <v-btn
            v-if="!isHost"
            color="grey"
            size="large"
            variant="tonal"
            class="flex-grow-1"
            disabled
          >
            <v-icon start>mdi-clock-outline</v-icon>
            Waiting for host...
          </v-btn>

          <!-- Leave -->
          <v-btn
            color="default"
            size="large"
            variant="outlined"
            class="flex-grow-1"
            @click="leaveLobby"
          >
            <v-icon start>mdi-exit-to-app</v-icon>
            Leave
          </v-btn>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>