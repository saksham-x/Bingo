import { ref } from 'vue';
import { auth, db } from '@/firebase';
import { child, get, ref as dbRef, set } from 'firebase/database';
import { useRouter } from 'vue-router';
export function useRoom() {
    const router = useRouter();
    const error = ref('');
    const loading = ref(false);
    // Generate a random 6-char alphanumeric code
    function generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // removed ambiguous: 0,O,1,I
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    // Generate a random board (2D array) for a given grid size
    function generateBoard(gridSize) {
        const totalNumbers = gridSize * gridSize;
        const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        // Convert to 2D array
        const board = [];
        for (let row = 0; row < gridSize; row++) {
            board.push(numbers.slice(row * gridSize, (row + 1) * gridSize));
        }
        return board;
    }
    // Create a new room
    async function createRoom(gridSize) {
        const user = auth.currentUser;
        if (!user)
            return;
        loading.value = true;
        error.value = '';
        try {
            // Generate unique code
            let roomCode = generateRoomCode();
            const roomsRef = dbRef(db, 'rooms');
            // Check uniqueness (retry up to 5 times)
            let attempts = 0;
            while (attempts < 5) {
                const snapshot = await get(child(roomsRef, roomCode));
                if (!snapshot.exists())
                    break;
                roomCode = generateRoomCode();
                attempts++;
            }
            // Create room data
            const roomData = {
                gridSize,
                status: 'waiting',
                hostId: user.uid,
                turnOrder: [],
                currentTurnIndex: 0,
                turnExpiresAt: 0,
                calledNumbers: [],
                createdAt: Date.now(),
            };
            // Player data
            const playerData = {
                displayName: user.displayName || 'Anonymous',
                photoURL: user.photoURL || '',
                board: generateBoard(gridSize),
                markedNumbers: [],
                lettersEarned: [],
                isWinner: false,
            };
            // Write room + player atomically
            await set(dbRef(db, `rooms/${roomCode}`), roomData);
            await set(dbRef(db, `rooms/${roomCode}/players/${user.uid}`), playerData);
            router.push(`/room/${roomCode}`);
        }
        catch (err) {
            error.value = err.message || 'Failed to create room';
        }
        finally {
            loading.value = false;
        }
    }
    // Join an existing room
    async function joinRoom(roomCode) {
        const user = auth.currentUser;
        if (!user)
            return;
        loading.value = true;
        error.value = '';
        const code = roomCode.toUpperCase().trim();
        try {
            // Check if room exists
            const roomSnapshot = await get(dbRef(db, `rooms/${code}`));
            if (!roomSnapshot.exists()) {
                error.value = 'Room not found. Check the code and try again.';
                return;
            }
            const roomData = roomSnapshot.val();
            // Check if game already started
            if (roomData.status !== 'waiting') {
                error.value = 'This game has already started.';
                return;
            }
            // Check if player is already in the room
            const playerSnapshot = await get(dbRef(db, `rooms/${code}/players/${user.uid}`));
            if (playerSnapshot.exists()) {
                // Already joined, just navigate
                router.push(`/room/${code}`);
                return;
            }
            // Add player to room
            const playerData = {
                displayName: user.displayName || 'Anonymous',
                photoURL: user.photoURL || '',
                board: generateBoard(roomData.gridSize),
                markedNumbers: [],
                lettersEarned: [],
                isWinner: false,
            };
            await set(dbRef(db, `rooms/${code}/players/${user.uid}`), playerData);
            router.push(`/room/${code}`);
        }
        catch (err) {
            error.value = err.message || 'Failed to join room';
        }
        finally {
            loading.value = false;
        }
    }
    return {
        error,
        loading,
        createRoom,
        joinRoom,
        generateBoard,
    };
}
