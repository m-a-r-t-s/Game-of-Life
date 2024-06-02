class Automata {
    constructor(game) {
        this.game = game;
        
        // sets gameboard dimensions
        this.boardHeight = 234;
        this.boardWidth = 468;

        this.currentTick = 0;
        this.totalTicks = 0;

        this.rate = parseInt(document.getElementById("rate").value, 10);

        this.initAutomata();
    }

    initAutomata() {
        // initializes grid with all cells at 0 (dead)
        this.automata = Array.from({ length: this.boardWidth }, () => 
            Array.from({ length: this.boardHeight }, () => 0));

        this.generateRandomAutomata();
    }

    generateRandomAutomata() {
        // randomly assigns values (0 or 1) to each cell in grid
        this.automata = this.automata.map(col => col.map(() => 
            Math.round(Math.random())));
    }

    updateAutomata() {
        const newAutomata = [];

        this.automata.forEach((col, colIndex) => {
            const newCol = [];

            col.forEach((cell, rowIndex) => {
                let neighborCount = 0; // count of live neighbors
                
                [-1, 0, 1].forEach(i => {
                    [-1, 0, 1].forEach(j => {
                        const neighborCol = colIndex + i;
                        const neighborRow = rowIndex + j;

                        // checks how many neighbors (within bounds) are alive
                        if ((i !== 0 || j !== 0) && neighborCol >= 0 && neighborCol < this.boardWidth && neighborRow >= 0 && 
                            neighborRow < this.boardHeight && this.automata[neighborCol][neighborRow]) {
                            neighborCount++;
                        }
                    });
                });

                // determines new state of cell
                newCol.push((cell && (neighborCount === 2 || neighborCount === 3)) || (!cell && neighborCount === 3) ? 1 : 0);
            });

            newAutomata.push(newCol);
        });

        this.automata = newAutomata;
    }

    update() {
        this.rate = parseInt(document.getElementById("rate").value, 10);
    
        if (this.currentTick++ >= this.rate && this.rate !== 120) {
            this.currentTick = 0;
            this.totalTicks++;
            document.getElementById("ticks").textContent = "Ticks: " + this.totalTicks;
    
            this.updateAutomata();
        }
    }    

    draw(ctx) {
        const cellSideLength = 4;
        const outlineWidth = 1;
        
        // sets color for live cells
        ctx.fillStyle = "magenta";
        
        // draws the live cells
        this.automata.forEach((col, colIndex) => {
            col.forEach((cell, rowIndex) => {
                if (cell) ctx.fillRect(colIndex * cellSideLength + outlineWidth, rowIndex * cellSideLength + outlineWidth, 
                    cellSideLength - 2 * outlineWidth, cellSideLength - 2 * outlineWidth);
            });
        });
    }
}
