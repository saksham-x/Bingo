import { ref } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, update } from 'firebase/database';
export function useBoard(roomCode, initialBoard) {
    const board = ref(JSON.parse(JSON.stringify(initialBoard)));
    // Flatten board to 1D for drag & drop, then rebuild to 2D
    const flatBoard = ref(board.value.flat());
    function rebuildBoard() {
        const gridSize = board.value.length;
        const newBoard = [];
        for (let row = 0; row < gridSize; row++) {
            newBoard.push(flatBoard.value.slice(row * gridSize, (row + 1) * gridSize));
        }
        board.value = newBoard;
    }
    // Randomize the board
    function randomize() {
        const gridSize = board.value.length;
        const totalNumbers = gridSize * gridSize;
        const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        flatBoard.value = numbers;
        rebuildBoard();
    }
    // Save board to Firebase
    async function saveBoard() {
        const user = auth.currentUser;
        if (!user)
            return;
        rebuildBoard();
        await update(dbRef(db, `rooms/${roomCode}/players/${user.uid}`), {
            board: board.value,
        });
    }
    // Called after drag & drop ends
    function onDragEnd() {
        rebuildBoard();
        saveBoard();
    }
    // Randomize and save
    function randomizeAndSave() {
        randomize();
        saveBoard();
    }
    return {
        board,
        flatBoard,
        rebuildBoard,
        randomize: randomizeAndSave,
        onDragEnd,
        saveBoard,
    };
}
