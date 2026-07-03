import React from 'react';

function Card({ card, onClick }) {
  return (
    <div className="card" onClick={() => onClick(card)}>
      <div className={`card-inner ${card.isFlipped ? 'flipped' : ''}`}>
        
        {/* 카드 뒷면 (유저가 처음 보는 무늬) */}
        <div className="card-face card-front">
          <img src={card.backImg} alt="card back" draggable="false" />
        </div>

        {/* 카드 앞면 (양 또는 늑대) */}
        <div className="card-face card-back">
          <img src={card.frontImg} alt={card.type} draggable="false" />
        </div>

      </div>
    </div>
  );
}

export default Card;