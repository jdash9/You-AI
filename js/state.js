/**
 * Shared mutable state for the You-AI game.
 * This script defines a global __GS object that all other game logic
 * scripts read from and write to. It must be loaded before any other
 * game logic script.
 */

window.__GS = window.__GS || (function () {

  // ── Screen / Mode state ─────────────────────────────────────────────
  var currentScreen = 'intro';
  var modeSelected = false;
  var typeSelected = false;
  var selectedKeywords = [];

  // ── Typewriter token ─────────────────────────────────────────────────
  var promptTypeToken = 0;
  var resultTypeTokens = { you: 0, ai: 0 };

  // ── Neural network state ─────────────────────────────────────────────
  var networkSelectedInputs = new Set();
  var networkActiveInputIdx = null;
  var networkActiveContextIdx = null;
  var networkActiveIntentIdx = null;
  var networkActiveOutputIdx = null;
  var networkAllNodes = [[], [], [], []];
  var networkAllData = [[], [], [], []];
  var networkConnections = [];
  var networkNodeRadius = 60;
  var networkNodeSpacing = 200;
  var networkSvg = null;
  var networkSvgWidth = 820;
  var networkSvgHeight = 420;

  // ── Question / Filter state ──────────────────────────────────────────
  var currentQuestionRef = null;
  var selectedFilter = null;
  var filterExplanation = null;
  var filterChosen = false;

  // ── Timer state ──────────────────────────────────────────────────────
  var FAST_TIMER_SECONDS = 60;
  var fastTimerInterval = null;
  var fastTimerDeadline = 0;
  var fastTimerActive = false;

  // ── SVG namespace constant ───────────────────────────────────────────
  var SVGNS = 'http://www.w3.org/2000/svg';

  // ── Weak keywords set ────────────────────────────────────────────────
  var WEAK_KEYWORDS = new Set([
    'what', 'who', 'where', 'when', 'why', 'how',
    'is', 'are', 'am', 'was', 'were', 'be', 'being', 'been',
    'the', 'a', 'an', 'and', 'or', 'but', 'not', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'if', 'then', 'else', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'must',
    'this', 'that', 'these', 'those', 'it', 'them', 'us', 'you', 'me', 'he', 'she', 'we', 'they',
    'your', 'his', 'her', 'their', 'our', 'my', 'its'
  ]);

  return {
    // Constants
    SVGNS: SVGNS,
    WEAK_KEYWORDS: WEAK_KEYWORDS,
    FAST_TIMER_SECONDS: FAST_TIMER_SECONDS,

    // Screen navigation
    goToScreen: goToScreen,

    // Screen / Mode state
    get currentScreen() { return currentScreen; },
    set currentScreen(v) { currentScreen = v; },
    get modeSelected() { return modeSelected; },
    set modeSelected(v) { modeSelected = v; },
    get typeSelected() { return typeSelected; },
    set typeSelected(v) { typeSelected = v; },
    get selectedKeywords() { return selectedKeywords; },
    set selectedKeywords(v) { selectedKeywords = v; },

    // Typewriter tokens
    get promptTypeToken() { return promptTypeToken; },
    set promptTypeToken(v) { promptTypeToken = v; },
    resultTypeTokens: resultTypeTokens,

    // Network state
    networkSelectedInputs: networkSelectedInputs,
    get networkActiveInputIdx() { return networkActiveInputIdx; },
    set networkActiveInputIdx(v) { networkActiveInputIdx = v; },
    get networkActiveContextIdx() { return networkActiveContextIdx; },
    set networkActiveContextIdx(v) { networkActiveContextIdx = v; },
    get networkActiveIntentIdx() { return networkActiveIntentIdx; },
    set networkActiveIntentIdx(v) { networkActiveIntentIdx = v; },
    get networkActiveOutputIdx() { return networkActiveOutputIdx; },
    set networkActiveOutputIdx(v) { networkActiveOutputIdx = v; },
    networkAllNodes: networkAllNodes,
    networkAllData: networkAllData,
    networkConnections: networkConnections,
    get networkNodeRadius() { return networkNodeRadius; },
    set networkNodeRadius(v) { networkNodeRadius = v; },
    get networkNodeSpacing() { return networkNodeSpacing; },
    set networkNodeSpacing(v) { networkNodeSpacing = v; },
    get networkSvg() { return networkSvg; },
    set networkSvg(v) { networkSvg = v; },
    get networkSvgWidth() { return networkSvgWidth; },
    set networkSvgWidth(v) { networkSvgWidth = v; },
    get networkSvgHeight() { return networkSvgHeight; },
    set networkSvgHeight(v) { networkSvgHeight = v; },

    // Question / Filter state
    get currentQuestionRef() { return currentQuestionRef; },
    set currentQuestionRef(v) { currentQuestionRef = v; },
    get selectedFilter() { return selectedFilter; },
    set selectedFilter(v) { selectedFilter = v; },
    get filterExplanation() { return filterExplanation; },
    set filterExplanation(v) { filterExplanation = v; },
    get filterChosen() { return filterChosen; },
    set filterChosen(v) { filterChosen = v; },

    // Timer state
    get fastTimerInterval() { return fastTimerInterval; },
    set fastTimerInterval(v) { fastTimerInterval = v; },
    get fastTimerDeadline() { return fastTimerDeadline; },
    set fastTimerDeadline(v) { fastTimerDeadline = v; },
    get fastTimerActive() { return fastTimerActive; },
    set fastTimerActive(v) { fastTimerActive = v; }
  };
})();