import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ShoppingList, ShoppingItem, Store } from '../types/shopping';

interface ShoppingState {
  lists: ShoppingList[];
  activeList: ShoppingList | null;
  filters: {
    store: string;
    category: string;
    priceRange: [number, number];
    checked: boolean | 'all';
  };
}

type ShoppingAction =
  | { type: 'CREATE_LIST'; payload: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_LIST'; payload: { id: string; updates: Partial<ShoppingList> } }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_ACTIVE_LIST'; payload: ShoppingList | null }
  | { type: 'ADD_ITEM'; payload: { listId: string; item: Omit<ShoppingItem, 'id' | 'createdAt'> } }
  | { type: 'UPDATE_ITEM'; payload: { listId: string; itemId: string; updates: Partial<ShoppingItem> } }
  | { type: 'DELETE_ITEM'; payload: { listId: string; itemId: string } }
  | { type: 'TOGGLE_ITEM_CHECKED'; payload: { listId: string; itemId: string } }
  | { type: 'SET_FILTERS'; payload: Partial<ShoppingState['filters']> }
  | { type: 'CLEAR_FILTERS' };

const initialState: ShoppingState = {
  lists: [],
  activeList: null,
  filters: {
    store: 'all',
    category: 'all',
    priceRange: [0, 100],
    checked: 'all',
  },
};

function shoppingReducer(state: ShoppingState, action: ShoppingAction): ShoppingState {
  switch (action.type) {
    case 'CREATE_LIST': {
      const newList: ShoppingList = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        lists: [newList, ...state.lists],
      };
    }
    
    case 'UPDATE_LIST': {
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? { ...list, ...action.payload.updates, updatedAt: new Date() }
            : list
        ),
        activeList: state.activeList?.id === action.payload.id
          ? { ...state.activeList, ...action.payload.updates, updatedAt: new Date() }
          : state.activeList,
      };
    }
    
    case 'DELETE_LIST': {
      return {
        ...state,
        lists: state.lists.filter(list => list.id !== action.payload),
        activeList: state.activeList?.id === action.payload ? null : state.activeList,
      };
    }
    
    case 'SET_ACTIVE_LIST':
      return { ...state, activeList: action.payload };
    
    case 'ADD_ITEM': {
      const newItem: ShoppingItem = {
        ...action.payload.item,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? { ...list, items: [...list.items, newItem], updatedAt: new Date() }
            : list
        ),
        activeList: state.activeList?.id === action.payload.listId
          ? { ...state.activeList, items: [...state.activeList.items, newItem], updatedAt: new Date() }
          : state.activeList,
      };
    }
    
    case 'UPDATE_ITEM': {
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === action.payload.itemId
                    ? { ...item, ...action.payload.updates }
                    : item
                ),
                updatedAt: new Date(),
              }
            : list
        ),
        activeList: state.activeList?.id === action.payload.listId
          ? {
              ...state.activeList,
              items: state.activeList.items.map(item =>
                item.id === action.payload.itemId
                  ? { ...item, ...action.payload.updates }
                  : item
              ),
              updatedAt: new Date(),
            }
          : state.activeList,
      };
    }
    
    case 'DELETE_ITEM': {
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(item => item.id !== action.payload.itemId),
                updatedAt: new Date(),
              }
            : list
        ),
        activeList: state.activeList?.id === action.payload.listId
          ? {
              ...state.activeList,
              items: state.activeList.items.filter(item => item.id !== action.payload.itemId),
              updatedAt: new Date(),
            }
          : state.activeList,
      };
    }
    
    case 'TOGGLE_ITEM_CHECKED': {
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === action.payload.itemId
                    ? { ...item, checked: !item.checked }
                    : item
                ),
                updatedAt: new Date(),
              }
            : list
        ),
        activeList: state.activeList?.id === action.payload.listId
          ? {
              ...state.activeList,
              items: state.activeList.items.map(item =>
                item.id === action.payload.itemId
                  ? { ...item, checked: !item.checked }
                  : item
              ),
              updatedAt: new Date(),
            }
          : state.activeList,
      };
    }
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };
    
    default:
      return state;
  }
}

const ShoppingContext = createContext<{
  state: ShoppingState;
  dispatch: React.Dispatch<ShoppingAction>;
} | null>(null);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  return (
    <ShoppingContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
}
