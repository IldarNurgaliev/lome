<template>
  <v-app>
    <Loader v-if="loading" />
    <div v-else>
      <Navbar @drawer="isOpen = !isOpen" />

      <Sidebar :value="isOpen" />

      <v-main>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>
    </div>
    <v-footer app>
      FOOTER
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/elements/Navbar.vue";
import Sidebar from "@/components/elements/Sidebar.vue";

import messages from "@/common/messages";

export default {
  data: () => ({
    loading: true,
    isOpen: false
  }),
  components: {
    Navbar,
    Sidebar
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
    }
  },
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || "Что-то пошло не так");
    }
  },
  mounted() {
    this.loading = false;
  }
};
</script>
