<script setup>
import { useAuthStore } from "../store/auth";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}
const product_name = ref("");
const product_description = ref("");
const product_category = ref("");
const product_original_price = ref("");
const product_picture_url = ref("");
const product_end_date = ref("");
const error = ref(false);

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
function postProduct() {
  try {
    router.push({
      name: "Product",
      params: {
        name: product_name.value,
        description: product_description.value,
        category: product_category.value,
        originalPrice: product_original_price.value,
        pictureUrl: product_picture_url.value,
        endDate: product_end_date.value,
        sellerId: route.params.userId,
        createdAt: Date(),
        updatedAt: Date(),
        seller: {
          id: route.params.userId,
          username: route.params.username,
        },
        bids: [],
      },
    });
  } catch (e) {
    console.log(e);
    error.value = true;
  }
}
</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form>
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
          Une erreur s'est produite
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input
            type="text"
            class="form-control"
            id="product-name"
            v-model="product_name"
            required
            data-test-product-name
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
            v-model="product_description"
            required
            data-test-product-description
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input
            type="text"
            class="form-control"
            id="product-category"
            v-model="product_category"
            required
            data-test-product-category
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
              v-model="product_original_price"
              required
              data-test-product-price
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
            v-model="product_picture_url"
            required
            data-test-product-picture
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
            v-model="product_end_date"
            required
            data-test-product-end-date
          />
        </div>

        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            v-bind:disabled="!disableButton"
            data-test-submit
            onclick="postProduct"
          >
            Ajouter le produit
            <span
              data-test-spinner
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="disableButton"
            ></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
