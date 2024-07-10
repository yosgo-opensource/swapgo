"""
This is a simple python program that demonstrates how to run KataGo's
analysis engine as a subprocess and send it a query. It queries the
result of playing the 4-4 point on an empty board and prints out
the json response.
"""

import argparse
import json
import subprocess
import time
from threading import Thread
import sgfmill
import sgfmill.boards
import sgfmill.ascii_boards
from typing import Tuple, List, Optional, Union, Literal, Any, Dict
import ast

Color = Union[Literal["b"],Literal["w"]]
Move = Union[None,Literal["pass"],Tuple[int,int]]

def sgfmill_to_str(move: Move) -> str:
    if move is None:
        return "pass"
    if move == "pass":
        return "pass"
    (y,x) = move
    return "ABCDEFGHJKLMNOPQRSTUVWXYZ"[x] + str(y+1)

class KataGo:

    def __init__(self, katago_path: str, config_path: str, model_path: str, additional_args: List[str] = []):
        self.query_counter = 0
        katago = subprocess.Popen(
            ["./katago", "analysis", "-config", "./ana.cfg", "-model", "./g170e-b20c256x2-s5303129600-d1228401921.bin.gz", *additional_args],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        self.katago = katago
        def printforever():
            while katago.poll() is None:
                data = katago.stderr.readline()
                time.sleep(0)
                # if data:
                #     print("KataGo: ", data.decode(), end="")
            data = katago.stderr.read()
            # if data:
            #     print("KataGo: ", data.decode(), end="")
        self.stderrthread = Thread(target=printforever)
        self.stderrthread.start()

    def close(self):
        self.katago.stdin.close()


    def query(self, initial_board: sgfmill.boards.Board, moves: List[Tuple[Color,Move]], komi: float, max_visits=None):
        query = {}

        query["id"] = str(self.query_counter)
        self.query_counter += 1

        query["moves"] = [(color,sgfmill_to_str(move)) for color, move in moves]
        query["initialStones"] = []
        for y in range(initial_board.side):
            for x in range(initial_board.side):
                color = initial_board.get(y,x)
                if color:
                    query["initialStones"].append((color,sgfmill_to_str((y,x))))
        query["rules"] = "Chinese"
        query["komi"] = komi
        query["boardXSize"] = initial_board.side
        query["boardYSize"] = initial_board.side
        query["includePolicy"] = True
        if max_visits is not None:
            query["maxVisits"] = max_visits
        return self.query_raw(query)

    def query_raw(self, query: Dict[str,Any]):
        self.katago.stdin.write((json.dumps(query) + "\n").encode())
        self.katago.stdin.flush()

        # print(json.dumps(query))

        line = ""
        while line == "":
            if self.katago.poll():
                time.sleep(1)
                raise Exception("Unexpected katago exit")
            line = self.katago.stdout.readline()
            line = line.decode().strip()
            # print("Got: " + line)
        response = json.loads(line)

        # print(response)
        return response

if __name__ == "__main__":
    description = """
    Example script showing how to run KataGo analysis engine and query it from python.
    """
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument(
        "-katago-path",
        help="Path to katago executable",
        required=False,
    )
    parser.add_argument(
        "-config-path",
        help="Path to KataGo analysis config (e.g. cpp/configs/analysis_example.cfg in KataGo repo)",
        required=False,
    )
    parser.add_argument(
        "-model-path",
        help="Path to neural network .bin.gz file",
        required=False,
    )
    parser.add_argument("-moves", help="String representation of moves list (e.g. '[('b',(3,3)),('w',(15,15))]')", required=True)
    args = vars(parser.parse_args())
    # print(args)

    katago = KataGo(args["katago_path"], args["config_path"], args["model_path"])

    board = sgfmill.boards.Board(9)
    komi = 6.5
    moves = ast.literal_eval(args["moves"])

    # displayboard = board.copy()
    # for color, move in moves:
    #     if move != "pass":
    #         row,col = move
    #         displayboard.play(row,col,color)
    # print(sgfmill.ascii_boards.render_board(displayboard))

    # print("Query result: ")
    response = katago.query(board, moves, komi)
    policy = response["moveInfos"]
    root_info = response["rootInfo"]
    # 找出最高概率的移動
    best_move = max(policy, key=lambda x: x["prior"])
    # 對移動按概率排序
    sorted_moves = sorted(policy, key=lambda x: x["prior"], reverse=True)

    # 選取所有可用的移動，最多5個
    top_moves = sorted_moves[:min(5, len(sorted_moves))]

    # print(f"建議的下一步: {best_move['move']}, 概率: {best_move['prior']}")

    # 計算並顯示勝率
    black_win_rate = root_info["winrate"] * 100
    white_win_rate = 100 - black_win_rate

    # print(f"黑棋勝率: {black_win_rate:.2f}%")
    # print(f"白棋勝率: {white_win_rate:.2f}%")

    # 顯示局勢評估
    score_lead = root_info["scoreLead"]
    # print(f"局勢評估: {'黑棋領先' if score_lead > 0 else '白棋領先'} {abs(score_lead):.2f} 目")

    output = {
        "pv": f"{policy[0]["pv"]}",
        "next_move": f"{best_move['move']}, 概率: {best_move['prior']:.9f}",
        "top_moves": [
            {
                "move": move["move"],
                "probability": f"{move['prior']:.9f}"
            } for move in top_moves
        ],
        "black_win_rate": f"{black_win_rate:.2f}%",
        "white_win_rate": f"{white_win_rate:.2f}%",
        "score_lead": f"{'黑棋領先' if score_lead > 0 else '白棋領先'} {abs(score_lead):.2f} 目"
    }

    print(json.dumps(output, ensure_ascii=False))

    katago.close()