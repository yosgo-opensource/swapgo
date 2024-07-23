// file: components/baseScreenWritingTemplate.js

import { visualizeGoBoard } from "./visualizeGoBoard";

export const getBaseScreenWritingTemplate = ({
  player,
  playerColor,
  aiColor,
  whoFirst,
  currentState,
  aiResponse,
  battle,
  screenWriting
}) => 
  `
This is a Go game, and your mission is to translate the situation on the board into a historical battle.

The player's name is ${player}, representing the ${playerColor} side. The opponent is AI, representing the ${aiColor} side. ${whoFirst} goes first.
The number of black stones captured is ${currentState?.blackStonesCaptured}, and the number of white stones captured is ${currentState?.whiteStonesCaptured}.

${
  aiResponse
    ? `The opponent (which is made by KataGo AI) played at position ${aiResponse.next_move_number_format}
    The current analysis of the situation is ${aiResponse?.score_lead}
    The win rates are: Black: ${aiResponse?.black_win_rate}, White: ${aiResponse?.white_win_rate},
`
    : ""
}

The current board state is:
${
  currentState?.intersections &&
  visualizeGoBoard(currentState?.intersections, currentState.boardSize)
}

${
  currentState?.playedPoint
    ? `The player played at position [${currentState?.playedPoint.x}, ${currentState?.playedPoint.y}]`
    : ""
}

The battle is ${battle.name}

Black side is ${battle.black}, White side is ${battle.white}

${
  screenWriting.length > 0 &&
  `Previous narratives:
${screenWriting.map((s, index) => `${index}.${s.description}`).join("\n")}`
}
`
  
//   `
// 這是一場圍棋比賽，而你的任務就是轉譯，把棋盤上的局勢描述成歷史上的戰役

// 玩家的名稱是 ${player} 代表 ${playerColor} 方，對手是 AI 代表 ${aiColor} 方，由 ${whoFirst} 先手
// 黑子被吃掉的數量是 ${currentState?.blackStonesCaptured}，白子被吃掉的數量是 ${currentState?.whiteStonesCaptured}

// ${
//   aiResponse
//     ? `對手下在了 ${aiResponse.next_move_number_format} 位置
//     即時分析的局勢是 ${aiResponse?.score_lead}
//     勝率分別是黑：${aiResponse?.black_win_rate} 與白：${aiResponse?.white_win_rate}，
// `
//     : ""
// }

// 目前的棋盤是 
// ${
//   currentState?.intersections &&
//   visualizeGoBoard(currentState?.intersections, currentState.boardSize)
// }

// ${
//   currentState?.playedPoint
//     ? `玩家下在了 [${currentState?.playedPoint.x}, ${currentState?.playedPoint.y}] 的位置`
//     : ""
// }

// 戰役的部分是 ${battle.name}

// 黑方是 ${battle.black}，白方是 ${battle.white}

// ${
//   screenWriting.length > 0 &&
//   `先前有以下劇情
// ${screenWriting.map((s, index) => `${index}.${s.description}`).join("\n")}`
// }
// `
;

export const getBasePromptEnd = 

// `description: 30字的英文
// imgPrompt: 搭配劇情的生成圖片提示詞，請你搭配使用此基本風格 sketch style, black and white illustration, soft pencil lines, minimalist details, vintage look, beige background

// 另外就是圖片提示詞可能要注意安全政策(Safe Policy)，在不影響生成圖片的精彩度之下，避免一些過於細節暴力、血腥的場景

// 最後請你直接回應 JSON 格式的字串，例如下方

// {
//     description: ""
//     imgPrompt: ""
// }
// `;

`
description: 30 words in English
imgPrompt: Image generation prompt that matches the narrative. Please use this basic style: sketch style, black and white illustration, soft pencil lines, minimalist details, vintage look, beige background

Please note that the image prompt should adhere to safety policies (Safe Policy). While maintaining the vividness of the generated image, avoid overly detailed violent or bloody scenes.

Please always respond directly with a JSON formatted string, as shown below:

{
    "description": "",
    "imgPrompt": ""
}
`;