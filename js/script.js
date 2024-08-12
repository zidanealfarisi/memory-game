document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const modeSelection = document.getElementById("mode-selection");
  const refreshButton = document.getElementById("refresh-button");
  const timerElement = document.getElementById("timer");
  const timerDisplay = document.querySelector(".timer");
  const cardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];
  let cards = [...cardValues, ...cardValues]; // Duplicate the card values to create pairs
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let timer;
  let timeLeft;
  let gameOverFlag = false; // Flag to indicate if the game is over
  let matchedPairs = 0;

  function initializeGame(selectedTime) {
    gameBoard.innerHTML = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    timeLeft = selectedTime; // Set time based on selected mode
    gameOverFlag = false; // Reset game over flag
    matchedPairs = 0; // Reset matched pairs count
    clearInterval(timer);

    // Shuffle the cards
    cards = cards.sort(() => 0.5 - Math.random());

    // Create card elements
    cards.forEach((value) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
              <div class="card-inner">
                  <div class="card-front">${value}</div>
                  <div class="card-back"></div>
              </div>
          `;
      card.dataset.value = value;
      gameBoard.appendChild(card);
    });

    document
      .querySelectorAll(".card")
      .forEach((card) => card.addEventListener("click", flipCard));
    showAllCards();
    startTimer();
  }

  function showAllCards() {
    document
      .querySelectorAll(".card")
      .forEach((card) => card.classList.add("flipped"));
    setTimeout(() => {
      document
        .querySelectorAll(".card")
        .forEach((card) => card.classList.remove("flipped"));
    }, 2000); // Show cards for 2 seconds
  }

  function flipCard() {
    if (lockBoard || gameOverFlag) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    matchedPairs++;
    timeLeft += 3; // Add 3 seconds for correct match
    updateTimerDisplay();
    resetBoard();

    if (matchedPairs === cardValues.length) {
      clearInterval(timer); // Stop the timer
      setTimeout(() => {
        alert("Winner!");
        resetGame();
      }, 100);
    }
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      timeLeft -= 5; // Subtract 5 seconds for incorrect match
      updateTimerDisplay();
      resetBoard();
    }, 1500);
  }

  function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
  }

  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameOver();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    timerElement.textContent = timeLeft;
  }

  function gameOver() {
    gameOverFlag = true; // Set game over flag
    alert("Game Over!");
    setTimeout(resetGame, 100); // Restart the game after the alert is closed
  }

  function resetGame() {
    modeSelection.style.display = "block";
    gameBoard.style.display = "none";
    timerDisplay.style.display = "none";
    refreshButton.style.display = "none";
  }

  refreshButton.addEventListener("click", () => location.reload());

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTime = parseInt(button.dataset.time, 10);
      modeSelection.style.display = "none";
      gameBoard.style.display = "grid";
      timerDisplay.style.display = "block";
      refreshButton.style.display = "block";
      initializeGame(selectedTime);
    });
  });

  // Initial reset to show mode selection
  resetGame();
});
