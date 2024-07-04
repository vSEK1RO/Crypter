export function uploadFile(callback) {
    const elem = window.document.createElement('input');
    elem.type = 'file';
    document.body.appendChild(elem);
    elem.onchange = () => {
        let res = elem.files[0]
        document.body.removeChild(elem)
        callback(res)
    }
    elem.oncancel = () => {
        document.body.removeChild(elem)
    }
    elem.click();
}