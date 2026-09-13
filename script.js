const noteButton = document.querySelector('.open-note');
const sealedNote = document.querySelector('.sealed-note');
const letterMessage = document.querySelector('.letter-message');
const wishButton = document.querySelector('.wish-button');
const wishComplete = document.querySelector('.wish-complete');
const soundButton = document.querySelector('.sound-button');
const soundLabel = document.querySelector('.sound-label');
const birthdayMusic = document.getElementById('birthday-music');
const scrollButtons = document.querySelectorAll('[data-scroll]');

const choiceButtons = document.querySelectorAll('.choice-button');
const choiceResult = document.querySelector('.choice-result');

const heartButtons = document.querySelectorAll('.heart-button');
const loveMeterText = document.querySelector('.love-meter-text');
const loveMeterReset = document.querySelector('.love-meter-reset');

const memoryButtons = document.querySelectorAll('.memory-button');
const memoryStatus = document.querySelector('.memory-status');
const memoryMoves = document.getElementById('memory-moves');
const memoryBest = document.getElementById('memory-best');
const memoryReset = document.querySelector('.memory-reset');

const luckyButton = document.querySelector('.lucky-button');
const luckyResult = document.querySelector('.lucky-result');
const luckyCount = document.getElementById('lucky-count');

const quizButtons = document.querySelectorAll('.quiz-button');
const quizResult = document.querySelector('.quiz-result');

const rouletteButton = document.querySelector('.roulette-button');
const rouletteResult = document.querySelector('.roulette-result');

const dateButton = document.querySelector('.date-button');
const dateResult = document.querySelector('.date-result');

const wouldButtons = document.querySelectorAll('.would-button');
const wouldResult = document.querySelector('.would-result');

const promiseButton = document.querySelector('.promise-button');
const promiseResult = document.querySelector('.promise-result');
const surpriseButton = document.querySelector('.surprise-button');
const surpriseResult = document.querySelector('.surprise-result');
const ritualButton = document.querySelector('.ritual-button');
const ritualResult = document.querySelector('.ritual-result');
const futureButton = document.querySelector('.future-button');
const futureResult = document.querySelector('.future-result');
const fortuneButton = document.querySelector('.fortune-button');
const fortuneResult = document.querySelector('.fortune-result');
const petButtons = document.querySelectorAll('.pet-button');
const petResult = document.querySelector('.pet-result');
const challengeButton = document.querySelector('.challenge-button');
const challengeResult = document.querySelector('.challenge-result');
const catchGameArea = document.getElementById('catch-game-area');
const catchBasket = document.getElementById('catch-basket');
const catchStart = document.querySelector('.catch-start');
const catchStatus = document.querySelector('.catch-status');
const catchMessage = document.getElementById('catch-message');

const proposalBox = document.querySelector('.proposal-box');
const proposalReveal = document.querySelector('.proposal-reveal');
const proposalAnswers = document.querySelectorAll('.proposal-answer');
const proposalResult = document.querySelector('.proposal-result');

const bigHeartButton = document.querySelector('.big-heart-button');
const heartUnlockSection = document.querySelector('.heart-unlock');

const countdownDays = document.getElementById('countdown-days');
const countdownHours = document.getElementById('countdown-hours');
const countdownMinutes = document.getElementById('countdown-minutes');
const countdownSeconds = document.getElementById('countdown-seconds');
const countdownMessage = document.getElementById('countdown-message');
const birthdayLock = document.getElementById('birthday-lock');
const lockDays = document.getElementById('lock-days');
const lockHours = document.getElementById('lock-hours');
const lockMinutes = document.getElementById('lock-minutes');
const lockSeconds = document.getElementById('lock-seconds');

const birthdayDate = new Date(2026, 8, 13, 0, 1, 0);
const padTime = (value) => String(value).padStart(2, '0');

const updateCountdown = () => {
  const remaining = birthdayDate.getTime() - Date.now();

  if (remaining <= 0) {
    countdownDays.textContent = '00';
    countdownHours.textContent = '00';
    countdownMinutes.textContent = '00';
    countdownSeconds.textContent = '00';
    countdownMessage.textContent = 'Happy birthday, my love. Today is all yours.';
    lockDays.textContent = '00';
    lockHours.textContent = '00';
    lockMinutes.textContent = '00';
    lockSeconds.textContent = '00';
    birthdayLock.classList.add('is-unlocked');
    document.body.classList.remove('is-locked');
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownDays.textContent = padTime(days);
  countdownHours.textContent = padTime(hours);
  countdownMinutes.textContent = padTime(minutes);
  countdownSeconds.textContent = padTime(seconds);
  lockDays.textContent = padTime(days);
  lockHours.textContent = padTime(hours);
  lockMinutes.textContent = padTime(minutes);
  lockSeconds.textContent = padTime(seconds);
  countdownMessage.textContent = 'Until I get to celebrate you all day long.';
  document.body.classList.add('is-locked');
};

updateCountdown();
window.setInterval(updateCountdown, 1000);

scrollButtons.forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
  });
});

