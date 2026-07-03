import { useState, useEffect } from 'react';
import { fetchItems } from './data/items.ts';
import type { Item, Category } from './data/types.ts';

export function App() {
  // --- Core Application States ---
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Navigation Routing States
  const [currentView, setCurrentView] = useState<'browse' | 'detail' | 'booking'>('browse');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Search and Filter Configuration States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  // --- Initial Data Load ---
  useEffect(() => {
    fetchItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // --- Defensive Search and Filtering Engine ---
  const filteredItems = items.filter((item) => {
    // TRAP CHECK: Automatically prune items flagged as 'removed'
    if (item.status === 'removed') return false;

    // 1. Text Search Evaluation
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Strict Category Matching
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // 3. Price Classification Logic (Handles both null price values and 0-cent items as free)
    const isFree = item.price === null || item.price.amountCents === 0;
    const matchesPrice = priceFilter === 'all' || 
                         (priceFilter === 'free' && isFree) || 
                         (priceFilter === 'paid' && !isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Derived Target Selection
  const currentItem = items.find(i => i.id === selectedItemId) || null;

  // Render defensive loading state fallback
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ border: '3px solid #000000', padding: '24px', boxShadow: '6px 6px 0px #000000', backgroundColor: '#fff' }}>
          Loading your neighborhood toolkit...
        </h2>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#fafaf9', minHeight: '100vh', color: '#1c1917', paddingBottom: '60px' }}>
      
      
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        <p style={{ fontWeight: 'bold' }}>Base architecture established. Views will branch from here.</p>
      </main>

    </div>
  );
}