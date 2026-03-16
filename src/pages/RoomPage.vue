<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db, auth } from '@/firebase'
import {
  ref as dbRef,
  onValue,
  update,
  off,
} from 'firebase/database'
import { useBoard } from '@/composables/useBoard'
import draggable from 'vuedraggable'

const route = useRoute()
const router = useRouter()
const roomCode = route.params.code as string

// Room state
const roomData = ref<any>(null)
const players = ref<Record<string, any>>({})
const loading = ref(true)
const starting = ref(false)

// Current user
const currentUserId = computed(() => auth.currentUser?.uid || '')
const isHost = computed(() => roomData.value?.hostId === currentUserId.value)

// Player list as array
const playerList = computed(() => {
  return Object.entries(players.value).map(([uid, data]) => ({
    uid,
    ...data,
  }))
})

// Board setup (initialized after room data loads)
let boardComposable: ReturnType<typeof useBoard> | null = null
const flatBoard = ref<number[]>([])
const gridSize = computed(() => roomData.value?.gridSize || 5)

// Clipboard copy
const copied = ref(false)
function copyCode() {
  navigator.clipboard.writeText(roomCode)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

// Firebase listeners
let roomListener: any = null

onMounted(() => {
  // Listen to room data (excluding players)
  const roomRef = dbRef(db, `rooms/${roomCode}`)
  roomListener = onValue(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      router.push('/lobby')
      return
    }

    const data = snapshot.val()

    // Separate players from room data
    const { players: playersData, ...room } = data
    roomData.value = room
    players.value = playersData || {}

    // Initialize board composable once we have player data
    const currentPlayer = playersData?.[currentUserId.value]
    if (currentPlayer?.board && !boardComposable) {
      boardComposable = useBoard(roomCode, currentPlayer.board)
      flatBoard.value = boardComposable.flatBoard.value

      // Keep flatBoard in sync
      watch(boardComposable.flatBoard, (newVal) => {
        flatBoard.value = newVal
      })
    }

    // If game started, navigate to game page
    if (room.status === 'playing') {
      router.push(`/game/${roomCode}`)
    }

    loading.value = false
  })
})

onUnmounted(() => {
  if (roomListener) {
    off(dbRef(db, `rooms/${roomCode}`))
  }
})

// Drag & drop end handler
function onDragEnd() {
  if (boardComposable) {
    boardComposable.flatBoard.value = [...flatBoard.value]
    boardComposable.onDragEnd()
  }
}

// Randomize board
function handleRandomize() {
  if (boardComposable) {
    boardComposable.randomize()
    flatBoard.value = boardComposable.flatBoard.value
  }
}

// Host starts the game
async function startGame() {
  if (!isHost.value) return
  if (playerList.value.length < 2) return

  starting.value = true

  try {
    // Build turn order: host first, then others shuffled
    const otherPlayerIds = playerList.value
      .filter((p) => p.uid !== currentUserId.value)
      .map((p) => p.uid)

    // Shuffle others
    for (let i = otherPlayerIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[otherPlayerIds[i], otherPlayerIds[j]] = [otherPlayerIds[j], otherPlayerIds[i]]
    }

    const turnOrder = [currentUserId.value, ...otherPlayerIds]

    await update(dbRef(db, `rooms/${roomCode}`), {
      status: 'playing',
      turnOrder,
      currentTurnIndex: 0,
      calledNumbers: [],
      turnExpiresAt: Date.now() + 20000,
    })
  } catch (err) {
    console.error('Failed to start game:', err)
  } finally {
    starting.value = false
  }
}
</script>

