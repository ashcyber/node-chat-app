// ES6 class Syntax OOPS
/********************* CLASS SYNTAX *****************/



// Creating the user class
// For storing users data
class Users {
  constructor() {
    // create an empty user list
    // add users to the list
    // stores users across rooms
    this.users = [];
  }

  addUser(sock_id, user_name, room_name){
    // Shorthand method of creating a user object
    // With the parameters passed in the curly braces
    // Each user has three attributes namely:
    var user = {sock_id, user_name, room_name};
    this.users.push(user);
    return user;
  }

  // This removeUser method
  // filters the array removing user with matching id
  // Returns the remove user object
  removeUser (sock_id) {
    // return the user remove from the list

    // Get the user with the matching id
    var user = this.getUser(sock_id);

    //filter the orignal arr to remove when socket_id === id;
    if (user){
      this.users = this.users.filter((user) => {
        return user.sock_id !== sock_id;
      });
    }

    return user;
  }

  // Gets the user with the matching id
  // Returns the first element of the array
  // as filter returns an array 
  getUser(sock_id){
    var arr = this.users.filter((user) => {
      return user.sock_id === sock_id;
    });

    return arr[0];
  }

  // Returns a list of uses that are in the room
  getUsersInRoom(room_name){
    var arr = this.users.filter((user) => {
      return user.room_name === room_name;
    });


    var arr_names = arr.map((user) => {
      return user.user_name;
    });

    return arr_names;
  }
}

// Just like methods
// Classes can also be exported
// This method is then implemented in Server.js
module.exports = {Users};
