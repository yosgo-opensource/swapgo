export function visualizeGoBoard(intersections, size) {
    if (![9, 13, 19].includes(size)) {
      return "Invalid board size. Please use 9, 13, or 19.";
    }
  
    let board = "";
    const symbols = {
      empty: "⋅",
      black: "●",
      white: "○",
    };
  
    for (let y = 0; y < size; y++) {
      let row = "";
      for (let x = 0; x < size; x++) {
        const intersection = intersections.find((i) => i.x === x && i.y === y);
        row += symbols[intersection.value] + " ";
      }
      board += row.trim() + "\n";
    }
  
    return board;
  }