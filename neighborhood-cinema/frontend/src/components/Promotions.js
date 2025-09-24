import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Fetch promotions (add endpoint if needed)
    setPromotions([
      { name: 'Family Package', description: '20% off for groups of 4+', discount: 20 },
      { name: 'Loyalty Program', description: 'Earn points on every purchase', type: 'loyalty' },
      { name: 'Student Discount', description: 'Buy one, get one half off', discount: 50 }
    ]);
  }, []);

  return (
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center">Special Offers</h2>
        <div className="row">
          {promotions.map((promo, i) => (
            <div key={i} className="col-md-4">
              <h4>{promo.name}</h4>
              <p>{promo.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;
