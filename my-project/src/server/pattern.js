module.exports = {
  judgeUser: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/,
  judgePassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
}
