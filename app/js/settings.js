/* eslint-env browser */
/* global volume, player2, player3, player5, player6, player10, subtitle1, subtitle3, torrent1, torrent2, torrent3, torrent4, torrent5, torrent7, torrent8, torrent9, other1, other2, setRes, settingsTab, regProtButton, clearRelCache */
import { relations } from './anime.js'
export const settingsElements = [
  volume, player2, player3, player5, player6, player10, subtitle1, subtitle3, torrent1, torrent2, torrent3, torrent4, torrent5, torrent7, torrent8, torrent9, other1, other2
]
setRes.addEventListener('click', restoreDefaults)
settingsTab.addEventListener('click', applySettingsTimeout)
volume.addEventListener('click', applySettingsTimeout)
regProtButton.addEventListener('click', registerProtocol)
export const settings = JSON.parse(localStorage.getItem('settings')) || {}
function restoreDefaults () {
  localStorage.removeItem('settings')
  location.reload()
}
let applyTimeout
function applySettingsTimeout () {
  clearTimeout(applyTimeout)
  applyTimeout = setTimeout(saveSettings, 500)
}
function saveSettings () {
  for (const element of settingsElements) {
    settings[element.id] = element.type === 'checkbox' ? element.checked : element.value
  }
  localStorage.setItem('settings', JSON.stringify(settings))
}

function renderSettings () {
  for (const setting of Object.entries(settings)) {
    const settingElement = settingsElements.filter(e => e.id === setting[0])[0]
    if (settingElement) settingElement.type === 'checkbox' ? settingElement.checked = setting[1] : settingElement.value = setting[1]
  }
}
function registerProtocol () {
  if ('registerProtocolHandler' in navigator) {
    navigator.registerProtocolHandler(
      'magnet',
      `${location.href.replace(location.hash, '')}#home&file=%s`,
      'Miru'
    )
  }
}

if (!Object.values(settings).length) {
  saveSettings()
  location.reload()
}
clearRelCache.onclick = () => {
  localStorage.removeItem('relations')
  relations = {}
}
renderSettings()

other1.onclick = () => Notification.requestPermission().then(perm => { perm === 'denied' ? other1.checked = false : other1.checked = true })

export const searchParams = new URLSearchParams(location.href)
if (searchParams.get('access_token')) {
  localStorage.setItem('ALtoken', searchParams.get('access_token'))
  window.location = '/app/#settingsTab'
}
export const userBrowser = (() => {
  if (window.chrome) {
    if (navigator.userAgent.indexOf('Edg') !== -1) {
      return 'edge'
    } else {
      return 'chromium'
    }
  }
  if (typeof InstallTrigger !== 'undefined') return 'firefox'
})()