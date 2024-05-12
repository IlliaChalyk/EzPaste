;(() => {
  // TODO: implement Remove button function

  const valuesContainer = document.getElementById('values')
  chrome.storage.local.get().then((res) => {
    for (const key in res) {
      const div = getSavedValueDiv(key, res[key])
      valuesContainer.appendChild(div)
    }
  })

  const addBtn = document.getElementById('add-btn')
  const keyInput = document.getElementById('key-input')
  const valueInput = document.getElementById('value-input')

  addBtn.addEventListener('click', (event) => {
    event.preventDefault()
    chrome.runtime.sendMessage({
      type: 'createNewItem',
      values: {
        key: keyInput.value,
        value: valueInput.value,
      },
    })

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
