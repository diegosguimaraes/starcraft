
import React from 'react';

// This component is no longer used as market functionality has been removed.
// Keeping the file to prevent build errors if it's still indexed somewhere,
// but its functionality is gone.
const StationMarketView: React.FC = () => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl text-gray-200">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Mercado Indisponível</h2>
      <p className="text-gray-400">A funcionalidade de mercado foi removida desta estação.</p>
    </div>
  );
};

export default StationMarketView;
