// timer.js

export function initTimer() {
    // DOM Elements
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    const sessionText = document.getElementById('sessionText');
  
    const playBtn = document.getElementById('playButton');
    const resetBtn = document.getElementById('resetButton');
  
    const focusPlusBtn = document.querySelector('.plus-focus');
    const focusMinusBtn = document.querySelector('.minus-focus');
    const breakPlusBtn = document.querySelector('.plus-break');
    const breakMinusBtn = document.querySelector('.minus-break');

    // Default timer lengths (in minutes)
    let focusMinutes = 25;
    let breakMinutes = 5;

    // Load from localStorage if available
    const savedFocus = localStorage.getItem('focusMinutes');
    const savedBreak = localStorage.getItem('breakMinutes');
    if (savedFocus !== null) focusMinutes = Number(savedFocus);
    if (savedBreak !== null) breakMinutes = Number(savedBreak);

    // Current timer values in minutes and seconds
    let currentMinutes = focusMinutes;
    let currentSeconds = 0;
  
    // Timer state flags
    let isRunning = false;
    let isFocusSession = true;
    let timerInterval = null;

    // Sound effects
    const clickSound = new Audio('/static/sounds/click.mp3');
    const playSound = new Audio('/static/sounds/play.mp3');
    const pauseSound = new Audio('/static/sounds/pause.mp3');
    const alarmSound = new Audio('/static/sounds/timer.mp3');

    // Plays when play/reset/plus/minus buttons are pressed
    function playStartSound() { playSound.play(); }
    function playPauseSound() { pauseSound.play(); }
    function playClickSound() { clickSound.play(); }
    function playTimerSound() { alarmSound.play(); }
  
    // Updates the timer display and session label
    function updateDisplay() {
      minutes.textContent = String(currentMinutes).padStart(2, '0');
      seconds.textContent = String(currentSeconds).padStart(2, '0');
      sessionText.textContent = isFocusSession ? 'Time to focus!' : 'Take a break!';
    }

    // Saves the current focus and break times to localStorage
    function saveSettings() {
      localStorage.setItem('focusMinutes', focusMinutes);
      localStorage.setItem('breakMinutes', breakMinutes);
    }
  
    // Called every second to update the countdown timer
    function tick() {
      if (currentSeconds === 0) {
        if (currentMinutes === 0) {
          switchSession();
          return;
        }
        currentMinutes--;
        currentSeconds = 59;
      } else {
        currentSeconds--;
      }
      updateDisplay();
    }
  
    // Starts the timer
    function start() {
      if (isRunning) return;
      isRunning = true;
      playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
      timerInterval = setInterval(tick, 1000);
    }
  
    // Pauses the timer
    function pause() {
      if (!isRunning) return;
      isRunning = false;
      playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      clearInterval(timerInterval);
    }
  
    // Resets the timer
    function reset() {
      pause();
      currentMinutes = isFocusSession ? focusMinutes : breakMinutes;
      currentSeconds = 0;
      updateDisplay();
    }
  
    // Switches between focus and break sessions
    function switchSession() {
      pause();
      playTimerSound();
      isFocusSession = !isFocusSession;
      currentMinutes = isFocusSession ? focusMinutes : breakMinutes;
      currentSeconds = 0;
      updateDisplay();
      start();
    }
  
    // Adjusts focus time by the given amount
    function changeFocusTime(amount) {
      focusMinutes = Math.min(Math.max(1, focusMinutes + amount), 60);
      if (isFocusSession) reset();
      updateSettingsDisplay();
      saveSettings();
    }
  
    // Adjusts break time by the given amount
    function changeBreakTime(amount) {
      breakMinutes = Math.min(Math.max(1, breakMinutes + amount), 30);
      if (!isFocusSession) reset();
      updateSettingsDisplay();
      saveSettings();
    }
  
    // Updates the UI elements showing current focus and break times
    function updateSettingsDisplay() {
      const focusTimeValue = document.querySelector('.focus-time-value');
      const breakTimeValue = document.querySelector('.break-time-value');
    
      focusTimeValue.textContent = focusMinutes;
      breakTimeValue.textContent = breakMinutes;
    }

    // Helper to add click listeners on time change buttons
    function addTimeChangeListener(button, changeFn, amount) {
      button.addEventListener('click', () => {
        playClickSound();
        changeFn(amount);
      });
    }   

    // Attach event listeners to buttons for changing times
    addTimeChangeListener(focusPlusBtn, changeFocusTime, 1);
    addTimeChangeListener(focusMinusBtn, changeFocusTime, -1);
    addTimeChangeListener(breakPlusBtn, changeBreakTime, 1);
    addTimeChangeListener(breakMinusBtn, changeBreakTime, -1);
    
    // Play/pause button toggles the timer
    playBtn.addEventListener('click', () => {
      if (!isRunning) {
        playStartSound();
        start();
      } else {
        playPauseSound();
        pause();
      }
    });
  
    // Resets the current session timer
    resetBtn.addEventListener('click', () => {
      playClickSound();
      reset()
    });
  
    // Initialize UI with current times and session text on load
    updateSettingsDisplay();
    updateDisplay();
  }
  