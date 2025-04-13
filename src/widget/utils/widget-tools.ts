/**
 * Widget Tools - Utility functions for Figma widget development
 */

// Theme constants
export const COLORS = {
  primary: "#0D99FF",
  primaryHover: "#0870B8",
  secondary: "#F0F0F0",
  secondaryHover: "#E0E0E0",
  text: "#333333",
  lightText: "#666666",
  background: "#FFFFFF",
  border: "#E6E6E6",
  success: "#36B37E",
  error: "#FF5630",
  warning: "#FFAB00",
};

// Widget sizing helpers
export const SPACING = {
  xs: 4,
  sm: 8, 
  md: 16,
  lg: 24,
  xl: 32,
};

// Common shadow effects
export const EFFECTS = {
  dropShadow: {
    type: "drop-shadow" as const,
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    blur: 4,
  },
  strongShadow: {
    type: "drop-shadow" as const,
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 4 },
    blur: 8,
  }
};

// Formatting helpers
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Figma widget helper functions
export const createNodeId = (): string => {
  return 'id_' + Math.random().toString(36).substring(2, 11);
};

// UI Component generators
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export const buttonStyles = (variant: ButtonVariant = 'primary') => {
  switch (variant) {
    case 'primary':
      return {
        fill: COLORS.primary,
        hoverFill: COLORS.primaryHover,
        textColor: '#FFFFFF',
      };
    case 'secondary':
      return {
        fill: COLORS.secondary,
        hoverFill: COLORS.secondaryHover,
        textColor: COLORS.text,
      };
    case 'danger':
      return {
        fill: COLORS.error,
        hoverFill: '#E64C3D',
        textColor: '#FFFFFF',
      };
    default:
      return {
        fill: COLORS.primary,
        hoverFill: COLORS.primaryHover,
        textColor: '#FFFFFF',
      };
  }
};

// Network request utilities for widgets
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Storage helpers
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Widget data utilities
export interface WidgetData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, any>;
}

export const createWidgetData = (name: string, data: Record<string, any> = {}): WidgetData => {
  const now = new Date().toISOString();
  return {
    id: createNodeId(),
    name,
    createdAt: now,
    updatedAt: now,
    data
  };
};

export const updateWidgetData = (widgetData: WidgetData, newData: Partial<Record<string, any>>): WidgetData => {
  return {
    ...widgetData,
    updatedAt: new Date().toISOString(),
    data: { ...widgetData.data, ...newData }
  };
};