noteButton.addEventListener('click', () => {
  sealedNote.hidden = true;
  letterMessage.hidden = false;
  letterMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

wishButton.addEventListener('click', () => {
  wishButton.disabled = true;
  wishButton.textContent = 'Wish made ';
  wishButton.insertAdjacentHTML('beforeend', '<span aria-hidden="true">&#10024;</span>');
  wishComplete.hidden = false;
  createConfetti();
});

soundButton.addEventListener('click', () => {
  const isOn = soundButton.getAttribute('aria-pressed') === 'true';
  soundButton.setAttribute('aria-pressed', String(!isOn));
  soundLabel.textContent = isOn ? 'Sound off' : 'Sound on';

  if (!isOn) {
    birthdayMusic.volume = 0.5;
    birthdayMusic.play().catch(() => {
      // Some browsers block autoplay until the user interacts with the page.
      // The button click already counts as user interaction, so playback will start normally.
    });
  } else {
    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;
  }
});

/* ---------------- Pick your happy plan ---------------- */
/* Each choice now has its own line, and picking the same one twice in a
   row nudges toward trying another, so the card rewards actually exploring
   all four instead of clicking once and being done. */
const planLines = {
  Flowers: 'Flowers it is — I already know which ones make you smile the most.',
  'Dinner date': 'Dinner date it is — dress up or stay cozy, either way I\'m in.',
  'Movie night': 'Movie night it is — you pick, I\'ll get the blankets ready.',
  'Weekend trip': 'Weekend trip it is — let\'s actually put it on the calendar this time.'
};
let lastPlan = null;
let planTriesLeft = new Set(Object.keys(planLines));

choiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    choiceButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    const choice = button.dataset.choice;
    let line = planLines[choice] || `Perfect choice: ${choice}.`;
    if (choice === lastPlan) {
      line += ' (You already picked this one — go on, try a different day for it.)';
    }
    lastPlan = choice;
    planTriesLeft.delete(choice);
    if (planTriesLeft.size === 0) {
      line += ' You\'ve gone through all four — let\'s just do every single one this year.';
    }
    choiceResult.textContent = line;
  });
});

/* ---------------- Love meter ---------------- */
heartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = Number(button.dataset.score);
    heartButtons.forEach((item) => item.classList.toggle('active', Number(item.dataset.score) <= value));
    loveMeterText.textContent = `Love meter: ${value * 20}%`;
  });
});
if (loveMeterReset) {
  loveMeterReset.addEventListener('click', () => {
    heartButtons.forEach((item) => item.classList.remove('active'));
    loveMeterText.textContent = 'Love meter: 0% — tap a heart to fill it back up.';
  });
}

/* ---------------- Match the hearts (memory game) ---------------- */
/* Real memory-match rules: a move counter, a best score that only updates
   on a win, mismatches shake before flipping back, and a genuine shuffle
   on every reset so the board is different each time you play. */
const memoryIcons = { sun: '☀️', flower: '🌸', star: '⭐', moon: '🌙' };
const memoryGrid = document.querySelector('.memory-grid');
let firstMemoryChoice = null;
let secondMemoryChoice = null;
let lockBoard = false;
let matchedPairs = 0;
let moveCount = 0;
let bestMoves = null;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildMemoryBoard() {
  const pairs = shuffle([...Object.keys(memoryIcons), ...Object.keys(memoryIcons)]);
  memoryButtons.forEach((button, index) => {
    button.dataset.pair = pairs[index];
    button.textContent = '❤';
    button.disabled = false;
    button.classList.remove('revealed', 'matched', 'mismatch');
  });
  firstMemoryChoice = null;
  secondMemoryChoice = null;
  lockBoard = false;
  matchedPairs = 0;
  moveCount = 0;
  memoryStatus.textContent = 'Find all the matching pairs.';
  if (memoryMoves) memoryMoves.textContent = '0';
}

memoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (lockBoard || button === firstMemoryChoice || button.classList.contains('matched')) {
      return;
    }

    button.classList.add('revealed');
    button.textContent = memoryIcons[button.dataset.pair];
    button.disabled = true;

    if (!firstMemoryChoice) {
      firstMemoryChoice = button;
      return;
    }

    secondMemoryChoice = button;
    lockBoard = true;
    moveCount += 1;
    if (memoryMoves) memoryMoves.textContent = String(moveCount);

    if (firstMemoryChoice.dataset.pair === secondMemoryChoice.dataset.pair) {
      firstMemoryChoice.classList.add('matched');
      secondMemoryChoice.classList.add('matched');
      matchedPairs += 1;
      memoryStatus.textContent = 'You found a matching pair!';
      resetMemoryTurn();

      if (matchedPairs === Object.keys(memoryIcons).length) {
        if (bestMoves === null || moveCount < bestMoves) {
          bestMoves = moveCount;
          if (memoryBest) memoryBest.textContent = String(bestMoves);
        }
        memoryStatus.textContent = `All pairs matched in ${moveCount} moves — you are my favorite kind of magic.`;
        createConfetti();
      }
      return;
    }

    memoryStatus.textContent = 'Almost! Try again.';
    firstMemoryChoice.classList.add('mismatch');
    secondMemoryChoice.classList.add('mismatch');
    setTimeout(() => {
      firstMemoryChoice.classList.remove('revealed', 'mismatch');
      secondMemoryChoice.classList.remove('revealed', 'mismatch');
      firstMemoryChoice.disabled = false;
      secondMemoryChoice.disabled = false;
      firstMemoryChoice.textContent = '❤';
      secondMemoryChoice.textContent = '❤';
      resetMemoryTurn();
    }, 700);
  });
});

if (memoryReset) {
  memoryReset.addEventListener('click', buildMemoryBoard);
}
buildMemoryBoard();

function resetMemoryTurn() {
  firstMemoryChoice = null;
  secondMemoryChoice = null;
  lockBoard = false;
}

/* ---------------- Lucky love box ---------------- */
/* Never repeats the same surprise twice in a row, and keeps count so
   opening it again always feels worth doing. */
const surprises = [
  'A warm hug and a little more dessert.',
  'A surprise date night with your favorite music.',
  'A slow morning full of cuddles and coffee.',
  'A dreamy bouquet and a happy dance together.',
  'A day full of laughter, love, and no stress.',
  'Breakfast in bed on a completely random Tuesday.',
  'An hour where your phone stays in another room.'
];
let lastSurpriseIndex = -1;
let luckyOpens = 0;

luckyButton.addEventListener('click', () => {
  let index = Math.floor(Math.random() * surprises.length);
  while (surprises.length > 1 && index === lastSurpriseIndex) {
    index = Math.floor(Math.random() * surprises.length);
  }
  lastSurpriseIndex = index;
  luckyOpens += 1;
  luckyResult.textContent = `Lucky surprise: ${surprises[index]}`;
  if (luckyCount) {
    luckyCount.textContent = luckyOpens === 1 ? 'Opened once' : `Opened ${luckyOpens} times`;
  }
});

/* ---------------- My favorite thing (guess game) ---------------- */
/* Every option gets its own reaction rather than one shared line, and a
   short streak counter tracks how many times in a row it's the same guess. */
const quizLines = {
  'Your smile': 'Close — my heart definitely skips at your smile.',
  'Your kindness': 'Warm guess — your kindness is why everyone loves you the way I do.',
  'Your laugh': 'Good instinct — I could listen to that laugh for the rest of my life.',
  'Your love': 'That\'s the real answer — your love is the thing I never want to live without.'
};
let lastQuizPick = null;
let quizStreak = 0;

quizButtons.forEach((button) => {
  button.addEventListener('click', () => {
    quizButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    const answer = button.dataset.answer;
    if (answer === lastQuizPick) {
      quizStreak += 1;
    } else {
      quizStreak = 1;
    }
    lastQuizPick = answer;
    let line = quizLines[answer] || `Exactly — ${answer} is the magic that makes my whole world sparkle.`;
    if (quizStreak > 1) {
      line += ` (Picked that ${quizStreak} times in a row — you might be onto something.)`;
    }
    quizResult.textContent = line;
  });
});

/* ---------------- Compliment roulette ---------------- */
/* A quick shuffle animation before landing gives it a real "spin" feel,
   and a no-repeat draw stops the same line from showing up back to back. */
