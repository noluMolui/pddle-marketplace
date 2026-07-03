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

  // Authentication Management States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Search and Filter Configuration States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  // Checkout and Duration Calculation States
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // --- Initial Data Load ---
  useEffect(() => {
    fetchItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // --- Defensive Search and Filtering Engine ---
  const filteredItems = items.filter((item) => {
    if (item.status === 'removed') return false;

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    const isFree = item.price === null || item.price.amountCents === 0;
    const matchesPrice = priceFilter === 'all' || 
                         (priceFilter === 'free' && isFree) || 
                         (priceFilter === 'paid' && !isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Derived Target Selection
  const currentItem = items.find(i => i.id === selectedItemId) || null;

  // --- Event Handlers ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    setAuthError('');
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAuthEmail('');
    setIsBookingConfirmed(false);
    if (currentView === 'booking') {
      setCurrentView('detail');
    }
  };

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

  // Cost and Statement Formulations
  const basePriceCents = currentItem?.price?.amountCents || 0;
  const isItemFree = currentItem?.price === null || basePriceCents === 0;
  const totalCostDollars = ((basePriceCents * rentalDays) / 100).toFixed(2);

  const detailDisplayPrice = currentItem && isItemFree
    ? 'Free (Community Share)'
    : currentItem ? `$${(currentItem.price!.amountCents / 100).toFixed(2)} per ${currentItem.price!.period}` : '';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#fafaf9', minHeight: '100vh', color: '#1c1917', paddingBottom: '60px' }}>
      
      {/* --- Global Header --- */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #000000', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', cursor: 'pointer' }} onClick={() => { setCurrentView('browse'); setSelectedItemId(null); setIsBookingConfirmed(false); }}>
          Pddle
        </h1>
        <div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '14px', border: '2px solid #000000', padding: '6px 12px', backgroundColor: '#fef08a', fontWeight: 'bold' }}>
                User: {authEmail}
              </div>
              <button 
                onClick={handleSignOut}
                style={{ backgroundColor: '#ef4444', color: '#fff', border: '2px solid #000000', padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', boxShadow: '2px 2px 0px #000000' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setAuthError(''); setShowAuthModal(true); }}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: '2px solid #000000', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '3px 3px 0px #000000' }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* --- Main App Body Layout Container --- */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        
        {/* ================= VIEW 1: BROWSE METROPOLIS ================= */}
        {currentView === 'browse' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Borrow Equipment Locally</h2>
              <p style={{ margin: 0, color: '#57534e', fontSize: '16px' }}>Save money, reduce waste, and connect with neighbors near you.</p>
            </div>

            {/* Human Search & Filtering UI Panel */}
            <section style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', padding: '20px', marginBottom: '32px', boxShadow: '6px 6px 0px #000000' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label htmlFor="search" style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '13px', textTransform: 'uppercase' }}>Search Items</label>
                  <input 
                    id="search"
                    type="text" 
                    placeholder="Search tools, garden gear..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #000000', boxSizing: 'border-box', fontWeight: '500' }}
                  />
                </div>

                <div>
                  <label htmlFor="category" style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '13px', textTransform: 'uppercase' }}>Category</label>
                  <select 
                    id="category"
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #000000', boxSizing: 'border-box', backgroundColor: '#fff', fontWeight: '500', height: '42px' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="tools">Tools</option>
                    <option value="garden">Garden</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="sports">Sports</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '13px', textTransform: 'uppercase' }}>Price Range</label>
                  <select 
                    id="price"
                    value={priceFilter} 
                    onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #000000', boxSizing: 'border-box', backgroundColor: '#fff', fontWeight: '500', height: '42px' }}
                  >
                    <option value="all">Any Price</option>
                    <option value="free">Free / Community Shared</option>
                    <option value="paid">Paid Rentals</option>
                  </select>
                </div>
              </div>
            </section>

            {/* --- Results Counter & Fallback Shell --- */}
            <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '15px' }}>
              Showing {filteredItems.length} available {filteredItems.length === 1 ? 'item' : 'items'}
            </div>

            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', border: '2px dashed #a8a29e', backgroundColor: '#f5f5f4', borderRadius: '6px', marginTop: '16px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#78716c' }}>No equipment matches your search terms. Try broadening your criteria.</p>
              </div>
            ) : (
              /* --- Grid Presentation Wrapper --- */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredItems.map((item) => {
                  const displayPrice = item.price === null || item.price.amountCents === 0
                    ? 'Free'
                    : `$${(item.price.amountCents / 100).toFixed(2)} / ${item.price.period}`;

                  return (
                    <article 
                      key={item.id}
                      style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '4px 4px 0px #000000' }}
                    >
                      {/* View 1 Image Wrapper */}
                      <div style={{ height: '180px', backgroundColor: '#e7e5e4', borderBottom: '3px solid #000000', position: 'relative' }}>
                        <img 
                          src={item.photoUrls && item.photoUrls[0] ? item.photoUrls[0] : "https://via.placeholder.com/600x400"} 
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#000000', color: '#ffffff', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                          {item.category}
                        </span>
                      </div>

                      <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>{item.title}</h3>
                          <p style={{ margin: '0 0 16px 0', color: '#57534e', fontSize: '14px', lineHeight: '1.4' }}>{item.description}</p>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: item.price?.amountCents ? '#16a34a' : '#2563eb' }}>
                            {displayPrice}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setCurrentView('detail');
                            }}
                            style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000000', padding: '6px 12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '2px 2px 0px #000000' }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 2: PRODUCT DETAIL PAGE ================= */}
        {currentView === 'detail' && (
          <div>
            <button 
              onClick={() => { setCurrentView('browse'); setSelectedItemId(null); }}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0, fontSize: '15px', marginBottom: '24px', display: 'inline-flex', alignItems: 'center' }}
            >
              ← Back to equipment listings
            </button>

            {!currentItem ? (
              <div style={{ padding: '24px', backgroundColor: '#fee2e2', border: '2px solid #ef4444', fontWeight: 'bold' }}>
                Item configuration record missing or unavailable.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
                
                {/* Column Left: Visual Artwork Frame Wrapper (View 2 Image) */}
                <div style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', overflow: 'hidden', boxShadow: '6px 6px 0px #000000' }}>
                  <div style={{ height: '360px', backgroundColor: '#e7e5e4', borderBottom: '3px solid #000000' }}>
                    <img 
                      src={currentItem.photoUrls && currentItem.photoUrls[0] ? currentItem.photoUrls[0] : "https://via.placeholder.com/600x400"} 
                      alt={currentItem.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{ display: 'inline-block', backgroundColor: '#000000', color: '#ffffff', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px', marginBottom: '12px' }}>
                      {currentItem.category}
                    </span>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>{currentItem.title}</h2>
                    <p style={{ margin: 0, color: '#44403c', fontSize: '16px', lineHeight: '1.6' }}>{currentItem.description}</p>
                  </div>
                </div>

                {/* Column Right: Action Booking Board Container */}
                <div>
                  <div style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', padding: '24px', boxShadow: '6px 6px 0px #000000', marginBottom: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: '800', color: '#78716c', display: 'block', marginBottom: '4px' }}>Rental Cost</span>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#1c1917' }}>{detailDisplayPrice}</div>
                    </div>

                    <div style={{ borderTop: '2px solid #e7e5e4', paddingTop: '16px', marginBottom: '24px' }}>
                      <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: '800', color: '#78716c', display: 'block', marginBottom: '6px' }}>Lender Profile</span>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{currentItem.owner.displayName}</div>
                      <div style={{ fontSize: '13px', color: '#57534e', marginTop: '2px' }}>📍 Nearby Community Member</div>
                    </div>

                    <button
                      onClick={() => {
                        setRentalDays(3);
                        setIsBookingConfirmed(false);
                        setCurrentView('booking');
                      }}
                      style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: '3px solid #000000', padding: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '4px 4px 0px #000000', textAlign: 'center', boxSizing: 'border-box' }}
                    >
                      Book This Item
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 3: CHECKOUT CONFIRMATION OVERVIEW ================= */}
        {currentView === 'booking' && currentItem && (
          <div>
            <button 
              onClick={() => { setCurrentView('detail'); setIsBookingConfirmed(false); }}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0, fontSize: '15px', marginBottom: '24px' }}
            >
              ← Back to item specifications
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
              
              {/* Checkout Column Left: Item Reference Header (View 3 Image) */}
              <div style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', padding: '24px', boxShadow: '6px 6px 0px #000000' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 16px 0' }}>Confirm Your Reservation</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img 
                    src={currentItem.photoUrls && currentItem.photoUrls[0] ? currentItem.photoUrls[0] : "https://via.placeholder.com/80x80"} 
                    alt={currentItem.title} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #000000', borderRadius: '4px' }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>{currentItem.title}</h4>
                    <p style={{ margin: 0, color: '#57534e', fontSize: '14px' }}>Lender: {currentItem.owner.displayName}</p>
                  </div>
                </div>
              </div>

              {/* Checkout Column Right: Live Pricing Calculation System */}
              <div style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', padding: '24px', boxShadow: '6px 6px 0px #000000' }}>
                {!isAuthenticated ? (
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <p style={{ margin: '0 0 16px 0', fontWeight: 'bold', color: '#ef4444' }}>Authentication verified account sign-in required to process requests.</p>
                    <button 
                      onClick={() => { setAuthError(''); setShowAuthModal(true); }}
                      style={{ backgroundColor: '#2563eb', color: '#ffffff', border: '3px solid #000000', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '3px 3px 0px #000000' }}
                    >
                      Sign In Instantly
                    </button>
                  </div>
                ) : isBookingConfirmed ? (
                  <div style={{ textAlign: 'center', padding: '16px 0', backgroundColor: '#f0fdf4', border: '2px solid #16a34a', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '900', color: '#16a34a' }}>🎉 Reservation Confirmed!</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#166534', fontWeight: '500', padding: '0 12px' }}>
                      We notified {currentItem.owner.displayName}. Check your email inbox at <strong>{authEmail}</strong> for delivery arrangements!
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label htmlFor="duration" style={{ display: 'block', fontWeight: '800', marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase' }}>Rental Duration (Days)</label>
                      <input 
                        id="duration"
                        type="number" 
                        min="1" 
                        max="30" 
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: '100%', padding: '10px', border: '2px solid #000000', borderRadius: '4px', boxSizing: 'border-box', fontWeight: 'bold', fontSize: '16px' }}
                      />
                    </div>

                    <div style={{ borderTop: '2px dashed #000000', paddingTop: '16px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '8px' }}>
                        <span>Rate Statement:</span>
                        <span>{isItemFree ? 'Free' : `$${(basePriceCents / 100).toFixed(2)} / day`}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '900', borderTop: '2px solid #000000', paddingTop: '12px', marginTop: '12px' }}>
                        <span>Estimated Total:</span>
                        <span style={{ color: isItemFree ? '#2563eb' : '#16a34a' }}>{isItemFree ? 'Free' : `$${totalCostDollars}`}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsBookingConfirmed(true)}
                      style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', border: '3px solid #000000', padding: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '4px 4px 0px #000000' }}
                    >
                      Confirm Order Request
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ================= GLOBAL MODAL: ACCOUNT AUTH OVERLAY ================= */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(28, 25, 23, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '3px solid #000000', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '100%', boxSizing: 'border-box', boxShadow: '8px 8px 0px #000000', position: 'relative' }}>
            
            <button 
              onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', padding: '4px' }}
              aria-label="Close authentication modal"
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>Welcome to Pddle</h3>
            <p style={{ margin: '0 0 20px 0', color: '#57534e', fontSize: '14px' }}>Enter your email address to sign in instantly. No complex password required for this build demo.</p>

            <form onSubmit={handleAuthSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="authEmailInput" style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Email Address</label>
                <input 
                  id="authEmailInput"
                  type="email"
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '2px solid #000000', borderRadius: '4px', boxSizing: 'border-box', fontSize: '15px', fontWeight: '500' }}
                  autoFocus
                />
              </div>

              {authError && (
                <div style={{ backgroundColor: '#fee2e2', border: '2px solid #ef4444', color: '#b91c1c', padding: '8px 12px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px', borderRadius: '4px' }}>
                  {authError}
                </div>
              )}

              <button 
                type="submit"
                style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: '2px solid #000000', padding: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '3px 3px 0px #000000', boxSizing: 'border-box' }}
              >
                Access Platform Account
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}