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
const modalClose = document.querySelector('.modal-close');
const overlay = document.querySelector('.overlay');


const openModal = function(){
	modalCart.classList.add('show');
};
const closeModal = function(e){
	if(e.target == modalCart || e.target ==modalClose){
		this.classList.remove('show');
	}	
};
buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', closeModal);
//scroll smooth
(function(){
	const scrollLink = document.querySelectorAll('a.scroll-link');
	for(let i = 0; i < scrollLink.length; i++){
		scrollLink[i].addEventListener('click', function(event){
			 event.preventDefault();
			 const id = scrollLink[i].getAttribute('href');
			 document.querySelector(id).scrollIntoView({
				 behavior: 'smooth',
				 block: 'start',
			 })
		});
	}
})();
