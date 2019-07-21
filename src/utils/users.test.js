const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

// Test
test('User with valid parameters are added successfully', ()=>{
    const user = {
        id: '12345',
        username: 'Deepak',
        room: 'Bangalore'
    };
    expect(addUser(user)).toHaveProperty('user');
});

test('User with invalid username are rejected', ()=>{
    const user = {
        id: '12345',
        username: '',
        room: 'Bangalore'
    };
    expect(addUser(user)).toHaveProperty('error');
});

test('User with invalid room are rejected', ()=>{
    const user = {
        id: '12345',
        username: 'Deepak',
        room: ' '
    };
    expect(addUser(user)).toHaveProperty('error');
});

test('Duplicate Users are rejected in a room', ()=>{
    const user = {
        id: '12345',
        username: 'Deepak',
        room: 'Bangalore'
    };
    addUser(user);
    expect(addUser(user)).toHaveProperty('error');
});

test('Duplicate Users are allowed in different rooms', ()=>{
    let user = {
        id: '12345',
        username: 'Deepak',
        room: 'Bangalore'
    };
    addUser(user);
    user.room = 'Chennai';
    expect(addUser(user)).toHaveProperty('user');
});

test('Remove User Works ok', ()=>{
    let user1 = {
        id: '12345',
        username: 'Deepak',
        room: 'Bangalore'
    };
    let user2 = {
        id: '12346',
        username: 'Shrusti',
        room: 'Bangalore'
    };
    let user3 = {
        id: '12347',
        username: 'Sneha',
        room: 'Bangalore'
    };
    addUser(user1); addUser(user2); addUser(user3);
    expect(removeUser('12347')).toHaveProperty('username', 'sneha');
})

test('Can get a user by id', () => {
    let user1 = {
        id: '12345',
        username: 'Deepak',
        room: 'Bangalore'
    };
    let user2 = {
        id: '12346',
        username: 'Shrusti',
        room: 'Bangalore'
    };
    let user3 = {
        id: '12347',
        username: 'Sneha',
        room: 'Bangalore'
    };
    addUser(user1); addUser(user2); addUser(user3);
    expect(getUser('12346')).toBeTruthy();
    expect(getUser('12348')).toBeFalsy();
})

test('Can get all users in a room', () => {
    let user1 = {
        id: '12345',
        username: 'Deepak',
        room: 'Bhubaneswar'
    };
    let user2 = {
        id: '12346',
        username: 'Shrusti',
        room: 'Bhubaneswar'
    };
    let user3 = {
        id: '12347',
        username: 'Sneha',
        room: 'New Jersey'
    };
    addUser(user1); addUser(user2); addUser(user3);
    expect(getUsersInRoom('Bhubaneswar')).toHaveLength(2);
})