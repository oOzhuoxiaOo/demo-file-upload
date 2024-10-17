let uploadBtnDom  =  document.querySelector('.upload-btn') // 上传按钮
let fileInputDom = document.querySelector('.file-input') // 文件输入框
let pendingBoxDom = document.querySelector('.pending-status') // 待上传区域 dom
let resolveBoxDom = document.querySelector('.resolve-status') // 上传成功区域 dom
let deleteBtnDom =  document.querySelector('.delete-btn') // 删除按钮
let imgDom = document.querySelector('.o-img') // 上传图片展示区域
let submitBtnDom = document.querySelector('.submit-btn') // 提交按钮
let fileNameDom = document.querySelector('.resolve-status .name') // 文件名展示区域


// 上传的文件Blob对象
let targetFile = null
let defaultImgUrl = imgDom.src

// 校验文件 【支持格式：doc、docx、pdf、png，最大10M】
function checkFile(file) {
    let type = file.type
    let size = file.size
    let typeReg = /doc|docx|pdf|png/
    if (!typeReg.test(type)) {
        alert('文件格式不支持')
        return false
    }
    if (size > 10 * 1024 * 1024) {
        alert('文件大小不能超过10M')
        return false
    }
    return true
}

// 校验文件是否是图片png
function checkImage(file) {
    let type = file.type
    let typeReg = /png/
    if (!typeReg.test(type)) {
        return false
    }
    return true
}

// 控制相关dom显隐
function toggleVisibility() {
    pendingBoxDom.classList.toggle('hidden')
    resolveBoxDom.classList.toggle('hidden')
    submitBtnDom.classList.toggle('hidden')
}

// 上传按钮点击事件
uploadBtnDom.addEventListener('click', function() { 
    fileInputDom.click()
})

// 文件输入框change事件
fileInputDom.addEventListener('change', function() {
    if(!checkFile(this.files[0])) return
    targetFile = this.files[0]
    // 创建一个文件读取对象
    let reader = new FileReader()
    // 读取文件
    reader.readAsDataURL(targetFile)
    // 读取完毕后，如果是图片，将图片显示到页面上，如果不是则显示默认图片
    reader.onload = function() {
        toggleVisibility()
        imgDom.src = checkImage(targetFile) ?  reader.result : defaultImgUrl
        console.log(fileNameDom,targetFile)
        fileNameDom.innerText = targetFile.name
    }
})


// 删除按钮点击事件
deleteBtnDom.addEventListener('click', function() {
    targetFile = null
    toggleVisibility()
    imgDom.src = ''
})

// 提交按钮点击事件
submitBtnDom.addEventListener('click', function() {
    let formData = new FormData()
    formData.append('file', targetFile)
    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(res => res.json())
    .then(res => {
        // 上传后回调
        console.log(res)
    })
    .catch(err => {
        // 异常错误处理 （网络、异常）
        console.log(err)
    })
})
