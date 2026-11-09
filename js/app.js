// =========================================================================
// 1. GAME STATE (SEPARATE SCOREBOARDS & TURNS PER TAB)
// =========================================================================
let activeGameTab = 'MOVIES'; // 'MOVIES' | 'PRICE'

const teams = [
  {
    name: 'Sara Vedi 🧨',
    movies: { score: 0, solved: 0, streak: 0 },
    price:  { score: 0, solved: 0, streak: 0, pctOffHistory: [] }
  },
  {
    name: 'Pataka 💥',
    movies: { score: 0, solved: 0, streak: 0 },
    price:  { score: 0, solved: 0, streak: 0, pctOffHistory: [] }
  }
];

function getTeamAvgPctOff(teamIdx) {
  const hist = teams[teamIdx].price.pctOffHistory;
  if (!hist || hist.length === 0) return null;
  const sum = hist.reduce((acc, v) => acc + v, 0);
  return sum / hist.length;
}

let movieTurn = 0;
let priceTurn = 0;

function getCurrentTurn() {
  return activeGameTab === 'MOVIES' ? movieTurn : priceTurn;
}

function setCurrentTurnVal(val) {
  if (activeGameTab === 'MOVIES') movieTurn = val;
  else priceTurn = val;
}

function getTeamStats(teamIdx) {
  return activeGameTab === 'MOVIES' ? teams[teamIdx].movies : teams[teamIdx].price;
}

// Tab 1 State (Emoji Cinema Quiz)
const lockedMovieSlots = {}; // { 'HW-01': { status: 'SOLVED' | 'VOID', winner: 'Sara Vedi 🧨', points: 10 } }
let currentCategoryKey = null;
let currentMovieQuestion = null;
let clueRevealed = false;
let answerRevealed = false;

// Tab 2 State (Name the Price)
const lockedPriceSlots = {}; // { 'PRC-01': { status: 'SOLVED' | 'VOID', winner: 'Sara Vedi 🧨', points: 10 } }
let currentPriceItem = null;
let priceAnswerRevealed = false;

// Shared 30s Sparkler Timer
let timerSeconds = 30;
let timerInterval = null;

// =========================================================================
// 2. TAB NAVIGATION & SCOREBOARD RENDERING
// =========================================================================
function switchGameTab(tab) {
  stopClock();
  activeGameTab = tab;

  const tabBtnMovies = document.getElementById('tabBtnMovies');
  const tabBtnPrice  = document.getElementById('tabBtnPrice');

  const tabContentMovies = document.getElementById('tabContentMovies');
  const tabContentPrice  = document.getElementById('tabContentPrice');

  const activeClass   = 'px-4 py-2 font-extrabold uppercase transition bg-[#FFFDF8] text-[#B23C00] shadow-sm';
  const inactiveClass = 'px-4 py-2 font-extrabold uppercase transition text-white hover:bg-white/15';

  tabBtnMovies.className = tab === 'MOVIES' ? activeClass : inactiveClass;
  tabBtnPrice.className  = tab === 'PRICE'  ? activeClass : inactiveClass;

  tabContentMovies.classList.toggle('hidden', tab !== 'MOVIES');
  tabContentPrice.classList.toggle('hidden', tab !== 'PRICE');

  renderScoreboard();
  updateTelemetry();

  if (tab === 'MOVIES') {
    renderCategoryHub();
  } else if (tab === 'PRICE') {
    renderPriceBoard();
  }
}

