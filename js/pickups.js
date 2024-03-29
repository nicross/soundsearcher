'use strict'

const pickups = (function IIFE() {
  const things = [
    compass,
    ...shuffle(resonators),
  ]

  const pickupRadius = 1,
    pickupRelocate = GRID_LENGTH * 2

  let nextPickup = 0,
    pickupSpawned = false,
    rewardSpawned = false

  return {
    activate: () => {
      pickupSpawned = true
      spawn(footsteps, nextSpawnLocation(GRID_LENGTH / 4, Math.PI / 4, -Math.PI / 8))
    },
    update: ({d, x, y}) => {
      objects.filter((object) => {
        return !object.isCollected && object.isCollectible
      }).forEach((object) => {
        const dTo = distance(x, y, object.x, object.y)

        if (dTo <= pickupRadius) {
          object.pickup()
          pickupSpawned = false
          nextPickup = d + randomBetween(GRID_LENGTH, GRID_LENGTH * 2)
        } else if (dTo >= pickupRelocate && !rewardSpawned) {
          const moveTo = nextSpawnLocation(GRID_LENGTH, Math.PI / 2, -Math.PI / 4)
          object.x = moveTo.x
          object.y = moveTo.y
        }
      })

      if (!pickupSpawned && d >= nextPickup && things.length) {
        pickupSpawned = true
        spawn(things.shift(), nextSpawnLocation(GRID_LENGTH / 2, Math.PI / 2, -Math.PI / 4))
      }

      if (!pickupSpawned && !rewardSpawned && !things.length) {
        rewardSpawned = true
        spawn(arpeggiator, {x: 0, y: 0})
      }

      return this
    }
  }
})()
