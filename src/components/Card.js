import React from 'react';
import params from 'query-params';

const Card = ({
  name,
  url,
  image,
  source,
  description_en
}) => {
  const manetInstance = 'http://manet.medialab.sciences-po.fr/?';
  const captureParams = {
    url:url,
    delay:5000,
    format:'jpeg',
    width:300,
    height:170,
    zoom:0.25,
    clipRect:'0,0,300,170'
  };
  const capture = manetInstance + params.encode(captureParams);

  return (
    <div className="card">
      <h2>{name}</h2>
      <img src={ image ? image : capture }/>
      {source ? <a target="_blank" href={source}>source</a> : ''}
      {url ? <a target="_blank" href={url}>try it !</a> : ''}
      <p>{description_en}</p>

    </div>
  )
}

export default Card;
