package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
)

type authType string

// ClaimsKey is the key used to obtain the user's logged in data
const ClaimsKey authType = "claims"

// With checks if the user is authenticated via JWTs
func With(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, is := isAuthenticated(r)
		if !is {
			f.ServeHTTP(w, r)
			return
		}

		f.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ClaimsKey, claims)))
	})
}

// Must forbids access to certain pages without authentication, uses the provided
// handler to display the erroring page
func Must(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !IsAuthenticated(r) {
			// don't redirect git requests but instead ask for a BasicAuth
			if strings.Contains(r.Header.Get("User-Agent"), "git") {
				authHead := r.Header.Get("Authorization")
				if len(authHead) == 0 {
					w.Header().Add("WWW-Authenticate", "Basic realm=\".\"")
					w.WriteHeader(http.StatusUnauthorized)
					return
				}

				username, password, ok := r.BasicAuth()
				if !ok {
					w.WriteHeader(http.StatusBadRequest)
					return
				}
				fmt.Println("basic auth", username, password)
				return
			}

			http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
			return
		}

		f.ServeHTTP(w, r)
	}
}

// IsAuthenticated checks if the request has a reference to the user's claims
// inside the context.
func IsAuthenticated(r *http.Request) bool {
	return r.Context().Value(ClaimsKey) != nil
}