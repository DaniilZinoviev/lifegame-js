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
        constructor(table, options = {}) {
            if (!table) throw new Error("Lifegame: Requires first argument table!");

            this.table  = table;
            this.width  = options.width || 10;
            this.height = options.height || 10;
            this.liveClass = options.liveClass || 'live';
            this.tickBtn = options.tickBtn || null;

            this.init();
        }

        init() {
            this.createTable();
            this.fillWithLife();

            this.table.addEventListener('mousedown', (e) => {
                let cell = e.target;
                if (cell.tagName !== 'TD') return;
                if (isLive(cell)) {
                    unsetLive(cell);
                } else {
                    setLive(cell);
                }
            });
        
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

        fillWithLife(method = 'random') {
            this._forEachCell((cell) => {
                if (method === 'random' && Math.random() > 0.9) {
                    this.setLive(cell);
                }
            });
        }

        tick() {
            this._forEachCell((cell, x, y) => {
                let neigbours = this.getNeigbours(x, y);
                if (this.isLive(cell)) {
                    if (neigbours.live > 3 || neigbours.live < 2) {
                        this.unsetLive(cell);
                    }
                } else {
                    console.log('alive', cell, neigbours);
                    if (neigbours.live === 3) {
                        this.setLive(cell);
                    }
                }
            });
        }

        getNeigbours(x, y) {
            let response = {live: 0, empty: 0};
            for(let yDiff = -1; yDiff <= 1; yDiff++) {
                let row = this.table.rows[y + yDiff];

                if (!row) continue;
                
                for (let xDiff = -1; xDiff <= 1; xDiff++) {
                    let cell = row.cells[x + xDiff],
                        isCurrent = yDiff === 0 && xDiff === 0;

                    if (!cell || isCurrent) continue;

                    this.isLive(cell) ? response.live++ : response.empty++;
                }
            }
            return response;
        }

        isLive(cell) {
            return cell.classList.contains(this.liveClass);
        }
    
        setLive(cell) {
            cell.classList.add(this.liveClass);
        }
    
        unsetLive(cell) {
            cell.classList.remove(this.liveClass);
        }
    
        _forEachCell(func) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    let cell = this.table.rows[y].cells[x];
                    func(cell, x, y);
                }
            }
        }

    }

    new Lifegame(table, {
        tickBtn: tickBtn
    });

// })();