
const backgroundAudio = document.getElementById('background-audio');


function initializeAudio() {
  if (backgroundAudio) {
    // Configurar el volumen al 30%
    backgroundAudio.volume = 0.3;
    
    // Establecer el tiempo de inicio en 43 segundos
    backgroundAudio.currentTime = 43;
    
    // Intentar reproducir automáticamente
    const playPromise = backgroundAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Audio iniciado automáticamente desde el segundo 43');
      }).catch(error => {
        console.log('Reproducción automática bloqueada, se requiere interacción del usuario');
        // Agregar event listener para reproducir en la primera interacción
        document.addEventListener('click', function startAudio() {
          backgroundAudio.currentTime = 43;
          backgroundAudio.play();
          document.removeEventListener('click', startAudio);
        }, { once: true });
      });
    }
  }
}

// Botón sorpresa
// Próximamente: mostrar sorpresa animada 

// Carrusel 3D mejorado con rotación automática
const images = document.querySelectorAll('.carousel-img');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let current = 0;
let autoPlayInterval;
let isAutoPlaying = true;
let isPressed = false;
let pressInterval;

function updateCarousel3D() {
  images.forEach((img, i) => {
    // Remover todas las clases de posición
    img.classList.remove('active', 'prev-1', 'prev-2', 'next-1', 'next-2', 'hidden', 'hidden-left');
    
    // Calcular la posición relativa
    const totalImages = images.length;
    let relativePos = i - current;
    
    // Manejar el wrap-around
    if (relativePos > totalImages / 2) {
      relativePos -= totalImages;
    } else if (relativePos < -totalImages / 2) {
      relativePos += totalImages;
    }
    
    // Asignar clases según la posición
    if (relativePos === 0) {
      img.classList.add('active');
    } else if (relativePos === -1) {
      img.classList.add('prev-1');
    } else if (relativePos === -2) {
      img.classList.add('prev-2');
    } else if (relativePos === 1) {
      img.classList.add('next-1');
    } else if (relativePos === 2) {
      img.classList.add('next-2');
    } else if (relativePos > 2) {
      img.classList.add('hidden');
    } else if (relativePos < -2) {
      img.classList.add('hidden-left');
    }
  });
  
  // Actualizar indicadores
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === current);
  });
}

function nextImage() {
  current = (current + 1) % images.length;
  updateCarousel3D();
}

function prevImage() {
  current = (current - 1 + images.length) % images.length;
  updateCarousel3D();
}

function startAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(nextImage, 4000); // Cambia cada 4 segundos
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

function startContinuousScroll(direction) {
  if (pressInterval) clearInterval(pressInterval);
  pressInterval = setInterval(() => {
    if (direction === 'next') {
      nextImage();
    } else {
      prevImage();
    }
  }, 300); // Cambia cada 300ms cuando se mantiene presionado
}

function stopContinuousScroll() {
  if (pressInterval) {
    clearInterval(pressInterval);
    pressInterval = null;
  }
}

// Event listeners para los botones
prevBtn.addEventListener('click', () => {
  prevImage();
  if (isAutoPlaying) {
    stopAutoPlay();
    setTimeout(startAutoPlay, 6000);
  }
});

nextBtn.addEventListener('click', () => {
  nextImage();
  if (isAutoPlaying) {
    stopAutoPlay();
    setTimeout(startAutoPlay, 6000);
  }
});

// Mantener presionado para scroll continuo
prevBtn.addEventListener('mousedown', () => {
  isPressed = true;
  stopAutoPlay();
  startContinuousScroll('prev');
});

nextBtn.addEventListener('mousedown', () => {
  isPressed = true;
  stopAutoPlay();
  startContinuousScroll('next');
});

// Detener scroll continuo al soltar
prevBtn.addEventListener('mouseup', () => {
  isPressed = false;
  stopContinuousScroll();
  if (isAutoPlaying) {
    setTimeout(startAutoPlay, 3000);
  }
});

