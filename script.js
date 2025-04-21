function spawnRandomObstacle() {
    // Randomly add new moving obstacles
    if (obstacles.length < MAX_OBSTACLES) {
        // Determine spawn location (randomly from any edge)
        let x, y;
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        
        switch (side) {
            case 0: // Top
                x = Math.random() * GAME_WIDTH;
                y = -OBSTACLE_SIZE;
                break;
            case 1: // Right
                x = GAME_WIDTH + OBSTACLE_SIZE;
                y = Math.random() * GAME_HEIGHT;
                break;
            case 2: // Bottom
                x = Math.random() * GAME_WIDTH;
                y = GAME_HEIGHT + OBSTACLE_SIZE;
                break;
            case 3: // Left
                x = -OBSTACLE_SIZE;
                y = Math.random() * GAME_HEIGHT;
                break;
        }
        
        // Create obstacle and set its velocity to move toward the center
        const obstacle = new Obstacle(x, y);
        
        // Calculate direction toward center of screen
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;
        const angle = Math.atan2(centerY - y, centerX - x);
        
        // Set velocity based on angle to center
        const speed = 0.5 + Math.random() * 1.5;
        obstacle.speedX = Math.cos(angle) * speed;
        obstacle.speedY = Math.sin(angle) * speed;
        
        // Randomize size more dramatically
        obstacle.width = OBSTACLE_SIZE * (0.5 + Math.random() * 1.5);
        obstacle.height = OBSTACLE_SIZE * (0.5 + Math.random() * 1.5);
        
        // Add to obstacles array
        obstacles.push(obstacle);
    }
}function seedNewCells() {
    // Add a few random new cells to prevent stagnation
    const numNewCells = Math.floor(Math.random() * 3) + 1; // 1-3 new cells
    
    for (let i = 0; i < numNewCells; i++) {
        // Completely random placement of cells
        const row = Math.floor(Math.random() * GRID_ROWS);
        const col = Math.floor(Math.random() * GRID_COLS);
        
        // Set the cell as alive
        caGrid[row][col] = 1;
    }
    
    // Occasionally spawn a glider (a classic moving pattern)
    if (Math.random() < 0.1) { // 10% chance
        spawnGlider();
    }
}

function spawnGlider() {
    // Create a glider pattern at a random edge location
    // Glider pattern:
    // .O.
    // ..O
    // OOO
    
    // Pick a random edge (0 = top, 1 = right, 2 = bottom, 3 = left)
    const edge = Math.floor(Math.random() * 4);
    let row, col;
    
    // Position near an edge but with room to move
    switch (edge) {
        case 0: // Top edge
            row = 5;
            col = 5 + Math.floor(Math.random() * (GRID_COLS - 10));
            break;
        case 1: // Right edge
            row = 5 + Math.floor(Math.random() * (GRID_ROWS - 10));
            col = GRID_COLS - 5;
            break;
        case 2: // Bottom edge
            row = GRID_ROWS - 5;
            col = 5 + Math.floor(Math.random() * (GRID_COLS - 10));
            break;
        case 3: // Left edge
            row = 5 + Math.floor(Math.random() * (GRID_ROWS - 10));
            col = 5;
            break;
    }
    
    // Orientation (0-3 for 4 possible rotations)
    const orientation = Math.floor(Math.random() * 4);
    
    // Create glider based on orientation
    switch (orientation) {
        case 0: // Original orientation
            caGrid[row][col+1] = 1;
            caGrid[row+1][col+2] = 1;
            caGrid[row+2][col] = 1;
            caGrid[row+2][col+1] = 1;
            caGrid[row+2][col+2] = 1;
            break;
        case 1: // 90 degrees
            caGrid[row][col] = 1;
            caGrid[row+1][col] = 1;
            caGrid[row+2][col] = 1;
            caGrid[row][col+1] = 1;
            caGrid[row+1][col+2] = 1;
            break;
        case 2: // 180 degrees
            caGrid[row][col] = 1;
            caGrid[row][col+1] = 1;
            caGrid[row][col+2] = 1;
            caGrid[row+1][col] = 1;
            caGrid[row+2][col+1] = 1;
            break;
        case 3: // 270 degrees
            caGrid[row][col+2] = 1;
            caGrid[row+1][col] = 1;
            caGrid[row+1][col+2] = 1;
            caGrid[row+2][col+1] = 1;
            caGrid[row+2][col+2] = 1;
            break;
    }
}// --- Cellular Automata Functions ---

