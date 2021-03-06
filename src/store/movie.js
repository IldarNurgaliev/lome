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
      state.movieData = [];
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    }
  },
  actions: {
    async FETCHMOVIE_BY_ID({ commit, dispatch }, movieData) {
      try {
        const uid = await dispatch("getUid");
        const movieFullData = [];

        await Promise.all(
          movieData.map(async movie => {
            // Находим фильм по id и его значение пушим в массив

            let id =
              (
                await firebase
                  .database()
                  .ref(`users/${uid}/info`)
                  .child(movie.id)
                  .once("value")
              ).val() || {};
            let existLike = id.like !== true ? false : true;
            movie["like"] = existLike;

            movieFullData.push(movie);
          })
        );
        return movieFullData;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    FETCH_MOVIE({ getters, dispatch, commit }, movieName) {
      commit("setLoading", true);
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
          dispatch("FETCHMOVIE_BY_ID", response.data.titles).then(movieData => {
            this.commit("setMovie", movieData);
            commit("setLoading", false);
          });
        })
        .catch(err => {
          commit("setError", err);
          throw err;
        });
    },
    async LIKEMOVIE(
      { dispatch, commit },
      { like, likedId, likedImage, title }
    ) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`users/${uid}/info`)
          .child(likedId)
          .update({ like, likedImage, title, likedId });
        const moviesLikeChange = this.getters.getMovie;

        moviesLikeChange.map(oneMovie => {
          if (oneMovie.id === likedId) {
            oneMovie.like = like;
          }
        });

        commit("clearMovie");
        commit("setMovie", moviesLikeChange);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async SHOW_MOVIE_INFO({ commit, dispatch }, movieId) {
      try {
        const movieInfo = await Vue.axios.get(
          `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${movieId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host":
                "imdb-internet-movie-database-unofficial.p.rapidapi.com",
              "x-rapidapi-key":
                "a67b43680emshc2b8ff4a8bf27ebp149f8ejsn7963f988d678"
            }
          }
        );
        return movieInfo.data;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    }
  },
  getters: {
    getMovie: s => s.movieData,
    getLoading: s => s.loading
  }
};
