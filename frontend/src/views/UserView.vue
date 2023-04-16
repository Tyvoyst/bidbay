<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const { isAuthenticated, userData } = useAuthStore();

const router = useRouter();
const route = useRoute();

let user = ref();
const loading = ref(false);
const error = ref(null);

let userId = computed(() => route.params.userId);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
async function fetchUser() {
  loading.value = true;
  error.value = false;
  try {
    const res = await fetch("http://localhost:3000/api/users/" + userId.value);
    user.value = await res.json();
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
fetchUser();
</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur {{ user.username }}
      <span class="badge rounded-pill bg-primary" data-test-admin>Admin</span>
    </h1>
    <div class="text-center" data-test-loading>
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div class="alert alert-danger mt-3" data-test-error>
      Une erreur est survenue
    </div>
    <div data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div
              class="col-md-6 mb-6 py-2"
              v-for="i in user.products"
              :key="i"
              data-test-product
            >
              <div class="card">
                <RouterLink
                  :to="{ name: 'Product', params: { productId: i.id } }"
                >
                  <img
                    :src="i.pictureUrl"
                    class="card-img-top"
                    data-test-product-picture
                  />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink
                      :to="{
                        name: 'Product',
                        params: { productId: i.id },
                      }"
                      data-test-product-name
                    >
                      {{ i.name }}
                    </RouterLink>
                  </h5>
                  <p class="card-text" data-test-product-description>
                    {{ i.description }}
                  </p>
                  <p class="card-text" data-test-product-price>
                    Prix de départ : {{ i.originalPrice }} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2>Offres</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Offre</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="j in user.bids" :key="j" data-test-bid>
                <td>
                  <RouterLink
                    :to="{
                      name: 'Product',
                      params: { productId: j.product.id },
                    }"
                    data-test-bid-product
                  >
                    {{ j.product.name }}
                  </RouterLink>
                </td>
                <td data-test-bid-price>{{ j.price }} €</td>
                <td data-test-bid-date>{{ formatDate(new Date(j.date)) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
