
/**
 * An Array of routes that are public and do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
    "/"
]

/**
 * An Array of routes that require authentication
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

/**
 * The prefix for the authentication API
 * @type {string}
 */
export const apiAuthPrefix = "api/auth";


export const DEFAULT_LOGIN_REDIRECT = "/settings";