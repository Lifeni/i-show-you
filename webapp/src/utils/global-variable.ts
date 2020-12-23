const defaultFileOptions: IFileOptions = {
  auto_save: true,
  word_wrap: false,
  font_family:
    "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace",
  font_size: 14,
  line_height: 22,
}

const defaultNoticeOptions: INoticeOptions = {
  open: false,
  kind: 'info',
  title: 'Untitled Notice',
  subtitle: '只是一个通知占位符。',
}

export { defaultFileOptions, defaultNoticeOptions }
