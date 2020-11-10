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
      state.movieData = null;
    }
  },
  actions: {
    async fetchMovieById({ commit, dispatch }, movieData) {
      try {
        const uid = await dispatch("getUid");
        const movieFullData = [];
        ///
        var likeChange = firebase.database().ref("users/" + uid + "/info");

        likeChange.on("value", function(snapshot) {
          commit("clearMovie");
          movieFullData.map(movie => {
            for (let key in snapshot.val()) {
              if (movie.id === key.like) {
                movie.id = key.like;
              }
            }
          });
          commit("clearMovie");
          commit("setMovie", movieFullData);
        });
        ////

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
    fetchMovie({ dispatch, commit }, movieName) {
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
          dispatch("fetchMovieById", response.data.titles).then(movieData => {
            this.commit("setMovie", movieData);
          });
        })
        .catch(err => {
          commit("setError", err);
          throw err;
        });
    },
    async updateFavoriteMovie(
      { getters, dispatch, commit },
      { like, movieId }
    ) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`users/${uid}/info`)
          .child(movieId)
          .update({ like });
        const moviesLikeChange = this.getters.getMovie;

        moviesLikeChange.map(oneMovie => {
          if (oneMovie.id === movieId) {
            oneMovie.like = like;
          }
        });

        commit("clearMovie");
        commit("setMovie", moviesLikeChange);
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
