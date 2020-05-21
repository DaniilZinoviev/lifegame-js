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

    createTable(width, height);
    fillWithLife(width, height);

    // tick(table, width, height);
    // setTimeout(function() {
    //     tick(table, width, height);
    // }, 1000);

    // Initial filling the table
    function createTable(width = 10, height = 10) {
        for (let y = 0; y < height; y++) {
            let row = document.createElement('tr');
            for (let x = 0; x < width; x++) {
                let column = document.createElement('td');
                row.appendChild(column);
            }
            table.appendChild(row);
        }
    }

    function fillWithLife(width, height, method = 'random') {
        forEachCell(width, height, function(cell) {
            if (method === 'random' && Math.random() > 0.9) {
                setLive(cell);
            }
        });
    }

    function tick(width, height) {
        forEachCell(width, height, function(cell, x, y) {
            let neigbours = getNeigbours(x, y);
            if (isLive(cell)) {
                if (neigbours.live > 3 || neigbours.live < 2) {
                    unsetLive(cell);
                }
            } else {
                console.log('alive', cell, neigbours);
                if (neigbours.live === 3) {
                    setLive(cell);
                }
            }
        });
    }

    // @return {live: number; empty: number;}
    function getNeigbours(x, y) {
        let response = {live: 0, empty: 0};
        for(let yDiff = -1; yDiff <= 1; yDiff++) {
            let row = table.rows[y + yDiff];
            if (!row) continue;
            for (let xDiff = -1; xDiff <= 1; xDiff++) {
                let cell = row.cells[x + xDiff];
                let isCurrent = yDiff === 0 && xDiff === 0;
                if (!cell || isCurrent) continue;
                isLive(cell) ? response.live++ : response.empty++;
            }
        }
        return response;
    }

    // @return boolean
    function isLive(cell, liveClass = 'live') {
        return cell.classList.contains(liveClass);
    }

    function setLive(cell, liveClass = 'live') {
        cell.classList.add(liveClass);
    }

    function unsetLive(cell, liveClass = 'live') {
        cell.classList.remove(liveClass);
    }

    function forEachCell(width, height, func) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let cell = table.rows[y].cells[x];
                func(cell, x, y);
            }
        }
    }
    
    table.addEventListener('mousedown', function(e) {
        let cell = e.target;
        if (cell.tagName !== 'TD') return;
        if (isLive(cell)) {
            unsetLive(cell);
        } else {
            setLive(cell);
        }
    });

    tickBtn.addEventListener('mousedown', function(e) {
        tick(width, height);
    });

// })();