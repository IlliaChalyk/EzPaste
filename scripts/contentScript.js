;(() => {
  chrome.runtime.onMessage.addListener(function (request) {
    //TODO: add check if element is editable
    el = document.activeElement
    el.value = request.value
  })
})()
