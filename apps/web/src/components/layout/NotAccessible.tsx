// NotAccessible.tsx
import React from 'react';

const NotAccessible = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-xl font-bold">Accès refusé</h1>
      <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
    </div>
  );
};

export default NotAccessible;
