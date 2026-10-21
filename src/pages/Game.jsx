import { useCallback, useEffect, useRef, useState } from "react";
import "./Game.css";

const GAME_TIME = 45;

// =========================
// GRACZ
// =========================

const PLAYER_WIDTH = 70;
const PLAYER_HEIGHT = 8;
const PLAYER_SPEED = 850;

// =========================
// POCISK
// =========================

const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 14;
const BULLET_SPEED = 850;
const SHOT_COOLDOWN = 180;

// =========================
// PUNKTY
// =========================

const POINT_RADIUS = 12;

const MIN_SPAWN_INTERVAL = 0.22;
const MAX_SPAWN_INTERVAL = 0.48;

// =========================
// ZŁOTY PUNKT
// =========================

const GOLD_VALUE = 404;
const GOLD_COLOR = "#f5c542";
const GOLD_SPEED = 430;
const GOLD_RADIUS = 14;

// =========================
// RODZAJE PUNKTÓW
// =========================

const POINT_TYPES = [
  {
    type: "white",
    color: "#ffffff",
    value: 22,
    chance: 0.57,
  },
  {
    type: "red",
    color: "#ff3030",
    value: -98,
    chance: 0.34,
  },
  {
    type: "green",
    color: "#22c55e",
    value: 223,
    chance: 0.09,
  },
];

function getRandomPointType() {
  const random = Math.random();

  let accumulated = 0;

  for (const point of POINT_TYPES) {
    accumulated += point.chance;

    if (random <= accumulated) {
      return point;
    }
  }

  return POINT_TYPES[0];
}

function getRandomSpawnInterval() {
  return (
    MIN_SPAWN_INTERVAL +
    Math.random() *
      (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL)
  );
}

