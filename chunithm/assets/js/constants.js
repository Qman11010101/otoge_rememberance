export const jacketURLbase = "https://reiwa.f5.si/musicjackets/chunithm/"

const musicsURL = "https://reiwa.f5.si/chunirec_all.json"
export const musicsDataRaw = await (await fetch(musicsURL)).json()

const officialMusicsURL = "https://reiwa.f5.si/chunithm_official.json"
export const officialMusicsData = await (await fetch(officialMusicsURL)).json()