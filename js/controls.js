'use strict'

const controls = (function IIFE() {
  const backward = document.querySelector('.o-app--backward'),
    forward = document.querySelector('.o-app--forward'),
    left = document.querySelector('.o-app--left'),
    right = document.querySelector('.o-app--right')

  const controls = {
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false,
    arrowUp: false,
    keyA: false,
    keyD: false,
    keyE: false,
    keyQ: false,
    keyS: false,
    keyW: false,
    uiBackward: false,
    uiForward: false,
    uiLeft: false,
    uiRight: false,
  }

  const keys = {
    37: 'arrowLeft',
    38: 'arrowUp',
    39: 'arrowRight',
    40: 'arrowDown',
    65: 'keyA',
    68: 'keyD',
    69: 'keyE',
    81: 'keyQ',
    83: 'keyS',
    87: 'keyW',
  }

  function deadzone(input, threshold = 0.25) {
    const ratio = (Math.abs(input) - threshold) / (1 - threshold),
      sign = input > 0 ? 1 : -1

    return ratio > 0 ? sign * ratio : 0
  }

  function getControlsState() {
    const moveBackward = controls.arrowDown || controls.keyS || controls.uiBackward,
      moveForward = controls.arrowUp || controls.keyW || controls.uiForward,
      strafeLeft = controls.keyA,
      strafeRight = controls.keyD,
      turnLeft = controls.arrowLeft || controls.keyQ || controls.uiLeft,
      turnRight = controls.arrowRight || controls.keyE || controls.uiRight

    let controlsLongitudinal = 0,
      controlsTransverse = 0

    if (moveBackward && !moveForward) {
      controlsLongitudinal = -1
    } else if (moveForward && !moveBackward) {
      controlsLongitudinal = 1
    }

    if (strafeLeft && !strafeRight) {
      controlsTransverse = -1
    } else if (strafeRight && !strafeLeft) {
      controlsTransverse = 1
    }

    const result = {}

    if (turnLeft && !turnRight) {
      result.rotate = 1
    } else if (turnRight && !turnLeft) {
      result.rotate = -1
    }

    if (controlsLongitudinal || controlsTransverse) {
      result.translate = {
        radius: 1,
        theta: Math.atan2(controlsLongitudinal, controlsTransverse),
      }
    }

    return result
  }

  function getGamepadState() {
    const gamepads = navigator.getGamepads(),
      sticks = []

    for (let i = 0, length = gamepads.length; i < length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue;
      }

      if (0 in gamepad.axes && 1 in gamepad.axes) {
        sticks[0] = {
          x: deadzone(gamepad.axes[0]),
          y: -deadzone(gamepad.axes[1]),
        }
      }
      if (2 in gamepad.axes && 3 in gamepad.axes) {
        sticks[1] = {
          x: deadzone(gamepad.axes[2]),
          y: -deadzone(gamepad.axes[3]),
        }
      }
    }

    if (sticks.length == 0) {
      return {}
    }

    if (sticks.length == 1) {
      return {
        rotate: -sticks[0].x,
        translate: {
          radius: Math.min(1, distance(0, 0, 0, sticks[0].y)),
          theta: Math.atan2(sticks[0].y, 0),
        },
      }
    }

    const translateY = Math.max(-1, Math.min(sticks[0].y + sticks[1].y, 1))

    return {
      rotate: -sticks[1].x,
      translate: {
        radius: Math.min(1, distance(0, 0, sticks[0].x, translateY)),
        theta: Math.atan2(translateY, sticks[0].x),
      },
    }
  }

  function onBackwardStart() {
    controls.uiBackward = true
  }

  function onBackwardStop() {
    controls.uiBackward = false
  }

  function onForwardStart() {
    controls.uiForward = true
  }

  function onForwardStop() {
    controls.uiForward = false
  }

  function onLeftStart() {
    controls.uiLeft = true
  }

  function onLeftStop() {
    controls.uiLeft = false
  }

  function onRightStart() {
    controls.uiRight = true
  }

  function onRightStop() {
    controls.uiRight = false
  }

  return {
    activate: () => {
      backward.addEventListener('mouseover', onBackwardStart)
      backward.addEventListener('touchstart', onBackwardStart)
      backward.addEventListener('mouseout', onBackwardStop)
      backward.addEventListener('touchend', onBackwardStop)

      forward.addEventListener('mouseover', onForwardStart)
      forward.addEventListener('touchstart', onForwardStart)
      forward.addEventListener('mouseout', onForwardStop)
      forward.addEventListener('touchend', onForwardStop)

      left.addEventListener('mouseover', onLeftStart)
      left.addEventListener('touchstart', onLeftStart)
      left.addEventListener('mouseout', onLeftStop)
      left.addEventListener('touchend', onLeftStop)

      right.addEventListener('mouseover', onRightStart)
      right.addEventListener('touchstart', onRightStart)
      right.addEventListener('mouseout', onRightStop)
      right.addEventListener('touchend', onRightStop)

      window.addEventListener('keydown', (e) => {
        if (e.which in keys) {
          controls[keys[e.which]] = true
        }
      })

      window.addEventListener('keyup', (e) => {
        if (e.which in keys) {
          controls[keys[e.which]] = false
        }
      })

      return this
    },
    get: () => {
      return {
        rotate: 0,
        translate: {
          radius: 0,
          theta: 0,
        },
        ...getGamepadState(),
        ...getControlsState(),
      }
    }
  }
})()
