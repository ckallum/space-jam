# Cosmic Duel

A two-player space shooter game created for the "Emergent Chaos" Game Jam 2025.

![Game Screenshot](gamescreen.png)

## Game Description

Cosmic Duel is a fast-paced local multiplayer shooter where two spaceships battle against each other while navigating through a dynamic, ever-changing environment created by Conway's Game of Life cellular automata.

Players must not only outmaneuver and outshoot their opponent but also contend with constantly evolving obstacles that follow the rules of cellular automata, creating emergent patterns and challenges.

## Features

- **Two-player local multiplayer** - Compete against a friend on the same keyboard
- **Rotatable spaceships** - Control your ship's direction and aim with precision
- **Conway's Game of Life integration** - The battlefield evolves using cellular automata rules
- **Spawning obstacles** - Asteroids fly in from all sides of the screen
- **Dynamic environment** - No two games are ever the same
- **Full-screen gameplay** - Utilizes the entire browser window for an immersive experience
- **Visual effects** - Ships flash when hit, obstacles rotate and glow
- **On-screen scoring** - Keep track of lives and points without looking away from the action

## How to Play

### Controls

#### Player 1 (Blue Ship)
- **Movement**: WASD keys
- **Rotation**: Q (counter-clockwise) and E (clockwise)
- **Fire**: Spacebar

#### Player 2 (Orange Ship)
- **Movement**: UHJK keys
- **Rotation**: Y (counter-clockwise) and I (clockwise)
- **Fire**: Enter

### Game Objective

- Destroy the other player by reducing their lives to zero
- Avoid obstacles and enemy bullets
- Shoot obstacles to earn points
- Last player standing wins!

## Technical Implementation

The game leverages several interesting technical elements:

- **Cellular Automata System** - A grid-based implementation of Conway's Game of Life creates evolving obstacle patterns
- **Dynamic Obstacle Generation** - New obstacles spawn from the edges of the screen and navigate toward the center
- **Canvas-based Rendering** - All game elements are drawn directly on the HTML5 Canvas
- **Collision Detection** - Precise AABB (Axis-Aligned Bounding Box) collision detection
- **Game State Management** - Tracks player scores, lives, and game status

## Installation

1. Clone this repository
2. Open `index.html` in a modern web browser
3. No additional installation required!

## Game Jam Notes

This game was created for the "Emergent Chaos" Game Jam 2025 in 48 hours. The theme required creating a game with emergent complexity or behavior, which I've implemented through the cellular automata system that creates unpredictable but rule-based obstacle patterns.

The combination of player-versus-player combat and the ever-changing battlefield creates a unique tension where players must adapt to both their opponent's actions and the evolving environment.

## Credits

- Game Design & Programming: [Your Name]
- Inspired by Conway's Game of Life and classic arcade shooters

Enjoy the chaos!
