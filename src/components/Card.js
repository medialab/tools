import React from 'react';
import params from 'query-params';

const Card = ({
  name,
  url,
  image,
  source,
  description_en,
  baseline,
  publi,
  authors,
  by_medialab
}) => {
  const manetInstance = 'http://manet.medialab.sciences-po.fr/?';
  const captureParams = {
    url:(url ? url : source),
    delay:1000,
    format:'jpeg',
    width:(1024/2),
    height:(768/2),
    zoom:0.5
  };
  const capture = manetInstance + params.encode(captureParams);
  const fig = image ? image : capture;
  const style = {backgroundImage: 'url(' + fig + ')'};

  return (
    <div 
      className="card"
      itemScope
      itemType="http://schema.org/SoftwareApplication"
      typeof="SoftwareApplication"
      resource={'#' + name.replace(' ', '_')}
      id={'#' + name.replace(' ', '_')}
    >

      <a className="figure"
         itemProp="image"
         style={style}
         target="_blank"
         href={url ? url : source}>
      </a>


      <h3 itemProp="name">{name}</h3>
      <p itemProp="description" className="baseline">{baseline}</p>

      <p className="actions">
        {url ? <a  itemProp="url" target="_blank" href={url}>try it !</a> : ''}
        {source ? <a itemProp="downloadUrl" target="_blank" href={source}>source</a> : ''}
        {publi ? <a itemProp="citation" target="_blank" href={publi}>publication</a> : ''}
      </p>

      <p className="by">
        by { authors.join(', ') }
      </p>


    </div>
  )
}

export default Card;
