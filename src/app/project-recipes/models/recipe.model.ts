export interface Ingredient {
  name: string;
  quantity: number;
  unit: string; // 'g', 'ml', 'pz', 'cucchiai'...
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  servings: number; // porzioni "base": le quantità in ingredients sono calibrate per questo numero
  cookTimeMinutes: number;
  tags: string[];
  category: 'primo' | 'secondo' | 'dolce' | 'antipasto' | 'contorno';
  ingredients: Ingredient[];
  steps: string[];
}
