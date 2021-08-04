const alertSound = new Audio('./noti.mp3')

export function playSound() {
  console.log('Ding!')
  alertSound.play()
}
