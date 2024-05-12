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
      for (const key in data) {
        chrome.contextMenus.create({
          title: key,
          contexts: CONTEXTS,
          id: key,
          parentId: EZPASTE_MENU_ITEM_ID,
        })
      }
    })
  })

  chrome.contextMenus.onClicked.addListener((event) => {
    const id = event.menuItemId
    chrome.storage.local.get([id]).then(async (data) => {
      const value = data[id]
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })
      chrome.tabs.sendMessage(tab.id, { value })
    })
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { key, value } = request.values

    // TODO: implement proper duplicate check
    chrome.storage.local.get([key]).then(async (res) => {
      if (typeof res != 'undefined') {
        console.warn(`key "${res}" already exists.`)

        return sendResponse({
          status: 'error',
          message: `key  "${res}" already exists`,
        })
      }
    })

    // TODO: add sorted order
    chrome.storage.local.set({ [key]: value })
    chrome.contextMenus.create({
      title: key,
      contexts: CONTEXTS,
      id: key,
      parentId: EZPASTE_MENU_ITEM_ID,
    })
  })
})()