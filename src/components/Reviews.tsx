import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'
import { reviews } from '../data/storeData'
import { useAdmin } from '../context/useAdmin'

export default function Reviews() {
  const { feedbacks } = useAdmin()
  const [startIndex, setStartIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const approvedFeedbacks = feedbacks.filter(feedback => feedback.approved)
  const visibleReviews = approvedFeedbacks.length > 0
    ? approvedFeedbacks.map(feedback => ({
        id: feedback.id,
        name: feedback.name,
        avatar: '/avatars/default.jpg',
        rating: feedback.rating,
        text: feedback.text,
      }))
    : reviews

  const visibleCount = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
  const maxIndex = Math.max(0, visibleReviews.length - visibleCount)

  const next = () => setStartIndex(prev => Math.min(prev + 1, maxIndex))
  const prev = () => setStartIndex(prev => Math.max(prev - 1, 0))

  useEffect(() => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.children[0]?.getBoundingClientRect().width || 0
      trackRef.current.style.transform = `translateX(-${startIndex * (cardWidth + 16)}px)`
    }
  }, [startIndex])

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-neon-pink text-xl">✦</span>
            <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
              O QUE NOSSAS CLIENTES DIZEM
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-4 h-4 text-star fill-star" />
              ))}
            </div>
            <span className="text-text-main font-bold">4.9</span>
            <span className="text-text-dim text-sm">(312 avaliacoes)</span>
            <Link to="/feedback" className="text-neon-pink text-sm hover:text-hot-pink transition-colors">
              Deixar feedback
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-void border border-neon-pink/20 text-text-muted hover:text-neon-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="overflow-hidden mx-6">
            <div ref={trackRef} className="carousel-track gap-4">
              {visibleReviews.map(review => (
                <div
                  key={review.id}
                  className="review-card flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] rounded-xl p-5 relative"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center overflow-hidden">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = `
                            <span class="text-lg">👤</span>
                          `
                        }}
                      />
                    </div>
                    <span className="font-heading font-bold text-sm text-text-main">
                      {review.name}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-star fill-star" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-text-muted text-sm leading-relaxed">
                    {review.text}
                  </p>

                  {/* Heart */}
                  <Heart className="absolute bottom-4 right-4 w-4 h-4 text-neon-pink/30" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            disabled={startIndex >= maxIndex}
            className="absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-void border border-neon-pink/20 text-text-muted hover:text-neon-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setStartIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === startIndex
                  ? 'bg-neon-pink w-6'
                  : 'bg-text-dim hover:bg-text-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
