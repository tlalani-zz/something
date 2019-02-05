var items = new Map();
var colors = ['orange', 'lightblue', 'yellow'];
var open = -1;
const delay = t => new Promise(resolve => setTimeout(resolve, t));
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        showOptions();
        queryInventory();
    } else{
        showLogin();
    }
});

class Item {
    constructor(place, name) {
        this.place = place;
        this.name = name;
    }
}

function showLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("login_btn").style.display = "block";
    document.getElementById("login_out").style.display = "none";
    document.getElementById("some").style.display = "none"
  }
function showOptions() {
    document.getElementById("login").style.display = "none";
    document.getElementById("login_btn").style.display = "none";
    document.getElementById("login_out").style.display = "block";
    document.getElementById("some").style.display = "block"

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
            showInventory();
        }
    });
}

function showInventory() {
    var i = 0;
    var j = 0;
    var item_list = document.getElementById("item_list");
    for(var [key, val] of items.entries()) {
        var element = document.getElementById("list_"+i);
        if(element) {
            for(option of val) {
                var item = document.createElement("li");
                item.innerHTML = option;
                item.id = element.id+"_"+j;
                j++;
                item.style.display = "none"
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
                item.id = list.id+"_"+j;
                item.style.display = "none"
                list.appendChild(item);
            }
            list.onclick=displayItems;
            item_list.appendChild(list);
        }
        i = i + 1;
        j = 0;
    }
}

function displayItems() {
    for(element of event.srcElement.childNodes) {
        if(element.style) {
            if(element.style.display === "none" && open === -1) {
                element.style.display = "block"
            } else {
                if(open === 1) {
                    element.style.display = "none"
                }
            }
        }
    }
    open = -1 * open;
}

function searchItem() {
    var item = document.getElementById("search").value;
    item = item.replace(/\d/g, '').toLowerCase();
    var j = 0;
    for(var val of items.values()) {
        for(var i of val) {
            if(i.toLowerCase().includes(item)) {
                var e = document.getElementById("list_"+j);
                for(element of e.childNodes) {
                    if(element.innerHTML && element.innerHTML.includes(i)) {
                        window.scroll(0, 100);
                        var oldbg = e.style.backgroundColor;
                        e.style.backgroundColor = 'yellow'
                        element.style.display = "block"
                        scrollIt(e, 50, 'linear')
                        flash(element, e, oldbg)
                        break;
                    }
                }
            }
        }
        j++;
    }
}


function flash(element, e, oldbg) {
    var count = 0;
    var intervalId = setInterval(function() {
        if (element.style.visibility == 'hidden') {
            element.style.visibility = 'visible';
            if (count++ === 20) {
                clearInterval(intervalId);
                element.style.display = "none";
                e.style.backgroundColor = oldbg;
            }
        } else {
            element.style.visibility = 'hidden';
        }    
    }, 200);
}
