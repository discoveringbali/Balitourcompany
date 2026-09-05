'use client';
import { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import Image from 'next/image';

const mockReviews = [
  {
    id: 'm1',
    user: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely incredible experience! Our driver Putu was so friendly and knew all the best spots to avoid the crowds. Highly recommend the Ubud Highlights tour.',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    tourTitle: 'Ubud Highlights Tour'
  },
  {
    id: 'm2',
    user: 'Mark T.',
    rating: 5,
    comment: 'The Mount Batur sunrise trek was breathtaking. Our guide was very patient and made sure we safely reached the top. Booking through Balance Island was seamless!',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    tourTitle: 'Mount Batur Sunrise Trek'
  },
  {
    id: 'm3',
    user: 'Jessica W.',
    rating: 5,
    comment: 'Such a smooth and stress-free trip. The car was clean, AC worked perfectly, and we got to see the beautiful beaches in Uluwatu at our own pace.',
    date: new Date(Date.now() - 21 * 86400000).toISOString(),
    tourTitle: 'Uluwatu Sunset Tour'
  },
  {
    id: 'm4',
    user: 'David K.',
    rating: 5,
    comment: 'Our trip to Nusa Penida was the highlight of our Bali holiday! Balance Island organized everything perfectly, from the fast boat to the local transport.',
    date: new Date(Date.now() - 30 * 86400000).toISOString(),
    tourTitle: 'Nusa Penida Day Trip'
  }
];

export default function GlobalReviewsSection({ tours = [] }) {
  const [allReviews, setAllReviews] = useState([]);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const scrollRef = useRef(null);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    tourId: '',
    comment: ''
  });

  useEffect(() => {
    // 1. Calculate total reviews (from the listings numbers)
    const count = tours.reduce((sum, tour) => sum + (Number(tour.reviews) || 0), 0);
    // If no reviews at all, use mock length as fallback display
    setTotalReviewCount(count > 0 ? count : mockReviews.length);

    // 2. Extract real reviews from tours
    let extractedReviews = [];
    tours.forEach(tour => {
      if (tour.data && Array.isArray(tour.data.reviewsList)) {
        tour.data.reviewsList.forEach(rev => {
          extractedReviews.push({
            ...rev,
            tourTitle: tour.title
          });
        });
      }
    });

    // 3. Sort by date descending
    extractedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. Fallback to mocks if no real reviews
    if (extractedReviews.length === 0) {
      setAllReviews(mockReviews);
    } else {
      setAllReviews(extractedReviews);
    }
  }, [tours]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name || !formData.tourId || !formData.comment) {
      setFormError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.tourId,
          name: formData.name,
          rating: formData.rating,
          comment: formData.comment,
          accessCode: 'BI-123' // Required by the API
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess("Thank you for your review! It has been posted.");
        setFormData({ name: '', rating: 5, tourId: '', comment: '' });
        setTimeout(() => setIsWriteModalOpen(false), 2000);
        // Optimistically add to list (simple version)
        const selectedTour = tours.find(t => t.id === formData.tourId);
        setAllReviews(prev => [{
           id: data.newReview.id,
           user: data.newReview.user,
           rating: data.newReview.rating,
           comment: data.newReview.comment,
           date: data.newReview.date,
           tourTitle: selectedTour?.title || 'Bali Tour'
        }, ...prev]);
        setTotalReviewCount(prev => prev + 1);
      } else {
        setFormError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      setFormError("A network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-6 mb-16 mt-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[26px] md:text-[32px] font-black text-primary tracking-tight mb-2 font-serif">
            Guest Reviews <span className="text-gray-400 text-[20px]">({totalReviewCount})</span>
          </h2>
          <p className="text-text-secondary text-[14px] md:text-[16px] max-w-2xl leading-relaxed">
            See what our travelers are saying about their experiences with Balance Island.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-black text-white px-5 py-3 rounded-[16px] font-bold text-[14px] hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Write a Review
          </button>
          <button 
            onClick={() => setIsAllReviewsModalOpen(true)}
            className="bg-white border border-gray-200 text-black px-5 py-3 rounded-[16px] font-bold text-[14px] hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            See All
          </button>
        </div>
      </div>

      {/* Swipeable Carousel */}
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-black hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allReviews.slice(0, 10).map((review) => (
            <div 
              key={review.id} 
              className="snap-center shrink-0 w-[85vw] sm:w-[340px] bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[#f5a623]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 1} stroke="#e5e7eb" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-400">{formatDate(review.date)}</span>
              </div>
              <p className="text-[14px] text-text-secondary leading-relaxed flex-1 italic">
                "{review.comment}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 uppercase">
                  {review.user?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-black">{review.user}</p>
                  <p className="text-[11px] font-semibold text-gray-400 truncate max-w-[200px]">{review.tourTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-black hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* WRITE REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-black text-black">Write a Review</h3>
              <button onClick={() => setIsWriteModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>

            {formSuccess ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-[16px] text-center font-bold">
                {formSuccess}
              </div>
            ) : (
              <form onSubmit={submitReview} className="flex flex-col gap-4">
                {formError && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">{formError}</div>}
                
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[16px] p-3 text-sm focus:outline-none focus:border-black"
                    placeholder="e.g. Sarah M."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Select Tour</label>
                  <select 
                    value={formData.tourId}
                    onChange={e => setFormData({...formData, tourId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[16px] p-3 text-sm focus:outline-none focus:border-black"
                    required
                  >
                    <option value="">-- Choose a Tour --</option>
                    {tours.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="p-1"
                      >
                        <Star size={24} fill={formData.rating >= star ? "#f5a623" : "none"} stroke={formData.rating >= star ? "#f5a623" : "#d1d5db"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Your Review</label>
                  <textarea 
                    value={formData.comment}
                    onChange={e => setFormData({...formData, comment: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[16px] p-3 text-sm focus:outline-none focus:border-black min-h-[100px]"
                    placeholder="Share your experience..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-[16px] hover:bg-neutral-800 disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ALL REVIEWS MODAL */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-100">
              <h3 className="text-[20px] font-black text-black">All Reviews</h3>
              <button onClick={() => setIsAllReviewsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {allReviews.map((review) => (
                <div key={`all-${review.id}`} className="bg-gray-50 rounded-[20px] p-5">
                   <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1 text-[#f5a623]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 1} stroke="#e5e7eb" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">{formatDate(review.date)}</span>
                  </div>
                  <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs uppercase">
                      {review.user?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-black">{review.user}</p>
                      <p className="text-[10px] font-semibold text-gray-400">{review.tourTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