<template>
  <v-container class="py-6">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 60vh">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <template v-else>
      <!-- Room Header -->
      <v-card class="mb-6 pa-4" elevation="4" rounded="xl">
        <div class="d-flex align-center flex-wrap ga-4">
          <div>
            <div class="text-h5 font-weight-bold">
              <v-icon color="primary" class="mr-1">mdi-dice-multiple</v-icon>
              Waiting Room
            </div>
            <div class="text-body-2 text-medium-emphasis mt-1">
              Grid: {{ gridSize }}×{{ gridSize }} · {{ gridSize }} lines to win
            </div>
          </div>

          <v-spacer />

          <!-- Room Code -->
          <v-chip
            size="x-large"
            variant="tonal"
            color="primary"
            @click="copyCode"
            style="letter-spacing: 4px; font-size: 1.2rem; cursor: pointer;"
          >
            <v-icon start>{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
            {{ roomCode }}
          </v-chip>
        </div>
      </v-card>

      <v-row>
        <!-- Left Column: Players List -->
        <v-col cols="12" md="5">
          <v-card elevation="4" rounded="xl">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              Players ({{ playerList.length }})
            </v-card-title>

            <v-divider />

            <v-list>
              <v-list-item
                v-for="player in playerList"
                :key="player.uid"
                :title="player.displayName"
                :subtitle="player.uid === roomData.hostId ? 'Host' : 'Player'"
              >
                <template #prepend>
                  <v-avatar size="36" class="mr-3">
                    <v-img :src="player.photoURL || ''" />
                  </v-avatar>
                </template>
                <template #append>
                  <v-chip
                    v-if="player.uid === roomData.hostId"
                    size="small"
                    color="warning"
                    variant="tonal"
                  >
                    <v-icon start size="14">mdi-crown</v-icon>
                    Host
                  </v-chip>
                  <v-chip
                    v-if="player.uid === currentUserId"
                    size="small"
                    color="info"
                    variant="tonal"
                    class="ml-1"
                  >
                    You
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>

            <!-- Start Game Button (Host only) -->
            <v-card-actions v-if="isHost" class="pa-4">
              <v-btn
                color="success"
                size="large"
                block
                :loading="starting"
                :disabled="playerList.length < 2"
                @click="startGame"
              >
                <v-icon start>mdi-play</v-icon>
                Start Game
              </v-btn>
              <div v-if="playerList.length < 2" class="text-caption text-medium-emphasis mt-2 text-center w-100">
                Need at least 2 players to start
              </div>
            </v-card-actions>

            <!-- Waiting message (non-host) -->
            <v-card-text v-else class="text-center text-medium-emphasis">
              <v-icon class="mr-1">mdi-clock-outline</v-icon>
              Waiting for host to start the game...
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Board Setup -->
        <v-col cols="12" md="7">
          <v-card elevation="4" rounded="xl">
            <v-card-title class="d-flex align-center pa-4">
              <v-icon class="mr-2">mdi-grid</v-icon>
              Your Board
              <v-spacer />
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                @click="handleRandomize"
              >
                <v-icon start>mdi-shuffle</v-icon>
                Randomize
              </v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-4">
              <p class="text-body-2 text-medium-emphasis mb-4">
                Drag and drop numbers to rearrange your board. Click Randomize for a fresh shuffle.
              </p>

              <!-- Drag & Drop Grid -->
              <draggable
                v-model="flatBoard"
                item-key="element"
                class="d-grid"
                :style="{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gap: '8px',
                  maxWidth: gridSize <= 3 ? '280px' : '400px',
                  margin: '0 auto',
                }"
                @end="onDragEnd"
              >
                <template #item="{ element }">
                  <v-card
                    :key="element"
                    class="d-flex align-center justify-center"
                    :style="{
                      aspectRatio: '1',
                      cursor: 'grab',
                      userSelect: 'none',
                      fontSize: gridSize <= 3 ? '1.4rem' : '1.1rem',
                      fontWeight: 'bold',
                    }"
                    color="surface-variant"
                    variant="tonal"
                    rounded="lg"
                    elevation="2"
                  >
                    {{ element }}
                  </v-card>
                </template>
              </draggable>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>