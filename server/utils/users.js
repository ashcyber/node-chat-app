// ES6 class Syntax OOPS
/********************* CLASS SYNTAX *****************/
// class Person {
//   // JS Constructor Syntax
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//
//   getUserText(){
//     return `${this.name} is ${this.age} year(s) old.`
//   }
// }
//

class Users {
  constructor() {
    // create an empty user list
    // add users to the list
    this.users = [];
  }

  addUser(sock_id, user_name, room_name){
    // Shorthand method of creating a user object
    // With the parameters passed in the curly braces
    var user = {sock_id, user_name, room_name};
    this.users.push(user);
    return user;
  }


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

  getUser(sock_id){
    var arr = this.users.filter((user) => {
      return user.sock_id === sock_id;
    });

    return arr[0];
  }


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



// var t = new Users();
// t.addUser(1,'ashcyber', 'go');
// t.addUser(3,'fd','go');
// console.log(t.removeUser(1));
// console.log(t.getUsersInRoom('go'));

module.exports = {Users};
