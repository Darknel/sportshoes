class Cart {
  constructor() {
    this.cartContainer = document.querySelector('#modal-cart');
    this.cart = JSON.parse(localStorage['cart'] || '{}');
    this.addEventListeners();
    this.updateBadge();
    this.productService = new ProductsService();
  }
  addEventListeners() {
    document
      .querySelector('.openCartLink')
      .addEventListener('click', () => this.renderCart());
    this.cartContainer
      .querySelector('.order')
      .addEventListener('click', ev => this.order(ev));
  }
  saveCart() {
    localStorage['cart'] = JSON.stringify(this.cart);
  }
  async renderCart() {
    let total = 0;
    let cartDomSting = `
                      `;
    for (const id in this.cart) {
      const product = await this.productService.getProductById(id);
      total += product.price * this.cart[id];
      cartDomSting += ` <div class="container">
                          <div class="row" data-id="${id}"> 
                            <img class="col-12 card-img-top modal-body-product-image" src="img/${product.image}" alt="${product.title}">
                            <div class="col-12 modal-body-product-title">${product.title}</div>
                            <div class="col-12 modal-body-product-price">$${product.price}</div>
                            <div class="col-12 d-flex justify-content-center align-items-center">
                              <button data-id=${id} class="btn btn-dark btn-sm plus modal-body-product-plus"></button>
                              <div class="modal-body-product-count">${this.cart[id]}</div>
                              <button data-id=${id} class="btn btn-dark btn-sm minus modal-body-product-minus"></button>
                            </div>
                          </div>
                          <hr>`;
    }
    total = total.toFixed(2);
    cartDomSting += `
                          <div class="row">
                            <div class="col-12 d-flex justify-content-around modal-body-product-total-count">
                              <strong>TOTAL</strong>
                              <strong>$${total}</strong>
                            </div>
                          </div>            
                        </div>`;
    this.cartContainer.querySelector('.cart-product-list-container').innerHTML = cartDomSting;
    this.cartContainer.querySelectorAll('.plus').forEach(el => el.addEventListener('click', ev => this.changeQuantity(ev, this.addProduct)));
    this.cartContainer.querySelectorAll('.minus').forEach(el => el.addEventListener('click', ev => this.changeQuantity(ev, this.deleteProduct)));
  }
  changeQuantity(ev, operation) {
    const button = ev.target;
    const id = button.dataset.id;
    operation.call(this, id);
    this.renderCart();
  }
  addProduct(id) {
    this.cart[id] = (this.cart[id] || 0) + 1;
    this.saveCart();
    this.updateBadge();
  }
  deleteProduct(id) {
    if (this.cart[id] > 1) {
      this.cart[id] -= 1;
    } else {
      delete this.cart[id];
    }
    this.saveCart();
    this.updateBadge();
  }
  updateBadge() {
    let count = 0;
    for (const key in this.cart) {
      count += this.cart[key];
    }
    document.querySelector('#cart-badge').innerText = count;
    return count;


  }
  cartLength() {
    return Object.keys(this.cart).length;
  }
  order(ev) {
    if (this.cartLength() === 0) {
      window.showAlert('Please choose products to order', false);
      return;
    }
    const form = this.cartContainer.querySelector('.form-contacts');
    if (form.checkValidity()) {
      ev.preventDefault();
      fetch('order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientName: document.querySelector('#client-name').value,
          clientEmail: document.querySelector('#client-email').value,
          cart: this.cart
        })
      })
        .then(response => {
          if (response.status === 200) {
            return response.text();
          } else {
            throw new Error('Cannot send form');
          }
        })
        .then(responseText => {
          form.reset();
          this.cart = {};
          this.saveCart();
          this.updateBadge();
          this.renderCart();
          window.showAlert('Thank you! ' + responseText);
          this.cartContainer.querySelector('.btn-close').click();
        })
        .catch(error => showAlert('There is an error: ' + error, false));
    } else {
      window.showAlert('Please fill form correctly', false);
    }
  }
}
