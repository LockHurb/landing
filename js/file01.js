import { fetchFakerData } from './functions.js';
import { saveVote } from './firebase.js';

const renderCards = (items) => {
    const container = document.getElementById('skeleton-container');
    if (!container) return;
    container.innerHTML = '';
    items.slice(0, 3).forEach(({ title, author, genre, content }) => {
        const card = `
            <div class="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
                <h3 class="text-xl font-bold mb-2 text-blue-700">${title}</h3>
                <p class="text-gray-600 mb-1"><span class="font-semibold">Autor:</span> ${author}</p>
                <p class="text-gray-500 mb-3"><span class="font-semibold">Género:</span> ${genre}</p>
                <p class="text-gray-700">${content}</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
};

const loadData = async () => {
    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';
    const result = await fetchFakerData(url);
    if (result.success) {
        renderCards(result.body.data);
    } else {
        console.error(result.error);
    }
};

const enableForm = () => {
    const form = document.getElementById('form_voting');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const select = document.getElementById('select_product');
        if (!select) return;
        const productID = select.value;
        const result = await saveVote(productID);
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
        form.reset();
    });
};

(() => {
    loadData();
    enableForm();
})();