function initCellularAutomata() {
    // Initialize the grid with empty cells
    caGrid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(0));
    nextCaGrid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(0));
    
    // Seed with a very small number of live cells
    const initialCells = 10; // Significantly reduced number of initial cells
    
    for (let i = 0; i < initialCells; i++) {
        // Place cells in random locations, primarily in the middle third of the screen
        const row = Math.floor(GRID_ROWS / 3 + Math.random() * (GRID_ROWS / 3));
        const col = Math.floor(Math.random() * GRID_COLS);
        caGrid[row][col] = 1;
    }
    
    // Add a few simple stable patterns (like blocks or blinkers)
    // Add a block (2x2 square) - a stable pattern
    const blockRow = Math.floor(GRID_ROWS / 4);
    const blockCol = Math.floor(GRID_COLS / 4);
    caGrid[blockRow][blockCol] = 1;
    caGrid[blockRow][blockCol + 1] = 1;
    caGrid[blockRow + 1][blockCol] = 1;
    caGrid[blockRow + 1][blockCol + 1] = 1;
    
    // Add a blinker (3x1 line) - an oscillator
    const blinkerRow = Math.floor(GRID_ROWS / 5);
    const blinkerCol = Math.floor(3 * GRID_COLS / 4);
    caGrid[blinkerRow][blinkerCol - 1] = 1;
    caGrid[blinkerRow][blinkerCol] = 1;
    caGrid[blinkerRow][blinkerCol + 1] = 1;
}

function updateCellularAutomata() {
    // Create the next generation based on current grid
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            // Count live neighbors (including wrapping around edges)
            let liveNeighbors = 0;
            
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    // Skip the current cell itself
                    if (i === 0 && j === 0) continue;
                    
                    // Calculate neighbor position with wrapping
                    const neighborRow = (row + i + GRID_ROWS) % GRID_ROWS;
                    const neighborCol = (col + j + GRID_COLS) % GRID_COLS;
                    
                    // Count if neighbor is alive
                    liveNeighbors += caGrid[neighborRow][neighborCol];
                }
            }
            
            // Apply Game of Life rules
            if (caGrid[row][col] === 1) {
                // Cell is currently alive
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    // Dies from loneliness or overpopulation
                    nextCaGrid[row][col] = 0;
                } else {
                    // Survives
                    nextCaGrid[row][col] = 1;
                }
            } else {
                // Cell is currently dead
                if (liveNeighbors === 3) {
                    // Becomes alive due to reproduction
                    nextCaGrid[row][col] = 1;
                } else {
                    // Stays dead
                    nextCaGrid[row][col] = 0;
                }
            }
        }
    }
    
    // Swap grids
    [caGrid, nextCaGrid] = [nextCaGrid, caGrid];
    
    // Convert live cells to obstacles
    updateObstaclesFromGrid();
}

function updateObstaclesFromGrid() {
    // Clear current obstacles
    obstacles = [];
    
    // Create obstacles from live cells
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            if (caGrid[row][col] === 1) {
                // Convert grid position to canvas coordinates
                const x = col * GRID_CELL_SIZE;
                const y = row * GRID_CELL_SIZE;
                
                // Add a new obstacle at this position
                const newObstacle = new Obstacle(x, y);
                newObstacle.width = GRID_CELL_SIZE;
                newObstacle.height = GRID_CELL_SIZE;
                newObstacle.speedX = 0; // Static obstacles
                newObstacle.speedY = 0; // Static obstacles
                obstacles.push(newObstacle);
            }
        }
    }
}const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Settings ---
// --- Game Settings ---
const GAME_WIDTH = window.innerWidth; // Full window width
const GAME_HEIGHT = window.innerHeight; // Full window height
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;
const ROTATION_SPEED = 0.1; // Rotation speed in radians per frame
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const BULLET_SPEED = 7;
const MAX_BULLETS = 5; // Max bullets on screen per player
const OBSTACLE_SIZE = 25;
const OBSTACLE_SPAWN_RATE = 0.01; // Probability per frame
const MAX_OBSTACLES = 30; // Adjusted for bigger area
const INITIAL_LIVES = 3;
const FLASH_DURATION = 500; // Duration of flash effect in milliseconds
const GRID_CELL_SIZE = 20; // Size of each cell in the grid
const GRID_COLS = Math.floor(GAME_WIDTH / GRID_CELL_SIZE);
const GRID_ROWS = Math.floor(GAME_HEIGHT / GRID_CELL_SIZE);
const CA_UPDATE_INTERVAL = 200; // Update cellular automata every 200ms for faster updates

