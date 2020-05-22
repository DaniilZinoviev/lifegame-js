/*
 -Игра «Жизнь» происходит на клеточном поле, которое, традиционно, называется «вселенная».
 -Каждая клетка может быть живой или мёртвой.
 -Поколения сменяются синхронно по простым правилам:
 -в пустой (мёртвой) клетке, рядом с которой ровно три живые клетки, зарождается жизнь;
 -  если у живой клетки есть две или три живые соседки,то эта клетка продолжает жить;
    в противном случае (если соседей меньше двух или больше трёх) клетка умирает («от одиночества» или «от перенаселённости»).
*/

// ;(function(){
    
    window.table = document.getElementById('lifegame');
    let tickBtn = document.getElementById('tick');
    let width = 10;
    let height = 10;

    class Lifegame {
        constructor(options = {}) {
            if (!options.table) throw new Error("Lifegame: Requires first argument table!");

            this.table  = options.table;
            this.width  = options.width || 10;
            this.height = options.height || 10;
            this.liveClass = options.liveClass || 'live';
            this.tickBtn = options.tickBtn || null;

            this.matrix = this.createMatrix();
            this.init();
        }

        createMatrix() {
            let matrix = [];
            for (let y = 0; y < this.height; y++) {
                let row = [];
                for (let x = 0; x < this.width; x++) {
                    row.push({
                        isLive: false,
                        markedAsLive: false
                    });
                }
                matrix.push(row);
            }
            return matrix;
        }

        init() {
            this.fillWithLife();

            if (this.table) {
                this.createTable();
                this.renderTable();
                this.table.addEventListener('mousedown', (e) => {
                    let target = e.target;
                    if (target.tagName !== 'TD') return;
                    // Get matrix td to this td
                    let cell = this.getMatrixCell(target);
                    if (this.isLive(cell)) {
                        this.unsetLive(cell);
                    } else {
                        this.setLive(cell);
                    }
                    this.renderTable();
                });
            }
        
            if (this.tickBtn) {
                this.tickBtn.addEventListener('mousedown', () => {
                    this.tick();
                });
            }
        }

        createTable() {
            for (let y = 0; y < this.height; y++) {
                let row = document.createElement('tr');
                for (let x = 0; x < this.width; x++) {
                    let column = document.createElement('td');
                    row.appendChild(column);
                }
                this.table.appendChild(row);
            }
        }

        // @param td = HTMLElement TD
        getMatrixCell(td) {
            let x = td.cellIndex;
            let y = td.parentElement.rowIndex;
            return this.matrix[y][x];
        }

        // @param method = string
        fillWithLife(method = 'random') {
            this.matrix.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (method === 'random' && Math.random() > 0.9) {
                        this.setLive(cell);
                    }
                });
            });
        }

        tick() {
            this.matrix.forEach((row, y) => {
                row.forEach((cell, x) => {
                    let neigbours = this.getNeigbours(x, y);
                    if (this.isLive(cell)) {
                        this.markAsLive(cell);
                        if (neigbours.live > 3 || neigbours.live < 2) {
                            this.unmarkAsLive(cell);
                        }
                    } else {
                        this.unmarkAsLive(cell);
                        if (neigbours.live === 3) {
                            this.markAsLive(cell);
                        }
                    }
                });
            });
            this.setMarked();
            this.renderTable();
        }

        setMarked() {
            this.matrix.forEach((row, y) => {
                row.forEach((cell, x) => {
                    cell.isLive = cell.markedAsLive;
                });
            });
        }

        renderTable() {
            this.matrix.forEach((row, y) => {
                row.forEach((cell, x) => {
                    let tableCell = this.table.rows[y].cells[x];
                    if (this.isLive(cell)) {
                        tableCell.classList.add(this.liveClass);
                    } else {
                        tableCell.classList.remove(this.liveClass);
                    }
                });
            });
        }

        // @param x = number
        // @param y = number
        // @return {live: boolean, empty: boolean};
        getNeigbours(x, y) {
            let response = {live: 0, empty: 0};
            for(let yDiff = -1; yDiff <= 1; yDiff++) {
                let row = this.matrix[y + yDiff]
                if (!row) continue;
                for (let xDiff = -1; xDiff <= 1; xDiff++) {
                    let cell = row[x + xDiff],
                        isCurrent = yDiff === 0 && xDiff === 0;
                    if (!cell || isCurrent) continue;
                    this.isMarkedAsLive(cell) ? response.live++ : response.empty++;
                }
            }
            return response;
        }

        // @param cell = {isLive: boolean; markedAsLive: boolean;}
        isLive(cell) {
            return cell.isLive;
        }

        // @param cell = {isLive: boolean; markedAsLive: boolean;}
        isMarkedAsLive(cell) {
            return cell.isLive;
        }
    
        // @param cell = {isLive: boolean; markedAsLive: boolean;}
        setLive(cell) {
            cell.isLive = true;
        }
    
        // @param cell = {isLive: boolean; markedAsLive: boolean;}
        unsetLive(cell) {
            cell.isLive = false;
        }

        // @param cell = {isLive: boolean; markedAsLive: boolean;}
        markAsLive(cell) {
            cell.markedAsLive = true;
        }
    
        // @param cell = {isLive: boolean; markedAsLive: boolean;}
        unmarkAsLive(cell) {
            cell.markedAsLive = false;
        }

    }

    window.lifegame = new Lifegame({
        table: table,
        tickBtn: tickBtn
    });

// })();