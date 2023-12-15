import React, { useState, useEffect } from 'react'

const ShoppingAPi = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {data ? data.map((item, index) => (
        <div key={index}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <img src={item.image} alt={item.title} />
        </div>
      )) : 'Loading...'}
    </div>
  )
}

export default ShoppingAPi