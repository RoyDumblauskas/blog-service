import { useParams } from 'react-router';
// import { useState, useEffect } from 'react';

export default function Article() {
  let { slug } = useParams();

  return (
    <div id="article" className="page-container">
      <h1>Article: {slug}</h1>
    </div>
  );
};
