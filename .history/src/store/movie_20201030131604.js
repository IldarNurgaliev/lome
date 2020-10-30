/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import firebase from "firebase/app";
import Vue from "vue";

export default {
  state: {
    movieData: null,
    loading: false
  },
  mutations: {
    setMovie(state, data) {
      state.movieData = data;
    },
    clearMovie(state) {
      state.movieData = {};
    }
  },
  actions: {
    searchMovie({ dispatch, commit }, movieName) {
      Vue.axios
        .get(
          `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${movieName}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host":
                "imdb-internet-movie-database-unofficial.p.rapidapi.com",
              "x-rapidapi-key":
                "a67b43680emshc2b8ff4a8bf27ebp149f8ejsn7963f988d678"
            }
          }
        )
        .then(response => {
          console.log(response);
          this.commit("setMovie", response.data);
          console.log("from", this.getMovie);
        })
        .catch(err => {
          console.log(err);
          commit("setError", err);
          throw err;
        });
    },
    async addFavoriteMovie({ dispatch, commit }, { like, movieId }) {
      try {
        const uid = await dispatch("getUid");
        const info = await firebase
          .database()
          .ref(`users/${uid}/info`)
          .push({ like, movieId });
        return { like, id: info.key };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    }
  },
  getters: {
    getMovie: s => s.movieData
  }
};
