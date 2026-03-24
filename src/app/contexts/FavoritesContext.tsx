import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favoriteItems: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const updateProfileRef = useRef(updateProfile);
  const userRef = useRef(user);
  
  // Keep refs updated
  useEffect(() => {
    updateProfileRef.current = updateProfile;
    userRef.current = user;
  }, [updateProfile, user]);

  // Load favorites from user preferences only when user ID changes
  useEffect(() => {
    if (user?.preferences?.favoriteItems) {
      setFavoriteItems(user.preferences.favoriteItems);
    } else if (user) {
      setFavoriteItems([]);
    }
  }, [user?.id]);

  // Persist favorites to user profile when they change (debounced)
  useEffect(() => {
    if (!userRef.current) return;
    
    const timeoutId = setTimeout(() => {
      updateProfileRef.current({
        ...userRef.current!,
        preferences: {
          ...userRef.current!.preferences,
          favoriteItems,
        },
      });
    }, 300); // Debounce 300ms to avoid too many updates

    return () => clearTimeout(timeoutId);
  }, [favoriteItems]);

  const toggleFavorite = useCallback((itemId: string) => {
    setFavoriteItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []); // No dependencies - uses functional update

  const isFavorite = useCallback((itemId: string) => {
    return favoriteItems.includes(itemId);
  }, [favoriteItems]);

  const value: FavoritesContextType = {
    favoriteItems,
    toggleFavorite,
    isFavorite,
    favoritesCount: favoriteItems.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
