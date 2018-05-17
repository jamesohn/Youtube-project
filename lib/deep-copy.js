const copyObj = obj => {
  let copy = {}

  if (typeof obj === 'object' && obj != null) {
    for (attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = copyObj(obj[attr])
      }
    }
  } else {
    return copy = obj
  }
  return copy
}

module.exports = copyObj
