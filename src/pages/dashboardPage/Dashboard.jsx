import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import anh1 from '../../assets/1.webp'
import anh2 from '../../assets/2.webp'
import anh3 from '../../assets/3.webp'
import anh4 from '../../assets/4.webp'
import anh5 from '../../assets/5.webp'
import anh6 from '../../assets/6.webp'

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const images = [anh1, anh2, anh3, anh4, anh5, anh6]
  
  // Auto-slide sau 2 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 2000) // 2 giây
    
    return () => clearInterval(interval) // Cleanup khi component unmount
  }, [images.length])
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }
  
  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="dashboard">
      <div className="carousel-wrapper">
        <button className="carousel-btn prev-btn" onClick={prevSlide}>
          &#8249;
        </button>
        
        <div className="carousel-container">
          <div className="carousel">
            <div className="carousel-content">
              <div 
                className="carousel-slides" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {images.map((image, index) => (
                  <div key={index} className="carousel-slide">
                    <img src={image} alt={`Slide ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <button className="carousel-btn next-btn" onClick={nextSlide}>
          &#8250;
        </button>
      </div>
      
      {/* Dots bên ngoài carousel-wrapper */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard