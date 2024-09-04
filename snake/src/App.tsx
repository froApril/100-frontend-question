import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Position {
  x: number;
  y: number;
}

interface Snake {
  head: Position;
  body: Position[];
}

const randomPosition = () => {
  return Math.floor(Math.random() * 20);
};

const App = () => {
  const [stage, setStage] = useState<number[][]>([]);
  const [food, setFood] = useState<Position>({
    x: randomPosition(),
    y: randomPosition(),
  });

  const [snake, setSnake] = useState<Snake>({
    head: {
      x: randomPosition(),
      y: randomPosition(),
    },
    body: [],
  });

  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  useEffect(() => {
    console.log(snakeRef.current);
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  // update stage
  useEffect(() => {
    const newStage = [];
    for (let i = 0; i < 20; i++) {
      const row = [];
      for (let j = 0; j < 20; j++) {
        if (i == food.y && j == food.x) {
          row.push(1);
        } else if (i == snake.head.y && j == snake.head.x) {
          row.push(2);
        } else {
          if (snake.body.find((pos) => pos.x == j && pos.y == i)) {
            row.push(3);
          } else {
            row.push(0);
          }
        }
      }
      newStage.push(row);
    }
    setStage([...newStage]);
  }, [snake]);

  const move = (dx: number, dy: number) => {
    // remove the last at the body
    // set head to new position
    let newSnake = { ...snakeRef.current };
    let newFood = { ...foodRef.current };

    if (
      newSnake.head.x + dx < 0 ||
      newSnake.head.x + dx >= 20 ||
      newSnake.head.y + dy < 0 ||
      newSnake.head.y + dy >= 20 ||
      (newSnake.body.length > 0 &&
        newSnake.head.x + dx == newSnake.body[0].x &&
        newSnake.head.y + dy == newSnake.body[0].y) ||
      newSnake.body.find(
        (pos) => newSnake.head.x + dx == pos.x && newSnake.head.y + dy == pos.y
      )
    ) {
      console.log(
        newSnake.body.find(
          (pos) =>
            newSnake.head.x + dx == pos.x && newSnake.head.y + dy == pos.y
        )
      );
      return;
    }
    if (newSnake.body.length > 0) {
      newSnake.body.pop();
      newSnake.body.unshift(newSnake.head);
    }
    newSnake.head = {
      x: newSnake.head.x + dx,
      y: newSnake.head.y + dy,
    };

    if (newSnake.head.x == newFood.x && newSnake.head.y == newFood.y) {
      if (newSnake.body.length > 0) {
        newSnake.body.push({
          x: snakeRef.current.body[snakeRef.current.body.length - 1].x - dx,
          y: snakeRef.current.body[snakeRef.current.body.length - 1].y - dy,
        });
      } else {
        newSnake.body.push({
          x: snakeRef.current.head.x,
          y: snakeRef.current.head.y,
        });
      }
      setFood(() => {
        let res = { x: randomPosition(), y: randomPosition() };
        while (
          (snake.head.x === res.x && snake.head.y === res.y) ||
          snake.body.find((pos) => pos.x === res.x && pos.y === res.y)
        ) {
          res = { x: randomPosition(), y: randomPosition() };
        }
        return res;
      });
    }
    setSnake({ ...newSnake });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          move(-1, 0);
          break;
        case "ArrowRight":
          move(1, 0);
          break;
        case "ArrowUp":
          move(0, -1);
          break;
        case "ArrowDown":
          move(0, 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-[1000px] h-[1000px]">
          <div className="grid grid-cols-20">
            {stage.flat().map((cell, index) => {
              if (cell == 0) {
                return (
                  <div key={index} className="bg-blue-200 p-6 border"></div>
                );
              } else if (cell == 1) {
                return (
                  <div
                    key={index}
                    className="flex bg-blue-200 p-6 border food"
                  ></div>
                );
              } else if (cell == 2) {
                return (
                  <div
                    key={index}
                    className="flex bg-yellow-200 p-6 border"
                  ></div>
                );
              } else if (cell == 3) {
                return (
                  <div
                    key={index}
                    className="flex bg-green-200 p-6 border"
                  ></div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
