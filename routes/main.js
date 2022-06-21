const update = document.querySelector('#update-button')

update.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'put'
  })
})