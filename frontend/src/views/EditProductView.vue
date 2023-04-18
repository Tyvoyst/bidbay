<script setup>
import { useAuthStore } from "../store/auth";
import { useRoute, useRouter } from "vue-router";
import {computed, ref} from "vue";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
const route = useRoute();
const error = ref(false);

const product_name = ref("");
const product_description = ref("");
const product_category = ref("");
const product_original_price = ref("");
const product_picture_url = ref("");
const product_end_date = ref("");

const product = ref();

async function fetchProduct() {
  error.value = false;
  try {
    console.log(productId.value);
    const res = await fetch(
      "http://localhost:3000/api/products/" + productId.value
    );
    product.value = await res.json();
  } catch (e) {
    error.value = true;
  }
}
fetchProduct();
if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}
const disableButton = computed(() => {
  return (
    product_name.value.length > 0 &&
    product_description.value.length > 0 &&
    product_category.value.length &&
    product_original_price.value > 0 &&
    product_picture_url.value.length > 0 &&
    product_end_date.value.length > 0
  );
});
const productId = ref(route.params.productId);

</script>

<template>
  <h1 class="text-center">Modifier un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form>
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
          Une erreur est survenue
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input
            type="text"
            class="form-control"
            id="product-name"
            required
            data-test-product-name
            v-model="product_name"
            :value="product.value.name"
          />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea
            class="form-control"
            id="product-description"
            name="description"
            rows="3"
            required
            data-test-product-description
            v-model="product_description"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input
            type="text"
            class="form-control"
            id="product-category"
            required
            data-test-product-category
            v-model="product_category"
          />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              id="product-original-price"
              name="originalPrice"
              step="1"
              min="0"
              required
              data-test-product-price
              v-model="product_original_price"
            />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input
            type="url"
            class="form-control"
            id="product-picture-url"
            name="pictureUrl"
            required
            data-test-product-picture
            v-model="product_picture_url"
          />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input
            type="date"
            class="form-control"
            id="product-end-date"
            name="endDate"
            required
            data-test-product-end-date
            v-model="product_end_date"
          />
        </div>

        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            v-bind:disabled="!disableButton"
            data-test-submit
          >
            Modifier le produit
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              data-test-spinner
              :hidden="disableButton"
            ></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
