export function useBingo() {

  /**
   * Given a board (2D array) and a set of marked numbers,
   * returns the total number of completed lines (rows + cols + diagonals)
   */
  function countCompletedLines(board: number[][], markedNumbers: number[]): number {
    const gridSize = board.length
    const marked = new Set(markedNumbers)
    let completedLines = 0

    // Check rows
    for (let row = 0; row < gridSize; row++) {
      if (board[row].every((num) => marked.has(num))) {
        completedLines++
      }
    }

    // Check columns
    for (let col = 0; col < gridSize; col++) {
      let colComplete = true
      for (let row = 0; row < gridSize; row++) {
        if (!marked.has(board[row][col])) {
          colComplete = false
          break
        }
      }
      if (colComplete) completedLines++
    }

    // Check main diagonal (top-left to bottom-right)
    let mainDiag = true
    for (let i = 0; i < gridSize; i++) {
      if (!marked.has(board[i][i])) {
        mainDiag = false
        break
      }
    }
    if (mainDiag) completedLines++

    // Check anti diagonal (top-right to bottom-left)
    let antiDiag = true
    for (let i = 0; i < gridSize; i++) {
      if (!marked.has(board[i][gridSize - 1 - i])) {
        antiDiag = false
        break
      }
    }
    if (antiDiag) completedLines++

    return completedLines
  }

  /**
   * Given completed line count and grid size, return the letters earned
   */
  function getLettersEarned(completedLines: number, gridSize: number): string[] {
    const allLetters = ['B', 'I', 'N', 'G', 'O']
    // Only use first `gridSize` letters
    const availableLetters = allLetters.slice(0, gridSize)
    return availableLetters.slice(0, Math.min(completedLines, gridSize))
  }

  /**
   * Check if a player has won
   */
  function hasWon(completedLines: number, gridSize: number): boolean {
    return completedLines >= gridSize
  }

  return {
    countCompletedLines,
    getLettersEarned,
    hasWon,
  }
}