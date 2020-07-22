// file 文件体
const getBaseFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (e) => reject(e)
    })
}

export const getImageShowUrl = async (file) => {
    const itemFile = { ...file }
    if (!itemFile.url && !itemFile.prewUrl) {
        itemFile.prewUrl = await getBaseFile(itemFile.originFileObj)
    }
    return itemFile.url || itemFile.prewUrl
}

export const returnOssUrl = (key) => {
    const host = window.location.host;
    let hostName = ''
    if (host.indexOf('dev') > -1 || host.indexOf('daily') > -1 || host.indexOf('localhost') > -1) {
        hostName = `https://test-static.xinc818.com/${key}`
    } else {
        hostName = `https://static.xinc818.com/${key}`
    }
    return hostName
}
