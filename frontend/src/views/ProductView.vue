<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import VueCountdown from "@chenfengyuan/vue-countdown";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const route = useRoute();
const router = useRouter();

const productId = ref(route.params.productId);
const loading = ref(false);
const error = ref(false);
const product = ref();
const user = ref();
const now = new Date();
let endDate = "";
let time;
async function fetchProduct() {
  loading.value = true;
  error.value = false;
  try {
    const res = await fetch(
      "http://localhost:3000/api/products/" + productId.value
    );
    product.value = await res.json();
    endDate = new Date(product.value.endDate);
    time = computed(() => endDate - now);
    console.log(time.value)
    console.log(endDate);
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
fetchProduct();
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}
</script>

<template>
  <div class="row">
    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div
      class="alert alert-danger mt-4"
      role="alert"
      data-test-error
      v-if="error"
    >
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row" data-test-product>
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img
          :src="product.pictureUrl ? product.pictureUrl : ''"
          alt=""
          class="img-fluid rounded mb-3"
          data-test-product-picture
        />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              <vue-countdown :time="time" :interval="100" v-slot="{ days, hours, minutes, seconds }" v-if="time.value>0">
                Temps restant : {{ days }} jours, {{ hours }} heures, {{ minutes }} minutes, {{ seconds }} secondes
              </vue-countdown>
              <p v-else>Terminé</p>
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{ product.name }}
            </h1>
          </div>
          <div class="col-lg-6 text-end" v-if="isAdmin && isAuthenticated">
            <RouterLink
              :to="{ name: 'ProductEdition', params: { productId: productId } }"
              class="btn btn-primary"
              data-test-edit-product
            >
              Editer
            </RouterLink>
            &nbsp;
            <button
              class="btn btn-danger"
              data-test-delete-product
              v-if="isAdmin && isAuthenticated"
            >
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{ product.description }}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>
            Prix de départ : {{ product.originalPrice }} €
          </li>
          <li data-test-product-end-date>
            Date de fin : {{ formatDate(new Date(product.endDate)) }}
          </li>
          <li>
            Vendeur :
            <router-link
              :to="{ name: 'User', params: { userId: product.seller.id } }"
              data-test-product-seller
            >
              {{ product.seller.username }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids>
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in product.bids" :key="i" data-test-bid>
              <td>
                <router-link
                  :to="{ name: 'User', params: { userId: i.id } }"
                  data-test-bid-bidder
                >
                  {{ i.bidder.username }}
                </router-link>
              </td>
              <td data-test-bid-price>{{ i.price }} €</td>
              <td data-test-bid-date>{{ formatDate(i.createdAt) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid>
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids>Aucune offre pour le moment</p>

        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input
              type="number"
              class="form-control"
              id="bidAmount"
              data-test-bid-form-price
            />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            disabled
            data-test-submit-bid
          >
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const now = new Date();
    const newYear = new Date(now.getFullYear() + 1, 0, 1);

    return {
      time: newYear - now,
    };
  },
};
</script>