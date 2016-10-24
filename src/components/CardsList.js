import React from 'react';
import Card from './Card';

const CardsList = ({
  cards=[],
  loading
}) => (
  <section id='cards-list'>
    {cards.length > 0 ?
      cards.map((card, index) => (
        <Card key={index} {...card} />
      )) :
      loading ?
      'Loading' :
      'No item to display'
    }
  </section>
);

export default CardsList;