// Ensure canvas dimensions are set
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// --- Game State ---
let player1, player2;
let bullets = []; // Global array for all bullets
let obstacles = [];
let keysPressedP1 = {};
let keysPressedP2 = {}; // For Player 2 controls
let gameOver = false;
let animationFrameId;
let caGrid = []; // Cellular automata grid
let nextCaGrid = []; // Next state of cellular automata
let lastCAUpdate = 0; // Last time the CA was updated
let lastSeedUpdate = 0; // Last time new cells were seeded
let lastObstacleSpawn = 0; // Last time an obstacle was spawned
const SEED_INTERVAL = 500; // Add new cells every 0.5 seconds
const OBSTACLE_SPAWN_INTERVAL = 1000; // Spawn new obstacles every 1 second

// --- UI Elements ---
const p1LivesEl = document.getElementById('p1-lives');
const p1ScoreEl = document.getElementById('p1-score');
const p2LivesEl = document.getElementById('p2-lives');
const p2ScoreEl = document.getElementById('p2-score');
const gameOverEl = document.getElementById('gameOver');
const winnerEl = document.getElementById('winner');
const restartButton = document.getElementById('restartButton');

// --- Classes ---
class Player {
    constructor(x, y, color, controls, fireKey, rotateKeys, id) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.color = color;
        this.speed = PLAYER_SPEED;
        // Control mapping { up, down, left, right }
        this.controls = controls;
        this.fireKey = fireKey;
        // Rotation keys { clockwise, counterClockwise }
        this.rotateKeys = rotateKeys;
        this.lives = INITIAL_LIVES;
        this.score = 0;
        this.id = id; // 'p1' or 'p2'
        this.canShoot = true;
        this.shootCooldown = 300; // milliseconds
        this.rotation = 0; // Rotation in radians (0 means pointing up)
        this.rotationSpeed = ROTATION_SPEED;
        this.isFlashing = false; // Flash effect state
        this.flashUntil = 0; // Time until flash effect ends
    }

    draw() {
        // Save the current canvas state
        ctx.save();
        
        // Translate to the center of the player
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        
        // Rotate the canvas context
        ctx.rotate(this.rotation);
        
        // Determine fill color based on flash state
        if (this.isFlashing) {
            // Alternate between white and original color for flashing
            const flashingTime = Date.now();
            ctx.fillStyle = (Math.floor(flashingTime / 100) % 2 === 0) ? 'white' : this.color;
            
            // Check if flash duration has expired
            if (flashingTime > this.flashUntil) {
                this.isFlashing = false;
            }
        } else {
            ctx.fillStyle = this.color;
        }
        
        // Draw the player (centered at origin)
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Simple triangle nose indicating direction
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2 - 5); // top of triangle
        ctx.lineTo(-this.width/2, -this.height/2); // bottom left corner
        ctx.lineTo(this.width/2, -this.height/2); // bottom right corner
        ctx.closePath();
        ctx.fill();
        
        // Restore the canvas state
        ctx.restore();
    }

    move(keysPressed) {
        // Player movement independent of rotation (as in original game)
        // Standard WASD/UHJK controls move relative to screen, not ship orientation
        
        // Rotate the player
        if (keysPressed[this.rotateKeys.clockwise]) {
            this.rotation += this.rotationSpeed;
        }
        if (keysPressed[this.rotateKeys.counterClockwise]) {
            this.rotation -= this.rotationSpeed;
        }
        
        // Move up (independent of rotation)
        if (keysPressed[this.controls.up] && this.y > 0) {
            this.y -= this.speed;
        }
        // Move down (independent of rotation)
        if (keysPressed[this.controls.down] && this.y < GAME_HEIGHT - this.height) {
            this.y += this.speed;
        }
        // Move left (independent of rotation)
        if (keysPressed[this.controls.left] && this.x > 0) {
            this.x -= this.speed;
        }
        // Move right (independent of rotation)
        if (keysPressed[this.controls.right] && this.x < GAME_WIDTH - this.width) {
            this.x += this.speed;
        }
    }

    shoot(keysPressed) {
        // Check how many bullets this player currently has active
        const activePlayerBullets = bullets.filter(b => b.owner === this).length;

        if (keysPressed[this.fireKey] && this.canShoot && activePlayerBullets < MAX_BULLETS) {
            // Calculate bullet starting position based on player's center and rotation
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y + this.height / 2;
            
            // Add bullet to the *global* bullets array with the player's current rotation
            bullets.push(new Bullet(bulletX, bulletY, this.color, this, this.rotation));
            
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.shootCooldown);
        }
    }

    updateUI() {
        // This method is kept for compatibility but doesn't need to update DOM elements anymore
        // Game status is drawn directly on the canvas
    }

    hit() {
        // Called when the player is hit by a bullet or obstacle
        this.lives--;
        this.updateUI();
        
        // Trigger flash effect
        this.isFlashing = true;
        this.flashUntil = Date.now() + FLASH_DURATION;
        
        if (this.lives <= 0) {
            // Check for game over condition
            endGame();
        }
    }
}

