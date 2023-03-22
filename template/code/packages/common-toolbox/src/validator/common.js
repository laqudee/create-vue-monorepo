export function isMobile(rule, value) {
  if (!rule.required && !value) {
    return true
  }
  const reg = /^1[34578][0-9]\d{8}$/
  return reg.test(value)
}

export function isMobileAsync(rule, value, callback) {
  const reg = /^1[34578][0-9]\d{8}$/
  const msg = '您输入的手机号不合法，请重新输入'

  if (!rule.required && !value) callback()
  const valid = reg.test(value)
  if (valid) callback()
  callback(new Error(rule.message || msg))
}

export function isEmail(rule, value) {
  if (!rule.required && !value) {
    return true
  }
  const reg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  return reg.test(value)
}

export function isEmailAsync(rule, value, callback) {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+\.([a-zA-Z0-9_-]+)/
  const msg = '您输入的邮箱地址不正确，请重新输入'

  if (!rule.required && !value) callback()
  const match = value.match(reg)
  const valid = match && match[1].length > 1
  if (valid) callback()
  callback(new Error(rule.message || msg))
}

// 姓名中文校验
export function isNameAsync(rule, value, callback) {
  if (!rule.required && !value) {
    callback()
  }
  let reg = /^[\u4e00-\u9fa5]{2,4}$/
  if (!reg.test(value)) {
    callback(new Error('姓名不合法，请重新输入'))
  }
  callback()
}
