import axios from "axios";

axios.defaults.headers.common["x-api-key"] = "live_dVOe4SoJ0jqQBfXP8snPYSvezEQXiVNnuVnmAp8rM82na2LpNvCU8Xw9S0UGreJj";

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');


async function populateBreedSelect() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    const breeds = response.data;
    
    const fragment = document.createDocumentFragment();
    
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      
      fragment.appendChild(option);
    });
    
    breedSelect.appendChild(fragment);
  } catch (error) {
    showError();
  }
}

function showLoader() {
  loader.style.display = 'block';
  breedSelect.disabled = true;
  catInfo.style.display = 'none';
  error.style.display = 'none';
}

function hideLoader() {
  loader.style.display = 'none';
  breedSelect.disabled = false;
}

function showError() {
  error.style.display = 'block';
  hideLoader();
}

async function showCatInfo(breedId) {
  showLoader();
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    const [cat] = response.data;
    catInfo.innerHTML = `
      <img src="${cat.url}" alt="${cat.breeds[0].name}">
      <h2>${cat.breeds[0].name}</h2>
      <p>${cat.breeds[0].description}</p>
      <p>Temperament: ${cat.breeds[0].temperament}</p>
    `;
    catInfo.style.display = 'block';
    hideLoader();
  } catch (error) {
    showError();
  }
}

breedSelect.addEventListener('change', event => {
  const selectedBreedId = event.target.value;
  if (selectedBreedId) {
    showCatInfo(selectedBreedId);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  populateBreedSelect();
});
