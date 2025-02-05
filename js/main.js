let eventBus = new Vue()


Vue.component('product-review', {
    template: `
       <form class="review-form" @submit.prevent="onSubmit">
       <p v-if="errors.length">
             <b>Исправьте текущие ошибки:</b>
             <ul>
               <li v-for="error in errors">{{ error }}</li>
             </ul>
       </p>
         <p>
           <label for="name">Имя:</label>
           <input id="name" v-model="name" placeholder="name">
         </p>
        
         <p>
           <label for="review">Отзыв:</label>
           <textarea id="review" v-model="review"></textarea>
         </p>
         <p>
           <label for="rating">Рейтинг:</label>
           <select id="rating" v-model.number="rating">
             <option>5</option>
             <option>4</option>
             <option>3</option>
             <option>2</option>
             <option>1</option>
           </select>
         </p>
         
         <p>
           <input type="submit"> 
         </p>
        </form>
        
        
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommended: null,
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if(!this.name) this.errors.push("Имя обязательно.")
                if(!this.review) this.errors.push("Отзыв обязателен.")
                if(!this.rating) this.errors.push("Рейтинг обязателен.")
            }
        },
    }

})



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
           <p>{{description}}</p>
           <span class="sale">{{ sale }}</span>
           <p v-if="inStock" >В наличии</p>
           <p v-else :class="{ OutOfStock:!inStock }">Нет в наличии</p>
           <p v-if="errors.length">
                <b>Исправьте текущие ошибки:</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
           </p>
           <div
                   class="color-box"
                   v-for="(variant, index) in variants"
                   :key="variant.variantId"
                   :style="{ backgroundColor:variant.variantColor }"
                   @click="updateProduct(index)"
           ></div>
                <div class="size-product">
                    <a value="">Выберите размер</a>
                    <div class="size">
                        <a v-for="size in sizes" :value="size">{{size}}</a>
                    </div>
                </div>
                
           <button
                   v-on:click="addToCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }"
           >
               Добавить в корзину
           </button>
           <button
                   v-on:click="removeFromCart"
           >
               Удалить из корзины
           </button>
           <br>
           <a v-bind:href="link">Похожие товары >></a>    
       </div>           
           <product-tabs :reviews="reviews"></product-tabs>
       </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "Пара теплых носков",
            selectedVariant: 0,
            selectedSize: '',
            altText: "Socks",
            link: "https://www.ozon.ru/category/odezhda-obuv-i-aksessuary-7500/?text=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8&clid=11468697-1",
            onSale: true,
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
                    variantQuantity: 20
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
            errors: []
        }
    },
    methods: {
        addToCart() {
            this.errors = [];
            if (this.selectedSize === '') {
                this.errors.push("Выберите размер.");
            }
            if (this.selectedVariant === null) {
                this.errors.push("Выберите цвет.");
            }
            if (this.errors.length === 0) {
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            }
        },
        removeFromCart(index) {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        mounted() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            return this.onSale ? (`${this.brand} ${this.product} Скидка!`) : (`${this.brand} ${this.product} без скидки.`);
        },
        shipping() {
            if (this.premium) {
                return "Бесплатно";
            } else {
                return "190₽"
            }
        }
    }
})

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Отзывы'">
         <p v-if="!reviews.length"> Сейчас нет отзывов.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div> 
       <div v-show="selectedTab === 'Оставить отзыв'">
         <product-review></product-review>
     </div>
     <div v-show="selectedTab === 'Детали'">
        <product-detail></product-detail>
    </div>
     </div>
`,
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            tabs: ['Отзывы', 'Оставить отзыв', 'Детали'],
            selectedTab: 'Отзывы'
        }
    }
})

Vue.component('product-detail', {
    template:`
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`,
    data () {
        return {
            details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        eraseCart(id) {
            this.cart.pop(id);
        },

    },
})

