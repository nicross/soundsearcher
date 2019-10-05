const itemBase = {
  calculateGain: function ({x, y}) {
    if (this.inventory) {
      return 1
    }

    return 1 / this.getDistance(x, y) ** 2
  },
  calculatePan: function ({angle, x, y}) {
    if (this.inventory) {
      return 0
    }

    const cx = x + Math.sin(angle),
      cy = y + Math.cos(angle)

    const a = this.getDistance(cx, cy),
      b = distance(x, y, cx, cy),
      c = this.getDistance(x, y)

    const A = Math.acos(Math.max(-1, Math.min((b ** 2 + c ** 2 - a ** 2) / (2 * b * c), 1)))

    let normal = A
    normal /= Math.PI
    normal *= 2
    normal -= 1

    return normal
  },
  getDistance: function (x, y) {
    return distance(this.x, this.y, x, y)
  },
  onPickup: function () {},
  onSpawn: function () {},
  onUpdate: function ({angle, x, y}) {},
  pickup: function () {
    this.inventory = true
    this.onPickup()
    return this
  },
  spawn: function ({x, y}) {
    const context = audio.context()

    this.inventory = false
    this.x = x
    this.y = y

    this.gain = new GainNode(context)
    this.panner = context.createStereoPanner()

    this.gain.connect(this.panner)
    this.panner.connect(context.destination)

    this.onSpawn()

    return this
  },
  update: function ({angle, x, y}) {
    const context = audio.context()

    this.gain.gain.value = this.calculateGain({x, y})
    this.panner.pan.value = this.calculatePan({angle, x, y})

    this.onUpdate({angle, x, y})

    return this
  },
}

const items = []

function inventItem(id, definition) {
  return Object.setPrototypeOf({
    ...definition,
    id,
  }, itemBase)
}

function spawnItem(options) {
  const type = items[Math.floor(Math.random() * items.length)]
  return Object.create(type).spawn(options)
}
