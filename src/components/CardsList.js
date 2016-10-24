import React from 'react';

import Card from './Card';

const CardsList = ({
  cards=[]
}) => (
  <section id='cards-list'>
  <h2>Projects</h2>
    {cards.length > 0 ?
      cards.map((card, index) => (
        <Card key={index} {...card} />
      )) :
      'Loading'
    }
  </section>
);

export default CardsList;