class Bullet {
    constructor(x, y, color, owner, rotation) {
        this.x = x;
        this.y = y;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.color = color;
        this.speed = BULLET_SPEED;
        // Reference to the player who fired the bullet (important for collision logic)
        this.owner = owner;
        this.rotation = rotation;
        
        // Calculate velocity based on rotation
        this.velocityX = Math.sin(rotation) * BULLET_SPEED;
        this.velocityY = -Math.cos(rotation) * BULLET_SPEED;
    }

    draw() {
        // Save the current canvas state
        ctx.save();
        
        // Translate to bullet center
        ctx.translate(this.x, this.y);
        
        // Rotate the canvas to match bullet direction
        ctx.rotate(this.rotation);
        
        // Draw the bullet (centered at origin)
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Restore the canvas state
        ctx.restore();
    }

    update() {
        // Bullets move in the direction of their rotation
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = OBSTACLE_SIZE + Math.random() * 15;
        this.height = OBSTACLE_SIZE + Math.random() * 15;
        this.color = `rgb(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50})`; // Greyish rock color
        this.speedY = 0.5 + Math.random() * 1; // Move down screen
        this.speedX = (Math.random() - 0.5) * 1; // Slight sideways drift
        this.rotation = 0; // Initial rotation
        this.rotationSpeed = (Math.random() - 0.5) * 0.02; // Random rotation speed
    }

    draw() {
        ctx.save();
        
        // Translate to center of obstacle for rotation
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        
        // Check if this obstacle came from the CA grid or was randomly spawned
        if (this.speedX === 0 && this.speedY === 0) {
            // CA grid obstacle - draw with a slight glow
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 5;
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        } else {
            // Regular obstacle - draw with rotation
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        }
        
        ctx.restore();
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
    }
}

// --- Game Functions ---

