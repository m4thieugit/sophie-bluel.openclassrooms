import APIRequester from './pasb.api_requester.js';
import ModalManager from './pasb.manager_modal.js';
import Toast from './pasb.utils_toast.js';

export default class MainContentManager {
    constructor() {
        this.API_Requester = new APIRequester();
        this.current_category = 0;
    }

    displayEditMode() {
        const body__main = document.querySelector('main');
        const project__info = document.querySelector('.project-info');
    
        // Bannière du mode d'édition
        const banner__section = document.createElement('section');
        banner__section.id = 'mode-info';
        const banner__icon = document.createElement('i');
        banner__icon.classList.add('fa-regular');
        banner__icon.classList.add('fa-pen-to-square');
        const banner__text = document.createElement('p');
        banner__text.innerText = 'Mode édition';
        banner__section.appendChild(banner__icon);
        banner__section.appendChild(banner__text);
        body__main.appendChild(banner__section);
    
        // Bouton d'ouverture de la modale
        const edit_button__link = document.createElement('a');
        edit_button__link.classList.add('edit-button');
        const edit_button__icon = document.createElement('i');
        edit_button__icon.classList.add('fa-regular');
        edit_button__icon.classList.add('fa-pen-to-square');
        const edit_button__text = document.createElement('p');
        edit_button__text.innerText = 'modifier';
        edit_button__link.appendChild(edit_button__icon);
        edit_button__link.appendChild(edit_button__text);
        edit_button__link.addEventListener('click', (e) => {
            e.preventDefault();
            new ModalManager('edit-works');
        })
    
        project__info.appendChild(edit_button__link);
    }

    async switchCategory(category = 0) {
        if (this.current_category === category) { return; }
        this.current_category = category;
        const categories = document.querySelectorAll('.filters .category');
    
        for (let i = 0; i < categories.length; i++) {
            category = categories[i];
            if (Number(category.getAttribute('category-id')) === this.current_category) {
                category.classList.add('active');
            } else {
                category.classList.remove('active');
            }
        }
        this.showWorks(this.current_category)
    }

    async showCategories(category = this.current_category) {
        try {
            const filters = document.querySelector('.filters');
    
            filters.innerHTML = '';
            const categories = await this.API_Requester.getCategories();
            const categorySwitcher = (categoryId) => this.switchCategory(categoryId);

            function createCategory(categoryId, categoryName, isActive = false) {
                const category__container = document.createElement('div');
                category__container.classList.add('category');
                category__container.setAttribute('category-id', categoryId);
                category__container.setAttribute('category-name', categoryName);
                category__container.addEventListener('click', () => categorySwitcher(categoryId));
    
                if (isActive) {
                    category__container.classList.add('active');
                }
    
                const category__title = document.createElement('h4');
                category__title.innerText = categoryName;
                category__container.appendChild(category__title);
    
                filters.appendChild(category__container);
            }
    
            createCategory(0, 'Tous', true);
            for (let i = 0; i < categories.length; i++) {
                let category = categories[i];
                createCategory(category.id, category.name, false);
            }
            
        } catch (err) {
            console.error(err);
            return new Toast('Erreur', 'Une erreur s\'est produite lors du chargement des catégories', 'error');
        }
    }
    
    async showWorks(category = this.current_category) {
        try {
            const gallery = document.querySelector('.gallery');
    
            gallery.innerHTML = '';
            const works = await this.API_Requester.getWorks();
            
            for (let i = 0; i < works.length; i++) {
                let work = works[i];
    
                if (category === 0 || work.category.id === category) {
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = work.imageUrl;
                    img.alt = work.title;
                    figure.appendChild(img);
    
                    const figcaption = document.createElement('figcaption');
                    figcaption.innerText = work.title;
                    figure.appendChild(figcaption);
    
                    gallery.appendChild(figure);
                }
            }
            
        } catch (err) {
            return new Toast('Erreur', 'Une erreur s\'est produite lors du chargement des travaux', 'error');
        }
    }    
};