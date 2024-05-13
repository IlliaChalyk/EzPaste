;(() => {
  // TODO: implement Remove button function

  const valuesContainer = document.getElementById('values')
  const inputContainer = document.getElementById('input-container')

  const errorMessage = document.getElementById('error-container')

  chrome.storage.local.get().then((res) => {
    const sortedKeys = {}
    for (const key in res) {
      const { value, sortOrder } = res[key]
      sortedKeys[sortOrder] = { key, value }
    }

    for (const i in sortedKeys) {
      const { key, value } = sortedKeys[i]
      const div = getSavedValueDiv(key, value)
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

    const div = getSavedValueDiv(keyInput.value, valueInput.value)
    valuesContainer.appendChild(div)
    div.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })

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

  const setErrorMessage = (message) => {
    errorMessage.innerText = `Error: ${message}`
    errorMessage.hidden = false
  }
})()
