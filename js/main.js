Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
                <img :src="image" :alt="altText"/>
            </div>

           
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In stock</p>
                <p v-else>Out of Stock</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
                <p>Shipping: {{ shipping }}</p>
                <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"
                        @mouseover="updateProduct(index)"
                ></div>

                <p :class="{ 'out-of-stock': !inStock }">
                        {{ inStock ? 'In Stock' : 'Out of Stock' }}
                </p>

                <div class="card">
                    <span v-if="onSale" class="sale-text">On Sale</span>
                    <h2>{{ brand }} {{ product }}</h2>
                    <p>{{ description }}</p>
                    <product-details :details="details"></product-details>
                    <p :class="{ 'sale-message': onSale }">{{ sale }}</p>
                </div>

                <div class="size-product">
                    <h2>Размеры носков:</h2>
                    <a v-for="size in sizes" :key="size">
                        {{ size }}
                    </a>
                </div>

     
                <button
                        v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
        </div>
        <h2>Корзина товаров</h2>
        <div v-if="cart.length === 0">
            <p>Ваша корзина пуста.</p>
        </div>
        
        <div v-else>
        <div class="cart-item" v-for="item in cart" :key="item.id">
            <span>{{ item.name }} ({{ item.price }} руб.)</span>
            <button class="remove-button" @click="removeFromCart(item.id)">Удалить</button>
        </div>
        </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: 'A pair of warm, fuzzy socks',
            selectedVariant: 0,
            altText: "A pair of socks",
            //link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            inStock: true,
            onSale: true, // Управляет отображением элемента <span>
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],// Массив размеров
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
        sale() {
            if (this.onSale) {
                return `Распродажа! Товар ${this.brand} ${this.product} со скидкой!`;
            } else {
                return `Распродажа на товар ${this.brand} ${this.product} не проводится.`;
            }
        }

    }
})
let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [
            { id: 1, name: 'Носки Nike', price: 500 },
            { id: 2, name: 'Кроссовки Adidas', price: 4000 },
            { id: 3, name: 'Футболка Puma', price: 1500 }
        ]
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(itemId) {
            // Удаляем товар из корзины по его идентификатору
            this.cart = this.cart.filter(item => item.id !== itemId);
        }
    }

})
