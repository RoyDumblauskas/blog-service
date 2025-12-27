import { useParams } from 'react-router';
// import { useState, useEffect } from 'react';

export default function Article() {
  let { slug } = useParams();

  return (
    <div id="article">
      <h1>Article: {slug}</h1>
    </div>
  );
};
