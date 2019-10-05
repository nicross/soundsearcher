const position = (function IIFE() {
  const position = {
    angle: 0,
    x: 0,
    y: 0,
  }

  const vector = {
    rotation: 0,
    velocity: 0,
  }

  const acceleration = {
    rotation: (1 / 60) * (2 * Math.PI) / 12,
    velocity: 1 / 100,
  }

  const maxVector = {
    rotation: (2 * Math.PI) / 12,
    velocity: 1,
  }

  function step() {
    state = controls.getState()

    if (state.movingForward) {
      if (vector.velocity < 0) {
        vector.velocity = 0
      }
      if (vector.velocity < maxVector.velocity) {
        vector.velocity += acceleration.velocity
      }
    } else if (state.movingBackward) {
      if (vector.velocity > 0) {
        vector.velocity = 0
      }
      if (vector.velocity < maxVector.velocity) {
        vector.velocity -= acceleration.velocity
      }
    } else if (vector.velocity >= acceleration.velocity) {
      vector.velocity -= acceleration.velocity
    } else if (vector.velocity > 0) {
      vector.velocity = 0
    } else if (vector.velocity <= -acceleration.velocity) {
      vector.velocity += acceleration.velocity
    } else if (vector.velocity < 0) {
      vector.velocity = 0
    }

    if (state.turningLeft) {
      if (vector.rotation < 0) {
        vector.rotation = 0
      }
      if (vector.rotation < maxVector.rotation) {
        vector.rotation += acceleration.rotation
      }
    } else if (state.turningRight) {
      if (vector.rotation > 0) {
        vector.rotation = 0
      }
      if (vector.rotation < maxVector.rotation) {
        vector.rotation -= acceleration.rotation
      }
    } else if (vector.rotation >= acceleration.rotation) {
      vector.rotation -= acceleration.rotation
    } else if (vector.rotation > 0) {
      vector.rotation = 0
    } else if (vector.rotation <= -acceleration.rotation) {
      vector.rotation += acceleration.rotation
    } else if (vector.rotation < 0) {
      vector.rotation = 0
    }

    position.angle += vector.rotation
    position.x += vector.velocity * Math.cos(position.angle)
    position.y += vector.velocity * Math.sin(position.angle)

    window.requestAnimationFrame(step)
  }

  window.requestAnimationFrame(step)

  return {
    get: () => ({
      angle: position.angle,
      x: position.x,
      y: position.y,
    }),
    getVector: () => ({
      rotation: vector.rotation,
      velocity: vector.velocity,
    }),
  }
})()
