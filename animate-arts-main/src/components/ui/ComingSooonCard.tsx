import React from 'react';

const ComingSoonCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent to-black">
      <div className="text-center bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-zinc-800 max-w-md w-full">
        <h3 className="text-3xl font-semibold mb-4 font-inter text-white">
          Coming Soon
        </h3>
        <p className="text-gray-300 mb-6 font-inter">
          We're working on something exciting! Stay tuned for updates.
        </p>
        <button 
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 font-inter"
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default ComingSoonCard;