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

  ws.onopen = () => {
    console.log('Connected.')
    interval = setInterval(() => {
      ws.send('ping')
    }, 10000)
  }

  ws.onclose = () => {
    console.log('Connect Closed.')
    clearInterval(interval)
  }

  ws.onerror = () => {
    console.log('Connect Error.')
    clearInterval(interval)
  }

  ws.onmessage = event => {
    if (event.data === 'ping') {
      ws.send('pong')
    } else if (JSON.parse(event.data) && JSON.parse(event.data).id === id) {
      const data = JSON.parse(event.data)
      tabs.set(id, {
        ...tabs.get(id),
        name: data.name,
        updated_at: data.updated_at,
      })

      currentPage.setAll(
        {
          updated_at: data.updated_at,
          name: data.name,
          type: data.type,
          content: data.content,
          options: data.options,
        },
        true
      )

      window.dispatchEvent(new Event('updateFileEvent'))
      window.dispatchEvent(new Event('updateViewEvent'))
    }
  }
}

const closeUpdate = () => {
  if (ws) {
    ws.close()
  }
}

export { updateFile, closeUpdate }