function renderScoreboard() {
  const turn = getCurrentTurn();
  const s0 = getTeamStats(0);
  const s1 = getTeamStats(1);

  const avg0 = getTeamAvgPctOff(0);
  const avg1 = getTeamAvgPctOff(1);

  for (let i = 0; i < 2; i++) {
    const stats = i === 0 ? s0 : s1;
    const isTurn = turn === i;

    document.getElementById(`teamName${i}`).textContent = teams[i].name;
    document.getElementById(`teamScore${i}`).textContent = String(stats.score).padStart(2, '0');
    document.getElementById(`teamSolved${i}`).textContent = stats.solved;
    document.getElementById(`teamStreak${i}`).textContent = `${stats.streak} 🔥`;

    const avgWrap = document.getElementById(`teamAvgOffWrap${i}`);
    const avgEl   = document.getElementById(`teamAvgOff${i}`);
    if (avgWrap && avgEl) {
      if (activeGameTab === 'PRICE') {
        avgWrap.classList.remove('hidden');
        const myAvg = i === 0 ? avg0 : avg1;
        const otherAvg = i === 0 ? avg1 : avg0;
        if (myAvg === null) {
          avgEl.textContent = '—';
          avgEl.className = 'px-1.5 py-0.5 bg-[#FFF9DB] border border-[#FFB800] text-[#7A3200] font-extrabold';
        } else {
          avgEl.textContent = `${myAvg.toFixed(1)}%`;
          const isBetter = otherAvg === null || myAvg <= otherAvg;
          avgEl.className = isBetter
            ? 'px-1.5 py-0.5 bg-[#008272] border border-[#00695C] text-white font-extrabold'
            : 'px-1.5 py-0.5 bg-[#FFF9DB] border border-[#FFB800] text-[#7A3200] font-extrabold';
        }
      } else {
        avgWrap.classList.add('hidden');
      }
    }

    const panel = document.getElementById(`teamPanel${i}`);
    const bar   = document.getElementById(`turnBar${i}`);
    const badge = document.getElementById(`turnBadge${i}`);

    if (isTurn) {
      panel.className = 'md:col-span-5 p-5 cursor-pointer transition relative flex items-center justify-between active-team-glow';
      bar.className   = 'absolute top-0 left-0 right-0 h-1.5 bg-[#FF6700]';
      badge.className = 'px-2.5 py-0.5 font-extrabold uppercase bg-[#FF6700] text-white border border-[#E65100]';
      badge.textContent = '🪔 Active Turn';
    } else {
      panel.className = 'md:col-span-5 p-5 cursor-pointer transition relative flex items-center justify-between diwali-card hover:bg-[#FFF6E5]';
      bar.className   = 'absolute top-0 left-0 right-0 h-1.5 bg-transparent';
      badge.className = 'px-2.5 py-0.5 font-bold uppercase border diwali-border diwali-muted';
      badge.textContent = '○ Waiting';
    }
  }

  // Update Price Board Header Avg % Off Strip
  const bLabel0 = document.getElementById('boardAvgLabel0');
  const bVal0   = document.getElementById('boardAvgVal0');
  const bLabel1 = document.getElementById('boardAvgLabel1');
  const bVal1   = document.getElementById('boardAvgVal1');
  if (bLabel0) bLabel0.textContent = `${teams[0].name}:`;
  if (bVal0)   bVal0.textContent   = avg0 === null ? '—' : `${avg0.toFixed(1)}% off`;
  if (bLabel1) bLabel1.textContent = `${teams[1].name}:`;
  if (bVal1)   bVal1.textContent   = avg1 === null ? '—' : `${avg1.toFixed(1)}% off`;

  // Lead & Ratio Bar
  const leadEl = document.getElementById('matchLeadText');
  if (s0.score > s1.score) {
    leadEl.textContent = `${teams[0].name} +${s0.score - s1.score}`;
  } else if (s1.score > s0.score) {
    leadEl.textContent = `${teams[1].name} +${s1.score - s0.score}`;
  } else {
    leadEl.textContent = 'Tied Score';
  }

  const total = s0.score + s1.score;
  const pct0 = total === 0 ? 50 : Math.round((s0.score / total) * 100);
  document.getElementById('tugBar0').style.width = `${pct0}%`;
  document.getElementById('tugBar1').style.width = `${100 - pct0}%`;

  updateStageTeamLabels();
}

function updateStageTeamLabels() {
  const turn = getCurrentTurn();
  const other = 1 - turn;

  // Movie board & stage
  const promptEl = document.getElementById('promptTeamName');
  if (promptEl) promptEl.textContent = teams[movieTurn].name;
  const stagePill = document.getElementById('stageTeamPill');
  if (stagePill) stagePill.textContent = teams[turn].name;
  const btnAwardActive = document.getElementById('btnAwardActive');
  if (btnAwardActive) btnAwardActive.textContent = `🎉 Solved: ${teams[turn].name} (+10)`;
  const btnAwardSteal = document.getElementById('btnAwardSteal');
  if (btnAwardSteal) btnAwardSteal.textContent = `⚡ Steal: ${teams[other].name} (+10)`;

  // Price stage
  const pricePill = document.getElementById('priceStageTeamPill');
  if (pricePill) pricePill.textContent = teams[turn].name;
  const gLabel0 = document.getElementById('guessLabel0');
  if (gLabel0) gLabel0.textContent = `${teams[0].name} Guess`;
  const gLabel1 = document.getElementById('guessLabel1');
  if (gLabel1) gLabel1.textContent = `${teams[1].name} Guess`;
  const btnPrice0 = document.getElementById('btnPriceAward0');
  if (btnPrice0) btnPrice0.textContent = `${teams[0].name} (+10)`;
  const btnPrice1 = document.getElementById('btnPriceAward1');
  if (btnPrice1) btnPrice1.textContent = `${teams[1].name} (+10)`;
}

function getTotalMoviesCount() {
  return Object.values(CATEGORIES).reduce((acc, cat) => acc + cat.questions.length, 0);
}

function updateTelemetry() {
  let total = getTotalMoviesCount();
  let lockedMap = lockedMovieSlots;

  if (activeGameTab === 'PRICE') {
    total = PRICE_ITEMS.length;
    lockedMap = lockedPriceSlots;
  }

  const vals = Object.values(lockedMap);
  const solvedCount = vals.filter(v => v.status === 'SOLVED').length;
  const voidCount   = vals.filter(v => v.status === 'VOID').length;
  const openCount   = total - solvedCount - voidCount;

  document.getElementById('statOpen').textContent   = String(openCount).padStart(2, '0');
  document.getElementById('statSolved').textContent = String(solvedCount).padStart(2, '0');
  document.getElementById('statVoid').textContent   = String(voidCount).padStart(2, '0');
}

