/**
 * Placeholder service request to demonstrate the shared services layer.
 */
export const placeholderService = async (delayMs = 300) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true }), delayMs)
  })
