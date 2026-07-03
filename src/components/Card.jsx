import React from 'react';

function Card({ card, onClick }) {
  return (
    <div className="card" onClick={() => onClick(card)}>
      <div className={`card-inner ${card.isFlipped ? 'flipped' : ''}`}>
        {/* 카드 뒷면 (무늬 이미지는 그대로 유지) */}
        <div className="card-face card-front">
          <img src={card.backImg} alt="card back" draggable="false" />
        </div>

        {/* 카드 앞면 (PNG 이미지 대신 이모지 텍스트 출력) */}
        <div className="card-face card-back">
          <span className="emoji">{card.emoji}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
