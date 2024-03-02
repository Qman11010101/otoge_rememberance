import van from "../../../commonassets/js/van-1.3.0.min.js"
import { musicsDataRaw, jacketURLbase, officialMusicsData } from "./constants.js"
import { timeText } from "./utils.js"

const { button, div, img, input, section, span } = van.tags

function reading(title) {
    for (let i = 0; i < officialMusicsData.length; i++) {
        if (officialMusicsData[i].title === title) {
            return officialMusicsData[i].reading.replace(/ /g, "").replace(/　/g, "")
        }
    }
}

const musicsData = musicsDataRaw.map((m) => {
    return m.meta.genre === "ORIGINAL" || m.meta.genre === "イロドリミドリ" ? {
        title: m.meta.title.normalize("NFKC"),
        artist: m.meta.artist,
        reading: reading(m.meta.title),
        jacket: "../commonassets/img/unknown.png",
        release: new Date(m.meta.release).getTime() / 1000,
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
    const songNameElm = document.getElementById("song-name")
    let found = false
    for (let i = 0; i < musicsData.length; i++) {
        const songName = songNameElm.value
        if (musicsData[i].title === songName.normalize("NFKC")) {
            found = true

            // musicsData書き換え
            musicsData[i].found = true
            const title = musicsData[i].title
            const artist = musicsData[i].artist
            const jacket = jacketURLbase + md5(title + artist) + ".webp"
            musicsData[i].jacket = jacket

            // songs-area書き換え
            const se = document.getElementById("songs-area")
            for (let j = 0; j < se.children.length; j++) {
                if (se.children[j].getAttribute("data-title") === title) {
                    se.children[j].setAttribute("src", jacket)
                    se.children[j].scrollIntoView({ behavior: "smooth" })
                    break
                }
            }

            // 正解数書き換え
            const foundMusics = musicsData.filter((m) => m.found).length
            document.getElementById("found-musics").textContent = foundMusics
            document.getElementById("found-percentage").textContent = (foundMusics / musicsData.length * 100).toFixed(2)

            // inputリセット
            songNameElm.value = ""

            // 全曲発見したらタイマー停止
            if (foundMusics === musicsData.length) {
                stopTimer()
                isTimerRunning = false
            }
            break
        }
    }

    // ハズレ
    if (!found) {
        songNameElm.style.backgroundColor = "rgba(255, 0, 0, 0.7)"
        songNameElm.style.color = "white"
        setTimeout(() => {
            songNameElm.style.backgroundColor = "white"
            songNameElm.style.color = "black"
        }, 300)
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

function rewriteSongsArea() {
    const se = document.getElementById("songs-area")
    while (se.firstChild) {
        se.removeChild(se.firstChild)
    }
    for (let i = 0; i < musicsData.length; i++) {
        se.appendChild(
            img(
                {
                    class: "music-jacket",
                    "data-title": musicsData[i].title,
                    "data-artist": musicsData[i].artist,
                    "data-reading": musicsData[i].reading,
                    src: musicsData[i].jacket,
                }
            )
        )
    }
}

const hintButtons = () => div(
    { class: "hint-buttons" },
    button(
        {
            id: "order-name",
            onclick: () => {
                musicsData.sort((a, b) => a.title.localeCompare(b.title))
                rewriteSongsArea()
            },
        },
        "曲名順"
    ),
    button(
        {
            id: "order-release",
            onclick: () => {
                musicsData.sort((a, b) => a.release - b.release)
                rewriteSongsArea()
            },
        },
        "登場順"
    ),
    button(
        {
            id: "order-level",
            onclick: () => {
                musicsData.sort((a, b) => a.lev_mas - b.lev_mas)
                rewriteSongsArea()
            },
        },
        "MASTER定数順"
    )
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
                    "data-reading": musicsData[i].reading,
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
    hintButtons(),
    songsArea()
)

van.add(document.getElementsByTagName("main")[0], app)