/**
 * Animation utilities for React LLM
 * Provides smooth, delightful micro-interactions
 */

import { easings } from '../styles/tokens';

// Haptic feedback simulation for web
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 20]);
    }
  },
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
  }
};

// Spring physics animation
export const springAnimation = (
  element: HTMLElement,
  property: string,
  from: number,
  to: number,
  options: {
    stiffness?: number;
    damping?: number;
    mass?: number;
    onComplete?: () => void;
  } = {}
) => {
  const { stiffness = 200, damping = 20, mass = 1, onComplete } = options;
  
  let velocity = 0;
  let position = from;
  let rafId: number;
  
  const animate = () => {
    const springForce = (to - position) * stiffness;
    const dampingForce = velocity * damping;
    const acceleration = (springForce - dampingForce) / mass;
    
    velocity += acceleration * 0.001; // Convert to seconds
    position += velocity;
    
    // Apply the animation
    if (property === 'transform') {
      element.style.transform = `translateY(${position}px)`;
    } else if (property === 'opacity') {
      element.style.opacity = position.toString();
    }
    
    // Check if animation should continue
    if (Math.abs(velocity) > 0.01 || Math.abs(to - position) > 0.01) {
      rafId = requestAnimationFrame(animate);
    } else {
      // Snap to final value
      if (property === 'transform') {
        element.style.transform = `translateY(${to}px)`;
      } else if (property === 'opacity') {
        element.style.opacity = to.toString();
      }
      
      if (onComplete) onComplete();
    }
  };
  
  animate();
  
  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
};

// Parallax scroll effect
export const createParallaxEffect = (
  element: HTMLElement,
  speed: number = 0.5
) => {
  let ticking = false;
  
  const updatePosition = () => {
    const scrolled = window.pageYOffset;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
    ticking = false;
  };
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updatePosition);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', onScroll);
  
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
};

// Stagger animation for lists
export const staggerAnimation = (
  elements: NodeListOf<HTMLElement> | HTMLElement[],
  animation: string,
  delay: number = 50
) => {
  Array.from(elements).forEach((el, index) => {
    el.style.animationDelay = `${index * delay}ms`;
    el.classList.add(animation);
  });
};

// Smooth number counter animation
export const animateNumber = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1000,
  format?: (value: number) => string
) => {
  const startTime = performance.now();
  const formatter = format || ((n: number) => Math.round(n).toString());
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smooth animation
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
    const currentValue = start + (end - start) * easedProgress;
    
    element.textContent = formatter(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Magnetic cursor effect for interactive elements
export const createMagneticEffect = (element: HTMLElement, strength: number = 20) => {
  let rect = element.getBoundingClientRect();
  
  const onMouseMove = (e: MouseEvent) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(rect.width, rect.height);
    
    if (distance < maxDistance) {
      const power = (maxDistance - distance) / maxDistance;
      const moveX = (deltaX / distance) * strength * power;
      const moveY = (deltaY / distance) * strength * power;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  };
  
  const onMouseLeave = () => {
    element.style.transform = 'translate(0, 0)';
  };
  
  const updateRect = () => {
    rect = element.getBoundingClientRect();
  };
  
  element.addEventListener('mouseenter', updateRect);
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', updateRect);
  
  return () => {
    element.removeEventListener('mouseenter', updateRect);
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('resize', updateRect);
  };
};

// Typewriter effect for text
export const typewriterEffect = (
  element: HTMLElement,
  text: string,
  speed: number = 50,
  onComplete?: () => void
) => {
  let index = 0;
  element.textContent = '';
  
  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  type();
};

// Elastic overscroll effect
export const createElasticScroll = (element: HTMLElement) => {
  let startY = 0;
  let currentY = 0;
  let touching = false;
  
  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    touching = true;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!touching) return;
    
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (element.scrollTop === 0 && diff > 0) {
      // Overscrolling at top
      e.preventDefault();
      const resistance = diff / 3;
      element.style.transform = `translateY(${resistance}px)`;
    } else if (
      element.scrollTop === element.scrollHeight - element.clientHeight &&
      diff < 0
    ) {
      // Overscrolling at bottom
      e.preventDefault();
      const resistance = diff / 3;
      element.style.transform = `translateY(${resistance}px)`;
    }
  };
  
  const handleTouchEnd = () => {
    touching = false;
    element.style.transition = `transform 0.3s ${easings.spring}`;
    element.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      element.style.transition = '';
    }, 300);
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd);
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

// Page transition animations
export const pageTransition = {
  fadeIn: (element: HTMLElement, duration: number = 300) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ${easings.smooth}`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },
  
  slideIn: (element: HTMLElement, direction: 'left' | 'right' = 'right', duration: number = 400) => {
    const translateX = direction === 'right' ? '100%' : '-100%';
    element.style.transform = `translateX(${translateX})`;
    element.style.transition = `transform ${duration}ms ${easings.spring}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
    });
  },
  
  scaleIn: (element: HTMLElement, duration: number = 300) => {
    element.style.transform = 'scale(0.9)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ${easings.spring}, opacity ${duration}ms ${easings.smooth}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  }
};

// Success animation helper
export const showSuccess = (element: HTMLElement) => {
  element.classList.add('feedback-success');
  hapticFeedback.medium();
  
  setTimeout(() => {
    element.classList.remove('feedback-success');
  }, 600);
};

// Error animation helper
export const showError = (element: HTMLElement) => {
  element.classList.add('feedback-error');
  hapticFeedback.heavy();
  
  setTimeout(() => {
    element.classList.remove('feedback-error');
  }, 500);
};

// Confetti effect for celebrations
export const createConfetti = (x: number, y: number, count: number = 30) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#6C5CE7'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${x}px;
      top: ${y}px;
      opacity: 1;
      transform: scale(0);
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 200 + Math.random() * 200;
    const friction = 0.98;
    const gravity = 0.3;
    
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 5;
    let posX = 0;
    let posY = 0;
    let opacity = 1;
    let scale = 1;
    
    const animate = () => {
      vx *= friction;
      vy = (vy + gravity) * friction;
      posX += vx * 0.016; // 60fps
      posY += vy * 0.016;
      opacity -= 0.01;
      scale = Math.max(0, scale - 0.01);
      
      confetti.style.transform = `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${posX * 2}deg)`;
      confetti.style.opacity = opacity.toString();
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };
    
    requestAnimationFrame(() => {
      confetti.style.transform = 'scale(1)';
      animate();
    });
  }
};