function initGame() {
    // Reset game state
    gameOver = false;
    gameOverEl.classList.add('hidden'); // Hide game over screen
    bullets = []; // Clear all bullets
    obstacles = []; // Clear all obstacles
    keysPressedP1 = {}; // Reset keys pressed
    keysPressedP2 = {};
    lastCAUpdate = Date.now();
    lastSeedUpdate = Date.now();
    lastObstacleSpawn = Date.now();

    // Set canvas to full window size
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    // Initialize Cellular Automata
    initCellularAutomata();

    // Create Player 1 (WASD, Spacebar, QE for rotation) - top left corner
    player1 = new Player(
        50,                                    // Initial X (left side)
        50,                                    // Initial Y (top side)
        '#4af',                                // Color
        { up: 'w', down: 's', left: 'a', right: 'd' }, // Controls
        ' ',                                   // Fire key
        { clockwise: 'e', counterClockwise: 'q' }, // Rotation keys
        'p1'                                   // ID
    );

    // Create Player 2 (UHJK, Enter, BI for rotation) - bottom right corner
    player2 = new Player(
        GAME_WIDTH - PLAYER_WIDTH - 50,        // Initial X (right side)
        GAME_HEIGHT - PLAYER_HEIGHT - 50,      // Initial Y (bottom side)
        '#fa4',                                // Color
        { up: 'u', down: 'j', left: 'h', right: 'k' }, // Controls
        'enter',                               // Fire key
        { clockwise: 'i', counterClockwise: 'y' }, // Rotation keys
        'p2'                                   // ID
    );

    // Reset lives and scores
    player1.lives = INITIAL_LIVES;
    player1.score = 0;
    player2.lives = INITIAL_LIVES;
    player2.score = 0;
    player1.updateUI();
    player2.updateUI();

    // Cancel previous game loop if running
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    // Start the game loop
    gameLoop();
}

function spawnObstacle() {
    // Randomly add new obstacles from the top
    if (Math.random() < OBSTACLE_SPAWN_RATE && obstacles.length < MAX_OBSTACLES) {
        const x = Math.random() * (GAME_WIDTH - OBSTACLE_SIZE);
        const y = -OBSTACLE_SIZE; // Start just above the screen
        obstacles.push(new Obstacle(x, y));
    }
}