const compliments = [
  'Your smile makes every ordinary day feel like a celebration.',
  'You make kindness look effortless and beautiful.',
  'You are my favorite thought in every room and every season.',
  'Your laugh is still my favorite sound in the world.',
  'You bring warmth wherever you go, and I am lucky to be close to it.',
  'You make hard days feel lighter just by being in them.',
  'You notice the little things, and that is a rare kind of love.',
  'You are the softest, sweetest, most beautiful love I have ever known.',
  'The way you love makes my heart feel safe, full, and endlessly grateful.'
];
let lastComplimentIndex = -1;

function spinToResult(resultEl, pool, lastIndexRef, setLastIndex, prefix = '') {
  resultEl.classList.add('spinning');
  let ticks = 0;
  const maxTicks = 10;
  const interval = setInterval(() => {
    const randomLine = pool[Math.floor(Math.random() * pool.length)];
    resultEl.textContent = prefix + randomLine;
    ticks += 1;
    if (ticks >= maxTicks) {
      clearInterval(interval);
      let index = Math.floor(Math.random() * pool.length);
      while (pool.length > 1 && index === lastIndexRef.value) {
        index = Math.floor(Math.random() * pool.length);
      }
      lastIndexRef.value = index;
      resultEl.textContent = prefix + pool[index];
      resultEl.classList.remove('spinning');
    }
  }, 60);
}

const complimentRef = { value: lastComplimentIndex };
rouletteButton.addEventListener('click', () => {
  rouletteButton.disabled = true;
  spinToResult(rouletteResult, compliments, complimentRef, null);
  setTimeout(() => { rouletteButton.disabled = false; }, 700);
});

/* ---------------- Date night spinner ---------------- */
const dateIdeas = [
  'A candlelit dinner with your favorite dessert.',
  'A sunset walk followed by warm drinks and cuddles.',
  'A movie marathon in the coziest blankets.',
  'A spontaneous little road trip with our best playlist.',
  'Breakfast together, slow dancing, and absolutely no plans.',
  'A picnic somewhere we have never been before.',
  'Cooking a new recipe together and probably laughing at the mess.'
];
const dateRef = { value: -1 };
dateButton.addEventListener('click', () => {
  dateButton.disabled = true;
  spinToResult(dateResult, dateIdeas, dateRef, null);
  setTimeout(() => { dateButton.disabled = false; }, 700);
});

/* ---------------- Choose our mood ---------------- */
/* Each mood now has a small set of matching activities instead of one
   fixed line, so revisiting the same mood still turns up something new. */
const moodMessages = {
  cozy: [
    'Cozy it is: blankets, snacks, soft music, and you in my arms.',
    'Cozy it is: tea, candles, and a slow night with nowhere to be.',
    'Cozy it is: our favorite show and your head on my shoulder.'
  ],
  playful: [
    'Playful it is: silly photos, a little dancing, and lots of laughter.',
    'Playful it is: a board game rematch and terrible trash talk.',
    'Playful it is: karaoke, badly sung, but full volume.'
  ],
  adventure: [
    'Adventure it is: let\'s go somewhere new and make a story out of it.',
    'Adventure it is: a sunrise hike and coffee at the top.',
    'Adventure it is: pick a direction and just drive.'
  ]
};
const lastMoodPick = {};

wouldButtons.forEach((button) => {
  button.addEventListener('click', () => {
    wouldButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    const mood = button.dataset.mood;
    const options = moodMessages[mood];
    let index = Math.floor(Math.random() * options.length);
    while (options.length > 1 && index === lastMoodPick[mood]) {
      index = Math.floor(Math.random() * options.length);
    }
    lastMoodPick[mood] = index;
    wouldResult.textContent = options[index];
  });
});

/* ---------------- Extra little surprises ---------------- */
const secretPromises = [
  'I promise to keep choosing you, even in the quiet little moments.',
  'I promise to make your days feel lighter, softer, and happier.',
  'I promise to always make room for your laugh in my life.',
  'I promise to keep loving you in the big ways and the tiny ways.',
  'I promise to remind you every day that you are deeply loved.',
  'I promise to keep my heart soft for you, always and forever.',
  'I promise to love your soul, your smile, and every small part of you.'
];
let lastPromiseIndex = -1;

