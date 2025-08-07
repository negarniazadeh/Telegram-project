let users = JSON.parse(localStorage.getItem("users")) || [
    { id: 1, name: "Negar", image: "./assests/images/user2.png", userlasttext: "Hey, how are you today?", ourlasttext :"" },
    { id: 2, name: "Dad", image: "./assests/images/user4.png",  userlasttext: "Did you check my message?" , ourlasttext :""},
    { id: 3, name: "Zahra", image: "./assests/images/user1.png",  userlasttext: "I'm working on the project!" , ourlasttext :""},
    { id: 4, name: "Mom", image: "./assests/images/user5.png", userlasttext: "ok , honey." , ourlasttext :""},
    { id: 5, name: "Yasmin", image: "./assests/images/user3.png", userlasttext: "Can't wait for the trip!" , ourlasttext :""},
    { id: 6, name: "Reza", image: "../assests/images/user6.png", userlasttext: "Call me when you're free." , ourlasttext :""},
    { id: 7, name: "Ali", image: "./assests/images/user10.png", userlasttext: "Let’s grab coffee tomorrow." , ourlasttext :""},
    { id: 8, name: "Niloofar", image: "./assests/images/user8.png", userlasttext: "Meeting is at 3 PM sharp.", ourlasttext :"" },
    { id: 9, name: "Mina", image: "./assests/images/user9.png", userlasttext: "Check out this song!" , ourlasttext :""},
    { id: 10, name: "Nima", image: "./assests/images/user7.png", userlasttext: "Everything is going well!", ourlasttext :"" }
];
function getmessage(userid){
    let allmessage = JSON.parse(localStorage.getItem("messages")) || {};
    return allmessage[userid] || [];
} 

function savemessage(userid , messagetext){
    let allmessage = JSON.parse(localStorage.getItem("messages")) || {};

    if(!allmessage[userid]){
        allmessage[userid] = [];
    }

    allmessage[userid].push({
        text : messagetext,
        sender : "me",
    });

    localStorage.setItem("messages" , JSON.stringify(allmessage));

    let userindex = users.findIndex(user => user.id === userid);
    if(userindex !== -1){
        let [moveduser] = users.splice(userindex,1);
        moveduser.ourlasttext = messagetext;
        users.unshift(moveduser);
    }
    localStorage.setItem("users",JSON.stringify(users));
    rendercontacts(); 
}

selecteduser = null;

function rendercontacts(filteruser = users){
    let contactcontainer = document.getElementById("contact-div");

    contactcontainer.innerHTML = ""; 

    filteruser.forEach((user) =>{
        let contactdiv = document.createElement("div");
        contactdiv.className = "contact";

        if (user.id === selecteduser){
            contactdiv.classList.add("selected");
        }
        
        contactdiv.innerHTML =`
        <img src="${user.image}" alt="user" style="width: 80px; height: 80px;">
        <div class="Details">
        <strong>${user.name}</strong>
        <p>${user.ourlasttext || user.userlasttext}</p>
        </div>
        `
        contactdiv.addEventListener("click",()=>{
            document.querySelectorAll(".contact").forEach(c => c.classList.remove("selected"));
            contactdiv.classList.add("selected");

            selecteduser = user.id;

            openchat(user);
        });
        contactcontainer.appendChild(contactdiv);
    });
}
function  openchat(user){
    let chatheader = document.getElementById("chat-header");
    let chatbody = document.getElementById("chat-body");
    let textinput = document.querySelector(".chat-sendtext");
    let defultmessage = document.querySelector(".empty-message");

    chatheader.innerHTML="";
    chatbody.innerHTML="";

    if (defultmessage) {
        defultmessage.style.display = "none";
    }
    
    textinput.style.display = "block";

        let userinfo = document.createElement("div");
        userinfo.className="userinfo";
        userinfo.innerHTML=`
         <strong>${user.name}</strong>
         <img src="${user.image}" alt="user" style="width: 60px; height: 60px;">
        `
        let lasttext = document.createElement("div");
        lasttext.className="lasttext";
        lasttext.innerHTML=`
        <p>${user.userlasttext}</p>
        `

        chatheader.appendChild(userinfo);
        chatbody.appendChild(lasttext);

        let message = getmessage(user.id);
        message.forEach(msg =>{
            let msgdiv = document.createElement("div");
            msgdiv.className = msg.sender === "me" ? "my-message" : "lasttext";
            msgdiv.textContent = msg.text;
            chatbody.appendChild(msgdiv);
        });

        let sendbtn = document.getElementById("sendbtn");
        let input = document.getElementById("text");

        sendbtn.onclick = () => {
            let message = input.value.trim();
            if (message){
                savemessage(user.id , message);
                let msgDiv = document.createElement("div");
                msgDiv.className = "my-message";
                msgDiv.textContent = message;
                chatbody.appendChild(msgDiv);

                input.value = "";

                chatbody.scrollTop = chatbody.scrollHeight;
            }
        }
        selecteduser = user.id;
    
}

document.getElementById("search").addEventListener("input" , function(){
    let searchtext = this.value.trim().toLowerCase();

    let filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchtext)
    );
    rendercontacts(filtered);
});

rendercontacts();