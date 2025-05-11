const width = 300
const height = 300
const pointNumber = 10
const lineWidth = 10

const init = () => {
    // canvas の初期化のベストがわかってない
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    // これを書いて初めて黒く塗りつぶされる
    // ここからがお絵描きの始まりだ
    // なるほど普通に難しいぞこれは
    // 理解しました，interval が何個かあって，その間ごとに controllPoint があるということでね

    let lastX = width * 0.05
    let lastY = (Math.random() * 0.5 + 0.25) * height
    let interval = width * 0.9 / pointNumber
    // こいつをどうすればいいかわからん, というかなぜ y だけ準備する必要が？？
    // *2 -1 が意味あるのかと思ったが，-1 ~ 1 のレンジにしたかったってことなので当然ひつようだ
    let lastCpY = lastY + (Math.random() * 2 - 1) * 0.25 * height
    ctx.moveTo(lastX, lastY)

    // うんまあやってることは理解したけど，なんでそんな書き方？と納得はしてない
    // ベジエ曲線をつなげて書こうとすると，これが定石なのかもしれない
    for (let i = 0; i < pointNumber; i++) {
        let cp1X = lastX + interval / 3
        let cp1Y = lastY + (lastY - lastCpY)
        let x = lastX + interval
        let y = (Math.random() * 0.5 + 0.25) * height
        let cp2X = lastX + interval / 3 * 2
        let cp2Y = lastY + (Math.random() * 2 - 1) * 0.25 * height

        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y)
        lastX = x
        lastY = y
        // こいつを指定し忘れると結構カクカクになる
        lastCpY = cp2Y
    }
    ctx.strokeStyle = '#ff0'
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

window.onload = () => {
    init()
}