function setTurn(idx) {
  setCurrentTurnVal(idx);
  renderScoreboard();
}

function switchTurn() {
  setCurrentTurnVal(1 - getCurrentTurn());
  renderScoreboard();
}

function renameTeam(event, idx) {
  event.stopPropagation();
  const heading = document.getElementById(`teamName${idx}`);
  if (!heading || heading.querySelector('input')) return;

  const currentName = teams[idx].name;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'px-2 py-0.5 border-2 border-[#FF6700] bg-[#FFFDF8] text-[#3B1704] font-serif-editorial text-xl font-bold w-48 focus:outline-none';

  const commit = () => {
    const val = input.value.trim();
    if (val) teams[idx].name = val;
    renderScoreboard();
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') {
      input.value = currentName;
      input.blur();
    }
  });

  heading.textContent = '';
  heading.appendChild(input);
  input.focus();
  input.select();
}

// =========================================================================
// 3. TAB 1 LOGIC: EMOJI CINEMA QUIZ (4-COLUMN BOARD + STAGE VIEW)
// =========================================================================
const CATEGORY_HEADER_CLASSES = ['cat-marigold', 'cat-saffron', 'cat-tangerine', 'cat-diya-gold'];

function renderCategoryHub() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  const promptEl = document.getElementById('promptTeamName');
  if (promptEl) promptEl.textContent = teams[movieTurn].name;

  const keys = Object.keys(CATEGORIES);
  grid.innerHTML = keys.map((key, idx) => {
    const cat = CATEGORIES[key];
    const total = cat.questions.length;
    const lockedInCat = cat.questions.filter(q => lockedMovieSlots[q.id]).length;
    const remaining = total - lockedInCat;
    const headerTheme = CATEGORY_HEADER_CLASSES[idx % CATEGORY_HEADER_CLASSES.length];

    return `
      <div class="flex flex-col">
        <!-- Category Column Header -->
        <div class="p-4 border-b diwali-border ${headerTheme}">
          <div class="flex items-center justify-between font-mono-code text-xs mb-1">
            <span class="font-extrabold text-[#B23C00] uppercase">CATEGORY 0${idx + 1}</span>
            <span class="px-2 py-0.5 border border-[#FFB800] bg-[#FFF9DB] text-[#7A3200] font-extrabold">
              ${remaining}/${total} OPEN
            </span>
          </div>
          <h3 class="font-serif-editorial text-xl font-bold text-[#3B1704] flex items-center gap-2">
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </h3>
          <p class="text-xs diwali-muted font-medium mt-0.5">${cat.subtitle}</p>
        </div>

        <!-- Movie Reels List -->
        <div class="divide-y divide-[#F2C97D]">
          ${cat.questions.map((q) => {
            const lock = lockedMovieSlots[q.id];
            const numStr = String(q.num).padStart(2, '0');

            if (lock) {
              const isSolved = lock.status === 'SOLVED';
              return `
                <button disabled class="w-full p-3.5 text-left slot-locked flex flex-col gap-1">
                  <div class="flex items-center justify-between font-mono-code text-xs w-full">
                    <span class="font-extrabold text-[#8C4A19] line-through">🎬 REEL #${numStr}</span>
                    <span class="px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${isSolved ? 'bg-[#008272] text-white' : 'bg-[#8C4A19] text-white'}">
                      ${isSolved ? `✓ ${lock.winner}` : '✕ UNSOLVED'}
                    </span>
                  </div>
                  <div class="font-serif-editorial text-sm font-bold text-[#6E472B] line-through truncate">
                    ${q.answer}
                  </div>
                </button>
              `;
            }

            return `
              <button onclick="openQuestion('${cat.id}', '${q.id}')" class="w-full p-3.5 text-left diwali-card diwali-card-hover transition flex items-center justify-between group">
                <div>
                  <div class="font-mono-code text-[11px] diwali-muted font-bold uppercase">
                    ${q.id} • 10 PTS
                  </div>
                  <div class="font-serif-editorial text-lg font-bold text-[#3B1704] group-hover:text-[#D84315] transition">
                    🎬 Reel #${numStr}
                  </div>
                </div>
                <span class="px-2.5 py-1 border border-[#FFB800] bg-[#FFF9DB] group-hover:bg-[#FF6700] group-hover:text-white group-hover:border-[#E65100] font-mono-code text-xs font-extrabold text-[#7A3200] uppercase transition">
                  🍿 Play →
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function showCategoryHub() {
  stopClock();
  currentMovieQuestion = null;
  document.getElementById('stageView').classList.add('hidden');
  document.getElementById('boardView').classList.remove('hidden');
  renderCategoryHub();
}

function openQuestion(catKey, qId) {
  if (lockedMovieSlots[qId]) return;
  const cat = CATEGORIES[catKey];
  if (!cat) return;
  const q = cat.questions.find(item => item.id === qId);
  if (!q) return;

  currentCategoryKey = catKey;
  currentMovieQuestion = q;
  clueRevealed = false;
  answerRevealed = false;

  document.getElementById('boardView').classList.add('hidden');
  document.getElementById('stageView').classList.remove('hidden');

  document.getElementById('stageSlotCode').textContent = `${cat.icon} ${cat.id} // 🎬 REEL #${String(q.num).padStart(2, '0')}`;
  document.getElementById('stageIndustryLabel').textContent = cat.name;
  document.getElementById('stageEmojis').textContent = q.displayEmojis || q.emojis;

  renderClueAndAnswerState();
  updateStageTeamLabels();
  resetClockDisplay();
}

function renderClueAndAnswerState() {
  if (!currentMovieQuestion) return;

  const clueBox = document.getElementById('stageHintBox');
  const clueBtn = document.getElementById('hintBtn');
  if (clueRevealed) {
    clueBox.innerHTML = `<span class="font-serif-editorial text-lg font-bold text-[#3B1704]">💡 ${currentMovieQuestion.clue}</span>`;
    clueBtn.textContent = 'Hide Clue';
  } else {
    clueBox.innerHTML = `<span>Clue is hidden — click "Show Clue" or press [H]</span>`;
    clueBtn.textContent = 'Show Clue';
  }

  const ansBox = document.getElementById('stageAnswerBox');
  const ansBtn = document.getElementById('answerBtn');
  const breakdownBox = document.getElementById('stageBreakdownBox');
  if (answerRevealed) {
    ansBox.innerHTML = `<span class="font-serif-editorial text-2xl font-bold text-[#008272]">🎬 ${currentMovieQuestion.answer}</span>`;
    ansBtn.textContent = 'Hide';
    if (breakdownBox) breakdownBox.textContent = currentMovieQuestion.clue;
  } else {
    ansBox.innerHTML = `<span>Answer is hidden — click "Reveal" or press [Space]</span>`;
    ansBtn.textContent = '🎆 Reveal';
    if (breakdownBox) breakdownBox.textContent = '—';
  }
}

function toggleHint() {
  if (!currentMovieQuestion) return;
  clueRevealed = !clueRevealed;
  renderClueAndAnswerState();
}

function toggleClue() {
  toggleHint();
}

function toggleAnswer() {
  if (!currentMovieQuestion) return;
  answerRevealed = !answerRevealed;
  renderClueAndAnswerState();
}

function abortQuestion() {
  stopClock();
  currentMovieQuestion = null;
  document.getElementById('stageView').classList.add('hidden');
  document.getElementById('boardView').classList.remove('hidden');
  renderCategoryHub();
}

function resolveQuestion(outcome) {
  if (!currentMovieQuestion) return;
  stopClock();

  const qId = currentMovieQuestion.id;
  const activeIdx = movieTurn;
  const stealIdx  = 1 - movieTurn;

  if (outcome === 'ACTIVE') {
    teams[activeIdx].movies.score += 10;
    teams[activeIdx].movies.solved += 1;
    teams[activeIdx].movies.streak += 1;
    teams[stealIdx].movies.streak = 0;
    lockedMovieSlots[qId] = { status: 'SOLVED', winner: teams[activeIdx].name, points: 10 };
  } else if (outcome === 'STEAL') {
    teams[stealIdx].movies.score += 10;
    teams[stealIdx].movies.solved += 1;
    teams[stealIdx].movies.streak += 1;
    teams[activeIdx].movies.streak = 0;
    lockedMovieSlots[qId] = { status: 'SOLVED', winner: teams[stealIdx].name, points: 10 };
  } else {
    teams[0].movies.streak = 0;
    teams[1].movies.streak = 0;
    lockedMovieSlots[qId] = { status: 'VOID', winner: 'NONE', points: 0 };
  }

  // Advance turn to other team
  movieTurn = 1 - movieTurn;
  currentMovieQuestion = null;

  renderScoreboard();
  updateTelemetry();

  document.getElementById('stageView').classList.add('hidden');
  document.getElementById('boardView').classList.remove('hidden');
  renderCategoryHub();
}

// =========================================================================
// 4. TAB 2 LOGIC: NAME THE PRICE (15 ITEMS WITH PHOTOS)
// =========================================================================
function renderPriceBoard() {
  const grid = document.getElementById('priceItemsGrid');
  if (!grid) return;

  grid.innerHTML = PRICE_ITEMS.map((item) => {
    const lock = lockedPriceSlots[item.id];
    const numStr = String(item.num).padStart(2, '0');
    const imgSrc = item.image || '';

    if (lock) {
      const isSolved = lock.status === 'SOLVED';
      const g0Str = lock.guess0 !== undefined && !isNaN(lock.guess0)
        ? `${teams[0].name}: $${lock.guess0.toFixed(2)} (${lock.pct0.toFixed(1)}% off)`
        : '';
      const g1Str = lock.guess1 !== undefined && !isNaN(lock.guess1)
        ? `${teams[1].name}: $${lock.guess1.toFixed(2)} (${lock.pct1.toFixed(1)}% off)`
        : '';

      return `
        <button disabled class="p-4 text-left border-b border-r border-[#F2C97D] slot-locked flex flex-col justify-between min-h-[180px]">
          <div class="flex items-center justify-between font-mono-code text-xs w-full">
            <span class="font-extrabold text-[#8C4A19] line-through">ITEM #${numStr}</span>
            <span class="px-2 py-0.5 font-extrabold uppercase ${isSolved ? 'bg-[#008272] text-white' : 'bg-[#8C4A19] text-white'}">
              ${isSolved ? `✓ ${lock.winner} (+${lock.points})` : '✕ LOCKED'}
            </span>
          </div>

          <div class="my-2.5 flex items-center gap-3">
            <img src="${imgSrc}" alt="${item.title}" loading="lazy" class="w-14 h-14 object-contain border border-[#E5A93B] bg-white p-1 shrink-0 opacity-75" />
            <div>
              <div class="font-serif-editorial text-sm font-bold text-[#6E472B] line-through leading-snug">
                ${item.title}
              </div>
              <div class="font-mono-code text-sm font-extrabold text-[#008272] mt-1">
                🏷️ Actual: ${item.priceDisplay}
              </div>
              ${(g0Str || g1Str) ? `
                <div class="font-mono-code text-[10px] text-[#7A3200] font-bold mt-1 space-y-0.5">
                  ${g0Str ? `<div>• ${g0Str}</div>` : ''}
                  ${g1Str ? `<div>• ${g1Str}</div>` : ''}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="font-mono-code text-[11px] text-[#8C4A19] uppercase font-bold">
            🔒 REVEALED &amp; LOCKED
          </div>
        </button>
      `;
    }

    // Open tile on board: show Item #01..#15 and Store teaser, keep item & price hidden until clicked
    return `
      <button onclick="openPriceItem('${item.id}')" class="p-5 text-left border-b border-r border-[#F2C97D] diwali-card diwali-card-hover transition flex flex-col justify-between min-h-[180px] group">
        <div class="flex items-center justify-between font-mono-code text-xs w-full">
          <span class="px-2 py-0.5 border border-[#E5A93B] bg-[#FFF9DB] text-[#7A3200] font-extrabold">${item.id}</span>
          <span class="text-[#008272] font-extrabold uppercase">● 10 PTS</span>
        </div>

        <div class="my-3 flex items-center gap-3.5">
          <div class="w-12 h-12 border-2 border-[#FFB800] bg-[#FFF9DB] flex items-center justify-center text-2xl shrink-0">
            🏷️
          </div>
          <div>
            <div class="font-serif-editorial text-2xl font-bold text-[#3B1704] group-hover:text-[#D84315] transition">
              Item #${numStr}
            </div>
            <div class="font-mono-code text-xs diwali-muted uppercase font-bold">
              📍 ${item.store}
            </div>
          </div>
        </div>

        <div class="w-full pt-2 border-t border-[#F2C97D] flex items-center justify-between font-mono-code text-xs font-extrabold text-[#D84315] uppercase">
          <span>Show Photo &amp; Enter Guesses</span>
          <span>Open Item →</span>
        </div>
      </button>
    `;
  }).join('');
}

function openPriceItem(itemId) {
  if (lockedPriceSlots[itemId]) return;
  const item = PRICE_ITEMS.find(it => it.id === itemId);
  if (!item) return;

  currentPriceItem = item;
  priceAnswerRevealed = false;

  document.getElementById('priceBoardView').classList.add('hidden');
  document.getElementById('priceStageView').classList.remove('hidden');

  document.getElementById('priceStageBadge').textContent = `NAME THE PRICE // ITEM #${String(item.num).padStart(2, '0')} OF ${PRICE_ITEMS.length}`;
  document.getElementById('priceStageStore').textContent = `📍 ${item.store}`;
  document.getElementById('priceStageStorePill').textContent = `📍 ${item.store}`;
  document.getElementById('priceStageTitle').textContent = item.title;
  document.getElementById('priceStageImg').src = item.image || '';

  document.getElementById('priceGuess0').value = '';
  document.getElementById('priceGuess1').value = '';

  updateStageTeamLabels();
  renderPriceAnswerState();
  resetClockDisplay();
}

function evaluatePriceGuesses() {
  if (!currentPriceItem) return null;
  const v0 = parseFloat(document.getElementById('priceGuess0').value);
  const v1 = parseFloat(document.getElementById('priceGuess1').value);
  const actual = currentPriceItem.price;

  const has0 = !isNaN(v0) && v0 >= 0;
  const has1 = !isNaN(v1) && v1 >= 0;

  const d0 = has0 ? Math.abs(actual - v0) : Infinity;
  const d1 = has1 ? Math.abs(actual - v1) : Infinity;

  const pct0 = has0 ? (d0 / actual) * 100 : null;
  const pct1 = has1 ? (d1 / actual) * 100 : null;

  let winnerMode = null; // 0 | 1 | 'BOTH'
  let summaryText = '';

  if (!has0 && !has1) {
    winnerMode = null;
    summaryText = 'Enter team price guesses above to decide winner';
  } else if (Math.abs(d0 - d1) < 0.005) {
    winnerMode = 'BOTH';
    summaryText = d0 < 0.005
      ? '🎯 BOTH TEAMS SPOT-ON EXACT! (+10 Each)'
      : `🤝 TIE! Both teams off by $${d0.toFixed(2)} (${pct0.toFixed(1)}% off)`;
  } else if (d0 < d1) {
    winnerMode = 0;
    summaryText = d0 < 0.005
      ? `🎯 ${teams[0].name} SPOT-ON EXACT! ($0.00 off)`
      : `🏆 ${teams[0].name} Wins! Off by $${d0.toFixed(2)} (${pct0.toFixed(1)}% off)`;
  } else {
    winnerMode = 1;
    summaryText = d1 < 0.005
      ? `🎯 ${teams[1].name} SPOT-ON EXACT! ($0.00 off)`
      : `🏆 ${teams[1].name} Wins! Off by $${d1.toFixed(2)} (${pct1.toFixed(1)}% off)`;
  }

  return { v0, v1, has0, has1, d0, d1, pct0, pct1, winnerMode, summaryText };
}

function renderPriceAnswerState() {
  if (!currentPriceItem) return;
  const box = document.getElementById('priceStageAnswerBox');
  const btn = document.getElementById('priceRevealBtn');
  const card0 = document.getElementById('guessCard0');
  const card1 = document.getElementById('guessCard1');
  const stat0 = document.getElementById('guessStat0');
  const stat1 = document.getElementById('guessStat1');
  const badge0 = document.getElementById('guessBadge0');
  const badge1 = document.getElementById('guessBadge1');
  const autoBtnText = document.getElementById('btnAutoLockPriceText');

  const ev = evaluatePriceGuesses();

  if (!priceAnswerRevealed) {
    box.innerHTML = `<span>Enter both guesses, then click "Reveal &amp; Decide Winner"</span>`;
    btn.textContent = '🏷️ Reveal & Decide Winner';

    card0.className = 'p-4 space-y-2 transition bg-transparent';
    card1.className = 'p-4 space-y-2 transition bg-transparent';
    badge0.className = 'hidden';
    badge1.className = 'hidden';

    stat0.className = 'text-[11px] diwali-muted font-bold min-h-[16px]';
    stat0.textContent = ev.has0 ? `Locked in guess: $${ev.v0.toFixed(2)}` : `Enter ${teams[0].name}'s price guess`;

    stat1.className = 'text-[11px] diwali-muted font-bold min-h-[16px]';
    stat1.textContent = ev.has1 ? `Locked in guess: $${ev.v1.toFixed(2)}` : `Enter ${teams[1].name}'s price guess`;

    if (autoBtnText) {
      autoBtnText.textContent = (ev.has0 || ev.has1)
        ? '🏷️ Reveal Price & Decide Winner'
        : '🏆 Enter Guesses & Decide Winner';
    }
    return;
  }

  // Price is revealed! Show actual price, per-team $ diff + % off, and highlight winner
  box.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 w-full">
      <span class="font-serif-editorial text-3xl font-bold text-[#008272]">🏷️ ${currentPriceItem.priceDisplay}</span>
      <span class="font-mono-code text-xs font-extrabold px-2.5 py-1 bg-[#E0F2F1] border border-[#008272] text-[#00695C]">${ev.summaryText}</span>
    </div>
  `;
  btn.textContent = 'Hide Price';

  // Team 0 Card & Stat
  if (ev.has0) {
    const isWin0 = ev.winnerMode === 0 || ev.winnerMode === 'BOTH';
    card0.className = isWin0
      ? 'p-4 space-y-2 transition bg-[#E0F2F1]/70'
      : 'p-4 space-y-2 transition bg-transparent';
    badge0.className = isWin0
      ? 'px-2 py-0.5 text-[11px] font-extrabold uppercase bg-[#008272] text-white'
      : 'px-2 py-0.5 text-[11px] font-bold uppercase border border-[#E5A93B] text-[#8C4A19]';
    badge0.textContent = isWin0 ? '🏆 CLOSEST WINNER' : `Off by $${ev.d0.toFixed(2)}`;
    stat0.className = `text-xs font-extrabold min-h-[16px] ${isWin0 ? 'text-[#00695C]' : 'text-[#8C4A19]'}`;
    stat0.textContent = `Diff: $${ev.d0.toFixed(2)}  •  ${ev.pct0.toFixed(1)}% off`;
  } else {
    card0.className = 'p-4 space-y-2 transition bg-transparent';
    badge0.className = 'hidden';
    stat0.className = 'text-[11px] diwali-muted font-bold min-h-[16px]';
    stat0.textContent = 'No guess entered';
  }

  // Team 1 Card & Stat
  if (ev.has1) {
    const isWin1 = ev.winnerMode === 1 || ev.winnerMode === 'BOTH';
    card1.className = isWin1
      ? 'p-4 space-y-2 transition bg-[#E0F2F1]/70'
      : 'p-4 space-y-2 transition bg-transparent';
    badge1.className = isWin1
      ? 'px-2 py-0.5 text-[11px] font-extrabold uppercase bg-[#008272] text-white'
      : 'px-2 py-0.5 text-[11px] font-bold uppercase border border-[#E5A93B] text-[#8C4A19]';
    badge1.textContent = isWin1 ? '🏆 CLOSEST WINNER' : `Off by $${ev.d1.toFixed(2)}`;
    stat1.className = `text-xs font-extrabold min-h-[16px] ${isWin1 ? 'text-[#00695C]' : 'text-[#8C4A19]'}`;
    stat1.textContent = `Diff: $${ev.d1.toFixed(2)}  •  ${ev.pct1.toFixed(1)}% off`;
  } else {
    card1.className = 'p-4 space-y-2 transition bg-transparent';
    badge1.className = 'hidden';
    stat1.className = 'text-[11px] diwali-muted font-bold min-h-[16px]';
    stat1.textContent = 'No guess entered';
  }

  if (autoBtnText) {
    if (ev.winnerMode === 0) {
      autoBtnText.textContent = `🏆 Award ${teams[0].name} (+10) & Lock`;
    } else if (ev.winnerMode === 1) {
      autoBtnText.textContent = `🏆 Award ${teams[1].name} (+10) & Lock`;
    } else if (ev.winnerMode === 'BOTH') {
      autoBtnText.textContent = `🤝 Tie! Award Both (+10) & Lock`;
    } else {
      autoBtnText.textContent = `🏆 Enter Guesses to Auto-Decide`;
    }
  }
}

function updateClosestGuess() {
  renderPriceAnswerState();
}

function revealPriceAndDecide() {
  if (!currentPriceItem) return;
  priceAnswerRevealed = true;
  renderPriceAnswerState();
}

function togglePriceAnswer() {
  if (!currentPriceItem) return;
  priceAnswerRevealed = !priceAnswerRevealed;
  renderPriceAnswerState();
}

function lockAutoDecidedPriceWinner() {
  if (!currentPriceItem) return;
  const ev = evaluatePriceGuesses();

  if (!ev.has0 && !ev.has1) {
    const autoBtnText = document.getElementById('btnAutoLockPriceText');
    if (autoBtnText) {
      autoBtnText.textContent = '⚠️ Enter Team Prices First!';
      setTimeout(() => renderPriceAnswerState(), 2000);
    }
    document.getElementById('priceGuess0').focus();
    return;
  }

  // If price wasn't revealed yet, reveal it first so everyone sees the comparison!
  if (!priceAnswerRevealed) {
    priceAnswerRevealed = true;
    renderPriceAnswerState();
    return;
  }

  resolvePriceItem(ev.winnerMode, 10);
}

function pickRandomPriceItem() {
  const openList = PRICE_ITEMS.filter(it => !lockedPriceSlots[it.id]);
  if (openList.length === 0) return;
  const pick = openList[Math.floor(Math.random() * openList.length)];
  openPriceItem(pick.id);
}

function abortPriceItem() {
  stopClock();
  currentPriceItem = null;
  document.getElementById('priceStageView').classList.add('hidden');
  document.getElementById('priceBoardView').classList.remove('hidden');
  renderPriceBoard();
}

function resolvePriceItem(winnerMode, pts) {
  if (!currentPriceItem) return;
  stopClock();

  const itemId = currentPriceItem.id;
  const ev = evaluatePriceGuesses();

  // Record % off into each team's pctOffHistory if they entered a valid guess
  if (ev && ev.has0 && ev.pct0 !== null) {
    teams[0].price.pctOffHistory.push(ev.pct0);
  }
  if (ev && ev.has1 && ev.pct1 !== null) {
    teams[1].price.pctOffHistory.push(ev.pct1);
  }

  const guessMeta = {
    guess0: ev && ev.has0 ? ev.v0 : undefined,
    guess1: ev && ev.has1 ? ev.v1 : undefined,
    pct0:   ev && ev.has0 ? ev.pct0 : undefined,
    pct1:   ev && ev.has1 ? ev.pct1 : undefined
  };

  if (winnerMode === 0 || winnerMode === 1) {
    const otherIdx = 1 - winnerMode;
    teams[winnerMode].price.score += pts;
    teams[winnerMode].price.solved += 1;
    teams[winnerMode].price.streak += 1;
    teams[otherIdx].price.streak = 0;
    lockedPriceSlots[itemId] = { status: 'SOLVED', winner: teams[winnerMode].name, points: pts, ...guessMeta };
  } else if (winnerMode === 'BOTH') {
    teams[0].price.score += pts;
    teams[0].price.solved += 1;
    teams[0].price.streak += 1;
    teams[1].price.score += pts;
    teams[1].price.solved += 1;
    teams[1].price.streak += 1;
    lockedPriceSlots[itemId] = { status: 'SOLVED', winner: 'Tie / Both', points: pts, ...guessMeta };
  } else {
    teams[0].price.streak = 0;
    teams[1].price.streak = 0;
    lockedPriceSlots[itemId] = { status: 'VOID', winner: 'NONE', points: 0, ...guessMeta };
  }

  priceTurn = 1 - priceTurn;
  currentPriceItem = null;

  renderScoreboard();
  updateTelemetry();

  document.getElementById('priceStageView').classList.add('hidden');
  document.getElementById('priceBoardView').classList.remove('hidden');
  renderPriceBoard();
}

// =========================================================================
// 5. SPARKLER 30-SECOND TIMER & RESET BOARD
// =========================================================================
function updateAllTimerDisplays() {
  const formatted = `00:${String(timerSeconds).padStart(2, '0')}`;
  ['clockDisplay', 'priceClockDisplay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatted;
  });
}

function setAllTimerStatus(text, colorClass) {
  ['clockStatusText', 'priceClockStatusText'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
      el.className = `font-extrabold ${colorClass}`;
    }
  });
}

function resetClockDisplay() {
  stopClock();
  timerSeconds = 30;
  updateAllTimerDisplays();
  setAllTimerStatus('Ready', 'text-[#D84315]');
}

function stopClock() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function toggleClock() {
  if (timerInterval) {
    stopClock();
    setAllTimerStatus('Paused', 'text-[#8C4A19]');
    return;
  }

  if (timerSeconds <= 0) timerSeconds = 30;
  setAllTimerStatus('Running 🔥', 'text-[#008272]');

  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    updateAllTimerDisplays();
    if (timerSeconds <= 0) {
      stopClock();
      setAllTimerStatus('Time Up! ⏰', 'text-[#D32F2F]');
    }
  }, 1000);
}

// Two-click inline reset (avoids blocked window.confirm in sandboxed environments)
let resetPending = false;
let resetTimeout = null;

function resetMatch() {
  const btn = document.getElementById('resetMatchBtn');
  if (!resetPending) {
    resetPending = true;
    btn.textContent = '⚠️ Click Again to Confirm';
    btn.className = 'px-3.5 py-1.5 border border-white bg-[#D32F2F] text-white font-extrabold uppercase transition';
    resetTimeout = setTimeout(() => {
      resetPending = false;
      btn.textContent = 'Reset Board';
      btn.className = 'px-3.5 py-1.5 border border-white/60 bg-[#B23C00] text-white hover:bg-[#7F1D00] transition uppercase font-extrabold';
    }, 3500);
    return;
  }

  clearTimeout(resetTimeout);
  resetPending = false;
  btn.textContent = 'Reset Board';
  btn.className = 'px-3.5 py-1.5 border border-white/60 bg-[#B23C00] text-white hover:bg-[#7F1D00] transition uppercase font-extrabold';

  stopClock();

  // Only reset the currently active game tab!
  if (activeGameTab === 'MOVIES') {
    teams[0].movies = { score: 0, solved: 0, streak: 0 };
    teams[1].movies = { score: 0, solved: 0, streak: 0 };
    movieTurn = 0;
    Object.keys(lockedMovieSlots).forEach(k => delete lockedMovieSlots[k]);
    showCategoryHub();
  } else if (activeGameTab === 'PRICE') {
    teams[0].price = { score: 0, solved: 0, streak: 0, pctOffHistory: [] };
    teams[1].price = { score: 0, solved: 0, streak: 0, pctOffHistory: [] };
    priceTurn = 0;
    Object.keys(lockedPriceSlots).forEach(k => delete lockedPriceSlots[k]);
    abortPriceItem();
  }

  renderScoreboard();
  updateTelemetry();
}

// =========================================================================
// 6. KEYBOARD SHORTCUTS
// =========================================================================
document.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea') return;

  if (e.code === 'Space') {
    if (activeGameTab === 'MOVIES' && currentMovieQuestion) {
      e.preventDefault();
      toggleAnswer();
    } else if (activeGameTab === 'PRICE' && currentPriceItem) {
      e.preventDefault();
      togglePriceAnswer();
    }
  } else if (e.key === 'h' || e.key === 'H') {
    if (activeGameTab === 'MOVIES' && currentMovieQuestion) {
      e.preventDefault();
      toggleClue();
    }
  } else if (e.key === 't' || e.key === 'T') {
    if ((activeGameTab === 'MOVIES' && currentMovieQuestion) ||
        (activeGameTab === 'PRICE' && currentPriceItem)) {
      e.preventDefault();
      toggleClock();
    }
  } else if (e.key === 'Escape') {
    if (activeGameTab === 'MOVIES' && currentMovieQuestion) {
      e.preventDefault();
      abortQuestion();
    } else if (activeGameTab === 'PRICE' && currentPriceItem) {
      e.preventDefault();
      abortPriceItem();
    }
  }
});

// =========================================================================
// 7. INITIALIZE GAME BOARDS ON LOAD
// =========================================================================
renderScoreboard();
updateTelemetry();
renderCategoryHub();
renderPriceBoard();
