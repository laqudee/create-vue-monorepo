/**
 * @description 将base64转换为文件,接收2个参数，第一是base64，第二个是文件名字
 * @param {*} dataurl
 * @param {*} filename
 * @returns 文件对象
 */
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

/**
 * 
 * @param {*} url 
 * @param {*} name 
 * @param {*} type 
 */
export const BlobFile = (url, name, type) => {
  let blob = new Blob([url], {
    type: type
  })
  let downloadElement = document.createElement('a')
  let href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = name // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
