const generateMessage = function(messageText, user) {
    //console.log(user);
    return {
        user,
        text: messageText,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = function(locationUrl, user) {
    return {
        user,
        locationUrl,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}