if (promiseButton && promiseResult) {
  promiseButton.addEventListener('click', () => {
    let nextIndex = Math.floor(Math.random() * secretPromises.length);
    while (secretPromises.length > 1 && nextIndex === lastPromiseIndex) {
      nextIndex = Math.floor(Math.random() * secretPromises.length);
    }
    lastPromiseIndex = nextIndex;
    promiseResult.textContent = secretPromises[nextIndex];
    createConfetti();
  });
}

const secretWishes = [
  'My secret wish is simple: a life full of cozy evenings, your smile, and us.',
  'My secret wish is a hundred more mornings of coffee, cuddles, and your laughter.',
  'My secret wish is more adventures, more memories, and more reasons to stay close.',
  'My secret wish is forever with you: warm, easy, and full of love.',
  'My secret wish is to keep loving you in every season of life.',
  'My secret wish is a thousand more ways to make you feel adored.'
];
let lastWishIndex = -1;

if (surpriseButton && surpriseResult) {
  surpriseButton.addEventListener('click', () => {
    let nextIndex = Math.floor(Math.random() * secretWishes.length);
    while (secretWishes.length > 1 && nextIndex === lastWishIndex) {
      nextIndex = Math.floor(Math.random() * secretWishes.length);
    }
    lastWishIndex = nextIndex;
    surpriseResult.textContent = secretWishes[nextIndex];
    createConfetti();
  });
}

const tinyRituals = [
  'Tonight is for warm cuddles, soft music, and zero stress.',
  'Our ritual for today: a little slow dance and a lot of smiling.',
  'Let’s make today our cozy ritual: dessert, love, and a long talk.',
  'Our favorite ritual is still just being close and laughing together.'
];
let lastRitualIndex = -1;

if (ritualButton && ritualResult) {
  ritualButton.addEventListener('click', () => {
    let nextIndex = Math.floor(Math.random() * tinyRituals.length);
    while (tinyRituals.length > 1 && nextIndex === lastRitualIndex) {
      nextIndex = Math.floor(Math.random() * tinyRituals.length);
    }
    lastRitualIndex = nextIndex;
    ritualResult.textContent = tinyRituals[nextIndex];
    createConfetti();
  });
}

const futureUs = [
  'Future us: soft mornings, strong love, and never-ending little adventures.',
  'Future us: laughing too much, holding on too tightly, and never losing each other.',
  'Future us: a life that feels like peace, warmth, and home.',
  'Future us: all the dreams we keep talking about, finally turning into our everyday life.'
];
let lastFutureIndex = -1;

if (futureButton && futureResult) {
  futureButton.addEventListener('click', () => {
    let nextIndex = Math.floor(Math.random() * futureUs.length);
    while (futureUs.length > 1 && nextIndex === lastFutureIndex) {
      nextIndex = Math.floor(Math.random() * futureUs.length);
    }
    lastFutureIndex = nextIndex;
    futureResult.textContent = futureUs[nextIndex];
    createConfetti();
  });
}

const loveFortunes = [
  'A soft, beautiful future is waiting for you — and it includes me.',
  'Your luck is strong today: love is already working in your favor.',
  'The next big smile in your life is coming from somewhere very close.',
  'Good news: your heart is about to be spoiled in the very best way.',
  'The universe is clearly on your side today, because it gave you the love you deserve.',
  'Your love story keeps getting more beautiful, and I hope it never stops.'
];
let lastFortuneIndex = -1;

if (fortuneButton && fortuneResult) {
  fortuneButton.addEventListener('click', () => {
    let nextIndex = Math.floor(Math.random() * loveFortunes.length);
    while (loveFortunes.length > 1 && nextIndex === lastFortuneIndex) {
      nextIndex = Math.floor(Math.random() * loveFortunes.length);
    }
    lastFortuneIndex = nextIndex;
    fortuneResult.textContent = loveFortunes[nextIndex];
    createConfetti();
  });
}

petButtons.forEach((button) => {
  button.addEventListener('click', () => {
    petButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    petResult.textContent = `Our future pet is ${button.dataset.name} — and I already know we will love them a lot.`;
  });
});

const loveChallenges = [
  'Challenge accepted: one full day of extra cuddles and zero stress.',
  'Your challenge is to make each other laugh at least five times today.',
  'The mission is a surprise coffee date and the sweetest compliments you can think of.',
  'Challenge: plan a tiny adventure and call it our favorite memory before the night ends.'
];
let lastChallengeIndex = -1;

