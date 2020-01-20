window.onload = loadNotes();

let arrItems1 = [];
let arrItems2 = [];
let arrItems3 = [];

// Create new Vue instance
var app = new Vue({
    el: "#app",
    data: {
        title: "Todos",
        work: arrItems1,
        home: arrItems2,
        studies: arrItems3,
        select: 'work'
    },
    methods: {
        addTodo(e) {
            const item = e.target.value

            fetch("todos/add", {
                mode: 'cors',
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    item: item,
                    category: app.select
                })
            })
                .then(res => {
                    if(res.redirected) {
                        $("ul").html("");
                        loadNotes();
                    }
                })
            e.target.value = ""
        },
        removeTodo(id) {
            this.work = this.work.filter(todo => todo.id !== id)
            this.home = this.home.filter(todo => todo.id !== id)
            this.studies = this.studies.filter(todo => todo.id !== id)
            fetch("todos/delete/" + id, {
                method: "DELETE",
                headers: { "content-type": "application/json" }
            })
        },
        check(todo) {
            // Visual display without refresh page
            todo.done = !todo.done
            // Save change to variable
            let checked = todo.done;
            // PUT change
            fetch("todos/update/" + todo.id, {
                mode: 'cors',
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    checked: checked
                })
            })
        }
    }
})

function loadNotes() {
    /*let urls = [
        "todos?category=Home",
        "todos?category=Work",
        "todos?category=Studies"
    ];*/

    let urls = ["todos"];

    Promise.all(urls.map(url =>
        fetch(url)
            .then(data => data.json())
    ))
        .then(res => {
            res.forEach(e => {
                e.forEach(item => {
                    let cat = item.category.toLowerCase();
                    switch (cat) {
                        case "work":
                            arrItems1.push({ item: item.item, done: item.checked, id: item._id, category: item.category });
                            break;
                        case "home":
                            arrItems2.push({ item: item.item, done: item.checked, id: item._id, category: item.category });
                            break;
                        case "studies":
                            arrItems3.push({ item: item.item, done: item.checked, id: item._id, category: item.category });
                            break;
                    }
                })
            })
        })
        .catch((err) => {
            console.log("Error: ", err);
        })
}

$("#addBtn").click(function () {
    $("#addBar").toggle();
    if ($("#addBar").is(":visible")) {
        $("#addBtn").html("-");
    } else {
        $("#addBtn").html("+");
    }
});

$(function() {
    let viewPort = $(window).width();
    if(viewPort < 450) {
        $("h1").css("font-size", "20px");
    }
})