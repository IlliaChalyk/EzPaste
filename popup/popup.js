;(() => {
  // TODO: implement Remove button function

  const valuesContainer = document.getElementById('values')
  chrome.storage.local.get().then((res) => {
    const sortedKeys = {}
    for (const key in res) {
      const { value, sortOrder } = res[key]
      sortedKeys[sortOrder] = { key, value }
    }

    console.log(sortedKeys)
    for (const i in sortedKeys) {
      const { key, value } = sortedKeys[i]
      console.log(key, value)
      const div = getSavedValueDiv(key, value)
      valuesContainer.appendChild(div)
    }
  })

  const addBtn = document.getElementById('add-btn')
  const keyInput = document.getElementById('key-input')
  const valueInput = document.getElementById('value-input')

  // TODO: prevent empty keys to save
  addBtn.addEventListener('click', (event) => {
    event.preventDefault()

    // TODO: check if value saved without errors
    chrome.runtime.sendMessage({
      type: 'createNewItem',
      values: {
        key: keyInput.value,
        value: valueInput.value,
      },
    })

    // TODO: do that only on success
    const div = getSavedValueDiv(keyInput.value, valueInput.value)
    valuesContainer.appendChild(div)

    keyInput.value = ''
    valueInput.value = ''
  })

  // TODO: refactor getSavedValueDiv
  const getSavedValueDiv = (key, value) => {
    const div = document.createElement('div')
    div.className = 'saved-value'

    const keyInput = document.createElement('input')
    keyInput.value = key
    keyInput.className = 'i'
    keyInput.disabled = true

    const valueInput = document.createElement('input')
    valueInput.value = value
    valueInput.className = 'i'
    valueInput.disabled = true

    const deleteBtn = document.createElement('button')
    deleteBtn.innerText = 'Remove'
    deleteBtn.classList = 'btn delete'

    div.appendChild(keyInput)
    div.appendChild(valueInput)
    div.appendChild(deleteBtn)

    return div
  }
})()
