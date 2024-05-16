;(() => {
  chrome.runtime.onMessage.addListener(function (request) {
    const input = document.activeElement
    const initialValue = input.value
    const leftPart = initialValue.substring(0, input.selectionStart)
    const rightPart =
      input.selectionEnd - input.selectionStart > 0
        ? initialValue.substring(input.selectionEnd, initialValue.length)
        : ''

    input.value = `${leftPart}${request.value}${rightPart}`
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
})()
