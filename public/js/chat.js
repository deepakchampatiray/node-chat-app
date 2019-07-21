const socket = io();
const postMessage = document.querySelector('#postMessage')
const messageBox = document.querySelector('#message')
const sendLocation = document.querySelector('#sendLocation')
const messageForm = document.querySelector('.type_area > form')
const messages = document.querySelector('div.messages');
const sidebar = document.querySelector('div#sidebar');
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.on('message', (message) => {
    console.log(`Message Received :`, message)
    message.createdAt = moment(message.createdAt).format('lll');
    const html = Mustache.render(messageTemplate, message);
    messages.insertAdjacentHTML('beforeend', html);
});
socket.on('locationMessage', (locationMessage) => {
    console.log(`Message Received :`, locationMessage);
    locationMessage.createdAt = moment(locationMessage.createdAt).format('lll');
    const html = Mustache.render(locationMessageTemplate, locationMessage);
    messages.insertAdjacentHTML('beforeend', html);
});
socket.on('room-data', ({room, users}) => {
    console.log(room, users);
    sidebar.innerHTML = Mustache.render(sidebarTemplate, {room, users});
})

messageForm.addEventListener('submit', (e)=>{
    socket.emit('client-message', messageBox.value, (acknowledgement) => {
        console.log('Ack', acknowledgement);
    });
    messageBox.value = '';
    e.preventDefault();
})

sendLocation.addEventListener('click', ()=>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            if(position && position.coords) {
                socket.emit('sendLocation', {'lat': position.coords.latitude, 'long': position.coords.longitude})
            }
        })
    } else {
        alert('This feature is not supported on your browser.');
        return;
    }
})

socket.emit('join', {username, room});