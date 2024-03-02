import van from "../../../commonassets/js/van-1.3.0.min.js"
import { musicsDataRaw, jacketURLbase } from "./constants.js"
import { timeText } from "./utils.js"

const { button, div, img, input, section, span } = van.tags

const musicsData = musicsDataRaw.map((m) => {
    return m.meta.genre === "ORIGINAL" || m.meta.genre === "イロドリミドリ" ? {
        title: m.meta.title,
        artist: m.meta.artist,
        jacket: "../commonassets/img/unknown.png",
        release: m.meta.release,
        lev_mas: m.data.MAS.const,
        found: false
    } : null
}
).filter((s) => s !== null)

let timerId
let spentTime = 0
let isTimerRunning = false
function startTimer() {
    timerId = setInterval(() => {
        spentTime += 1
        document.getElementById("timer").textContent = timeText(spentTime)
    }, 1000)
    isTimerRunning = true
}

function stopTimer() {
    clearInterval(timerId)
}

function search() {
    const songName = document.getElementById("song-name").value
    for (let i = 0; i < musicsData.length; i++) {
        if (musicsData[i].title === songName) {
            // musicsData書き換え
            musicsData[i].found = true
            const title = musicsData[i].title
            const artist = musicsData[i].artist
            const jacket = jacketURLbase + md5(title + artist) + ".webp"
            musicsData[i].jacket = jacket

            // songs-area書き換え
            const se = document.getElementById("songs-area")
            se.children[i].setAttribute("src", jacket)
            se.children[i].scrollIntoView({ behavior: "smooth" })

            // 正解数書き換え
            const foundMusics = musicsData.filter((m) => m.found).length
            document.getElementById("found-musics").textContent = foundMusics
            document.getElementById("found-percentage").textContent = (foundMusics / musicsData.length * 100).toFixed(2)

            // inputリセット
            document.getElementById("song-name").value = ""

            // 全曲発見したらタイマー停止
            if (foundMusics === musicsData.length) {
                stopTimer()
                isTimerRunning = false
            }
            break
        }
    }
}

const inputArea = () => div(
    { class: "input-area" },
    input({
        id: "song-name",
        type: "text",
        placeholder: "入力してください……",
        oninput: () => {
            if (!isTimerRunning) startTimer()
        },
        onkeydown: (e) => {
            if (e.key === "Enter") search()
        }
    }),
    button(
        {
            id: "answer",
            onclick: search
        },
        "回答"
    ),
)

const timer = () => {
    return div(
        span("経過時間: "),
        span({ id: "timer", class: "display-big" }, "00:00:00")
    )
}

const progress = () => {
    return div(
        span("正解数: "),
        span({ id: "found-musics", class: "display-big" }, "0"),
        span({ class: "display-big" }, " / "),
        span({ class: "display-big" }, musicsData.length),
        span(" ("),
        span({ id: "found-percentage" }, "0"),
        span("%)")
    )
}

const displayArea = () => div(
    { class: "display-area" },
    timer(),
    progress()
)

const songsArea = () => {
    let songs = []
    for (let i = 0; i < musicsData.length; i++) {
        songs.push(
            img(
                {
                    class: "music-jacket",
                    "data-title": musicsData[i].title,
                    "data-artist": musicsData[i].artist,
                    src: musicsData[i].jacket,
                }
            )
        )
    }
    return div(
        { class: "songs-area", id: "songs-area" },
        ...songs
    )
}

const app = section(
    { id: "main-play-area" },
    inputArea(),
    displayArea(),
    songsArea()
)

van.add(document.getElementsByTagName("main")[0], app)