<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const { isAuthenticated, userData } = useAuthStore();

const router = useRouter();
const route = useRoute();

const user = ref();
const loading = ref(null);
const error = ref(null);
const valid = ref(null);

let userId = computed(() => route.params.userId);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
async function fetchUser() {
  loading.value = true;
  error.value = false;
  try {
    if (userId.value === "me") {
      const res = await fetch("http://localhost:3000/api/users/" +  userData.value.id);
      user.value = await res.json();
    } else {
      const res = await fetch("http://localhost:3000/api/users/" + userId.value);
      console.log(userId.value);
      user.value = await res.json();
    }
    console.log(user.value.message)
    user.value.message === "User not found" ? (valid.value = false) : (valid.value = true);
    console.log(valid.value);
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
      {{ user.username ? "Utilisateur "+user.username : "Cet utilisateur n'existe pas" }}
      <span class="badge rounded-pill bg-primary" data-test-admin v-if="user.admin===true">Admin</span>
    </h1>
    <div class="text-center" data-test-loading v-if="loading">
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div class="alert alert-danger mt-3" data-test-error v-if="error || !valid">
      Une erreur est survenue
    </div>
    <div data-test-view v-if="valid">
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row" v-if="user.products !== []">
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
