import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
let loadInterval;

function loader(element) {
  if (element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
      element.textContent += '.';
      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 300);
  }
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  const wrapperClass = isAi ? 'wrapper ai' : 'wrapper';

  return `
    <div class="${wrapperClass}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // User's chat stripe
  const uniqueIdUser = generateUniqueId();
  const userMessage = data.get('prompt');
  chatContainer.innerHTML += chatStripe(false, userMessage, uniqueIdUser);
  form.reset();

  // Bot's chat stripe
  const uniqueIdBot = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueIdBot);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueIdBot);
  loader(messageDiv);

  // Fetching data from the server
  try {
    const response = await fetch('https://web-gpt-5esa.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userMessage,
      }),
    });

    console.log('Server response:', response.status);
    clearInterval(loadInterval);
    if (messageDiv) {
      messageDiv.innerHTML = '';
    }

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.result;
      typeText(messageDiv, parsedData);
    } else {
      if (messageDiv) {
        messageDiv.innerHTML = 'Something went wrong, please try again';
      }
    }
  } catch (error) {
    console.error(error);
    if (messageDiv) {
      messageDiv.innerHTML = 'Something went wrong, please try again';
    }
  }
};

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
