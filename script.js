let stockPrice = 10.00;
let initialStockPrice = 10.00;
let cash = 100.00;  // Cash on hand
let shares = 0;  // Number of shares owned
let day = 1;
let totalDays = 30;
let stockPrices = [stockPrice];  // Array to store stock prices for each day
let days = [1];  // Array to store day numbers for chart

const stockPriceElement = document.getElementById('stock-price');
const portfolioElement = document.getElementById('portfolio');  // Portfolio display
const dayElement = document.getElementById('day');
const sharesElement = document.getElementById('shares');
const messageElement = document.getElementById('message');
const gameContainer = document.getElementById('game-container');
const startContainer = document.getElementById('start-container');
const playAgainButton = document.getElementById('play-again-btn');
const endContainer = document.getElementById('end-container');
const profitLossElement = document.getElementById('profit-loss');

// Get canvas context for the chart
const ctx = document.getElementById('stockChart').getContext('2d');

// Initialize Chart.js line chart for stock prices
const stockChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: days,  // Day numbers
        datasets: [{
            label: 'Stock Price',
            data: stockPrices,  // Stock prices
            borderColor: 'rgba(75, 192, 192, 1)',  // Default to blue
            backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Default to light blue
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Day'
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Price ($)'
                }
            }
        }
    }
});

document.getElementById('buy-btn').addEventListener('click', buyStock);
document.getElementById('sell-btn').addEventListener('click', sellStock);
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('play-again-btn').addEventListener('click', playAgain);

// Update the UI and chart colors
function updateUI() {
    let portfolioValue = cash + (shares * stockPrice);
    let initialValue = 100.00;
    let profitLoss = portfolioValue - initialValue;

    // Update stock price color
    stockPriceElement.innerText = `Stock Price: $${stockPrice.toFixed(2)}`;
    stockPriceElement.style.color = stockPrice > initialStockPrice ? 'green' : (stockPrice < initialStockPrice ? 'red' : 'black');

    // Update portfolio value color
    portfolioElement.innerText = `Portfolio Value: $${portfolioValue.toFixed(2)}`;
    portfolioElement.style.color = profitLoss > 0 ? 'green' : (profitLoss < 0 ? 'red' : 'black');

    dayElement.innerText = `Day: ${day}`;
    sharesElement.innerText = `Shares: ${shares}`;

    // Update chart colors based on current stock price
    let color = stockPrice > initialStockPrice ? 'rgba(75, 192, 75, 1)' : // Green
                (stockPrice < initialStockPrice ? 'rgba(255, 99, 132, 1)' : // Red
                'rgba(75, 192, 192, 1)'); // Blue (default)
    
    let backgroundColor = stockPrice > initialStockPrice ? 'rgba(75, 192, 75, 0.2)' : // Light green
                          (stockPrice < initialStockPrice ? 'rgba(255, 99, 132, 0.2)' : // Light red
                          'rgba(75, 192, 192, 0.2)'); // Light blue (default)

    stockChart.data.datasets[0].borderColor = color;
    stockChart.data.datasets[0].backgroundColor = backgroundColor;

    // Update chart
    stockChart.update();
}

// Randomize stock movement (up or down)
function randomStockMovement() {
    let change = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2); // Max change of $2
    stockPrice += change;
    if (stockPrice < 1) stockPrice = 1;  // Ensure price doesn't drop below $1
}

// Buy Stock (Limited to 1 share)
function buyStock() {
    if (shares === 0 && cash >= stockPrice) { // Limit to 1 share
        shares = 1;
        cash -= stockPrice;
        messageElement.innerText = "Bought 1 share!";
    } else if (shares > 0) {
        messageElement.innerText = "You can only hold 1 share!";
    } else {
        messageElement.innerText = "Not enough money to buy!";
    }
    updateUI();
}

// Sell Stock
function sellStock() {
    if (shares > 0) {
        cash += stockPrice;
        shares = 0;
        messageElement.innerText = "Sold 1 share!";
    } else {
        messageElement.innerText = "No shares to sell!";
    }
    updateUI();
}

// Start the game
function startGame() {
    // Hide the start button, show the game container
    startContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    endContainer.style.display = 'none';  // Hide the end container

    // Reset values
    stockPrice = initialStockPrice;
    cash = 100.00;  // Reset cash to $100
    shares = 0;
    day = 1;
    stockPrices = [stockPrice];  // Reset stock price array
    days = [1];  // Reset day array
    stockChart.data.labels = days;
    stockChart.data.datasets[0].data = stockPrices;
    stockChart.update();

    messageElement.innerText = '';

    updateUI();
    runGame();
}

// Run the game for 30 days
function runGame() {
    const interval = setInterval(() => {
        if (day > totalDays) {
            clearInterval(interval);
            endGame();
        } else {
            randomStockMovement();
            day++;
            stockPrices.push(stockPrice);
            days.push(day);
            updateUI();
        }
    }, 1500); // 1.5 seconds per day
}

function endGame() {
    let finalValue = cash + (shares * stockPrice);
    let profitOrLoss = finalValue - 100.00;

    // Hide the game and show the end container with play again button and profit/loss
    gameContainer.style.display = 'none';
    endContainer.style.display = 'block';

    if (profitOrLoss > 0) {
        messageElement.innerText = `Game over! You made a profit of $${profitOrLoss.toFixed(2)}!`;
        profitLossElement.innerText = `Profit: $${profitOrLoss.toFixed(2)}`;
        profitLossElement.style.color = 'green';
    } else if (profitOrLoss < 0) {
        messageElement.innerText = `Game over! You lost $${Math.abs(profitOrLoss).toFixed(2)}.`;
        profitLossElement.innerText = `Loss: $${Math.abs(profitOrLoss).toFixed(2)}`;
        profitLossElement.style.color = 'red';
    } else {
        messageElement.innerText = "Game over! You broke even!";
        profitLossElement.innerText = "You broke even!";
        profitLossElement.style.color = 'black';
    }
}

// Reset the game and play again
function playAgain() {
    startContainer.style.display = 'block';
    endContainer.style.display = 'none';  // Hide the end container

    messageElement.innerText = '';  // Clear any message
}

updateUI();