export default function Game() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const keysRef = useRef({
    left: false,
    right: false,
  });

  const playerRef = useRef({
    x: 0,
    y: 0,
  });

  const pointsRef = useRef([]);
  const bulletsRef = useRef([]);

  const scoreRef = useRef(0);

  const lastFrameRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const nextSpawnRef = useRef(getRandomSpawnInterval());
  const lastShotRef = useRef(0);

  // Czas rundy potrzebny do złotego punktu
  const roundTimeRef = useRef(0);

  // Moment pojawienia się złotego punktu
  const goldSpawnTimeRef = useRef(0);

  // Czy złoty punkt już pojawił się w tej rundzie
  const goldSpawnedRef = useRef(false);

  // Timeout animacji wyniku
  const goldAnimationTimeoutRef = useRef(null);

  // =========================
  // STATE
  // =========================

  const [gameState, setGameState] = useState("start");

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(GAME_TIME);

  // Czy gracz trafił złoty punkt
  const [goldHit, setGoldHit] = useState(false);

  // Animacja SCORE po trafieniu złotego punktu
  const [goldScoreAnimation, setGoldScoreAnimation] =
    useState(false);

  // =========================
  // CANVAS
  // =========================

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    playerRef.current.y = rect.height - 35;

    playerRef.current.x = Math.max(
      0,
      Math.min(
        rect.width - PLAYER_WIDTH,
        playerRef.current.x
      )
    );
  }, []);

  // =========================
  // STRZAŁ
  // =========================

  const shoot = useCallback(() => {
    if (gameState !== "playing") return;

    const now = performance.now();

    if (now - lastShotRef.current < SHOT_COOLDOWN) {
      return;
    }

    lastShotRef.current = now;

    const player = playerRef.current;

    bulletsRef.current.push({
      x:
        player.x +
        PLAYER_WIDTH / 2 -
        BULLET_WIDTH / 2,

      y: player.y - BULLET_HEIGHT,
    });
  }, [gameState]);

  // =========================
  // START GRY
  // =========================

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Czyścimy poprzedni timeout animacji
    if (goldAnimationTimeoutRef.current) {
      clearTimeout(goldAnimationTimeoutRef.current);
    }

    scoreRef.current = 0;

    pointsRef.current = [];
    bulletsRef.current = [];

    spawnTimerRef.current = 0;

    nextSpawnRef.current =
      getRandomSpawnInterval();

    lastShotRef.current = 0;

    lastFrameRef.current =
      performance.now();

    roundTimeRef.current = 0;

    // Złoty punkt pojawi się dokładnie raz
    // między 6. a 39. sekundą rundy.
    goldSpawnTimeRef.current =
      6 + Math.random() * (GAME_TIME - 12);

    goldSpawnedRef.current = false;

    playerRef.current = {
      x:
        rect.width / 2 -
        PLAYER_WIDTH / 2,

      y: rect.height - 35,
    };

    setScore(0);

    setTimeLeft(GAME_TIME);

    setGoldHit(false);

    setGoldScoreAnimation(false);

    setGameState("playing");
  }, []);

  // =========================
  // KONIEC GRY
  // =========================

  const endGame = useCallback(() => {
    cancelAnimationFrame(
      animationRef.current
    );

    keysRef.current.left = false;
    keysRef.current.right = false;

    setGoldScoreAnimation(false);

    setGameState("finished");
  }, []);

  // =========================
  // RESIZE
  // =========================

  useEffect(() => {
    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, [resizeCanvas]);

  // =========================
  // KLAWIATURA
  // =========================

  useEffect(() => {
    const keyDown = (event) => {
      const key =
        event.key.toLowerCase();

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.code === "Space" ||
        key === "a" ||
        key === "d"
      ) {
        event.preventDefault();
      }

      if (
        event.key === "ArrowLeft" ||
        key === "a"
      ) {
        keysRef.current.left = true;
      }

      if (
        event.key === "ArrowRight" ||
        key === "d"
      ) {
        keysRef.current.right = true;
      }

      if (
        event.code === "Space" &&
        !event.repeat
      ) {
        shoot();
      }
    };

    const keyUp = (event) => {
      const key =
        event.key.toLowerCase();

      if (
        event.key === "ArrowLeft" ||
        key === "a"
      ) {
        keysRef.current.left = false;
      }

      if (
        event.key === "ArrowRight" ||
        key === "d"
      ) {
        keysRef.current.right = false;
      }
    };

    window.addEventListener(
      "keydown",
      keyDown
    );

    window.addEventListener(
      "keyup",
      keyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        keyDown
      );

      window.removeEventListener(
        "keyup",
        keyUp
      );
    };
  }, [shoot]);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);

          endGame();

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [gameState, endGame]);

  // =========================
  // GAME LOOP
  // =========================

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const gameLoop = (timestamp) => {
      const rect =
        canvas.getBoundingClientRect();

      const deltaTime = Math.min(
        (timestamp -
          lastFrameRef.current) /
          1000,
        0.033
      );

      lastFrameRef.current =
        timestamp;

      roundTimeRef.current +=
        deltaTime;

      // =====================
      // RUCH GRACZA
      // =====================

      if (keysRef.current.left) {
        playerRef.current.x -=
          PLAYER_SPEED * deltaTime;
      }

      if (keysRef.current.right) {
        playerRef.current.x +=
          PLAYER_SPEED * deltaTime;
      }

      playerRef.current.x =
        Math.max(
          0,
          Math.min(
            rect.width -
              PLAYER_WIDTH,

            playerRef.current.x
          )
        );

      // =====================
      // MARGINES SPAWNU
      // =====================

      const spawnMargin =
        PLAYER_WIDTH / 2 +
        Math.max(
          POINT_RADIUS,
          GOLD_RADIUS
        ) +
        5;

      const availableWidth =
        rect.width -
        spawnMargin * 2;

      const getRandomX = () => {
        if (availableWidth <= 0) {
          return rect.width / 2;
        }

        return (
          spawnMargin +
          Math.random() *
            availableWidth
        );
      };

      // =====================
      // ZWYKŁE PUNKTY
      // =====================

      spawnTimerRef.current +=
        deltaTime;

      if (
        spawnTimerRef.current >=
        nextSpawnRef.current
      ) {
        spawnTimerRef.current = 0;

        nextSpawnRef.current =
          getRandomSpawnInterval();

        const pointType =
          getRandomPointType();

        pointsRef.current.push({
          x: getRandomX(),

          y: -POINT_RADIUS,

          radius: POINT_RADIUS,

          speed:
            95 +
            Math.random() * 135,

          ...pointType,
        });
      }

      // =====================
      // SEKRETNY ZŁOTY PUNKT
      // =====================

      if (
        !goldSpawnedRef.current &&
        roundTimeRef.current >=
          goldSpawnTimeRef.current
      ) {
        goldSpawnedRef.current = true;

        pointsRef.current.push({
          type: "gold",

          x: getRandomX(),

          y: -GOLD_RADIUS,

          radius: GOLD_RADIUS,

          speed: GOLD_SPEED,

          color: GOLD_COLOR,

          value: GOLD_VALUE,
        });
      }

      // =====================
      // RUCH PUNKTÓW
      // =====================

      pointsRef.current.forEach(
        (point) => {
          point.y +=
            point.speed * deltaTime;
        }
      );

      // =====================
      // RUCH POCISKÓW
      // =====================

      bulletsRef.current.forEach(
        (bullet) => {
          bullet.y -=
            BULLET_SPEED *
            deltaTime;
        }
      );

      // =====================
      // KOLIZJE
      // =====================

      const bulletsToRemove =
        new Set();

      const pointsToRemove =
        new Set();

      bulletsRef.current.forEach(
        (
          bullet,
          bulletIndex
        ) => {
          pointsRef.current.forEach(
            (
              point,
              pointIndex
            ) => {
              if (
                bulletsToRemove.has(
                  bulletIndex
                ) ||
                pointsToRemove.has(
                  pointIndex
                )
              ) {
                return;
              }

              const bulletCenterX =
                bullet.x +
                BULLET_WIDTH / 2;

              const bulletCenterY =
                bullet.y +
                BULLET_HEIGHT / 2;

              const dx =
                bulletCenterX -
                point.x;

              const dy =
                bulletCenterY -
                point.y;

              const distanceSquared =
                dx * dx +
                dy * dy;

              const collisionRadius =
                point.radius +
                BULLET_WIDTH;

              if (
                distanceSquared <
                collisionRadius *
                  collisionRadius
              ) {
                bulletsToRemove.add(
                  bulletIndex
                );

                pointsToRemove.add(
                  pointIndex
                );

                // Dodajemy punkty
                scoreRef.current +=
                  point.value;

                setScore(
                  scoreRef.current
                );

                // =====================
                // TRAFIONO ZŁOTY PUNKT
                // =====================

                if (
                  point.type ===
                  "gold"
                ) {
                  setGoldHit(true);

                  setGoldScoreAnimation(
                    true
                  );

                  if (
                    goldAnimationTimeoutRef.current
                  ) {
                    clearTimeout(
                      goldAnimationTimeoutRef.current
                    );
                  }

                  goldAnimationTimeoutRef.current =
                    setTimeout(
                      () => {
                        setGoldScoreAnimation(
                          false
                        );
                      },
                      1100
                    );
                }
              }
            }
          );
        }
      );

      // =====================
      // USUWANIE POCISKÓW
      // =====================

      bulletsRef.current =
        bulletsRef.current.filter(
          (
            bullet,
            index
          ) =>
            bullet.y >
              -BULLET_HEIGHT &&
            !bulletsToRemove.has(
              index
            )
        );

      // =====================
      // USUWANIE PUNKTÓW
      // =====================

      pointsRef.current =
        pointsRef.current.filter(
          (
            point,
            index
          ) =>
            point.y -
              point.radius <
              rect.height &&
            !pointsToRemove.has(
              index
            )
        );

      // =====================
      // RYSOWANIE
      // =====================

      ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
      );

      // =====================
      // GRACZ
      // =====================

      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        playerRef.current.x,
        playerRef.current.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );

      // =====================
      // LUFKA
      // =====================

      ctx.fillRect(
        playerRef.current.x +
          PLAYER_WIDTH / 2 -
          2,

        playerRef.current.y - 10,

        4,
        10
      );

      // =====================
      // POCISKI
      // =====================

      ctx.fillStyle = "#ffffff";

      bulletsRef.current.forEach(
        (bullet) => {
          ctx.fillRect(
            bullet.x,
            bullet.y,
            BULLET_WIDTH,
            BULLET_HEIGHT
          );
        }
      );

      // =====================
      // PUNKTY
      // =====================

      pointsRef.current.forEach(
        (point) => {
          ctx.beginPath();

          ctx.arc(
            point.x,
            point.y,
            point.radius,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            point.color;

          ctx.fill();
        }
      );

      animationRef.current =
        requestAnimationFrame(
          gameLoop
        );
    };

    animationRef.current =
      requestAnimationFrame(
        gameLoop
      );

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );
    };
  }, [gameState]);

  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      if (
        goldAnimationTimeoutRef.current
      ) {
        clearTimeout(
          goldAnimationTimeoutRef.current
        );
      }
    };
  }, []);

  // =========================
  // MYSZKA / TELEFON
  // =========================

  const movePlayerToPointer = (
    event
  ) => {
    if (
      gameState !== "playing"
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    const rect =
      canvas.getBoundingClientRect();

    const clientX =
      event.touches?.[0]
        ?.clientX ??
      event.clientX;

    const x =
      clientX -
      rect.left -
      PLAYER_WIDTH / 2;

    playerRef.current.x =
      Math.max(
        0,
        Math.min(
          rect.width -
            PLAYER_WIDTH,

          x
        )
      );
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="dot404">
      <nav className="dot404__nav">
        <a href="/" className="dot404__brand" aria-label="Wróć do portfolio">
          <strong>JS.</strong>
          <span>DOT404</span>
        </a>
        <a href="/" className="dot404__back">
          <span>WRÓĆ DO PORTFOLIO</span>
          <span>↗</span>
        </a>
      </nav>

      <main className="dot404__container">
        <header className="dot404__header">
          <div className="dot404__score">
            <span className="dot404__label">WYNIK</span>
            <span className={`dot404__score-value ${goldScoreAnimation ? "dot404__score-value--gold" : ""}`}>
              {score.toLocaleString("pl-PL")}
              <span className={`dot404__gold-line ${goldScoreAnimation ? "dot404__gold-line--active" : ""}`} />
            </span>
          </div>
          <div className="dot404__info">
            <span><span className="dot404__label">POZOSTAŁO </span>{timeLeft.toString().padStart(2, "0")}s</span>
            <span className="dot404__controls-desktop">A/D · ←/→ · SPACJA</span>
          </div>
        </header>

        <div className="dot404__board">
          <canvas
            ref={canvasRef}
            className="dot404__canvas"
            onMouseMove={(event) => { if (event.buttons === 1) movePlayerToPointer(event); }}
            onTouchStart={movePlayerToPointer}
            onTouchMove={movePlayerToPointer}
            onClick={() => { if (gameState === "playing") shoot(); }}
          />

          {gameState === "start" && (
            <div className="dot404__overlay">
              <p className="dot404__game-time">45 SEKUND</p>
              <h1 className="dot404__title">DOT404</h1>
              <div className="dot404__legend">
                <span><i className="dot404__dot dot404__dot--white" />+22</span>
                <span><i className="dot404__dot dot404__dot--green" />+223</span>
                <span><i className="dot404__dot dot404__dot--red" />-98</span>
              </div>
              <p className="dot404__instructions">A/D lub ←/→ · SPACJA = STRZAŁ</p>
              <button type="button" onClick={startGame} className="dot404__button">ROZPOCZNIJ</button>
            </div>
          )}

          {gameState === "finished" && (
            <div className="dot404__overlay">
              <p className="dot404__end-label">KONIEC GRY /</p>
              <p className="dot404__result-label">TWÓJ WYNIK</p>
              <h2 className="dot404__result">{score.toLocaleString("pl-PL")}</h2>
              {goldHit && (
                <div className="dot404__gold-result">
                  <div className="dot404__gold-divider" />
                  <p className="dot404__gold-title">ZŁOTY PUNKT TRAFIONY</p>
                  <p className="dot404__gold-points">+404</p>
                </div>
              )}
              <button type="button" onClick={startGame}
                className={`dot404__button ${goldHit ? "dot404__button--gold-result" : "dot404__button--restart"}`}>
                ZAGRAJ PONOWNIE
              </button>
            </div>
          )}
        </div>

        <footer className="dot404__footer">
          <span>JAKUBSZCZESNIAK.PL</span>
          <span>2026</span>
        </footer>
      </main>
    </div>
  );
}
