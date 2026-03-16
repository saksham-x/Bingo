<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGame } from '@/composables/useGame'
import { useTimer } from '@/composables/useTimer'

const route = useRoute()
const router = useRouter()
const roomCode = route.params.code as string

const game = useGame(roomCode)
const timer = useTimer()

// Subscribe to game state
onMounted(() => {
  game.subscribe()
})

onUnmounted(() => {
  game.unsubscribe()
  timer.stop()
})

// Watch for game status changes
watch(
  () => game.status.value,
  (newStatus) => {
    if (newStatus === 'finished') {
      timer.stop()
      router.push(`/result/${roomCode}`)
    }
  }
)

// Watch for turn changes → restart timer
watch(
  () => game.turnExpiresAt.value,
  (newExpiresAt) => {
    if (!newExpiresAt || game.status.value !== 'playing') return

    timer.startFromTimestamp(newExpiresAt, () => {
      // Only the active player auto-selects
      if (game.isMyTurn.value) {
        game.autoSelectNumber()
      }
    })
  }
)

// Is a number callable? (my turn + not already called)
function isCallable(num: number): boolean {
  return game.isMyTurn.value && !game.calledNumbers.value.includes(num)
}

// Is a number marked on my board?
function isMarked(num: number): boolean {
  return game.myMarkedNumbers.value.includes(num)
}

// Handle clicking a number on my board
async function handleCellClick(num: number) {
  if (!isCallable(num)) return
  await game.callNumber(num)
}

// Active player name
const activePlayerName = computed(() => {
  const player = game.players.value[game.activePlayerId.value]
  if (!player) return ''
  if (game.activePlayerId.value === game.currentUserId.value) return 'Your'
  return `${player.displayName}'s`
})

// BINGO letters for display based on grid size
const bingoLetters = computed(() => {
  const all = ['B', 'I', 'N', 'G', 'O']
  return all.slice(0, game.gridSize.value)
})

// Get letters earned for any player
function getPlayerLetters(uid: string): string[] {
  return game.players.value[uid]?.lettersEarned || []
}

// Timer color
const timerColor = computed(() => {
  if (timer.secondsLeft.value <= 5) return 'error'
  if (timer.secondsLeft.value <= 10) return 'warning'
  return 'primary'
})
</script>

<template>
  <v-container class="py-4" fluid>
    <!-- Loading -->
    <div v-if="game.loading.value" class="d-flex justify-center align-center" style="min-height: 60vh">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <template v-else>
      <!-- Top Bar: Turn Indicator + Timer -->
      <v-card class="mb-4 pa-4" elevation="4" rounded="xl">
        <div class="d-flex align-center flex-wrap ga-4">
          <!-- Turn indicator -->
          <div class="d-flex align-center">
            <v-avatar
              v-if="game.players.value[game.activePlayerId.value]"
              size="40"
              class="mr-3"
            >
              <v-img :src="game.players.value[game.activePlayerId.value]?.photoURL || ''" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">
                {{ activePlayerName }} Turn
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ game.isMyTurn.value ? 'Click a number on your board!' : 'Waiting...' }}
              </div>
            </div>
          </div>

          <v-spacer />

          <!-- Timer -->
          <v-chip
            :color="timerColor"
            size="x-large"
            variant="tonal"
            class="font-weight-bold"
            style="font-size: 1.3rem; min-width: 80px; justify-content: center;"
          >
            <v-icon start>mdi-clock-outline</v-icon>
            {{ timer.secondsLeft.value }}s
          </v-chip>
        </div>

        <!-- Your turn alert -->
        <v-alert
          v-if="game.isMyTurn.value"
          type="info"
          variant="tonal"
          density="compact"
          class="mt-3"
        >
          It's your turn! Pick a number from your board.
        </v-alert>
      </v-card>

      <v-row>
        <!-- Left Column: My Board -->
        <v-col cols="12" md="7">
          <v-card elevation="4" rounded="xl">
            <v-card-title class="d-flex align-center pa-4">
              <v-icon class="mr-2">mdi-grid</v-icon>
              Your Board

              <v-spacer />

              <!-- My BINGO Letters -->
              <div class="d-flex ga-1">
                <v-chip
                  v-for="letter in bingoLetters"
                  :key="letter"
                  :color="game.myLetters.value.includes(letter) ? 'success' : 'default'"
                  :variant="game.myLetters.value.includes(letter) ? 'flat' : 'outlined'"
                  size="small"
                  class="font-weight-bold"
                >
                  {{ letter }}
                </v-chip>
              </div>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-4">
              <!-- Board Grid (flattened to avoid nested v-for issue) -->
              <div
                :style="{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${game.gridSize.value}, 1fr)`,
                  gap: '8px',
                  maxWidth: game.gridSize.value <= 3 ? '320px' : '450px',
                  margin: '0 auto',
                }"
              >
                <v-card
                  v-for="(num, idx) in game.myBoard.value.flat()"
                  :key="idx"
                  class="d-flex align-center justify-center"
                  :style="{
                    aspectRatio: '1',
                    cursor: isCallable(num) ? 'pointer' : 'default',
                    fontSize: game.gridSize.value <= 3 ? '1.5rem' : '1.2rem',
                    fontWeight: 'bold',
                    opacity: isMarked(num) ? 1 : 0.9,
                    transition: 'all 0.2s ease',
                  }"
                  :color="isMarked(num) ? 'primary' : 'surface-variant'"
                  :variant="isMarked(num) ? 'flat' : 'tonal'"
                  :elevation="isCallable(num) ? 4 : 1"
                  rounded="lg"
                  @click="handleCellClick(num)"
                >
                  <v-icon v-if="isMarked(num)" size="14" class="mr-1">mdi-check</v-icon>
                  {{ num }}
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Players + Called Numbers -->
        <v-col cols="12" md="5">
          <!-- Players Status -->
          <v-card elevation="4" rounded="xl" class="mb-4">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              Players
            </v-card-title>

            <v-divider />

            <v-list density="compact">
              <v-list-item
                v-for="player in game.playerList.value"
                :key="player.uid"
                :class="{ 'bg-primary-darken-2': player.uid === game.activePlayerId.value }"
              >
                <template #prepend>
                  <v-avatar size="32" class="mr-3">
                    <v-img :src="player.photoURL || ''" />
                  </v-avatar>
                </template>

                <v-list-item-title class="d-flex align-center">
                  {{ player.displayName }}
                  <v-icon
                    v-if="player.uid === game.activePlayerId.value"
                    size="16"
                    color="warning"
                    class="ml-1"
                  >
                    mdi-arrow-left-bold
                  </v-icon>
                </v-list-item-title>

                <template #append>
                  <div class="d-flex ga-1">
                    <v-chip
                      v-for="letter in bingoLetters"
                      :key="letter"
                      :color="getPlayerLetters(player.uid).includes(letter) ? 'success' : 'default'"
                      :variant="getPlayerLetters(player.uid).includes(letter) ? 'flat' : 'outlined'"
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

          <!-- Called Numbers Log -->
          <v-card elevation="4" rounded="xl">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-history</v-icon>
              Called Numbers ({{ game.calledNumbers.value.length }})
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-4">
              <div v-if="game.calledNumbers.value.length === 0" class="text-medium-emphasis text-center">
                No numbers called yet
              </div>
              <div v-else class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="(num, idx) in [...game.calledNumbers.value].reverse()"
                  :key="idx"
                  :color="idx === 0 ? 'primary' : 'default'"
                  :variant="idx === 0 ? 'flat' : 'tonal'"
                  size="small"
                >
                  {{ num }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>