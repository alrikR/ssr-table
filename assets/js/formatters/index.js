const formatUser = user => {
  return `${user.last_name} ${user.first_name}`
}

const formatNumber = number => {
  return new Intl.NumberFormat(window.navigator.language, { minimumFractionDigits: 2 }).format(number)
}


export {
  formatUser,
  formatNumber
}
