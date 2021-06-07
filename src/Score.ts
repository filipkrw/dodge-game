import * as Two from 'twojs-ts'

export class Score {
  two: Two
  score = 0
  scoreText: Two.Text

  constructor(two: Two) {
    this.two = two
    this.scoreText = new Two.Text(`Score: ${this.score}`, 60, 70, {
      size: 32,
      alignment: 'left',
      fill: '#fff',
    })

    // @ts-ignore
    two.add(this.scoreText)
  }

  update() {
    this.scoreText.value = `Score: ${this.score}`
  }

  increment() {
    this.score++
  }
}
