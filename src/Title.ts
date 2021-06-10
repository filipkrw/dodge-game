import * as Two from 'twojs-ts'

export class Title {
  text: Two.Text

  constructor(two: Two, offset: number, size: number) {
    this.text = new Two.Text('', two.width / 2, two.height / 2 + offset, {
      size: size,
      style: 'bold',
      fill: '#fff',
      visible: false,
    })

    // @ts-ignore
    two.add(this.text)
  }
}
