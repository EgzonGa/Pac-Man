
  // get all possible next moves
  function getAdjacences(ind, queue, point) {
    if (typeof point !== 'undefined') {
      let adj = shuffle(ind, [{
        x: point.x,
        y: point.y - 1
      }, {
        x: point.x,
        y: point.y + 1
      }, {
        x: point.x - 1,
        y: point.y
      }, {
        x: point.x + 1,
        y: point.y
      }])
      return adj.filter((value) =>
        ((value.x >= 1 && value.x < SIZE.GRID && value.y < SIZE.GRID && value.y >= 1 && !isContained(map, value) && !isContained(queue, value))))
    } else {
      return []
    }
  }

  // shuffle the ghost's ways
  function shuffle(ind, array) {
    let arr = []
    let index = ind % 4
    for (let i = 0; i < 4; i++) {
      arr.push(array[(index + i) % 4])
    }
    return arr
  }
  // endregion

  // region: draw
  function drawPacman() {
    let color = pacman.power < 0 ? COLOR.PACMAN : COLOR.POWER
    let margin = pacman.power < 0 ? MARGIN_PACMAN : 0
    let angle = getAngle()
    let eye = getEye()
    let pac = {}
    pac.x = pacman.x * SIZE.BLOCK + SIZE.BLOCK / 2 + margin
    pac.y = pacman.y * SIZE.BLOCK + SIZE.BLOCK / 2 + margin
    pac.radius = SIZE.BLOCK / 2 - margin * 2

    // half of a circle
    ctx.beginPath()
    ctx.arc(pac.x, pac.y, pac.radius, angle.startMouth, angle.endMouth, false)
    ctx.fillStyle = color
    ctx.fill()

    // half of a circle
    ctx.beginPath()
    ctx.arc(pac.x, pac.y, pac.radius, angle.startHead, angle.endHead, false)
    ctx.fill()

    // draw eye
    ctx.beginPath()
    ctx.arc(eye.x, eye.y, SIZE.BLOCK / 10, 0, 2 * Math.PI, false)
    ctx.fillStyle = COLOR.FOOD
    ctx.fill()
  }

  function drawScore() {
    ctx.fillStyle = COLOR.FOOD
    ctx.font = '20px Monaco'
    ctx.fillText('Score: ' + score, 0, SIZE.BLOCK)
  }

  function drawPath() {
    if (pacman.power <= 0) {
      ghosts.forEach((value) => {
        value.path.forEach((path) => {
          ctx.fillStyle = value.color
          ctx.fillRect(path.x * SIZE.BLOCK + SIZE.BLOCK / 4, path.y * SIZE.BLOCK + SIZE.BLOCK / 4, SIZE.BLOCK / 2, SIZE.BLOCK / 2)
        })
      })
    }
  }

  function drawCherries() {
    cherries.forEach(cherry => {
      drawElement(ELEMENT.CHERRY, cherry)
    })
  }

  function drawGhosts() {
    ghosts.forEach(value => {
      drawElement(ELEMENT.GHOST, value)
    })
  }

  function drawFood() {
    food.forEach(value => {
      drawElement(ELEMENT.FOOD, value)
    })
  }

  function drawBackground() {
    ctx.fillStyle = COLOR.BACKGROUND
    ctx.fillRect(0, 0, w, w)
  }

  function drawMap() {
    map.forEach(value => {
      drawElement(ELEMENT.BLOCK, value)
    })
  }

  function drawElement(ele, obj) {
    let x = obj.x * SIZE.BLOCK
    let y = obj.y * SIZE.BLOCK
    switch (ele) {
      case ELEMENT.BLOCK:
        ctx.fillStyle = COLOR.MAP
        ctx.fillRect(x, y, SIZE.BLOCK, SIZE.BLOCK)
        break

      case ELEMENT.FOOD:
        ctx.fillStyle = COLOR.FOOD
        ctx.fillRect(x + SIZE.BLOCK / 3, y + SIZE.BLOCK / 3, SIZE.BLOCK / 3, SIZE.BLOCK / 3)
        break

      case ELEMENT.CHERRY:
        ctx.fillStyle = COLOR.CHERRY
        ctx.beginPath()
        ctx.arc(x + SIZE.BLOCK / 4, y + SIZE.BLOCK / 2, SIZE.BLOCK / 4, 0, 2 * Math.PI, false)
        ctx.arc(x + SIZE.BLOCK * 3 / 4, y + SIZE.BLOCK * 3 / 4, SIZE.BLOCK / 4, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(x + SIZE.BLOCK / 4, y + SIZE.BLOCK / 4)
        ctx.lineTo(x + SIZE.BLOCK, y)
        ctx.moveTo(x + SIZE.BLOCK * 3 / 4, y)
        ctx.lineTo(x + SIZE.BLOCK * 3 / 4, y + SIZE.BLOCK / 2)
        ctx.lineWidth = 3
        ctx.strokeStyle = COLOR.CHERRY_BRANCH
        ctx.stroke()
        break

      case ELEMENT.GHOST:
        const pow = pacman.power / 100
        let color = pow < 0 || pow === 1 || pow === 5 || pow === 9 || pow === 13 ? obj.color : COLOR.GHOST_WEAK
        ctx.fillStyle = color
        ctx.fillRect(x, y + SIZE.BLOCK / 2, SIZE.BLOCK, SIZE.BLOCK / 4)
        ctx.beginPath()
        ctx.arc(x + SIZE.BLOCK / 2, y + SIZE.BLOCK / 2, SIZE.BLOCK / 2, Math.PI, 0, false)
        // four circles as foot
        for (let i = -3; i <= 3; i += 2) {
          ctx.arc(x + SIZE.BLOCK / 2 + SIZE.BLOCK * i / 8, y + SIZE.BLOCK / 2 + SIZE.BLOCK / 4, SIZE.BLOCK / 8, 0, Math.PI, false)
        }

        ctx.fill()
        ctx.fillStyle = COLOR.EYE
        ctx.beginPath()
        ctx.arc(x + SIZE.BLOCK / 4, y + SIZE.BLOCK / 2, SIZE.BLOCK / 8, 0, 2 * Math.PI, false)
        ctx.arc(x + SIZE.BLOCK * 3 / 4, y + SIZE.BLOCK / 2, SIZE.BLOCK / 8, 0, 2 * Math.PI, false)
        ctx.fill()
        break
    }
  }
  // endregion

  // region: utils
  // set width = height = the shortest dimension of the browser window
  function setCanvasStyle() {
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w > h ? h - 150 : w - 150
    canvas.height = canvas.width
    canvas.style.left = (w - canvas.width) / 2 + 'px'
    canvas.style.position = "absolute"
  }

  function isContained(arr, obj) {
    return arr.some(value => (value.x === obj.x && value.y === obj.y))
  }

  // simplify the random function
  function random(x) {
    return Math.floor(Math.random() * x)
  }

  function reachCherry(obj) {
    return obj.x === cherries[obj.target].x && obj.y === cherries[obj.target].y
  }

  // follow the path
  function followPath(ghost) {
    if (ghost.path[0].x === ghost.x) {
      ghost.direction = ghost.path[0].y > ghost.y ? DIRECTION.DOWN : DIRECTION.UP
    } else {
      ghost.direction = ghost.path[0].x > ghost.x ? DIRECTION.RIGHT : DIRECTION.LEFT
    }
  }

  // return the oposite direction
  function opositeOf(x) {
    switch (x) {
      case DIRECTION.LEFT:
        return DIRECTION.RIGHT
      case DIRECTION.RIGHT:
        return DIRECTION.LEFT
      case DIRECTION.UP:
        return DIRECTION.DOWN
      case DIRECTION.DOWN:
        return DIRECTION.UP
    }
  }

  // return the array of directions that a ghost is able to turn in the next move
  function whereCanGo(obj) {
    let direction = []
    if (isCrashed(map, obj.x + 1, obj.y) === -1) {
      direction.push(DIRECTION.RIGHT)
    }
    if (isCrashed(map, obj.x - 1, obj.y) === -1) {
      direction.push(DIRECTION.LEFT)
    }
    if (isCrashed(map, obj.x, obj.y - 1) === -1) {
      direction.push(DIRECTION.UP)
    }
    if (isCrashed(map, obj.x, obj.y + 1) === -1) {
      direction.push(DIRECTION.DOWN)
    }
    return direction
  }

  function isHitGhost() {
    let x = pacman.x
    let y = pacman.y
    for (let ele in ghosts) {
      let ex = ghosts[ele].x
      let ey = ghosts[ele].y
      let condition = (Math.ceil(ex) === Math.ceil(x) &&
          Math.ceil(ey) === Math.ceil(y)) ||
        (Math.floor(ex) === Math.floor(x) &&
          Math.floor(ey) === Math.floor(y))
      if (condition) {
        return ele
      }
    }
    return -1
  }

  // check if 2 elements are about to crash in the next move
  // returns -1 if not crash
  // return the index of the element in the array if crash
  function isCrashed(arr, x, y) {
    for (let ele in arr) {
      if (arr[ele].x === x && arr[ele].y === y) {
        return ele
      }
    }
    return -1
  }

  function randomProperty(obj) {
    let keys = Object.keys(obj)
    return obj[keys[random(keys.length)]]
  }

  function roundCoordinates() {
    ingame.px = Math.round(pacman.x)
    ingame.py = Math.round(pacman.y)
  }

  // get position of pacman's eyes
  function getEye() {
    let eye = {}
    const base = {
      x: pacman.x * SIZE.BLOCK,
      y: pacman.y * SIZE.BLOCK
    }
    switch (pacman.direction) {
      case DIRECTION.RIGHT:
      case DIRECTION.LEFT:
        eye.x = base.x + SIZE.BLOCK / 2
        eye.y = base.y + SIZE.BLOCK / 4
        break
      case DIRECTION.UP:
        eye.x = base.x + SIZE.BLOCK / 4
        eye.y = base.y + SIZE.BLOCK / 2
        break
      case DIRECTION.DOWN:
        eye.x = base.x + SIZE.BLOCK * 3 / 4
        eye.y = base.y + SIZE.BLOCK / 2
        break
    }
    return eye
  }

  // get angle of 2 arches of pacman
  function getAngle() {
    let angle = {
      startMouth: Math.PI,
      endMouth: Math.PI,
      startHead: Math.PI,
      endHead: Math.PI
    }
    if (!isOpen) {
      angle.startMouth = 0
      angle.endHead = 0
      return angle
    }
    let mouth = 0
    let head = 0
    switch (pacman.direction) {
      case DIRECTION.RIGHT:
        mouth = 0.25
        head = 0.75
        break
      case DIRECTION.LEFT:
        mouth = 1.75
        head = 1.25
        break
      case DIRECTION.UP:
        mouth = 0.25
        head = 1.75
        break
      case DIRECTION.DOWN:
        mouth = 0.75
        head = 1.25
        break
    }
    angle.startMouth *= mouth
    angle.endMouth *= mouth > 1 ? mouth - 1 : mouth + 1
    angle.startHead *= head
    angle.endHead *= head > 1 ? head - 1 : head + 1
    return angle
  }

  function generateOthers(x, y) {
    pushIntoMap({
      x: x,
      y: y
    })
    pushIntoMap({
      x: SIZE.GRID - x - 1,
      y: y
    })
    pushIntoMap({
      x: x,
      y: SIZE.GRID - y - 1
    })
    pushIntoMap({
      x: SIZE.GRID - x - 1,
      y: SIZE.GRID - y - 1
    })
  }

  function pushIntoMap(value) {
    map.push({
      x: value.x,
      y: value.y
    })
  }
  // endregion

  // region: keypress event
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        pacman.direction = DIRECTION.LEFT
        pacman.y = ingame.py
        break
      case 38:
        pacman.direction = DIRECTION.UP
        pacman.x = ingame.px
        break
      case 39:
        pacman.direction = DIRECTION.RIGHT
        pacman.y = ingame.py
        break
      case 40:
        pacman.direction = DIRECTION.DOWN
        pacman.x = ingame.px
        break
    }
  }
  // endregion
})()