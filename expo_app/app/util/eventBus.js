const listeners = new Map()

export const APP_EVENTS = {
  FAVORITES_UPDATED: 'favoritesUpdated',
}

export const emitEvent = (eventName, payload) => {
  const eventListeners = listeners.get(eventName)
  if (!eventListeners) {
    return
  }

  eventListeners.forEach((listener) => {
    try {
      listener(payload)
    } catch (listenerError) {
      console.error(`[eventBus] Error running listener for ${eventName}`, listenerError)
    }
  })
}

export const subscribeToEvent = (eventName, callback) => {
  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set())
  }

  const eventListeners = listeners.get(eventName)
  eventListeners.add(callback)

  return () => {
    eventListeners.delete(callback)
    if (eventListeners.size === 0) {
      listeners.delete(eventName)
    }
  }
}
