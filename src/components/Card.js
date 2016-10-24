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
    width:250,
    height:200,
    zoom:0.5,
    clipRect:'0,0,250,200'
  };
  const capture = manetInstance + params.encode(captureParams);
  const fig = image ? image : capture;
  const style = {backgroundImage: 'url(' + fig + ')'};

  return (
    <div className="card">

      <a className="figure"
         style={style}
         target="_blank"
         href={url ? url : source}>
      </a>

      <h3>{name}</h3>
      <p className="baseline">{baseline}</p>

      <p className="actions">
        {url ? <a target="_blank" href={url}>try it !</a> : ''}
        {source ? <a target="_blank" href={source}>source</a> : ''}
        {publi ? <a target="_blank" href={publi}>publication</a> : ''}
      </p>

    </div>
  )
}

export default Card;
