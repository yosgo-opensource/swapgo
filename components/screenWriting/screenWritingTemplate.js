import { getBaseScreenWritingTemplate, getBasePromptEnd } from './baseScreenWritingTemplate';

export const getScreenWritingTemplate = (params) => `
${getBaseScreenWritingTemplate(params)}

Now, using the rules of Go and your imagination, please describe the current battle situation and provide an image prompt for this scene.

${getBasePromptEnd}
`;
// Mandarin Prompt : 接下來請你使用圍棋的規則與想像力，把當前的戰況劇情描述出來，並提供該劇情場景所需的圖片提示詞


export const getEndGameScreenWritingTemplate = (params) => `
${getBaseScreenWritingTemplate(params)}

The game has now reached its conclusion. The player is ${params.player}, representing the ${params.playerColor} side, while the opponent is AI, representing the ${params.aiColor} side. This match is about to end.

The win rate for black is ${params.aiResponse?.black_win_rate}, and for white is ${params.aiResponse?.white_win_rate}. The current situation is ${params.aiResponse?.score_lead}
The current state of affairs is: ${params.aiResponse?.score_lead}

Please provide a concluding narrative for this match and generate an image prompt for the final scene.

${getBasePromptEnd}
`;

// 現在有人發動了棋盤的判決，玩家是 ${params.player}，代表 ${params.playerColor} 方，對手是 AI，代表 ${params.aiColor} 方，這場比賽將會結束

// 黑子的勝率是 ${params.aiResponse?.black_win_rate}，白子的勝率是 ${params.aiResponse?.white_win_rate}，目前的局勢是 ${params.aiResponse?.score_lead}
// 目前情勢是：${params.aiResponse?.score_lead}

// 請為這場比賽做結束的劇情描述與圖片生成提示詞