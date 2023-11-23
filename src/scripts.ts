import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";

// const dateFormated = format(new Date(), "dd.MM.yyyy");
const cardWrapper = document.querySelector<HTMLDivElement>(".js-card-wrapper");
const cardForm = document.querySelector(".js-card-form");

type Card = {
  id: number;
  name: string;
  description: string;
  description2: string;
  description3: string;
  date: number;
};

const drawCards = () => {
  const result = axios.get<Card[]>("http://localhost:3004/cards");
  cardWrapper.innerHTML = "";
  result.then(({ data }) => {
    data.forEach((card) => {   
          
      cardWrapper.innerHTML += `
      <div class="card-content-wrapper">      
      <img class="card__image" src="assets/images/emoticon.png">
      <h1 class="card__heading">${card.name}</h1>
      <p class="card__description">${card.description}</p>
      <p class="card__description">${card.description2}</p>
      <p class="card__description">${card.description3}</p>
      <div class="card-button-wrapper">
      <button class="js-card-delete card__button" data-card-id="${card.id}">Delete</button>
      <button class="js-card-edit card__button" data-card-id="${card.id}">Edit</button>
      </div>
      <div "card__post-date-wrapper">      
      <p class="card__post-date">Created: ${formatDistanceToNow(new Date(card.date), { locale: enUS })} ago</p> 
      </div>        
      </div>
      `; 
    });     
      
    const cardDeleteButtons =
      document.querySelectorAll<HTMLButtonElement>(".js-card-delete");
    cardDeleteButtons.forEach((cardBtn) => {
      cardBtn.addEventListener("click", () => {
        const { cardId } = cardBtn.dataset;
        // destructuring
        // const id = cardBtn.dataset;
        // console.log(cardBtn.dataset.cardId);

        axios.delete<Card>(`http://localhost:3004/cards/${cardId}`).then(() => {
          drawCards();
        });
      });
    });
  });
};

drawCards();

cardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cardNameInput =
    cardForm.querySelector<HTMLInputElement>('input[name="card"]');
  const cardNameInputValue = cardNameInput.value;

  const cardDescriptionInput = cardForm.querySelector<HTMLInputElement>(
    'input[name="card-description"]'
  );
  const cardDescriptionInputValue = cardDescriptionInput.value;

  const cardDescription2Input = cardForm.querySelector<HTMLInputElement>(
    'input[name="card-description2"]'
  );
  const cardDescription2InputValue = cardDescription2Input.value;
  
  const cardDescription3Input = cardForm.querySelector<HTMLInputElement>(
    'input[name="card-description3"]'
  );
  const cardDescription3InputValue = cardDescription3Input.value;

  axios
    .post<Card>("http://localhost:3004/cards", {
      name: cardNameInputValue,
      description: cardDescriptionInputValue,
      description2: cardDescription2InputValue,
      description3: cardDescription3InputValue,
      date: new Date(),
    })

    .then(() => {
      cardNameInput.value = "";
      cardDescriptionInput.value = "";
      cardDescription2Input.value = "";
      cardDescription3Input.value = "";
      drawCards();
    });
});
