const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


//cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const overlay = document.querySelector('.overlay');
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const longGoodsList = document.querySelector('.long-goods-list');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');

//goods
const getGoods = async () => {
	const result = await fetch('db/db.json')
	if(!result){
		throw  'false ' + result.status;
	}
	return await result.json();
}

//modal
const cart = {
	cartGoods: [
		{
			id: "099",
			name: "watch",
			price: 999,
			count: 2,
		},
		{
			id: "090",
			name: "boots",
			price: 9,
			count: 3,
		},
	],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
			        <td>${name}</td>
					<td>${price}$</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${count * price}$</td>
					<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
        });
		const totalPrice = this.cartGoods.reduce((sum, item) => {
              return sum + item.price * item.count;
		}, 0);
		cardTableTotal.textContent = totalPrice + "$";
	},
	addCartGood(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if(goodItem){
			this.plusGood(id);
		}else{
			getGoods()
			.then(data => data.find(item => item.id === id))
			.then(({id, name, price}) => {
				this.cartGoods.push({
					id,
					name,
					price,
					count: 1,
				})
			});
		};
	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				if(item.count <= 1){
					this.deleteGood(id);
				}else{
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	if(addToCart){
      cart.addCartGood(addToCart.dataset.id)
	}
})
cartTableGoods.addEventListener('click', e => {
 const target = e.target;
 if(target.tagName === "BUTTON"){
	const id = target.closest('.cart-item').dataset.id;
	if ( target.classList.contains('cart-btn-delete')){
		cart.deleteGood(id);
	 };
	 if ( target.classList.contains('cart-btn-minus')){
		cart.minusGood(id);
	 };
	 if ( target.classList.contains('cart-btn-plus')){
		cart.plusGood(id);
	 };
  }

});

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
};
const closeModal = () => {
   modalCart .classList.remove('show');	
};
buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', (event) => {
  const target = event.target;
  if(target.classList.contains('overlay') || target.classList.contains('modal-close')){
	closeModal();
  }
});
//scroll smooth
(function(){
	const scrollLink = document.querySelectorAll('a.scroll-link');
	for(const scrollLin of scrollLink){
		scrollLin.addEventListener('click', event => {
			 event.preventDefault();
			 const id = scrollLin.getAttribute('href');
			 document.querySelector(id).scrollIntoView({
				 behavior: 'smooth',
				 block: 'start',
			 })
		});
	}
})();

// create card

const createCard = function({label, name, img, description, id, price}) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	card.innerHTML = `
	            <div class="goods-card">
				${label ? `<span class="label">${label}</span>` : ''}
					<img src="db/${img}" alt="${name}">
					<h3 class="goods-title">${name}</h3>
					<p class="goods-description">${description}</p>
					<button class="button goods-card-btn add-to-cart" data-id=${id}>
						<span class="button-price">$${price}</span>
					</button>
				</div>
	`;
	 return card;
};

const renderCards = function(data){
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};

const showAll = e => {
	e.preventDefault();
	getGoods().then(renderCards);
}
viewAll.forEach(function(elem){
	elem.addEventListener("click", showAll)
});



const filterCards = function(field, value){
	getGoods()
	.then(data => data.filter(good => good[field] === value))
	.then(renderCards);
};


navigationLink.forEach(function(link){
	link.addEventListener('click', e => {
         e.preventDefault();
		 const field = link.dataset.field;
		 const value = link.textContent;
		 filterCards(field, value);
	})
});
showAcsessories.forEach(item => {
	item.addEventListener("click", e => {
		e.preventDefault();
		filterCards('category', 'Accessories');
	});
});
showClothing.forEach(item => {
	item.addEventListener("click", e => {
		e.preventDefault();
		filterCards('category', 'Clothing');
	});
});
