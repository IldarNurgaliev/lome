<template>
  <v-app id="inspire">
    <v-main class="background-gray">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Register form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="isValid">
                  <v-text-field
                    label="email"
                    name="email"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model.trim="email"
                    required
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model.trim="password"
                    required
                    :rules="[
                      rules.required,
                      rules.passNumber,
                      rules.passLength
                    ]"
                  ></v-text-field>
                  <v-text-field
                    id="confirm password"
                    label="Confirm password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model.trim="passwordConfirm"
                    required
                    :rules="[
                      password === passwordConfirm || 'Password must match'
                    ]"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <router-link
                  to="/login"
                  color="primary"
                  class="pr-6 text-decoration-none"
                >
                  Sign-in
                </router-link>
                <v-btn
                  color="primary"
                  @click="submitHandler"
                  :disabled="!isValid"
                >
                  Register</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    email: "",
    password: "",
    passwordConfirm: "",
    isValid: false,
    rules: {
      required: v => !!v || "Required",
      email: v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid",
      passLength: v =>
        (v && v.length >= 6) || "Password must have 5+ characters",
      passNumber: v => /(?=.*\d)/.test(v) || "Must have one number",
      passConfirm: () =>
        this.password === this.passwordConfirm || "Password must be same"
    }
  }),
  methods: {
    async submitHandler() {
      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      };
      try {
        await this.$store.dispatch("register", formData);
        this.$router.push("/");
        // eslint-disable-next-line no-empty
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