if (challengeButton && challengeResult) {
  challengeButton.addEventListener('click', () => {
    let nextIndex = Math.floor(Math.random() * loveChallenges.length);
    while (loveChallenges.length > 1 && nextIndex === lastChallengeIndex) {
      nextIndex = Math.floor(Math.random() * loveChallenges.length);
    }
    lastChallengeIndex = nextIndex;
    challengeResult.textContent = loveChallenges[nextIndex];
    createConfetti();
  });
}

let catchInterval = null;
let catchMoveTimer = null;
let caughtHearts = 0;
let catchRunning = false;

if (catchGameArea && catchBasket && catchStart && catchStatus && catchMessage) {
  const moveBasket = (event) => {
    const areaRect = catchGameArea.getBoundingClientRect();
    const x = event.clientX - areaRect.left - 28;
    const clampedX = Math.min(Math.max(x, 0), areaRect.width - 56);
    catchBasket.style.left = `${clampedX}px`;
  };

  const createHeart = () => {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = '❤';
    const maxLeft = catchGameArea.clientWidth - 28;
    heart.style.left = `${Math.random() * maxLeft}px`;
    heart.style.top = '0px';
    catchGameArea.appendChild(heart);

    const moveHeart = () => {
      const basketRect = catchBasket.getBoundingClientRect();
      const heartRect = heart.getBoundingClientRect();
      const areaRect = catchGameArea.getBoundingClientRect();
      const currentTop = Number.parseFloat(heart.style.top) || 0;
      const nextTop = currentTop + 4;
      heart.style.top = `${nextTop}px`;

      const overlapsBasket =
        heartRect.bottom >= basketRect.top &&
        heartRect.top <= basketRect.bottom &&
        heartRect.left + heartRect.width > basketRect.left &&
        heartRect.right - heartRect.width < basketRect.right;

      if (overlapsBasket) {
        caughtHearts += 1;
        catchStatus.textContent = `Caught ${caughtHearts} heart${caughtHearts === 1 ? '' : 's'}!`;
        heart.remove();
        if (caughtHearts >= 5) {
          clearInterval(catchInterval);
          catchInterval = null;
          catchRunning = false;
          catchStatus.textContent = 'You caught all the love!';
          catchMessage.hidden = false;
          catchMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
          createConfetti();
        }
        return;
      }

      if (nextTop > areaRect.height - 12) {
        heart.remove();
        if (caughtHearts < 5) {
          catchStatus.textContent = 'A heart slipped away — try again!';
        }
        return;
      }

      requestAnimationFrame(moveHeart);
    };

    requestAnimationFrame(moveHeart);
  };

  const startCatchGame = () => {
    if (catchRunning) return;
    catchRunning = true;
    caughtHearts = 0;
    catchMessage.hidden = true;
    catchStatus.textContent = 'Catch the hearts before they fall away.';
    catchGameArea.querySelectorAll('.falling-heart').forEach((heart) => heart.remove());

    catchInterval = window.setInterval(() => {
      if (!catchRunning) return;
      createHeart();
    }, 700);
  };

  catchStart.addEventListener('click', () => {
    startCatchGame();
  });

  catchGameArea.addEventListener('mousemove', moveBasket);
  catchGameArea.addEventListener('touchmove', (event) => {
    if (event.touches[0]) moveBasket(event.touches[0]);
  }, { passive: true });
}

/* ---------------- One more forever (proposal box) ---------------- */
if (proposalBox) {
  proposalBox.addEventListener('click', () => {
    const isOpen = proposalBox.classList.toggle('open');
    proposalBox.setAttribute('aria-expanded', String(isOpen));
    proposalReveal.hidden = !isOpen;
  });

  proposalAnswers.forEach((button) => {
    button.addEventListener('click', () => {
      proposalResult.textContent = button.dataset.answer === 'yes'
        ? 'The best answer. I choose you for every lifetime.'
        : 'Then it\'s settled: you and me, always and forever.';
      createConfetti();
    });
  });
}

/* ---------------- Tap the heart to open all the love ---------------- */
bigHeartButton.addEventListener('click', () => {
  const isOpen = heartUnlockSection.classList.toggle('open');
  bigHeartButton.classList.toggle('beating', isOpen);
  bigHeartButton.setAttribute('aria-pressed', String(isOpen));
  createConfetti();
});

function createConfetti() {
  const container = document.querySelector('.confetti-container');
  const colors = ['#efaa95', '#e4b666', '#f7e3d1', '#d86655', '#ffffff'];

  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${35 + Math.random() * 30}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * 70}vw`);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    container.appendChild(piece);
    window.setTimeout(() => piece.remove(), 2300);
  }
}