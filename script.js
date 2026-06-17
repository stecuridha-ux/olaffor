   // TANGGAL AWAL JADIAN YANG SUDAH VALID (16 OKTOBER 2025)
   const HUBUNGAN_MULAI_DATE = new Date("2025-10-16T00:00:00");

   const typingPhrases = [
       "Selamat datang di ruang kecil kebahagiaan kita.",
       "Setiap detik bersamamu adalah berkah terbaik.",
       "Semoga ini bisa buat kamu senyum hari ini.",
       "Aku sangat menyayangimu, sekarang dan selamanya."
   ];

   // BACKGROUND PARTICLES
   const canvas = document.getElementById('bgCanvas');
   const ctx = canvas.getContext('2d');
   let hearts = [];

   function resizeCanvas() {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
   }
   window.addEventListener('resize', resizeCanvas);
   resizeCanvas();

   class HeartParticle {
       constructor() {
           this.reset();
           this.y = Math.random() * canvas.height;
       }
       reset() {
           this.x = Math.random() * canvas.width;
           this.y = canvas.height + 20;
           this.size = Math.random() * 8 + 4;
           this.speedX = Math.random() * 1 - 0.5;
           this.speedY = Math.random() * 0.8 + 0.3;
           this.opacity = Math.random() * 0.5 + 0.2;
       }
       update() {
           this.x += this.speedX;
           this.y -= this.speedY;
           if (this.y < -20) this.reset();
       }
       draw() {
           ctx.save();
           ctx.globalAlpha = this.opacity;
           ctx.fillStyle = '#f43f5e';
           ctx.shadowBlur = 10;
           ctx.shadowColor = '#f43f5e';
           ctx.beginPath();
           let topCurveHeight = this.size * 0.3;
           ctx.moveTo(this.x, this.y + topCurveHeight);
           ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
           ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size);
           ctx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
           ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
           ctx.closePath();
           ctx.fill();
           ctx.restore();
       }
   }

   for (let i = 0; i < 40; i++) {
       hearts.push(new HeartParticle());
   }

   function animateParticles() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       hearts.forEach(p => {
           p.update();
           p.draw();
       });
       requestAnimationFrame(animateParticles);
   }
   animateParticles();

   // AUDIO ENGINE
   const romanticAudio = document.getElementById('romanticAudio');
   const audioIcon = document.getElementById('audioIcon');

   function toggleAudio() {
       if (romanticAudio.paused) {
           romanticAudio.play().then(() => {
               audioIcon.textContent = '⏸';
           }).catch(err => console.log("Autoplay diblok browser."));
       } else {
           romanticAudio.pause();
           audioIcon.textContent = '▶';
       }
   }

   // TYPING TEXT
   let phraseIdx = 0;
   let charIdx = 0;
   let isDeleting = false;
   const typingTarget = document.getElementById('typingText');

   function processTyping() {
       const currentPhrase = typingPhrases[phraseIdx];
       if (!isDeleting) {
           typingTarget.textContent = currentPhrase.substring(0, charIdx + 1);
           charIdx++;
           if (charIdx === currentPhrase.length) {
               isDeleting = true;
               setTimeout(processTyping, 2500);
               return;
           }
       } else {
           typingTarget.textContent = currentPhrase.substring(0, charIdx - 1);
           charIdx--;
           if (charIdx === 0) {
               isDeleting = false;
               phraseIdx = (phraseIdx + 1) % typingPhrases.length;
           }
       }
       setTimeout(processTyping, isDeleting ? 30 : 75);
   }
   document.addEventListener('DOMContentLoaded', () => setTimeout(processTyping, 1000));

   // TIMELINE COUNTER
   function updateTimelineCounter() {
       const skrg = new Date();
       const selisihMs = skrg - HUBUNGAN_MULAI_DATE;

       if (selisihMs < 0) {
           document.getElementById('cntDays').textContent = "00";
           document.getElementById('cntHours').textContent = "00";
           document.getElementById('cntMinutes').textContent = "00";
           document.getElementById('cntSeconds').textContent = "00";
           return;
       }

       const hari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));
       const jam = Math.floor((selisihMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
       const menit = Math.floor((selisihMs % (1000 * 60 * 60)) / (1000 * 60));
       const detik = Math.floor((selisihMs % (1000 * 60)) / 1000);

       document.getElementById('cntDays').textContent = String(hari).padStart(2, '0');
       document.getElementById('cntHours').textContent = String(jam).padStart(2, '0');
       document.getElementById('cntMinutes').textContent = String(menit).padStart(2, '0');
       document.getElementById('cntSeconds').textContent = String(detik).padStart(2, '0');
   }
   setInterval(updateTimelineCounter, 1000);
   updateTimelineCounter();

   // LETTER OPENER
   function openLetter() {
       const closedDiv = document.getElementById('envelopeClosed');
       const openDiv = document.getElementById('envelopeOpen');
       if (openDiv.classList.contains('hidden')) {
           closedDiv.classList.add('hidden');
           openDiv.classList.remove('hidden');
           setTimeout(() => {
               openDiv.classList.remove('opacity-0', 'translate-y-4');
           }, 50);
       }
   }

   // ARCADE MANAGER
   function switchGame(gameNum) {
       document.querySelectorAll('.game-container').forEach(el => el.classList.add('hidden'));
       for (let i = 1; i <= 3; i++) {
           const btn = document.getElementById(`tabBtn${i}`);
           btn.className = "px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all cursor-pointer text-slate-400 hover:text-rose-300";
       }
       document.getElementById(`gameArea${gameNum}`).classList.remove('hidden');
       document.getElementById(`tabBtn${gameNum}`).className = "px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all cursor-pointer bg-rose-500 text-white shadow-md shadow-rose-500/20";

       if (gameNum === 1) initCatchGame();
       if (gameNum === 2) resetMemoryGame();
       if (gameNum === 3) initLoveQuestion();
   }

   // GAME 1 LOGIC
   let catchScore = 0;
   let catchInterval;
   const catchBox = document.getElementById('catchCanvasBox');
   const basket = document.getElementById('basket');
   const fallingHeart = document.getElementById('fallingHeart');
   const catchFeedback = document.getElementById('catchFeedback');
   const praiseTexts = ["Manis banget!", "Olaf Hebat! ✨", "Hatiku tertangkap! 💖", "I Love You! 🥰", "Wah kamu jago! 🎉"];

   catchBox.addEventListener('mousemove', (e) => {
       const rect = catchBox.getBoundingClientRect();
       let relativeX = e.clientX - rect.left;
       moveBasket(relativeX, rect.width);
   });

   catchBox.addEventListener('touchmove', (e) => {
       if (e.touches.length > 0) {
           const rect = catchBox.getBoundingClientRect();
           let relativeX = e.touches[0].clientX - rect.left;
           moveBasket(relativeX, rect.width);
       }
   });

   function moveBasket(xPos, boxWidth) {
       let halfBasket = basket.offsetWidth / 2;
       let targetX = xPos - halfBasket;
       if (targetX < 0) targetX = 0;
       if (targetX > boxWidth - basket.offsetWidth) targetX = boxWidth - basket.offsetWidth;
       basket.style.left = `${targetX}px`;
       basket.style.transform = 'none';
   }

   let heartY = 0;
   let heartX = Math.random() * 80 + 10;
   let heartSpeed = 2.5;

   function initCatchGame() {
       clearInterval(catchInterval);
       heartY = 0;
       catchScore = 0;
       heartSpeed = 2.5;
       document.getElementById('catchScore').textContent = catchScore;
       catchFeedback.textContent = "";
       
       catchInterval = setInterval(() => {
           heartY += heartSpeed;
           fallingHeart.style.top = `${heartY}px`;
           fallingHeart.style.left = `${heartX}%`;

           if (heartY > catchBox.offsetHeight - 50) {
               let bRect = basket.getBoundingClientRect();
               let hRect = fallingHeart.getBoundingClientRect();
               if (hRect.left + hRect.width > bRect.left && hRect.left < bRect.left + bRect.width) {
                   catchScore++;
                   document.getElementById('catchScore').textContent = catchScore;
                   catchFeedback.textContent = praiseTexts[Math.floor(Math.random() * praiseTexts.length)];
                   heartSpeed += 0.2;
                   resetHeart();
               }
           }
           if (heartY > catchBox.offsetHeight) {
               resetHeart();
           }
       }, 20);
   }

   function resetHeart() {
       heartY = 0;
       heartX = Math.random() * 80 + 10;
   }

   // GAME 2 LOGIC
   const emojis = ['💖', '💖', '🌹', '🌹', '👑', '👑', '🧸', '🧸', '💍', '💍', '🐱', '🐱'];
   let choiceCards = [];
   let choiceElements = [];
   let canClickMemory = true;

   function resetMemoryGame() {
       const grid = document.getElementById('memoryGrid');
       const winMsg = document.getElementById('memoryMessage');
       grid.innerHTML = '';
       winMsg.classList.add('hidden');
       choiceCards = [];
       choiceElements = [];
       canClickMemory = true;

       let shuffledEmojis = [...emojis];
       for (let i = shuffledEmojis.length - 1; i > 0; i--) {
           const j = Math.floor(Math.random() * (i + 1));
           [shuffledEmojis[i], shuffledEmojis[j]] = [shuffledEmojis[j], shuffledEmojis[i]];
       }

       shuffledEmojis.forEach((emoji, idx) => {
           const card = document.createElement('div');
           card.className = "memory-card w-16 h-16 md:w-20 md:h-20 aspect-square cursor-pointer";
           card.dataset.emoji = emoji;
           card.dataset.id = idx;
           card.innerHTML = `
               <div class="memory-card-inner relative w-full h-full pointer-events-none">
                   <div class="memory-card-front absolute w-full h-full bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-xl shadow-inner text-rose-400">❓</div>
                   <div class="memory-card-back absolute w-full h-full bg-rose-950/40 rounded-xl border border-slate-700 flex items-center justify-center text-2xl box-glow">
                       ${emoji}
                   </div>
               </div>
           `;
           card.addEventListener('click', flipMemoryCard);
           grid.appendChild(card);
       });
   }

   function flipMemoryCard(e) {
       const clickedCard = e.currentTarget;
       if (!canClickMemory || clickedCard.classList.contains('flipped') || choiceElements.includes(clickedCard)) return;

       clickedCard.classList.add('flipped');
       choiceCards.push(clickedCard.dataset.emoji);
       choiceElements.push(clickedCard);

       if (choiceCards.length === 2) {
           canClickMemory = false;
           if (choiceCards[0] === choiceCards[1]) {
               choiceCards = [];
               choiceElements = [];
               canClickMemory = true;
               checkMemoryWinCondition();
           } else {
               setTimeout(() => {
                   choiceElements.forEach(el => el.classList.remove('flipped'));
                   choiceCards = [];
                   choiceElements = [];
                   canClickMemory = true;
               }, 1000);
           }
       }
   }

   function checkMemoryWinCondition() {
       const allCards = document.querySelectorAll('.memory-card');
       const totalFlipped = document.querySelectorAll('.memory-card.flipped');
       if (allCards.length === totalFlipped.length) {
           document.getElementById('memoryMessage').classList.remove('hidden');
           triggerConfettiSplurge();
       }
   }

   // GAME 3 LOGIC (FIXED)
   let hasNoButtonTeleported = false;

   function initLoveQuestion() {
       const noBtn = document.getElementById('noBtn');
       const container = document.getElementById('btnContainer');
       hasNoButtonTeleported = false;
       container.classList.remove('flex', 'justify-center', 'items-center', 'gap-6');
       container.classList.add('flex', 'justify-center', 'items-center', 'gap-6');
       noBtn.style.removeProperty('position');
       noBtn.style.removeProperty('left');
       noBtn.style.removeProperty('top');
   }

   function teleportNoButton(event) {
       if (event) event.preventDefault();
       const noBtn = document.getElementById('noBtn');
       const container = document.getElementById('btnContainer');

       if (!hasNoButtonTeleported) {
           container.classList.remove('flex', 'justify-center', 'items-center', 'gap-6'); 
           noBtn.style.position = 'absolute';
           hasNoButtonTeleported = true;
       }

       const parentArea3 = document.getElementById('gameArea3');
       const maxX = parentArea3.clientWidth - noBtn.clientWidth - 20;
       const maxY = parentArea3.clientHeight - noBtn.clientHeight - 20;

       let randomX = Math.floor(Math.random() * maxX) + 10;
       let randomY = Math.floor(Math.random() * maxY) + 10;

       noBtn.style.left = `${randomX}px`;
       noBtn.style.top = `${randomY}px`;
   }

   function selectYes() {
       triggerConfettiSplurge();
       alert("Yeay! Aku tahu kamu pasti sayang banget sama aku! ❤️ Terima kasih sudah mampir ke website kecil ini, Olaf!");
   }

   // CONFETTI SYSTEM
   const confettiCanvas = document.getElementById('confettiCanvas');
   const cCtx = confettiCanvas.getContext('2d');
   let confettiPieces = [];
   let confettiActive = false;

   function resizeConfettiCanvas() {
       confettiCanvas.width = window.innerWidth;
       confettiCanvas.height = window.innerHeight;
   }
   window.addEventListener('resize', resizeConfettiCanvas);
   resizeConfettiCanvas();

   class ConfettiPiece {
       constructor() {
           this.x = Math.random() * confettiCanvas.width;
           this.y = Math.random() * -50 - 20;
           this.size = Math.random() * 6 + 4;
           this.color = ['#f43f5e', '#ffb6c1', '#fda4af', '#e4b382', '#ffffff'][Math.floor(Math.random() * 5)];
           this.speedX = Math.random() * 4 - 2;
           this.speedY = Math.random() * 5 + 3;
           this.rotation = Math.random() * 360;
           this.rotationSpeed = Math.random() * 4 - 2;
       }
       update() {
           this.x += this.speedX;
           this.y += this.speedY;
           this.rotation += this.rotationSpeed;
       }
       draw() {
           cCtx.save();
           cCtx.translate(this.x, this.y);
           cCtx.rotate(this.rotation * Math.PI / 180);
           cCtx.fillStyle = this.color;
           cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
           cCtx.restore();
       }
   }

   function triggerConfettiSplurge() {
       confettiPieces = [];
       for (let i = 0; i < 120; i++) {
           confettiPieces.push(new ConfettiPiece());
       }
       if (!confettiActive) {
           confettiActive = true;
           animateConfetti();
       }
   }

   function animateConfetti() {
       if (confettiPieces.length === 0) {
           confettiActive = false;
           cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
           return;
       }
       cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
       confettiPieces.forEach((p, idx) => {
           p.update();
           p.draw();
           if (p.y > confettiCanvas.height) {
               confettiPieces.splice(idx, 1);
           }
       });
       requestAnimationFrame(animateConfetti);
   }

   window.onload = () => {
       initCatchGame();
       initLoveQuestion();
   };
