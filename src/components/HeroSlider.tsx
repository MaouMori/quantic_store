import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdmin } from '../context/useAdmin'

export default function HeroSlider() {
  const { banners } = useAdmin()
  const heroSlides = banners.filter(banner => banner.active && banner.position === 'home')
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const activeIndex = Math.min(current, Math.max(0, heroSlides.length - 1))

  const nextSlide = useCallback(() => {
    setCurrent(prev => (heroSlides.length ? (prev + 1) % heroSlides.length : 0))
  }, [heroSlides.length])

  const prevSlide = useCallback(() => {
    setCurrent(prev => (heroSlides.length ? (prev - 1 + heroSlides.length) % heroSlides.length : 0))
  }, [heroSlides.length])

  useEffect(() => {
    if (!isAutoPlaying) return
    if (heroSlides.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [heroSlides.length, isAutoPlaying, nextSlide])

  if (heroSlides.length === 0) return null

  return (
    <section
      className="relative w-full overflow-hidden bg-void"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative w-full max-w-[1920px] mx-auto h-[clamp(260px,56.25vw,720px)] overflow-hidden">
        {heroSlides.map((s, index) => {
          const image = (
            <img
              src={s.image}
              alt={s.title || 'Banner'}
              className="w-full h-full object-contain object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          )
          const link = s.link.trim()

          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {link ? (
                <Link to={link} className="block w-full h-full">
                  {image}
                </Link>
              ) : (
                image
              )}
            </div>
          )
        })}

        {heroSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-void/50 border border-neon-pink/20 text-text-muted hover:text-neon-pink hover:border-neon-pink/40 flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-void/50 border border-neon-pink/20 text-text-muted hover:text-neon-pink hover:border-neon-pink/40 flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Proximo banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {heroSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-neon-pink w-8'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ver banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
