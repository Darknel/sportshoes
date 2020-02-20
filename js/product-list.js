class ProductList {
  constructor(cart) {
    this.cart = cart;
    this.container = document.querySelector('.products-wrapper');
    this.productService = new ProductsService();
    this.productService
      .getProducts()
      .then(() => this.renderProducts())
      .then(() => this.addEventListeners());
  }
  async renderProducts() {
    let productListDomString = '';
    const products = await this.productService.getProducts();
    products.forEach(product => {

      productListDomString += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                  <div class="products-card card product">
                  <span class="products-badge badge badge-dark">${product.badge}</span>
                    <div class="products-card-head d-flex flex-column">
                      <p class="products-price products-price--new" id="productsPriceNew">$${product.newPrice}</p>
                      <p class="products-price products-price--old" id="productsPriceOld">$${product.oldPrice}</p>
                      <p class="products-price products-price--current" id="">$${product.oldPrice}</p>
                    </div>
                    <img class="card-img-top" src="img/${product.image}" 
                        alt="${product.title}">
                    <div class="products-card-body card-body d-flex flex-column">
                      <ul class="products-description list-group list-group-flush">
                        <li class="products-description__item text-uppercase text-bold list-group-item">${product.gender}</li>
                        <li class="products-description__item list-group-item">${product.description}</li>
                        <li class="products-description__item list-group-item">${product.idNumber}</li>
                      </ul>
                      <button class="btn products-btn-info" data-toggle="modal" data-target="#productInfoModal" data-id="${product.id}"></button>
                    </div>
                  </div>
                </div>`;
    });
    this.container.innerHTML = productListDomString;
  }
  addEventListeners() {
    document
      .querySelectorAll('.product .products-btn-info')
      .forEach(button =>
        button.addEventListener('click', event =>
          this.handleProductInfoClick(event)
        )
      );
    document
      .querySelectorAll(
        '.card.product button.buy, #productInfoModal button.buy'
      )
      .forEach(button =>
        button.addEventListener('click', event =>
          this.handleProductBuyClick(event)
        )
      );
  }
  async handleProductInfoClick(event) {
    const button = event.target; // Button that triggered the modal
    const id = button.dataset.id; // Extract info from data-* attributes
    const product = await this.productService.getProductById(id);
    const modal = document.querySelector('#productInfoModal');
    const productImg = modal.querySelector('.modal-body .card-img-top');
    productImg.setAttribute('src', 'img/' + product.image);
    productImg.setAttribute('alt', product.title);
    modal.querySelector('.modal-body .card-title').innerText = product.title;
    modal.querySelector('.modal-body .card-text').innerText = product.description;
    const btnBuy = modal.querySelector('button.buy');
    btnBuy.innerText = `$${product.price} - Buy`;
    btnBuy.dataset.id = id;
  }
  handleProductBuyClick(event) {
    const button = event.target;
    const id = button.dataset.id;
    this.cart.addProduct(id);
    window.showAlert('Product added to cart');
  }
}
