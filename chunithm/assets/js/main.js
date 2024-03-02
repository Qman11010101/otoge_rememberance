import van from "../../../commonassets/js/van-1.3.0.min.js"
import { musicsDataRaw, jacketURLbase } from "./constants.js"

const { button, div, img, input, section } = van.tags

const musicsData = musicsDataRaw.map((m) => {
    return m.meta.genre === "ORIGINAL" || m.meta.genre === "イロドリミドリ" ? {
        title: m.meta.title,
        artist: m.meta.artist,
        jacket: "../../commonassets/img/unknown.png",
        lev_mas: m.data.MAS.const,
        found: false
    } : null
}
).filter((s) => s !== null)

const inputArea = () => div(
    { class: "input-area" },
    input({ id: "song-name", type: "text", placeholder: "入力してください……" }),
    button(
        {
            id: "answer",
            onclick: () => {
                const songName = document.getElementById("song-name").value
                for (let i = 0; i < musicsData.length; i++) {
                    if (musicsData[i].title === songName) {
                        musicsData[i].found = true
                        const title = musicsData[i].title
                        const artist = musicsData[i].artist
                        const jacket = jacketURLbase + md5(title + artist) + ".webp"
                        musicsData[i].jacket = jacket
                        const se = document.getElementById("songs-area")
                        se.children[i].setAttribute("src", jacket)
                        se.children[i].scrollIntoView({ behavior: "smooth" })
                        document.getElementById("song-name").value = ""
                        break
                    }
                }
            },
        },
        "回答"
    ),
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
    songsArea()
)

van.add(document.getElementsByTagName("main")[0], app)