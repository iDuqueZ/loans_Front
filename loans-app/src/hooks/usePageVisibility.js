import { useState, useEffect, useCallback } from 'react';

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [lastVisibilityChange, setLastVisibilityChange] = useState(Date.now());

  const handleVisibilityChange = useCallback(() => {
    const now = Date.now();
    // Evitar cambios muy rápidos de visibilidad (menos de 500ms)
    if (now - lastVisibilityChange < 500) {
      return;
    }
    
    setLastVisibilityChange(now);
    setIsVisible(!document.hidden);
  }, [lastVisibilityChange]);

  useEffect(() => {
    // Configurar el listener de cambios de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Limpiar el listener al desmontar
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return isVisible;
}
