import React from 'react';
import params from 'query-params';

const Card = ({
  name,
  url,
  image,
  source,
  description_en,
  baseline,
  publi
}) => {
  const manetInstance = 'http://manet.medialab.sciences-po.fr/?';
  const captureParams = {
    url:(url ? url : source),
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
      <h3>{name}</h3>
      <p>{baseline}</p>

      <figure>
        <img src={ image ? image : capture }/>
      </figure>


      <p className="actions">
        {url ? <a target="_blank" href={url}>try it !</a> : ''}
        {source ? <a target="_blank" href={source}>source</a> : ''}
        {publi ? <a target="_blank" href={publi}>publication</a> : ''}
      </p>

    </div>
  )
}

export default Card;
