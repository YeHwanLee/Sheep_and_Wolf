import React from 'react';

function Card({ card, onClick }) {
  return (
    <div className="card" onClick={() => onClick(card)}>
      {/* isFlipped 상태에 따라 flipped 클래스가 추가됨 */}
      <div className={`card-inner ${card.isFlipped ? 'flipped' : ''}`}>
        {/* 카드 뒷면 (기본 상태) */}
        <div className="card-front">
          <img src={card.backImg} alt="card back" />
        </div>

        {/* 카드 앞면 (뒤집혔을 때 나오는 양 또는 늑대) */}
        <div className="card-back">
          <img src={card.frontImg} alt={card.type} />
        </div>
      </div>
    </div>
  );
}

export default Card;
