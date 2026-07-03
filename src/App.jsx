import { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';

// 찾으신 이미지를 불러옵니다. 경로와 확장자가 맞는지 꼭 확인하세요!
import sheepImg from './assets/sheep.png';
import wolfImg from './assets/wolf.png';
import backImg from './assets/card-back.png';

function App() {
  const [cards, setCards] = useState([]);
  const [isLocked, setIsLocked] = useState(false); // 애니메이션 도중 클릭 방지용

  // 게임 초기 세팅 (컴포넌트가 처음 렌더링될 때 실행)
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // 양 8장, 늑대 8장 배열 만들기
    const initialCards = [
      ...Array(8).fill({ type: 'sheep', frontImg: sheepImg }),
      ...Array(8).fill({ type: 'wolf', frontImg: wolfImg })
    ];

    // 카드 섞기 (Fisher-Yates 셔플)
    const shuffled = initialCards
      .map(card => ({ ...card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        backImg: backImg
      }));

    setCards(shuffled);
  };

  const handleCardClick = (clickedCard) => {
    // 잠겨있거나 이미 뒤집힌 카드는 클릭 무시
    if (isLocked || clickedCard.isFlipped) return;

    // 1. 클릭한 카드를 뒤집음
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    // 2. 늑대인지 확인
    if (clickedCard.type === 'wolf') {
      setIsLocked(true); // 다른 카드 클릭 방지
      
      // 1초(1000ms) 뒤에 모든 카드를 다시 뒷면으로 돌림
      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(card => ({ ...card, isFlipped: false }))
        );
        setIsLocked(false);
      }, 1000);
    } else {
      // 3. 양일 경우 승리 조건 체크 (선택 사항)
      // 뒤집힌 양의 개수가 8개가 되면 승리 알림을 띄울 수 있습니다.
    }
  };

  return (
    <div className="App">
      <h1>양 찾기 게임 🐑🐺</h1>
      <p>늑대를 피해서 양 8마리를 모두 찾으세요!</p>
      
      <div className="card-grid">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            onClick={handleCardClick} 
          />
        ))}
      </div>
      
      <button className="reset-btn" onClick={initGame}>게임 다시 시작</button>
    </div>
  );
}

export default App;