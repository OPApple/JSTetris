document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    let scoreBoard = document.querySelector('#score')
    let startBtn = document.querySelector('#start-button')
    let linesCleared = document.querySelector('#Lines')
    let deathScreen = document.querySelector('#Death')


    const width =  10;

    let score = 0
    let lines = 0

    let timerId

    const leftUp = 0;
    const midUp = 1;
    const rightUp = 2;
    const leftMid = width;
    const mid = width + 1;
    const rightMid = width + 2;
    const leftDown = width * 2;
    const midDown = width * 2 + 1;
    const rightDown = width * 2 +2;

    const single = 100
    const double = 300
    const triple = 500
    const tetris = 800

    let gravity = 400

  

    const LPiece = [
        [leftMid, mid, rightMid, rightUp],
        [midUp, mid, midDown, rightDown],
        [leftMid, mid, rightMid, leftDown],
        [leftUp, midUp, mid, midDown],
    ]

    const JPiece = [
        [leftUp, leftMid, mid, rightMid],
        [midUp, rightUp, mid, midDown],
        [leftMid, mid, rightMid, rightDown],
        [midUp, mid, midDown, leftDown]
    ]

    const SPiece = [
        [midUp, rightUp, leftMid, mid],
        [midUp, mid, rightMid, rightDown],
        [mid, rightMid, leftDown, midDown],
        [leftUp, leftMid, mid, midDown]
    ]
    
    const ZPiece = [
        [leftUp, midUp, mid, rightMid],
        [rightUp, mid, rightMid, midDown],
        [leftMid, mid, midDown, rightDown],
        [midUp, leftMid, mid, leftDown]
    ]

    const TPiece = [
        [midUp, leftMid, mid, rightMid],
        [midUp, mid, rightMid, midDown],
        [leftMid, mid, rightMid, midDown],
        [midUp, leftMid, mid, midDown]
    ]

    const IPiece = [
        [width, width + 1, width + 2, width + 3],
        [2, width + 2, width * 2 + 2, width * 3 + 2],
        [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1]
    ]

    const OPiece = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const pieces = [LPiece, JPiece, IPiece, OPiece, TPiece, SPiece, ZPiece]

    const colors = [
        'orange',
        'blue',
        '#5DADE2',
        'yellow',
        'purple',
        'green',
        'red'
    ]

    let streak = 0

    let currentPosition = 3
    let random = Math.floor(Math.random() * pieces.length)
    let orientation = 1
    let current = pieces[random][orientation - 1]

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('piece')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function erase() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('piece')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }


    startBtn.addEventListener('click', () => {
        if (timerId) {
          clearInterval(timerId)
          timerId = null
        } else {
          draw()
          timerId = setInterval(movevDown, gravity)

        }
      })

    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 39){
            moveRight()
        } else if (e.keyCode === 38){
            rotate()
        } else if (e.keyCode === 40){
            movevDown()
        } else if (e.keyCode === 32){
            
        }
    }

    document.addEventListener('keydown', control)


    function movevDown () {
        erase()
        currentPosition += width
        draw()
        stop()
        
    }
    
    function stop() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            
            random = Math.floor(Math.random() * pieces.length)
            orientation = 0
            current = pieces[random][orientation]
            currentPosition = 4
            draw()
            clearLines()
            streak = 0
            death()
        }
    }

    function moveLeft() {
        erase()
        const LeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!LeftEdge) {
            currentPosition -= 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }

        draw()
    }



    function moveRight(){
        erase()
        const RightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!RightEdge){
            currentPosition += 1
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }

    function rotate(){
        erase()
        
        
        orientation ++
        
        if (orientation > 3){
            orientation = 0
        }
        
        current = pieces[random][orientation]

        draw()
        
        
        
    }

    function clearLines(){
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
            if(row.every(index => squares[index].classList.contains('taken'))){
                streak ++
                
                if(streak === 1){
                    score += single
                }else if (streak === 2){                    
                    score += double - single
                }else if (streak === 3){
                    score += triple - double
                }else if (streak === 4){
                    score += tetris - triple
                }
                
                scoreBoard.innerHTML = score
                
                lines ++
                linesCleared.innerHTML = lines

    
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('piece')
                    squares[index].style.backgroundColor = ''
                  })
    
                  const squaresRemoved = squares.splice(i, width)
                  squares = squaresRemoved.concat(squares)
                  squares.forEach(cell => grid.appendChild(cell))
        }
        }
    }

    function death() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            deathScreen.innerHTML = "Death"
            clearInterval(timerId)
        }
    }
    
})