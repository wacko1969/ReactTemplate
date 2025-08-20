import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  GiMushroomGills,
  GiCoffin,
  GiSpy,
  GiDeadHead,
  GiSasquatch,
} from "react-icons/gi";

type SquareTableProps = {
  rows: number;
  cols: number;
};

const getTableState = (rows: number, cols: number) => {
  const totalCells = rows * cols;
  const iconCount = Math.floor(totalCells * 0.05);

  // Generate unique random positions for coffins
  const coffinPositions = new Set<number>();
  while (coffinPositions.size < iconCount) {
    coffinPositions.add(Math.floor(Math.random() * totalCells));
  }

  // Generate unique random positions for mushrooms, avoiding coffins
  const mushroomPositions = new Set<number>();
  while (mushroomPositions.size < iconCount) {
    const pos = Math.floor(Math.random() * totalCells);
    if (!coffinPositions.has(pos) && !mushroomPositions.has(pos)) {
      mushroomPositions.add(pos);
    }
  }

  // Find all empty cells
  const emptyCells: number[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (!coffinPositions.has(i) && !mushroomPositions.has(i)) {
      emptyCells.push(i);
    }
  }

  // Pick one random empty cell for GiSpy
  let spyStartCell: number | null = null;
  if (emptyCells.length > 0) {
    spyStartCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  // Place four GiSasquatch in yellow, not within one cell of GiSpy
  const sasquatchCells = new Set<number>();
  if (spyStartCell !== null) {
    // Helper to check if a cell is within one cell of GiSpy
    const spyX = spyStartCell % cols;
    const spyY = Math.floor(spyStartCell / cols);
    const isNearSpy = (idx: number) => {
      const x = idx % cols;
      const y = Math.floor(idx / cols);
      return Math.abs(x - spyX) <= 1 && Math.abs(y - spyY) <= 1;
    };
    // Filter open cells not near GiSpy
    const openCells = emptyCells.filter(
      (idx) => idx !== spyStartCell && !isNearSpy(idx)
    );
    // Randomly pick 4 unique cells for GiSasquatch
    while (sasquatchCells.size < 4 && openCells.length > 0) {
      const pick = openCells.splice(
        Math.floor(Math.random() * openCells.length),
        1
      )[0];
      sasquatchCells.add(pick);
    }
  }

  return {
    coffinCellsInit: coffinPositions,
    mushroomCellsInit: mushroomPositions,
    spyStartCell,
    sasquatchCellsInit: sasquatchCells,
  };
};

const SquareTable: React.FC<SquareTableProps> = ({ rows, cols }) => {
  // Table state for reset
  const [tableSeed, setTableSeed] = useState<number>(0);
  // Level state
  const [level, setLevel] = useState<number>(1);

  // Debounce ref for arrow key movement
  const lastMoveRef = useRef<number>(0);
  // Table and cell classes
  // ...existing code...
  // Only perimeter cells get borders
  const getCellClass = (r: number, c: number) => {
    let borders = "";
    if (r === 0) borders += " border-t-2 border-gray-800";
    if (r === rows - 1) borders += " border-b-2 border-gray-800";
    if (c === 0) borders += " border-l-2 border-gray-800";
    if (c === cols - 1) borders += " border-r-2 border-gray-800";
    return `box-border text-center align-middle${borders}`;
  };
  // Calculate cell size based on viewport and table dimensions
  const size = Math.floor(
    Math.min(window.innerWidth / cols, window.innerHeight / rows)
  );

  // Helper to restart table but keep score
  const restartTableKeepScore = () => {
    setTableSeed((seed) => seed + 1);
    setDeadHeadCell(null);
    setLevel((prev) => prev + 1);
    // Do NOT reset highScore
  };

  // Helper to get valid moves (no coffin, within bounds)
  const getValidMoves = (x: number, y: number) => {
    const moves = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];
    return moves.filter(
      ({ x, y }) =>
        x >= 0 &&
        x < cols &&
        y >= 0 &&
        y < rows &&
        !coffinCells.current.has(getIndex(x, y))
    );
  };

  const tableClass = "game-table";
  const moveToward = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    const moves = getValidMoves(from.x, from.y);
    if (moves.length === 0) return from;
    let minDist = Infinity;
    let bestMove = from;
    for (const move of moves) {
      const dist = Math.abs(move.x - to.x) + Math.abs(move.y - to.y);
      if (dist < minDist) {
        minDist = dist;
        bestMove = move;
      }
    }
    return bestMove;
  };

  // Memoize random icon locations so they don't change on every render
  const {
    coffinCellsInit,
    mushroomCellsInit,
    spyStartCell,
    sasquatchCellsInit,
  }: {
    coffinCellsInit: Set<number>;
    mushroomCellsInit: Set<number>;
    spyStartCell: number | null;
    sasquatchCellsInit: Set<number>;
  } = useMemo(() => getTableState(rows, cols), [rows, cols, tableSeed]);

  // Sasquatch positions as array of {x, y}
  const [sasquatchPositions, setSasquatchPositions] = useState<
    { x: number; y: number }[]
  >(() => {
    return Array.from(sasquatchCellsInit).map((idx) => ({
      x: idx % cols,
      y: Math.floor(idx / cols),
    }));
  });

  // Convert spyStartCell to x/y coordinates
  const getXY = (cellIndex: number) => ({
    x: cellIndex % cols,
    y: Math.floor(cellIndex / cols),
  });
  const getIndex = (x: number, y: number) => y * cols + x;

  // State for spy position
  const [spyPos, setSpyPos] = useState<{ x: number; y: number }>(
    spyStartCell !== null ? getXY(spyStartCell) : { x: 0, y: 0 }
  );
  // Ref to always have latest spyPos for Sasquatch movement
  const spyPosRef = useRef<{ x: number; y: number }>(spyPos);
  useEffect(() => {
    spyPosRef.current = spyPos;
  }, [spyPos]);

  // State for high score
  const [highScore, setHighScore] = useState<number>(0);

  // State for dead head cell (if GiSpy hits a coffin)
  const [deadHeadCell, setDeadHeadCell] = useState<number | null>(null);

  // Mutable refs for current icon positions
  const coffinCells = useRef<Set<number>>(new Set(coffinCellsInit));
  const mushroomCells = useRef<Set<number>>(new Set(mushroomCellsInit));
  const sasquatchCells = useRef<Set<number>>(new Set(sasquatchCellsInit));

  // Reset table state
  const resetTable = () => {
    setTableSeed((seed) => seed + 1);
    setHighScore(0);
    setDeadHeadCell(null);
    setLevel(1);
    // These will be reset by useMemo and useRef on next render
  };

  // Reset icons and spy position when tableSeed changes
  useEffect(() => {
    coffinCells.current = new Set(coffinCellsInit);
    mushroomCells.current = new Set(mushroomCellsInit);
    sasquatchCells.current = new Set(sasquatchCellsInit);
    setSpyPos(spyStartCell !== null ? getXY(spyStartCell) : { x: 0, y: 0 });
    setSasquatchPositions(
      Array.from(sasquatchCellsInit).map((idx) => ({
        x: idx % cols,
        y: Math.floor(idx / cols),
      }))
    );
  }, [
    coffinCellsInit,
    mushroomCellsInit,
    spyStartCell,
    sasquatchCellsInit,
    tableSeed,
    rows,
    cols,
  ]);

  // Sasquatch movement effect
  useEffect(() => {
    if (deadHeadCell !== null) return;
    const interval = setInterval(() => {
      setSasquatchPositions((prevPositions) => {
        let collisionIndex: number | null = null;
        let collisionIdxInArray: number | null = null;
        const newPositions = prevPositions.map((pos, idx) => {
          // Randomly decide: chase spy or mushroom
          const chaseSpy = Math.random() < 0.5;
          let target;
          if (chaseSpy || mushroomCells.current.size === 0) {
            target = spyPosRef.current;
          } else {
            // Find nearest mushroom
            let minDist = Infinity;
            let nearest: { x: number; y: number } | null = null;
            for (const cellIdx of mushroomCells.current) {
              const mx = cellIdx % cols;
              const my = Math.floor(cellIdx / cols);
              const dist = Math.abs(mx - pos.x) + Math.abs(my - pos.y);
              if (dist < minDist) {
                minDist = dist;
                nearest = { x: mx, y: my };
              }
            }
            target = nearest || spyPosRef.current;
          }
          const next = moveToward(pos, target);
          const nextIdx = getIndex(next.x, next.y);
          // If moving onto a mushroom, remove it
          if (mushroomCells.current.has(nextIdx)) {
            mushroomCells.current.delete(nextIdx);
          }
          // If moving onto GiSpy, trigger game over and mark this Sasquatch for removal
          if (
            next.x === spyPosRef.current.x &&
            next.y === spyPosRef.current.y &&
            collisionIndex === null
          ) {
            collisionIndex = getIndex(spyPosRef.current.x, spyPosRef.current.y);
            collisionIdxInArray = idx;
          }
          return next;
        });
        // If all mushrooms are gone, start next level
        if (mushroomCells.current.size === 0) {
          setTimeout(restartTableKeepScore, 250);
        }
        if (collisionIndex !== null && collisionIdxInArray !== null) {
          setDeadHeadCell(collisionIndex);
          // Remove the Sasquatch that collided
          return newPositions.filter((_, idx) => idx !== collisionIdxInArray);
        }
        return newPositions;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [cols, rows, deadHeadCell]);

  // Arrow key event listener logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastMoveRef.current < 250) return;
      lastMoveRef.current = now;

      if (deadHeadCell !== null) {
        if (e.code === "Space") {
          resetTable();
        }
        return;
      }

      let { x, y } = spyPos;
      if (e.key === "ArrowUp") {
        y = Math.max(0, y - 1);
      } else if (e.key === "ArrowDown") {
        y = Math.min(rows - 1, y + 1);
      } else if (e.key === "ArrowLeft") {
        x = Math.max(0, x - 1);
      } else if (e.key === "ArrowRight") {
        x = Math.min(cols - 1, x + 1);
      } else {
        return;
      }
      const newIndex = getIndex(x, y);

      // If GiSpy enters a coffin cell and the icon is rendered
      if (coffinCells.current.has(newIndex)) {
        // Only trigger game over if the cell is visually a coffin
        if (coffinCells.current.has(newIndex)) {
          coffinCells.current.delete(newIndex);
          setDeadHeadCell(newIndex);
          setSpyPos({ x, y });
          return;
        }
      }

      // If GiSpy enters a sasquatch cell and the icon is rendered
      if (sasquatchCells.current.has(newIndex)) {
        // Only trigger game over if the cell is visually a Sasquatch
        if (sasquatchCells.current.has(newIndex)) {
          sasquatchCells.current.delete(newIndex);
          setDeadHeadCell(newIndex);
          setSpyPos({ x, y });
          return;
        }
      }

      // If GiSpy enters a mushroom cell
      if (mushroomCells.current.has(newIndex)) {
        mushroomCells.current.delete(newIndex);
        setHighScore((score: number) => score + 100);
        setSpyPos({ x, y });
        // If all mushrooms are cleared, restart table but keep score
        if (mushroomCells.current.size === 0) {
          setTimeout(restartTableKeepScore, 250); // slight delay for UX
        }
        return;
      }

      // Otherwise, just move
      setSpyPos({ x, y });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spyPos, rows, cols, deadHeadCell]);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left gutter: vertically and horizontally centered content */}
      <div className="flex flex-col justify-center items-center w-1/4 h-full relative">
        <div className="text-5xl font-bold text-center">Score</div>
        <div className="text-5xl font-mono text-center mt-2">
          {highScore.toString().padStart(6, "0")}
        </div>
        {/* Level display at bottom, centered horizontally */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center">
          Level {level}
        </div>
      </div>
      {/* Table centered in middle gutter */}
      <div className="flex justify-center items-center w-2/4 h-full">
        <table
          className={tableClass}
          style={{
            width: size * cols,
            height: size * rows,
          }}
        >
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }).map((_, c) => {
                  const cellIndex = r * cols + c;
                  const isSpy = spyPos.x === c && spyPos.y === r;
                  // Show Sasquatch if any is at this cell
                  const isSasquatch = sasquatchPositions.some(
                    (p) => p.x === c && p.y === r
                  );
                  return (
                    <td
                      className={getCellClass(r, c)}
                      style={{ width: size, height: size }}
                      key={c}
                    >
                      {deadHeadCell === cellIndex ? (
                        <GiDeadHead className="mx-auto text-xl text-red-600" />
                      ) : coffinCells.current.has(cellIndex) ? (
                        <GiCoffin className="mx-auto text-xl text-white" />
                      ) : mushroomCells.current.has(cellIndex) ? (
                        <GiMushroomGills className="mx-auto text-xl text-green-600" />
                      ) : isSasquatch ? (
                        <GiSasquatch className="mx-auto text-xl text-yellow-400" />
                      ) : isSpy ? (
                        <GiSpy className="mx-auto text-xl text-blue-600" />
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Right gutter: Game Over message if deadHeadCell is set */}
      <div className="w-1/4 h-full flex flex-col justify-center items-center">
        {deadHeadCell !== null && (
          <>
            <div className="text-5xl font-bold text-center text-red-700">
              Game Over
            </div>
            <div className="text-2xl font-semibold text-center text-gray-700 mt-4">
              Spacebar to play again
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SquareTable;