nextBtn.addEventListener('mouseup', () => {
  isPressed = false;
  stopContinuousScroll();
  if (isAutoPlaying) {
    setTimeout(startAutoPlay, 3000);
  }
});

// Detener scroll continuo al salir del botón
prevBtn.addEventListener('mouseleave', () => {
  if (isPressed) {
    isPressed = false;
    stopContinuousScroll();
    if (isAutoPlaying) {
      setTimeout(startAutoPlay, 3000);
    }
  }
});

nextBtn.addEventListener('mouseleave', () => {
  if (isPressed) {
    isPressed = false;
    stopContinuousScroll();
    if (isAutoPlaying) {
      setTimeout(startAutoPlay, 3000);
    }
  }
});

// Pausar auto-play al hacer hover sobre el carrusel
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', () => {
  if (isAutoPlaying) {
    stopAutoPlay();
  }
});

carousel.addEventListener('mouseleave', () => {
  if (isAutoPlaying) {
    startAutoPlay();
  }
});

// Event listeners para los indicadores
document.querySelectorAll('.indicator').forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    current = index;
    updateCarousel3D();
    if (isAutoPlaying) {
      stopAutoPlay();
      setTimeout(startAutoPlay, 6000);
    }
  });
});

// Soporte para gestos táctiles (swipe)
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  if (isAutoPlaying) {
    stopAutoPlay();
  }
});

carousel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  if (isAutoPlaying) {
    setTimeout(startAutoPlay, 4000);
  }
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe izquierda - siguiente imagen
      nextImage();
    } else {
      // Swipe derecha - imagen anterior
      prevImage();
    }
  }
}

// Inicializar
updateCarousel3D();
startAutoPlay();

