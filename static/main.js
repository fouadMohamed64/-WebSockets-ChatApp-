const socket = io();

let totalPeople = document.getElementById("peoplesTotal");
let messageContainer = document.getElementById("messageContainer");
let nameInput = document.getElementById("nameInput");
let messageForm = document.getElementById("messageForm");
let messageInput = document.getElementById("messageInput");

console.log(messageContainer);

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("total-people", (data) => {
  totalPeople.innerHTML = `Total People: ${data}`;
});

function sendMessage() {
  if (messageInput.value == "") return;
  //   console.log(messageInput.value);
  let data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: [new Date()],
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chatMessage", (data) => {
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  let element = `
        <li class='${isOwnMessage ? "messageRight" : "messageLeft"}'>
          <p class="message">
            ${data.message}
            <span>${data.name} ${data.dateTime}</span>
          </p>
        </li>
        `;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typeing a message..`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typeing a message..`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: ``,
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  let element = `
        <li class="messageFeedBack">
          <p class="feedBack" id="feedBack">${data.feedback}</p>
        </li>
    `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  scrollToBottom();
  document.querySelectorAll("li.messageFeedBack").forEach((ele) => {
    ele.parentNode.removeChild(ele);
  });
}
