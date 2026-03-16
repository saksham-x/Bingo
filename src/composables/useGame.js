import { computed, ref } from 'vue';
import { auth, db } from '@/firebase';
import { onValue, ref as dbRef, update } from 'firebase/database';
import { useBingo } from './useBingo';
export function useGame(roomCode) {
    const roomData = ref(null);
    const players = ref({});
    const loading = ref(true);
    const { countCompletedLines, getLettersEarned, hasWon } = useBingo();
    const currentUserId = computed(() => auth.currentUser?.uid || '');
    const gridSize = computed(() => roomData.value?.gridSize || 5);
    const turnOrder = computed(() => roomData.value?.turnOrder || []);
    const currentTurnIndex = computed(() => roomData.value?.currentTurnIndex || 0);
    const calledNumbers = computed(() => roomData.value?.calledNumbers || []);
    const turnExpiresAt = computed(() => roomData.value?.turnExpiresAt || 0);
    const status = computed(() => roomData.value?.status || 'waiting');
    // Who's turn is it?
    const activePlayerId = computed(() => {
        if (turnOrder.value.length === 0)
            return '';
        return turnOrder.value[currentTurnIndex.value % turnOrder.value.length];
    });
    const isMyTurn = computed(() => activePlayerId.value === currentUserId.value);
    // Current player's data
    const myPlayerData = computed(() => players.value[currentUserId.value]);
    const myBoard = computed(() => myPlayerData.value?.board || []);
    const myMarkedNumbers = computed(() => myPlayerData.value?.markedNumbers || []);
    const myLetters = computed(() => myPlayerData.value?.lettersEarned || []);
    // Player list as array (ordered by turn order)
    const playerList = computed(() => {
        return turnOrder.value.map((uid) => ({
            uid,
            ...players.value[uid],
        })).filter((p) => p.displayName); // filter out undefined
    });
    // Subscribe to room data
    function subscribe() {
        const roomRef = dbRef(db, `rooms/${roomCode}`);
        onValue(roomRef, (snapshot) => {
            if (!snapshot.exists())
                return;
            const data = snapshot.val();
            const { players: playersData, ...room } = data;
            roomData.value = room;
            players.value = playersData || {};
            loading.value = false;
        });
    }
    // Call a number (on your turn)
    async function callNumber(number) {
        if (!isMyTurn.value)
            return;
        if (calledNumbers.value.includes(number))
            return;
        const user = auth.currentUser;
        if (!user)
            return;
        // 1. Add number to called numbers
        const newCalledNumbers = [...calledNumbers.value, number];
        // 2. Mark number on ALL players' boards + check for wins
        const updates = {
            [`rooms/${roomCode}/calledNumbers`]: newCalledNumbers,
            [`rooms/${roomCode}/currentTurnIndex`]: currentTurnIndex.value + 1,
            [`rooms/${roomCode}/turnExpiresAt`]: Date.now() + 20000,
        };
        // For each player, update their marked numbers and check lines
        let someoneWon = false;
        let winnerId = '';
        for (const [uid, playerData] of Object.entries(players.value)) {
            const board = playerData.board || [];
            const currentMarked = playerData.markedNumbers || [];
            // Check if this number exists on their board
            const flatBoard = board.flat();
            if (flatBoard.includes(number)) {
                const newMarked = [...currentMarked, number];
                updates[`rooms/${roomCode}/players/${uid}/markedNumbers`] = newMarked;
                // Check completed lines
                const completedLines = countCompletedLines(board, newMarked);
                const letters = getLettersEarned(completedLines, gridSize.value);
                updates[`rooms/${roomCode}/players/${uid}/lettersEarned`] = letters;
                // Check win
                if (hasWon(completedLines, gridSize.value)) {
                    someoneWon = true;
                    winnerId = uid;
                    updates[`rooms/${roomCode}/players/${uid}/isWinner`] = true;
                }
            }
        }
        // If someone won, update game status
        if (someoneWon) {
            updates[`rooms/${roomCode}/status`] = 'finished';
            updates[`rooms/${roomCode}/winnerId`] = winnerId;
        }
        await update(dbRef(db), updates);
    }
    // Auto-select a random unmarked number (for timeout)
    async function autoSelectNumber() {
        if (!isMyTurn.value)
            return;
        const board = myBoard.value.flat();
        const calledSet = new Set(calledNumbers.value);
        const unmarked = board.filter((n) => !calledSet.has(n));
        if (unmarked.length === 0)
            return;
        const randomNumber = unmarked[Math.floor(Math.random() * unmarked.length)];
        await callNumber(randomNumber);
    }
    // Unsubscribe
    function unsubscribe() {
        const roomRef = dbRef(db, `rooms/${roomCode}`);
        // Using off imported from firebase
        import('firebase/database').then(({ off }) => {
            off(roomRef);
        });
    }
    return {
        roomData,
        players,
        loading,
        gridSize,
        turnOrder,
        currentTurnIndex,
        calledNumbers,
        turnExpiresAt,
        status,
        activePlayerId,
        isMyTurn,
        myBoard,
        myMarkedNumbers,
        myLetters,
        playerList,
        currentUserId,
        subscribe,
        unsubscribe,
        callNumber,
        autoSelectNumber,
    };
}
