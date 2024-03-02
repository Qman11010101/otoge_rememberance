import van from "../../../commonassets/js/van-1.3.0.min.js"

const { button, div, input, section } = van.tags

const inputArea = () => div(
    { class: "input-area" },
    input({ id: "song-name", type: "text", placeholder: "入力してください……" }),
    button({ id: "answer" }, "回答"),
)

const songsArea = () => div(
    { class: "songs-area" },
)

const app = section(
    {id: "main-play-area"},
    inputArea(),
    songsArea()
)

van.add(document.getElementsByTagName("main")[0], app)