const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser())
app.use(cors())

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function runKataGoAnalysis(moves) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'ana.py'),
      '-moves', moves
    ]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const jsonOutput = JSON.parse(output);
          resolve(jsonOutput);
        } catch (error) {
          reject(new Error(`Failed to parse JSON output: ${error.message}`));
        }
      } else {
        reject(new Error(`Python script exited with code ${code}\nError: ${errorOutput}`));
      }
    });
  });
}

function parseMoves(input) {
  // 將輸入字符串轉換為 [("b",(3,3))] 格式
  return input.split(',').map(move => {
    const [color, position] = move.trim().split(' ');
    const x = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(position[0]);
    const y = parseInt(position.slice(1)) - 1;
    return `("${color}",(${y},${x}))`;
  });
}

async function getMoves() {
  return new Promise((resolve) => {
    rl.question('Enter the moves (e.g. "b D4, w Q16"), or "quit" to exit: ', (answer) => {
      resolve(answer.trim());
    });
  });
}

// async function main() {
//   while (true) {
//     const movesInput = await getMoves();
    
//     const moves = "[('b',(3,3)),('w',(3,1))]"
    
//     try {
//       console.log('Starting KataGo analysis...');
//       const result = await runKataGoAnalysis(moves);
//       console.log('KataGo analysis completed successfully.');
//       console.log('Result:');
//       console.log(`建議的下一步: ${result.next_move}`);
//       console.log(`黑棋勝率: ${result.black_win_rate}`);
//       console.log(`白棋勝率: ${result.white_win_rate}`);
//       console.log(`局勢評估: ${result.score_lead}`);
//       break;
//     } catch (error) {
//       console.error('Error running KataGo analysis:', error.message);
//     }
//   }
  
//   rl.close();
//   console.log('Thank you for using KataGo analysis!');
// }

app.post('/ana', async (req, res) => {
    const {
        moves
    } = req.body
    console.log(req.body.moves)
    const result = await runKataGoAnalysis(moves);
    console.log('KataGo analysis completed successfully.');
    console.log('Result:');
    console.log(`建議的下一步: ${result.next_move}`);
    console.log(`黑棋勝率: ${result.black_win_rate}`);
    console.log(`白棋勝率: ${result.white_win_rate}`);
    console.log(`局勢評估: ${result.score_lead}`);
    res.status(200).send(result) 
})

app.listen(3031, () => console.log('run'))