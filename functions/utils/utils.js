exports.isOrangePhoneNumber = function (phonenumber) {
    const regexOrange = /6(9([0-9])|5([5-9]))[0-9]{6}$/;
    return phonenumber.match(regexOrange)
}

exports.isMTNPhoneNumber = function (phonenumber) {
    const regexMTN = /6(7([0-9])|(8|5)([0-4]))[0-9]{6}$/
    return phonenumber.match(regexMTN)
}