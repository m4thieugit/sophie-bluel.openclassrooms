import APIRequester from './pasb.api_requester.js';
import MainContentManager from './pasb.manager_content.js';
import Toast from './pasb.utils_toast.js';

export default class ModalManager {
    constructor(type) {
        this.API_Requester = new APIRequester();
        this.mainContentManager = new MainContentManager();
		this.type = type;
        this.types_available = ['edit-works', 'add-works'];
		if (!this.types_available.includes(this.type)) { return new Toast('Erreur', 'Une erreur s\'est produite lors du chargement des catégories', 'error'); }
        this._setup();
    }

    _setup() {
        if (this._alreadyExists) {
            return this.showModal();
        }

        const modal = document.createElement('div');
        modal.id = this.type;
        modal.classList.add('modal');

        const modal_content = document.createElement('div');
        modal_content.classList.add('modal-content');

        const modal_close_button = document.createElement('i');
        modal_close_button.classList.add('modal-close', 'fa-solid', 'fa-xmark');

        const modal_main_content = document.createElement('div');
        modal_main_content.classList.add('modal-main-content');

        modal_content.appendChild(modal_close_button);
        modal_content.appendChild(modal_main_content);
        modal.appendChild(modal_content);

        window.addEventListener('click', (e) => {
            if (e.target === modal || e.target === modal_close_button) {
                this.hideModal();
            }
        });

        document.body.appendChild(modal);
        this.switchModalContent();
    }

    switchModalContent(type = this.type) {
		if (!this.types_available.includes(type)) { return new Toast('Erreur', 'Une erreur s\'est produite lors du chargement des catégories', 'error'); }
        if (this.type !== type) { this.type = type; }

        switch (type) {
            case 'edit-works': 
                this._modalEditContent();
                break;
            case 'add-works': 
                this._modalAddContent();
                break;
        }

        this.showModal();
    }

    showModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    hideModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
    }

    async _modalEditContent() {
        this._resetModalContent();
        const modal_main_content = document.querySelector('.modal-main-content');

        function createSpace() {
            const modal_space = document.createElement('div');
            modal_space.classList.add('modal-space');
    
            modal_main_content.appendChild(modal_space);
        }

        createSpace();

        const modal_title = document.createElement('h2');
        modal_title.innerText = 'Galerie photo';
        modal_main_content.appendChild(modal_title);

        createSpace();

        const modal_works = document.createElement('div');
        modal_works.classList.add('modal-works');
        modal_main_content.appendChild(modal_works);

        try {
            const gallery = document.querySelector('.modal .modal-works');
            gallery.innerHTML = '';

            const works = await this.API_Requester.getWorks();
            
            for (let i = 0; i < works.length; i++) {
                let work = works[i];
                const modal_work = document.createElement('div');
                modal_work.classList.add('modal-work');
                modal_work.setAttribute('work-id', work.id);
                modal_work.setAttribute('work-name', work.title);

                const modal_work_delete_icon = document.createElement('i');
                modal_work_delete_icon.classList.add('modal-work-delete-icon', 'fa-solid', 'fa-trash-can');
                modal_work.appendChild(modal_work_delete_icon);
                modal_work_delete_icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.API_Requester.deleteWork(work.id)
                    .then(() => {
                        modal_work.remove();
                        new Toast('Travaux supprimés !', 'Les travaux ont bien été supprimés.', 'success');
                        this.mainContentManager.showCategories(0);
                        this.mainContentManager.showWorks();
                    })
                    .catch((err) => {
                        console.error(err);
                        new Toast('Erreur', 'Une erreur s\'est produite lors de la suppression des travaux', 'error')
                    });
                });

                const modal_work_img = document.createElement('img');
                modal_work_img.src = work.imageUrl;
                modal_work_img.alt = work.title;
                modal_work_img.classList.add('modal-work-img');
                modal_work.appendChild(modal_work_img);
                gallery.appendChild(modal_work);
            }
            
        } catch (err) {
            console.error(err)
            return new Toast('Erreur', 'Une erreur s\'est produite lors du chargement des travaux', 'error');
        }

        createSpace();

        const modal_separator = document.createElement('div');
        modal_separator.classList.add('modal-separator');
        modal_main_content.appendChild(modal_separator);

        createSpace();

        const modal_button = document.createElement('button');
        modal_button.classList.add('modal-button');
        modal_button.innerText = 'Ajouter une photo';
        modal_button.addEventListener('click', () => {
            this._modalAddContent();
        });
        modal_main_content.appendChild(modal_button);
    }

    async _modalAddContent() {
        this._resetModalContent();
        this._resetModalContent();
        const modal_content = document.querySelector('.modal-content');
        const modal_main_content = document.querySelector('.modal-main-content');

        const modal_return_button = document.createElement('i');
        modal_return_button.classList.add('modal-return', 'fa-solid', 'fa-arrow-left');
        modal_return_button.addEventListener('click', () => {
            modal_return_button.remove();
            this._modalEditContent();
        });
        modal_content.appendChild(modal_return_button);

        function createSpace(element = modal_main_content) {
            const modal_space = document.createElement('div');
            modal_space.classList.add('modal-space');
    
            element.appendChild(modal_space);
        }

        createSpace();


        /* -------------------------------------------------------------*/
        /* --------------- FORMULAIRE DE LA 2EME MODAL -----------------*/
        /* -------------------------------------------------------------*/


        const modal_form = document.createElement('form');
        modal_form.method = 'POST';
        modal_form.action = '#';
        modal_form.enctype = 'multipart/form-data';
        modal_form.runat = 'server';
        modal_form.classList.add('modal-add-work-form');

        const modal_title = document.createElement('h2');
        modal_title.innerText = 'Ajout photo';
        modal_form.appendChild(modal_title);

        /* -------------------------------------------------------------*/
        /* -------------------------------------------------------------*/
        /* ------------------- PREMIER CONTENAIRE ----------------------*/
        /* -------------------------------------------------------------*/
        /* -------------------------------------------------------------*/

        createSpace(modal_form);

        const modal_img_view_container = document.createElement('div');
        modal_img_view_container.classList.add('modal-img-view-container');
       
        /* -------------------------------------------------------------*/
        /* -------------------------- ICONE ----------------------------*/
        /* -------------------------------------------------------------*/

        const modal_img_view_container_icon = document.createElement('i');
        modal_img_view_container_icon.classList.add('modal-img-view-container-icon', 'fa-regular', 'fa-image');
        modal_img_view_container.appendChild(modal_img_view_container_icon);


        /* -------------------------------------------------------------*/
        /* ------------------- BOUTON D'AJOUT DE PHOTO -----------------*/
        /* -------------------------------------------------------------*/
        const modal_img_view_container_button = document.createElement('button');
        modal_img_view_container_button.classList.add('modal-img-view-container-button');
        modal_img_view_container_button.innerText = '+ Ajouter photo';
        modal_img_view_container_button.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                document.querySelector('.modal-img-view-container-input').click();
            } catch (err) { console.error(err) }
            return false;
        });
        
        modal_img_view_container.appendChild(modal_img_view_container_button);

        /* -------------------------------------------------------------*/
        /* ------------- DESCRIPTION DU BOUTON D'AJOUT -----------------*/
        /* -------------------------------------------------------------*/

        const modal_img_view_container_information = document.createElement('p');
        modal_img_view_container_information.classList.add('modal-img-view-container-information');
        modal_img_view_container_information.innerText = 'jpg, png : 4mo max';
        modal_img_view_container.appendChild(modal_img_view_container_information);

        /* -------------------------------------------------------------*/
        /* ------------------- INPUT INVISIBLE D'IMAGE  ----------------*/
        /* -------------------------------------------------------------*/

        const modal_img_view_container_image_input = document.createElement('input');
        modal_img_view_container_image_input.type = 'file';
        modal_img_view_container_image_input.accept = 'image/*';
        modal_img_view_container_image_input.name = 'image';

        modal_img_view_container_image_input.classList.add('modal-img-view-container-input');

        modal_img_view_container_image_input.addEventListener('change', (e) => {
            if (modal_img_view_container_image_input.files && modal_img_view_container_image_input.files[0]) {
                const reader = new FileReader();

                reader.addEventListener('load', (e) => {
                    const img_preview = document.createElement('img');
                    img_preview.src = e.target.result;
                    img_preview.alt = 'Image des travaux';
                    img_preview.classList.add('modal-form-data-img');
                    modal_img_view_container.appendChild(img_preview);
                    modal_img_view_container_icon.remove();
                    modal_img_view_container_information.remove();
                    modal_img_view_container_button.remove();
                });

                reader.readAsDataURL(modal_img_view_container_image_input.files[0]);
            }
        });

        modal_img_view_container.appendChild(modal_img_view_container_image_input);

        
        /* -------------------------------------------------------------*/
        /* -------------------------------------------------------------*/
        /* ------------------- SECOND CONTENAIRE -----------------------*/
        /* -------------------------------------------------------------*/
        /* -------------------------------------------------------------*/


        const modal_inputs_container = document.createElement('div');
        modal_inputs_container.classList.add('modal-inputs-container');

        /* -------------------------------------------------------------*/
        /* ------------------- INPUT DU NOM ----------------------------*/
        /* -------------------------------------------------------------*/

        const modal_inputs_container_title_label = document.createElement('label');
        modal_inputs_container_title_label.innerText = 'Titre';
        modal_inputs_container_title_label.for = 'title';

        const modal_inputs_container_title_input = document.createElement('input');
        modal_inputs_container_title_input.type = 'text';
        modal_inputs_container_title_input.name = 'title';
        modal_inputs_container_title_input.classList.add('modal-inputs-container-title');

        /* -------------------------------------------------------------*/
        /* ------------------- INPUT DES CATEGORIES --------------------*/
        /* -------------------------------------------------------------*/

        const modal_inputs_container_categories_label = document.createElement('label');
        modal_inputs_container_categories_label.innerText = 'Categorie';
        modal_inputs_container_categories_label.for = 'category';

        const modal_inputs_container_categories_select = document.createElement('select');
        modal_inputs_container_categories_select.name = 'category';
        modal_inputs_container_categories_select.classList.add('modal-inputs-container-categorie');

        this.API_Requester.getCategories()
            .then((categories) => {
                for (let i = 0; i < categories.length; i++) {
                    let category = categories[i];
                    let modal_inputs_container_categories_select_option = document.createElement('option');
                    modal_inputs_container_categories_select_option.value = category.id;
                    modal_inputs_container_categories_select_option.innerText = category.name;
                    modal_inputs_container_categories_select.appendChild(modal_inputs_container_categories_select_option);
                }
            })
            .catch((err) => {
                console.error(err);
                return new Toast('Erreur', 'Une erreur s\'est produite lors du chargement des catégories', 'error');
            });

        modal_inputs_container.appendChild(modal_inputs_container_title_label);
        modal_inputs_container.appendChild(modal_inputs_container_title_input);
        modal_inputs_container.appendChild(modal_inputs_container_categories_label);
        modal_inputs_container.appendChild(modal_inputs_container_categories_select);

        modal_form.appendChild(modal_img_view_container);
        modal_form.appendChild(modal_inputs_container);

        createSpace(modal_form);

        const modal_separator = document.createElement('div');
        modal_separator.classList.add('modal-separator');
        modal_form.appendChild(modal_separator);

        createSpace(modal_form);

        const modal_button = document.createElement('button');
        modal_button.classList.add('modal-button');
        modal_button.type = 'submit';
        modal_button.innerText = 'Valider';
        modal_form.appendChild(modal_button);

        modal_form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            if (!formData.has('image')) { return new Toast('L\'image n\'est pas renseignée !', 'Veuillez ajouter une image.', 'warn'); }
            if (!formData.has('title') || formData.get('title').trim() === '') { return new Toast('Le titre est invalide !', 'Veuillez ajouter un titre valide.', 'warn'); }
            if (!formData.has('category') || formData.get('category').trim() === '') { return new Toast('La catégorie est invalide !', 'Veuillez ajouter une catégorie valide.', 'warn'); }

            this.API_Requester.createWork(formData)
            .then((res) => {
                if (res.status < 200 || res.status > 201) {
                    new Toast('Echec', 'Veuillez vérifier les éléments du formulaire.', 'error');
                    return;
                }
                this.mainContentManager.showCategories(0);
                this.mainContentManager.showWorks();
                modal_return_button.remove();
                this._modalEditContent();
                new Toast('Travaux ajoutés !', 'La requête a parfaitement aboutie.', 'success');
            })
            .catch((err) => {
                console.error(err)
                new Toast('Erreur', 'Une erreur s\'est produite lors de l\'envoie de la requête.', 'error')
            });
        });

        modal_main_content.appendChild(modal_form);

    }

    _resetModalContent() {
        const modal = document.querySelector('.modal');
        modal.id = this.current_type;

        const modal_main_content = document.querySelector('.modal-main-content');
        modal_main_content.innerHTML = '';
    }

    get current_type() {
        return this.type;
    }

    get _alreadyExists() {
        const modal = document.querySelector('.modal');
        if (!modal) { return false; }
        else { return true; }
    }
};