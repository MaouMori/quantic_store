import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
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
      className="relative w-full h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Full background image - covers entire hero */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          {/* Light overlay only on left side for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/40 to-transparent" />
          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent" />
        </div>
      ))}

      {/* Decorative elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-neon-pink rounded-full animate-twinkle" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-neon-purple rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-soft-pink rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
      </div>

      {/* Slides Content */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className={`hero-slide flex items-center z-20 ${index === activeIndex ? 'active' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center">
              {/* Text Content - positioned on the left */}
              <div className="space-y-6 max-w-xl">
                <div className="space-y-1">
                  <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-none tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {s.title}
                  </h1>
                </div>

                <p className="text-white/90 text-base sm:text-lg max-w-md leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  Banner ativo no painel administrativo.
                </p>

                <Link to={s.link || '/loja'} className="group relative inline-flex items-center gap-2 bg-neon-pink hover:bg-hot-pink text-white px-6 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all btn-shine shadow-lg shadow-neon-pink/30">
                  <Sparkles className="w-4 h-4" />
                  VER AGORA
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right side is empty - the background image shows the characters */}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-void/50 border border-neon-pink/20 text-text-muted hover:text-neon-pink hover:border-neon-pink/40 flex items-center justify-center transition-all backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-void/50 border border-neon-pink/20 text-text-muted hover:text-neon-pink hover:border-neon-pink/40 flex items-center justify-center transition-all backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
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
          />
        ))}
      </div>
    </section>
  )
}
