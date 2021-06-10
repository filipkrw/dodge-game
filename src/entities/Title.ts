import * as Two from 'twojs-ts'

export class Title {
  two: Two
  text: Two.Text
  offset: number

  constructor(two: Two, offset: number, size: number, layer: Two.Group) {
    this.offset = offset
    this.two = two
    this.text = new Two.Text('', two.width / 2, two.height / 2 + offset, {
      size: size,
      style: 'bold',
      fill: '#fff',
      visible: false,
    })
    layer.add(this.text)

    // @ts-ignore
    two.add(this.text)
  }

  center() {
    this.text.translation = new Two.Vector(this.two.width / 2, this.two.height / 2 + this.offset)
  }
}
