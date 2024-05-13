;(() => {
  const EZPASTE_MENU_ITEM_TITLE = 'EzPaste'
  const EZPASTE_MENU_ITEM_ID = 'ezpaste'
  const CONTEXTS = ['editable']

  chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      title: EZPASTE_MENU_ITEM_TITLE,
      contexts: CONTEXTS,
      id: EZPASTE_MENU_ITEM_ID,
    })

    chrome.storage.local.get().then((data) => {
      const sortedKeys = []
      for (const key in data) {
        const { sortOrder, value } = data[key]
        sortedKeys[sortOrder] = key
      }

      sortedKeys.forEach((key) => {
        chrome.contextMenus.create({
          title: key,
          contexts: CONTEXTS,
          id: key,
          parentId: EZPASTE_MENU_ITEM_ID,
        })
      })
    })
  })

  chrome.contextMenus.onClicked.addListener((event) => {
    const id = event.menuItemId
    chrome.storage.local.get([id]).then(async (data) => {
      const value = data[id].value
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })
      chrome.tabs.sendMessage(tab.id, { value })
    })
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    ;(async () => {
      if (request.type === 'createNewItem') {
        const { key, value } = request.values

        const existingKey = await chrome.storage.local.get([key])
        if (existingKey[key]) {
          console.warn(`key "${key}" already exists.`)

          return sendResponse({
            status: 'error',
            message: `key  "${key}" already exists`,
          })
        }

        const data = await chrome.storage.local.get()
        const count = Object.keys(data).length
        const sortOrder = count + 1

        chrome.storage.local.set({ [key]: { sortOrder, value } })
        chrome.contextMenus.create({
          title: key,
          contexts: CONTEXTS,
          id: key,
          parentId: EZPASTE_MENU_ITEM_ID,
        })

        sendResponse({
          status: 'success',
          message: `Key ${key} with value ${value} saved successfully`,
        })
      }
    })()

    return true
  })
})()