// Simple Axis-Aligned Bounding Box (AABB) collision check
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function handleCollisions() {
    // --- Bullet vs Obstacle Collisions ---
    for (let i = bullets.length - 1; i >= 0; i--) {
        // Check if bullet exists (it might have been removed in a previous check this frame)
        if (!bullets[i]) continue;
        for (let j = obstacles.length - 1; j >= 0; j--) {
            // Check if obstacle exists
            if (!obstacles[j]) continue;
            if (checkCollision(bullets[i], obstacles[j])) {
                // Award score to the player who fired the bullet
                bullets[i].owner.score += 10;
                bullets[i].owner.updateUI();
                
                // Remove the bullet
                bullets.splice(i, 1);
                
                // Remove the obstacle (all obstacles can now be destroyed)
                obstacles.splice(j, 1);
                
                // Also update the CA grid to remove this cell
                const gridRow = Math.floor(obstacles[j].y / GRID_CELL_SIZE);
                const gridCol = Math.floor(obstacles[j].x / GRID_CELL_SIZE);
                
                // Check if the grid coordinates are valid
                if (gridRow >= 0 && gridRow < GRID_ROWS && gridCol >= 0 && gridCol < GRID_COLS) {
                    caGrid[gridRow][gridCol] = 0;
                }
                
                // Bullet is gone, break inner loop to avoid errors
                break;
            }
        }
    }

    // --- Bullet vs Player Collisions (Player vs Player Shooting) ---
    for (let i = bullets.length - 1; i >= 0; i--) {
        // Check if bullet exists
        if (!bullets[i]) continue;

        const bullet = bullets[i];

        // Check if Player 2's bullet hits Player 1
        if (bullet.owner === player2 && checkCollision(bullet, player1)) {
            player1.hit(); // Player 1 loses a life
            bullets.splice(i, 1); // Remove the bullet
            // If player 1 hit caused game over, stop further checks
            if (gameOver) return;
            continue; // Bullet is gone, move to next bullet
        }

        // Check if Player 1's bullet hits Player 2
        if (bullet.owner === player1 && checkCollision(bullet, player2)) {
            player2.hit(); // Player 2 loses a life
            bullets.splice(i, 1); // Remove the bullet
            // If player 2 hit caused game over, stop further checks
            if (gameOver) return;
            // continue; // Not strictly needed here as it's the last check for this bullet
        }
    }

    // --- Player vs Obstacle Collisions ---
    for (let i = obstacles.length - 1; i >= 0; i--) {
        // Check if obstacle exists
        if (!obstacles[i]) continue;

        // Check Player 1 collision
        if (checkCollision(player1, obstacles[i])) {
            player1.hit(); // Player 1 loses a life
            
            // Remove the obstacle
            obstacles.splice(i, 1);
            
            // If player 1 hit caused game over, stop further checks
            if (gameOver) return;
            continue; // Obstacle is gone, move to next obstacle
        }

        // Check Player 2 collision (only if Player 1 didn't collide with this one)
        if (checkCollision(player2, obstacles[i])) {
            player2.hit(); // Player 2 loses a life
            
            // Remove the obstacle
            obstacles.splice(i, 1);
            
            // If player 2 hit caused game over, stop further checks
            if (gameOver) return;
            // continue; // Not strictly needed here
        }
    }

    // --- Player vs Obstacle Collisions ---
    for (let i = obstacles.length - 1; i >= 0; i--) {
        // Check if obstacle exists
        if (!obstacles[i]) continue;

        // Check Player 1 collision
        if (checkCollision(player1, obstacles[i])) {
            player1.hit(); // Player 1 loses a life
            
            // Only remove obstacle if it's not from CA grid
            if (obstacles[i].speedX !== 0 || obstacles[i].speedY !== 0) {
                obstacles.splice(i, 1);
            }
            
            // If player 1 hit caused game over, stop further checks
            if (gameOver) return;
            continue; // Obstacle is gone, move to next obstacle
        }

        // Check Player 2 collision (only if Player 1 didn't collide with this one)
        if (checkCollision(player2, obstacles[i])) {
            player2.hit(); // Player 2 loses a life
            
            // Only remove obstacle if it's not from CA grid
            if (obstacles[i].speedX !== 0 || obstacles[i].speedY !== 0) {
                obstacles.splice(i, 1);
            }
            
            // If player 2 hit caused game over, stop further checks
            if (gameOver) return;
            // continue; // Not strictly needed here
        }
    }

    // --- Player vs Obstacle Collisions ---
    for (let i = obstacles.length - 1; i >= 0; i--) {
        // Check if obstacle exists
        if (!obstacles[i]) continue;

        // Check Player 1 collision
        if (checkCollision(player1, obstacles[i])) {
            player1.hit(); // Player 1 loses a life
            obstacles.splice(i, 1); // Remove the obstacle
            // If player 1 hit caused game over, stop further checks
            if (gameOver) return;
             continue; // Obstacle is gone, move to next obstacle
        }

        // Check Player 2 collision (only if Player 1 didn't collide with this one)
         if (checkCollision(player2, obstacles[i])) {
            player2.hit(); // Player 2 loses a life
            obstacles.splice(i, 1); // Remove the obstacle
             // If player 2 hit caused game over, stop further checks
            if (gameOver) return;
            // continue; // Not strictly needed here
        }
    }
}


function update() {
    // Main update function, called every frame before drawing
    if (gameOver) return; // Don't update if game is over

    // Update player positions based on keys pressed
    player1.move(keysPressedP1);
    player2.move(keysPressedP2);

    // Handle player shooting based on keys pressed
    player1.shoot(keysPressedP1);
    player2.shoot(keysPressedP2);

    // Update all bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        // Remove bullets that fly off the screen edges
        if (bullets[i].x < -BULLET_WIDTH || 
            bullets[i].x > GAME_WIDTH + BULLET_WIDTH || 
            bullets[i].y < -BULLET_HEIGHT || 
            bullets[i].y > GAME_HEIGHT + BULLET_HEIGHT) {
            bullets.splice(i, 1);
        }
    }
    
    // Update all obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        // Remove obstacles that move far off screen
        if (obstacles[i].x < -OBSTACLE_SIZE * 2 || 
            obstacles[i].x > GAME_WIDTH + OBSTACLE_SIZE * 2 || 
            obstacles[i].y < -OBSTACLE_SIZE * 2 || 
            obstacles[i].y > GAME_HEIGHT + OBSTACLE_SIZE * 2) {
            obstacles.splice(i, 1);
        }
    }

    // Check if it's time to update the cellular automata
    const currentTime = Date.now();
    if (currentTime - lastCAUpdate > CA_UPDATE_INTERVAL) {
        updateCellularAutomata();
        lastCAUpdate = currentTime;
    }
    
    // Check if it's time to seed new cells to prevent stagnation
    if (currentTime - lastSeedUpdate > SEED_INTERVAL) {
        seedNewCells();
        lastSeedUpdate = currentTime;
    }
    
    // Check if it's time to spawn new random obstacles
    if (currentTime - lastObstacleSpawn > OBSTACLE_SPAWN_INTERVAL) {
        spawnRandomObstacle();
        lastObstacleSpawn = currentTime;
    }

    // Detect and resolve collisions
    handleCollisions();
}

