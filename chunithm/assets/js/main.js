import van from "../../../commonassets/js/van-1.3.0.min.js"
import { musicsData, jacketURLbase } from "./constants.js"

const { button, div, img,  input, section } = van.tags

const inputArea = () => div(
    { class: "input-area" },
    input({ id: "song-name", type: "text", placeholder: "入力してください……" }),
    button({ id: "answer" }, "回答"),
)

const songsArea = () => {
    const songs = musicsData.map((m) => {
        return m.meta.genre === "ORIGINAL" ? img(
            { class: "music-jacket", src: jacketURLbase + md5(m.meta.title + m.meta.artist) + ".webp" },
        ) : null
    })
    return div(
        { class: "songs-area" },
        ...songs
    )
}

const app = section(
    {id: "main-play-area"},
    inputArea(),
    songsArea()
)

van.add(document.getElementsByTagName("main")[0], app)