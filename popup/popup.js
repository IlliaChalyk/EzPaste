;(() => {
  const valuesContainer = document.getElementById('values')
  const errorMessage = document.getElementById('error-container')

  chrome.storage.local.get().then((res) => {
    const sortedKeys = {}
    for (const idx in res) {
      if (idx === 'lastItemId') {
        continue
      }
      const { key, value } = res[idx]
      sortedKeys[idx] = { key, value }
    }

    for (const idx in sortedKeys) {
      const { key, value } = sortedKeys[idx]
      const div = getSavedValueDiv(key, value, idx)
      valuesContainer.appendChild(div)
    }
  })

  const addBtn = document.getElementById('add-btn')
  const keyInput = document.getElementById('key-input')
  const valueInput = document.getElementById('value-input')

  addBtn.addEventListener('click', async (event) => {
    event.preventDefault()

    errorMessage.hidden = true
    if (!keyInput.value.trim().length) {
      setErrorMessage('key cannot be empty!')
      return
    }

    const response = await chrome.runtime.sendMessage({
      type: 'createNewItem',
      values: {
        key: keyInput.value,
        value: valueInput.value,
      },
    })

    if (response.status === 'error') {
      setErrorMessage(response.message)
      return
    }

    const itemId = response.itemId
    const div = getSavedValueDiv(keyInput.value, valueInput.value, itemId)
    valuesContainer.appendChild(div)
    div.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })

    keyInput.value = ''
    valueInput.value = ''
  })

  // TODO: refactor getSavedValueDiv
  const getSavedValueDiv = (key, value, itemId) => {
    const div = document.createElement('div')
    div.className = 'saved-value'
    div.id = itemId

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
    deleteBtn.addEventListener('click', handelRemoveEntry)

    div.appendChild(keyInput)
    div.appendChild(valueInput)
    div.appendChild(deleteBtn)

    return div
  }

  const handelRemoveEntry = (event) => {
    const btn = event.srcElement
    const itemId = btn.parentElement.id
    chrome.runtime.sendMessage({
      type: 'deleteItem',
      itemId: itemId,
    })

    btn.parentElement.remove()
  }

  const setErrorMessage = (message) => {
    errorMessage.innerText = `Error: ${message}`
    errorMessage.hidden = false
  }
})()
