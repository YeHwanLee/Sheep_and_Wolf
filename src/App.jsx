import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Card from './components/Card';
import './App.css';

import backImg from './assets/card-back.png';

function App() {
  const [cards, setCards] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [cardCount, setCardCount] = useState(16);
  const [attempts, setAttempts] = useState(1);
  const [sheepFound, setSheepFound] = useState(0);

  const flipSound = useRef(new Audio('./flip.mp3'));
  const wolfSound = useRef(new Audio('./wolf.mp3'));
  const winSound = useRef(new Audio('./win.mp3'));

  useEffect(() => {
    initGame(16, true);
  }, []);

  const initGame = (count, isFullReset = false) => {
    const half = count / 2;
    const initialCards = [
      ...Array(half).fill({ type: 'sheep', emoji: '🐑' }),
      ...Array(half).fill({ type: 'wolf', emoji: '🐺' }),
    ];

    const shuffled = initialCards
      .map((card) => ({ ...card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        backImg: backImg,
      }));

    setCards(shuffled);
    setSheepFound(0);
    setIsLocked(false);

    if (isFullReset) {
      setAttempts(1);
    }
  };

  const resetGame = (newCount) => {
    if (isResetting) return;
    setIsResetting(true);
    setIsLocked(true);

    setCards((prev) => prev.map((card) => ({ ...card, isFlipped: false })));

    setTimeout(() => {
      setCardCount(newCount);
      initGame(newCount, true);
      setIsResetting(false);
    }, 600);
  };

  const handleCardClick = (clickedCard) => {
    if (isLocked || clickedCard.isFlipped) return;

    // 카드를 즉시 뒤집습니다.
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    if (clickedCard.type === 'wolf') {
      setIsLocked(true);

      // 🚀 늑대(땡)일 때는 카드 뒤집는 소리를 생략하고,
      // 카드가 완전히 돌아간 시점(500ms 후)에 땡 소리만 재생합니다.
      setTimeout(() => {
        wolfSound.current.currentTime = 0;
        wolfSound.current.play().catch(() => {});
      }, 000);

      // 카드를 다시 덮는 시간은 땡 소리를 듣고 엎어지도록 넉넉하게 1.5초로 늦췄습니다.
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, isFlipped: false }))
        );
        setIsLocked(false);
        setSheepFound(0);
        setAttempts((prev) => prev + 1);
      }, 1500);
    } else {
      // 🚀 양일 때는 성공 타격감을 위해 카드 뒤집는 소리를 즉시 냅니다.
      flipSound.current.currentTime = 0;
      flipSound.current.play().catch(() => {});

      const newSheepFound = sheepFound + 1;
      setSheepFound(newSheepFound);

      if (newSheepFound === ((newCount) => cardCount / 2)()) {
        setIsLocked(true);

        setTimeout(() => {
          winSound.current.currentTime = 0;
          winSound.current.play().catch(() => {});
          triggerConfetti();
        }, 000);
      }
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFFFFF'],
    });
  };

  return (
    <div className="App">
      <header className="game-header">
        <h1>숨은 양 찾기 🐑</h1>

        <div className="stats-panel">
          <div className="stat-item">
            <span className="stat-label">찾은 양</span>
            <span className="stat-value">
              {sheepFound} / {cardCount / 2}
            </span>
          </div>
          <div className="divider"></div>
          <div className="stat-item">
            <span className="stat-label">도전 횟수</span>
            <span className="stat-value highlight">{attempts}</span>
          </div>
        </div>

        <div className="controls">
          <button
            className={cardCount === 4 ? 'active' : ''}
            onClick={() => resetGame(4)}
          >
            쉬움
          </button>
          <button
            className={cardCount === 16 ? 'active' : ''}
            onClick={() => resetGame(16)}
          >
            보통
          </button>
          <button
            className={cardCount === 36 ? 'active' : ''}
            onClick={() => resetGame(36)}
          >
            어려움
          </button>
          <button className="reset-btn" onClick={() => resetGame(cardCount)}>
            다시 하기
          </button>
        </div>
      </header>

      <div className="play-zone">
        <div className={`card-grid grid-${cardCount}`}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
