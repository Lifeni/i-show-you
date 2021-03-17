const addBlank = (time: string) => {
  return new Date(time)
    .toLocaleString()
    .replace(/上午/, ' 上午 ')
    .replace(/下午/, ' 下午 ')
}

export { addBlank }
