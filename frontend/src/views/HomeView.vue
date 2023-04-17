<script setup>
import { ref, computed } from "vue";

const loading = ref(false);
const error = ref(false);
let productList = ref([]);
let bidsPrice = ref([]);
let currentDate = new Date();
currentDate = currentDate.toLocaleString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
console.log(currentDate);
async function fetchProducts() {
  loading.value = true;
  error.value = false;
  try {
    const res = await fetch("http://localhost:3000/api/products");
    productList.value = await res.json();
    for (let i = 0; i < productList.value.length; i++) {
      let max = 0;
      for (let j = 0; j < productList.value.at(i).bids.length; j++) {
        if (max < productList.value.at(i).bids.at(j).price) {
          max = productList.value.at(i).bids.at(j).price;
        }
      }
      bidsPrice.value.push(max);
    }
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
fetchProducts();


function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}
</script>

<template>
  <div>
    <h1 class="text-center mb-4">Liste des produits</h1>

    <div class="row mb-3">
      <div class="col-md-6">
        <form>
          <div class="input-group">
            <span class="input-group-text">Filtrage</span>
            <input
              type="text"
              class="form-control"
              placeholder="Filtrer par nom"
              data-test-filter
            />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-test-sorter
          >
            Trier par nom
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#"> Nom </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" data-test-sorter-price>
                Prix
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error.value">
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="i in productList"
        data-test-product
        :key="i"
      >
        <div class="card">
          <RouterLink :to="{ name: 'Product', params: { productId: i.id } }">
            <img
              :src="i.pictureUrl"
              data-test-product-picture
              class="card-img-top"
            />
          </RouterLink>
          <div class="card-body">
            <h5 class="card-title">
              <RouterLink
                data-test-product-name
                :to="{ name: 'Product', params: { productId: i.id } }"
              >
                {{ i.name }}
              </RouterLink>
            </h5>
            <p class="card-text" data-test-product-description>
              {{ i.description }}
            </p>
            <p class="card-text">
              Vendeur :
              <RouterLink
                data-test-product-seller
                :to="{ name: 'User', params: { userId: i.seller.id } }"
              >
                {{ i.seller.username }}
              </RouterLink>
            </p>
            <p class="card-text" data-test-product-date v-if="formatDate(i.endDate)>currentDate">
              En cours jusqu'au {{ formatDate(i.endDate) }}
            </p>
            <p class="card-text" data-test-product-date v-else>
                Terminé
            </p>
            <p class="card-text" data-test-product-price v-if="formatDate(i.endDate)>currentDate">
              Prix de départ : {{ i.originalPrice }} €
            </p>
            <p class="card-text" data-test-product-price v-else>
              Prix actuel : {{ bidsPrice.at(productList.indexOf(i)) }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
