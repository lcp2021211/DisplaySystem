document.addEventListener('switch', function(message) {
  console.log(message.detail)
  alert('event happening')
})
setTimeout(function() {
  const switchEvent = new CustomEvent('switch', {detail: 'url'})
  document.dispatchEvent(switchEvent)
}, 3000)