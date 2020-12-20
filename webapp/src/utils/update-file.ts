import store from 'store2'

let ws: WebSocket

const updateFile = async (id: string) => {
  const currentPage = store.namespace(id)
  const tabs = store.namespace('tabs')

  ws = new WebSocket(
    `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${
      window.location.host
    }/websocket/file/${id}`
  )

  let interval: number

  ws.onopen = event => {
    console.log('Connected.')
    interval = setInterval(() => {
      ws.send('ping')
    }, 10000)
  }

  ws.onclose = event => {
    console.log('Connect Closed.')
    clearInterval(interval)
  }

  ws.onerror = event => {
    console.log('Connect Error.')
    clearInterval(interval)
  }

  ws.onmessage = event => {
    if (event.data === 'ping') {
      ws.send('pong')
    } else if (JSON.parse(event.data) && JSON.parse(event.data).id === id) {
      const data = JSON.parse(event.data)
      tabs.set(
        id,
        JSON.stringify({
          ...JSON.parse(tabs.get(id)),
          name: data.name,
          updated_at: data.updated_at,
        })
      )

      currentPage.set('updated-at', data.updated_at, true)
      currentPage.set('name', data.name, true)
      currentPage.set('type', data.type, true)
      currentPage.set('content', data.content, true)
      window.dispatchEvent(new Event('updateStorage'))
    }
  }
}

const closeUpdate = () => {
  if (ws) {
    ws.close()
  }
}

export { updateFile, closeUpdate }
