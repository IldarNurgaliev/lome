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
    async fetchMovieById({ commit, dispatch }, movieId) {
      try {
        const uid = await dispatch("getUid");
        const category =
          (
            await firebase
              .database()
              .ref(`users/${uid}/info`)
              .child(movieId)
              .once("value")
          ).val() || {};
        // const cats = [];
        // Object.keys(categories).forEach(key => {
        //   cats.push({
        //     title: categories[key].title,
        //     limit: categories[key].limit,
        //     id: key
        //   });
        // });
        // return cats;
        console.log(category);
        return { ...category };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchMovie({ dispatch, commit }, movieName) {
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
          console.log("1", response.data.titles);

          var doubles = response.data.titles.map(num => {
            dispatch("fetchMovieById", num.id);
          });
          return doubles;
        })
        .then(doubles => {
          console.log("2", doubles);
          this.commit("setMovie", doubles.data);
        })
        .catch(err => {
          console.log(err);
          commit("setError", err);
          throw err;
        });
    },
    async updateFavoriteMovie({ dispatch, commit }, { like, movieId }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`users/${uid}/info`)
          .child(movieId)
          .update({ like });
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
