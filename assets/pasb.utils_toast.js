export default class Toast {
	constructor(title, description, type) {
		this.title = title;
		this.description = description;
		this.types_available = ['success', 'warn', 'error'];
		this.type = type;
		if (!this.types_available.includes(this.type)) { throw new Error('Le type de toast n\'est pas reconnu.'); }
		this._setup();
		this.makeToast();
	}

	_setup() {
		if (document.getElementById('toats-container')) { return; }
		let toast__container = document.createElement('div');
		toast__container.id = 'toats-container';
		let style = document.createElement('style');
		style.innerHTML = `
			#toats-container {
				position: fixed;
				top: 0;
				right: 0;
				max-width: 600px;
				overflow-x: hidden;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 15px;
				gap: 10px;
				z-index: 2;
			}
			.toast {
				max-width: 100%;
				width: 600px;
				color: #ffffff;
				box-shadow: 0px 1px 7px 0px rgb(0 0 0 / 30%);
				animation: slideFromRight 1s normal forwards;
			}
			.toast h1 {
				text-transform: uppercase;
			}
			.toast h1, .toast p {
				color: #ffffff;
				font-family: Arial, sans-serif;
			}
			@media screen and (max-width: 768px) {
				#toats-container, .toast { max-width: 95%; }
				#toats-container { padding: 15px 0px 15px 15px; }
			}
			@keyframes slideFromRight {
				0% {
					opacity: 0;
					transform: translateX(200px);
				}
				100% {
					opacity: 1;
					transform: translateX(0px);
				}
			}
			.toast.success .toast-content-secondary {
				background-color: #4ac16a;
			}
			.toast.warn .toast-content-secondary {
				background-color: #d38800;
			}
			.toast.error .toast-content-secondary {
				background-color: #FF0000;
			}
			.toast-content {
				display: flex;
				background-color: #333333;
			}
			.toast-content-primary {
					padding: 15px;
			}
			.toast-title, .toast-description {
					margin: 10px;
					text-align: left;
			}
			.toast-content-secondary {
					height: auto;
					width: 100px;
					justify-content: center;
					align-items: center;
					display: flex;
					background-color: #363636;
			}
			.toast-progression {
					max-width: 100%;
					width: 100%;
					height: 10px;
					background-color: #5c5c5c;
			}
			.toast-progression-bar {
					width: 100%;
					height: 10px;
					background-color: #ffbc00;
			}
			.close-button {
					font-size: 25px;
					cursor: pointer;
					font-weight: 700;
			}
      	`;
		document.body.appendChild(style);
		document.body.appendChild(toast__container);
	}

	removeToast(target) {
		let toast = target.closest('.toast');
		toast.remove();
	}
	
	makeToast() {
		const toast__container = document.getElementById('toats-container');

		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.classList.add(this.type);

		const toast__content = document.createElement('div');
		toast__content.classList.add('toast-content');

		const toast__content__secondary = document.createElement('div');
		toast__content__secondary.classList.add('toast-content-secondary');

		const toast__content__close__button = document.createElement('i');
		toast__content__close__button.classList.add('fa-solid');
		toast__content__close__button.classList.add('fa-circle-info');
		toast__content__close__button.classList.add('close-button');
		toast__content__close__button.addEventListener('click', (e) => this.removeToast(e.target));
		toast__content__secondary.appendChild(toast__content__close__button);

		toast__content.appendChild(toast__content__secondary);

		const toast__content__primary = document.createElement('div');
		toast__content__primary.classList.add('toast-content-primary');

		const toast__content__title = document.createElement('h1');
		toast__content__title.classList.add('toast-title');
		toast__content__title.innerText = this.title;
		toast__content__primary.appendChild(toast__content__title);

		const toast__content__description = document.createElement('p');
		toast__content__description.classList.add('toast-description');
		toast__content__description.innerText = this.description;
		toast__content__primary.appendChild(toast__content__description);

		toast__content.appendChild(toast__content__primary);

		const toast__progression = document.createElement('div');
		toast__progression.classList.add('toast-progression');
		toast__progression.style.maxWidth = '100%';

		const toast__progression__bar = document.createElement('div');
		toast__progression__bar.classList.add('toast-progression-bar');
		toast__progression__bar.style.maxWidth = '0%';
		toast__progression.appendChild(toast__progression__bar);


		let i = 0;
		let interval = setInterval(() => {
			i++;
			toast__progression__bar.style.maxWidth = i + '%';
			if (i === 100) {
				this.removeToast(toast);
				return clearInterval(interval);
			}
		}, 35);

		toast.appendChild(toast__content);
		toast.appendChild(toast__progression);
		toast__container.appendChild(toast);
	}
};