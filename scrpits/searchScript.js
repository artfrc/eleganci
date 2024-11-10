// search.js

document.addEventListener('DOMContentLoaded', () => {
   const searchInput = document.querySelector('.search-itens input');
   const cards = document.querySelectorAll('.card');

   searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();

      cards.forEach(card => {
         const itemName = card.querySelector('p').textContent.toLowerCase();
         
         if (itemName.includes(searchTerm)) {
            card.style.display = 'block';
         } else {
            card.style.display = 'none';
         }
      });
   });
});