// Animaciones de fondo: tulipanes mejorados, destellos, corazones y huellitas
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  function randomTulip() {
    return {
      x: Math.random() * w,
      y: h + 40 + Math.random() * 100,
      speed: 0.6 + Math.random() * 1.4,
      size: 32 + Math.random() * 20,
      sway: Math.random() * 2.5,
      swayDir: Math.random() > 0.5 ? 1 : -1,
      color: ['#d6c7f7', '#ffd1e3', '#c7eaff', '#e7b5ff', '#b8e6b8'][Math.floor(Math.random()*5)],
      petalCount: 3 + Math.floor(Math.random() * 3),
      rotation: Math.random() * Math.PI * 2
    };
  }

  function randomHeart() {
    return {
      x: Math.random() * w,
      y: h + 30 + Math.random() * 80,
      speed: 0.4 + Math.random() * 1.0,
      size: 12 + Math.random() * 16,
      sway: Math.random() * 1.5,
      swayDir: Math.random() > 0.5 ? 1 : -1,
      color: ['#ff6b9d', '#ff8fab', '#ffb3d1', '#ffd1e3', '#e7b5ff'][Math.floor(Math.random()*5)],
      rotation: Math.random() * Math.PI * 2,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function randomSparkle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.2 + Math.random() * 3,
      alpha: 0.6 + Math.random() * 0.4,
      speed: 0.08 + Math.random() * 0.15
    };
  }

  function randomPaw() {
    return {
      x: Math.random() * w,
      y: h + 20 + Math.random() * 100,
      speed: 0.4 + Math.random() * 0.8,
      size: 18 + Math.random() * 10,
      alpha: 0.15 + Math.random() * 0.15
    };
  }

  let tulips = Array.from({length: 10}, randomTulip);
  let hearts = Array.from({length: 8}, randomHeart);
  let sparkles = Array.from({length: 20}, randomSparkle);
  let paws = Array.from({length: 4}, randomPaw);

  function drawTulip(t) {
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(Math.sin(t.y/40)*0.15*t.swayDir + t.rotation);
    
    // Tallo
    ctx.beginPath();
    ctx.moveTo(0, t.size*0.5);
    ctx.lineTo(0, t.size*0.95);
    ctx.strokeStyle = '#7fb069';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Hojas
    ctx.beginPath();
    ctx.ellipse(-t.size*0.15, t.size*0.7, t.size*0.12, t.size*0.08, -0.3, 0, Math.PI*2);
    ctx.fillStyle = '#8bc34a';
    ctx.globalAlpha = 0.8;
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(t.size*0.15, t.size*0.75, t.size*0.1, t.size*0.07, 0.3, 0, Math.PI*2);
    ctx.fill();
    
    // Pétalos del tulipán
    for (let i = 0; i < t.petalCount; i++) {
      const angle = (i / t.petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      
      // Pétalo principal
      ctx.beginPath();
      ctx.ellipse(0, -t.size*0.1, t.size*0.2, t.size*0.4, 0, 0, Math.PI*2);
      ctx.fillStyle = t.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      
      // Detalle del pétalo
      ctx.beginPath();
      ctx.ellipse(0, -t.size*0.15, t.size*0.15, t.size*0.3, 0, 0, Math.PI*2);
      ctx.fillStyle = t.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      
      ctx.restore();
    }
    
    // Centro del tulipán
    ctx.beginPath();
    ctx.arc(0, -t.size*0.1, t.size*0.08, 0, Math.PI*2);
    ctx.fillStyle = '#ffd700';
    ctx.globalAlpha = 0.8;
    ctx.fill();
    
    ctx.restore();
  }

  function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(Math.sin(h.y/30)*0.1*h.swayDir + h.rotation);
    
    const pulse = Math.sin(h.pulse) * 0.1 + 1;
    const size = h.size * pulse;
    
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size * 0.5, -size * 0.5, 0, -size * 0.5);
    ctx.bezierCurveTo(size * 0.5, -size * 0.5, size * 0.5, -size * 0.2, 0, size * 0.3);
    ctx.fillStyle = h.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    
    // Brillo
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.25, size * 0.1, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    
    ctx.restore();
  }

  function drawSparkle(s) {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = '#fff9f3';
    ctx.shadowColor = '#fff9f3';
    ctx.shadowBlur = 10;
    ctx.fill();
    
    // Cruz de destellos
    ctx.beginPath();
    ctx.moveTo(s.x - s.r*2, s.y);
    ctx.lineTo(s.x + s.r*2, s.y);
    ctx.moveTo(s.x, s.y - s.r*2);
    ctx.lineTo(s.x, s.y + s.r*2);
    ctx.strokeStyle = '#fff9f3';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }

  function drawPaw(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size*0.5, p.size*0.3, 0, 0, Math.PI*2);
    ctx.fillStyle = '#ffd1e3';
    ctx.fill();
    for (let i = -1; i <= 1; i+=2) {
      ctx.beginPath();
      ctx.ellipse(i*p.size*0.22, -p.size*0.18, p.size*0.13, p.size*0.13, 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(0, -p.size*0.18, p.size*0.13, p.size*0.13, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0,0,w,h);
    
    // Dibujar tulipanes
    tulips.forEach(t => {
      t.y -= t.speed;
      t.x += Math.sin(t.y/40)*t.sway;
      t.rotation += 0.01;
      drawTulip(t);
      if (t.y < -40) Object.assign(t, randomTulip());
    });
    
    // Dibujar corazones
    hearts.forEach(h => {
      h.y -= h.speed;
      h.x += Math.sin(h.y/30)*h.sway;
      h.rotation += 0.02;
      h.pulse += 0.1;
      drawHeart(h);
      if (h.y < -30) Object.assign(h, randomHeart());
    });
    
    // Dibujar destellos
    sparkles.forEach(s => {
      s.alpha -= s.speed*0.01;
      s.y += s.speed;
      drawSparkle(s);
      if (s.alpha < 0.1) Object.assign(s, randomSparkle());
    });
    
    // Dibujar huellitas
    paws.forEach(p => {
      p.y -= p.speed;
      drawPaw(p);
      if (p.y < -20) Object.assign(p, randomPaw());
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });
}

// Gatito animado interactivo mejorado
const catAnim = document.getElementById('cat-anim');
const catMouth = document.getElementById('cat-mouth');
const catBlushL = document.getElementById('cat-blush-left');
const catBlushR = document.getElementById('cat-blush-right');
const catEyeL = document.getElementById('cat-eye-left');
const catEyeR = document.getElementById('cat-eye-right');
const catTail = document.getElementById('cat-tail');
let catState = 'normal';

function setCatState(state) {
  if (!catMouth || !catBlushL || !catBlushR || !catEyeL || !catEyeR || !catTail) return;
  
  if (state === 'love') {
    // Boca feliz
    catMouth.setAttribute('d', 'M57,72 Q60,78 63,72');
    // Mejillas más rosadas
    catBlushL.setAttribute('opacity', '0.9');
    catBlushR.setAttribute('opacity', '0.9');
    // Ojos más grandes y felices
    catEyeL.setAttribute('rx', '4.5');
    catEyeL.setAttribute('ry', '5.5');
    catEyeR.setAttribute('rx', '4.5');
    catEyeR.setAttribute('ry', '5.5');
    // Cola feliz
    catTail.style.transform = 'rotate(5deg)';
    showHearts();
  } else if (state === 'angry') {
    // Boca enojada
    catMouth.setAttribute('d', 'M57,76 Q60,70 63,76');
    // Mejillas más intensas
    catBlushL.setAttribute('opacity', '0.8');
    catBlushR.setAttribute('opacity', '0.8');
    // Ojos más pequeños y enojados
    catEyeL.setAttribute('rx', '3.5');
    catEyeL.setAttribute('ry', '4');
    catEyeR.setAttribute('rx', '3.5');
    catEyeR.setAttribute('ry', '4');
    // Cola enojada
    catTail.style.transform = 'rotate(-8deg)';
  } else {
    // Boca normal
    catMouth.setAttribute('d', 'M57,72 Q60,75 63,72');
    // Mejillas normales
    catBlushL.setAttribute('opacity', '0.6');
    catBlushR.setAttribute('opacity', '0.6');
    // Ojos normales
    catEyeL.setAttribute('rx', '4');
    catEyeL.setAttribute('ry', '5');
    catEyeR.setAttribute('rx', '4');
    catEyeR.setAttribute('ry', '5');
    // Cola normal
    catTail.style.transform = 'rotate(0deg)';
  }
  catState = state;
}

function showHearts() {
  const svg = document.getElementById('cat-svg');
  if (!svg) return;
  
  // Limpiar corazones anteriores
  const existingHearts = svg.querySelectorAll('.floating-heart');
  existingHearts.forEach(heart => heart.remove());
  
  for (let i = 0; i < 5; i++) {
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    heart.setAttribute('class', 'floating-heart');
    heart.setAttribute('d', `M60,50
      c-3,-5 -10,-5 -10,2
      c0,7 10,12 10,20
      c0,-8 10,-13 10,-20
      c0,-7 -7,-7 -10,-2z`);
    heart.setAttribute('fill', ['#ff6b9d', '#ff8fab', '#ffb3d1', '#e7b5ff', '#d6c7f7'][i]);
    heart.setAttribute('opacity', '0.8');
    heart.style.animation = `floatHeart ${2 + i * 0.3}s infinite`;
    heart.style.transformOrigin = 'center';
    
    // Posición aleatoria alrededor del gatito
    const angle = (i / 5) * Math.PI * 2;
    const radius = 30 + Math.random() * 20;
    const x = 60 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    heart.style.transform = `translate(${x}px, ${y}px)`;
    
    svg.appendChild(heart);
  }
}

// Animación de la cola
function animateTail() {
  if (!catTail) return;
  
  const tailAnimation = () => {
    const time = Date.now() * 0.003;
    const sway = Math.sin(time) * 3;
    catTail.style.transform = `rotate(${sway}deg)`;
    requestAnimationFrame(tailAnimation);
  };
  
  tailAnimation();
}

// Interacciones del gatito
if (catAnim) {
  catAnim.addEventListener('mouseenter', () => {
    setCatState('love');
  });
  
  catAnim.addEventListener('mouseleave', () => {
    setCatState('normal');
  });
  
  catAnim.addEventListener('click', () => {
    setCatState('love');
    setTimeout(() => setCatState('normal'), 2000);
  });
  
  // Iniciar animación de la cola
  animateTail();
}

// Frases románticas con efecto máquina de escribir
const frases = [
  'Mi niña hermosa, eres el sueño que nunca supe que tenía. 💜',
  'Bebe linda, cada día me enamoras más con tu brillo. ✨',
  
  'Enana, contigo todo es más dulce y especial. 🌸',
  
  
  'Mi princesa, eres la luz que ilumina todos mis días. 👑✨',
  
  'Mi ángel, has convertido mi vida en un paraíso. 👼',
  
  'Mi sol, tu sonrisa calienta mi corazón cada mañana. ☀️',

  'Mi estrella, eres mi guía en mi camino. ⭐',

  'No quiero perderte, eres lo más especial para mí. 🦋'
];
const typewriter = document.getElementById('typewriter');
let fraseIdx = 0;
let charIdx = 0;
function typeFrase() {
  if (!typewriter) return;
  if (charIdx <= frases[fraseIdx].length) {
    typewriter.textContent = frases[fraseIdx].slice(0, charIdx);
    charIdx++;
    setTimeout(typeFrase, 38 + Math.random()*40);
  } else {
    setTimeout(()=>{
      charIdx = 0;
      fraseIdx = (fraseIdx+1)%frases.length;
      setTimeout(typeFrase, 900);
    }, 1800);
  }
}
typeFrase(); 

// Botón sorpresa: mostrar modal animado
const loveBtn = document.getElementById('love-btn');
const surpriseModal = document.getElementById('surprise-modal');
const closeModalBtn = document.querySelector('.close-modal');

function openSurprise() {
  if (surpriseModal) {
    surpriseModal.classList.add('active');
    surpriseModal.classList.remove('hidden');
  }
}
function closeSurprise() {
  if (surpriseModal) {
    surpriseModal.classList.remove('active');
    setTimeout(()=>surpriseModal.classList.add('hidden'), 400);
  }
}
if (loveBtn) loveBtn.addEventListener('click', openSurprise);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeSurprise); 

