const flattenObj = obj => {
  let flattened = {}

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattened = { ...flattened, ...flattenObj(obj[key]) }
    } else {
      flattened[key] = obj[key]
    }
  })

  return flattened
}

export {
  flattenObj
}