function draw() {
    // Main drawing function, called every frame after updating
    // Clear the entire canvas
    ctx.fillStyle = '#000'; // Black background
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw all active obstacles
    obstacles.forEach(obstacle => obstacle.draw());

    // Draw all active bullets
    bullets.forEach(bullet => bullet.draw());

    // Draw players
    player1.draw();
    player2.draw();
    
    // Draw game status in corners
    drawGameStatus();
}

function drawGameStatus() {
    // Draw player info in corners of the screen
    ctx.save();
    
    // Player 1 info - top left
    ctx.fillStyle = player1.color;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`P1 Lives: ${player1.lives}  Score: ${player1.score}`, 10, 20);
    
    // Player 2 info - top right
    ctx.fillStyle = player2.color;
    ctx.textAlign = 'right';
    ctx.fillText(`P2 Lives: ${player2.lives}  Score: ${player2.score}`, GAME_WIDTH - 10, 20);
    
    ctx.restore();
}

function endGame() {
    // Triggered when a player's lives reach 0
    gameOver = true;
    cancelAnimationFrame(animationFrameId); // Stop the game loop
    gameOverEl.classList.remove('hidden'); // Show the game over message box

    // Determine the winner based on remaining lives
    if (player1.lives <= 0 && player2.lives <= 0) {
        winnerEl.textContent = "It's a draw!"; // Both lost on same frame
    } else if (player1.lives <= 0) {
        winnerEl.textContent = "Player 2 Wins!";
    } else if (player2.lives <= 0) {
         winnerEl.textContent = "Player 1 Wins!";
    } else {
         // This case shouldn't normally be reached if triggered by lives <= 0
         winnerEl.textContent = "Game Over!";
    }
}

function gameLoop() {
    // The core recursive loop using requestAnimationFrame for smooth animation
    if (gameOver) return; // Stop looping if game has ended

    update(); // Update game state (movement, bullets, obstacles, collisions)
    draw();   // Redraw the canvas with updated positions

    // Request the next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- Event Listeners ---
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase(); // Normalize key to lowercase for checks

    // If game is over and space is pressed, restart the game
    if (gameOver && key === ' ') {
        initGame();
        return;
    }

    // Player 1 Controls (WASD + Space + QE for rotation + Z/C for additional rotation)
    if (['w', 'a', 's', 'd', ' ', 'q', 'e', 'z', 'c'].includes(key)) {
       keysPressedP1[key] = true;
    }
    // Player 2 Controls (UHJK + Enter + YI for rotation + B/M for additional rotation)
    if (['u', 'h', 'j', 'k', 'enter', 'y', 'i', 'b', 'm'].includes(key)) {
         keysPressedP2[key] = true;
    }

    // Prevent default browser action for spacebar scrolling page down
    if(key === ' ') {
        e.preventDefault();
    }
    // Prevent default for Enter if it causes issues (e.g., form submission)
    if(key === 'enter') {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase(); // Normalize key

     // Player 1 Controls
    if (['w', 'a', 's', 'd', ' ', 'q', 'e', 'z', 'c'].includes(key)) {
        keysPressedP1[key] = false;
    }
    // Player 2 Controls
    if (['u', 'h', 'j', 'k', 'enter', 'y', 'i', 'b', 'm'].includes(key)) {
         keysPressedP2[key] = false;
    }
});

// Add event listener for the restart button
restartButton.addEventListener('click', initGame);

// --- Start Game ---
initGame(); // Initialize and start the game when the script loads