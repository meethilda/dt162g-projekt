window.onload = loadNotes();

function loadNotes() {
    /*try {
        let [home, work, studies] = Promise.all([
            fetch("http://localhost:3000/todos?category=Home"),
            fetch("http://localhost:3000/todos?category=Work"),
            fetch("http://localhost:3000/todos?category=Studies")
        ])
    }
    catch(err) {
        console.log(err);
    }*/
    let urls = [
        "http://localhost:3000/todos?category=Home",
        "http://localhost:3000/todos?category=Work",
        "http://localhost:3000/todos?category=Studies"
    ];

    Promise.all(urls.map(url =>
        fetch(url)
            .then(data => data.json())
    ))
        .then(res => {
            res.forEach(e => {
                $(".container").append(`
                <div class="notes" id="note-${e[0].category}">
                    <h2 class="toggle ${e[0].category}">${e[0].category}</h2>
                    <ul id="${e[0].category}">
                        <li v-for="item in items">{{ item.item }}</li>
                    </ul>
                </div>
                `);

                let hideVue = `#note-${e[0].category}`;
                let elVue = `#${e[0].category}`;
                let arrItems = [];

                // Create new Vue instance
                var showThem = new Vue({
                    el: elVue,
                    data: {
                        // Items array
                        items: arrItems
                    }
                })
                // Create new Vue instance
                /*var hideThem = new Vue({
                    el: hideVue,
                    data: {
                        // Items array
                        //items: arrItems,
                        isHidden: false
                    }
                })*/

                $(".toggle." + e[0].category).click(function() {
                    $(elVue).toggle("slow", function() {

                    });
                });
                
                e.forEach(item => {
                    arrItems.push({item: item.item});
                })
            })
        })
    // Get items
    /*fetch("http://localhost:3000/todos")
        .then(data => data.json())
        .then(res => {
            // Create array
            let arrItems = [];
            // Foreach response
            res.forEach(e => {
                // Create object
                let itemObj = {item: e.item};
                // Push to array
                arrItems.push(itemObj);
            })
            // Create new Vue instance
            var showThem = new Vue({
                el: '#vue',
                data: {
                    // Items array
                    items: arrItems
                }
            })
        });*/
};

function addItem() {
    
}
