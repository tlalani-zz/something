var items = new Map();
var i = 0;
var colors = ['orange', 'lightblue'];
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        showOptions();
        queryInventory();
    }
});

class Item {
    constructor(place, name) {
        this.place = place;
        this.name = name;
    }
}

function showOptions() {
    document.getElementById("login").style.display = "none";
    document.getElementById("login_btn").style.display = "none";
    document.getElementById("login_out").style.display = "block";

}

function showLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("login_btn").style.display = "block";
    document.getElementById("login_out").style.display = "none";
  }
function showOptions() {
    document.getElementById("login").style.display = "none";
    document.getElementById("login_btn").style.display = "none";
    document.getElementById("login_out").style.display = "block";

}

function showLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("login_btn").style.display = "block";
    document.getElementById("login_out").style.display = "none";
  }

function queryInventory() {
    var db = firebase.database();
    db.ref("Inventory").once('value', function(snapshot) {
        if(snapshot) {
            snapshot.forEach(roomSide => {
                console.log(roomSide.key);
                roomSide.forEach(area => {
                    if((typeof area.val()) !== "object" && (area.val().length === undefined || area.val().length === null)) {
                        if(items[roomSide.key]) {
                            items[roomSide.key].push(area.val());
                        } else {
                            items.set(roomSide.key, []);
                            items[roomSide.key].push(area.val());
                        }
                    }
                    area.forEach(shelf => {
                        if((typeof shelf.val()) !== "object" && shelf.val().toString().split(",").length < 2){
                            var index = roomSide.key+"/"+area.key;
                            if(items.get(index)) {
                                items.get(index).push(shelf.val());
                            } else {
                                items.set(index, [])
                                items.get(index).push(shelf.val());
                            }
                        }
                        shelf.forEach(side => {
                            if(typeof side.val() !== "object" && side.val().toString().split(",").length < 2) {
                                var index = roomSide.key+"/"+area.key+"/"+shelf.key;
                                if(items.get(index)) {
                                    items.get(index).push(side.val())
                                } else {
                                    items.set(index, [])
                                    items.get(index).push(side.val());
                                }
                            }
                            side.forEach(item => {
                                var index = roomSide.key+"/"+area.key+"/"+shelf.key+"/"+side.key;
                                if(items.get(index)) {
                                    items.get(index).push(item.val());
                                } else {
                                    items.set(index, [])
                                    items.get(index).push(item.val());
                                }
                            })
                        })
                    })
                })
            });
        }
    })
}

function showInventory() {
    var item_list = document.getElementById("item_list");
    for(var [key, val] of items.entries()) {
        var element = document.getElementById("list_"+i);
        if(element) {
            for(option of val) {
                var item = document.createElement("li");
                item.innerHTML = option;
                item.style.display = "none"
                element.onclick = function(element) {
                    console.log(element.childNodes)
                }
                element.appendChild(item);   
            }
        } else {
            var list = document.createElement("ul")
            var indicies = colors.length;
            list.innerHTML = key;
            list.id = "list_"+i;
            list.style.backgroundColor=colors[i % indicies];
            for(option of val) {
                var item = document.createElement("li")
                item.innerHTML = option;
                item.style.display = "none"
                list.appendChild(item);
            }
            list.onclick=displayItems;
            item_list.appendChild(list);
        }
        i = i + 1;
    }
}

function displayItems() {
    console.log(event.srcElement.childNodes)
    for(element of event.srcElement.childNodes) {
        if(element.style) {
            if(element.style.display === "none") {
                element.style.display = "block"
            } else {
                element.style.display = "none"
            }
        }
    }
}