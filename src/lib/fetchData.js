
export default function fetchData(key, callback) {
  Tabletop.init({
    key,
    callback,
    simpleSheet: false
  })
}