// Animación de carta saliendo del sobre
const envelopeOverlay = document.getElementById('envelope-click-overlay');
const svgLetterGroup = document.getElementById('svg-letter-group');
const pullInstruction = document.querySelector('.pull-instruction');

function resetEnvelopeModal() {
  if (svgLetterGroup) {
    svgLetterGroup.classList.remove('svg-letter-visible');
    svgLetterGroup.classList.add('svg-letter-hidden');
  }
  if (pullInstruction) {
    pullInstruction.classList.remove('hide');
  }
  if (closeModalBtn) {
    closeModalBtn.style.display = 'none';
  }
}
function showLetter() {
  if (svgLetterGroup) {
    svgLetterGroup.classList.remove('svg-letter-hidden');
    svgLetterGroup.classList.add('svg-letter-visible');
  }
  if (pullInstruction) {
    pullInstruction.classList.add('hide');
  }
  if (closeModalBtn) {
    closeModalBtn.style.display = 'block';
  }
}
if (envelopeOverlay) {
  envelopeOverlay.addEventListener('click', showLetter);
}
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    resetEnvelopeModal();
    closeSurprise();
  });
}
// Al abrir el modal, resetear estado
if (loveBtn) loveBtn.addEventListener('click', resetEnvelopeModal); 

// Inicializar el audio cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  initializeAudio();
});

// También inicializar cuando la ventana se carga completamente
window.addEventListener('load', function() {
  initializeAudio();
});

// Asegurar que el audio vuelva al segundo 43 cuando termine (para el bucle)
if (backgroundAudio) {
  backgroundAudio.addEventListener('ended', function() {
    backgroundAudio.currentTime = 43;
    backgroundAudio.play();
  });
} 