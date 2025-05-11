const width = 300
const height = 300
const pointNumber = 10
const lineWidth = 10

const init = () => {
    // canvas の初期化のベストがわかってない
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    let time = 0
    const messageDiv = document.createElement('div')
    document.body.appendChild(messageDiv)
    messageDiv.textContent = `elapsed time: ${time} s`

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

    let startX = lastX
    let startY = lastY

    let interval = width * 0.9 / pointNumber
    // こいつをどうすればいいかわからん, というかなぜ y だけ準備する必要が？？
    // *2 -1 が意味あるのかと思ったが，-1 ~ 1 のレンジにしたかったってことなので当然ひつようだ
    let lastCpY = lastY + (Math.random() * 2 - 1) * 0.25 * height
    // この moveTo は初めてみたけど，なるほどなという感じがした
    // ベジエ曲線など書く時は一般的なんだろうか
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

    ctx.beginPath()
    ctx.arc(startX, startY, 15, 0, 2 * Math.PI)
    ctx.fillStyle = '#f00'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(lastX, lastY, 15, 0, 2 * Math.PI)
    ctx.fillStyle = '#0ff'
    ctx.fill()

    let isInGame = false
    let isGameOver = false
    canvas.onpointermove = (e) => {
        x = e.offsetX
        y = e.offsetY
        // これの後ろに data つけるのなんて，かえってくる情報知らないとできねえよな
        data = ctx.getImageData(x, y, 1, 1).data

        // この辺りの関数の入り組み方がやばすぎてついていけてない
        // そもそも onmove の中に tick とか入れるのはおかしくないか？とちょっと思ったが
        if (data[0] === 255 && data[1] === 0 && data[2] === 0) {
            isInGame = true
            const startTime = Date.now()
            const tick = () => {
                requestAnimationFrame(tick)
                if (!isGameOver) {
                    const elapsedTime = (Date.now() - startTime) / 1000
                    messageDiv.textContent = `elapsed time: ${elapsedTime.toFixed(2)} s`
                }
            }
            tick()
        }

        if (isInGame && !isGameOver) {
            if (data[2] !== 0) {
                isGameOver = true
            } else if (data[0] !== 255) {
                isGameOver = true
                gameover(x, y)
                return
            }
        }
    }

    const gameover = async (x, y) => {
        ctx.fillStyle = '#f00'
        ctx.lineWidth = '1px'
        for (let i = 0; i < 30; i++) {
            ctx.beginPath()
            ctx.arc(x, y, i, 0, Math.PI * 2)
            ctx.fill()
            await new Promise(r => setTimeout(r, 15))
        }
    }
}


window.onload = () => {
    init()
}