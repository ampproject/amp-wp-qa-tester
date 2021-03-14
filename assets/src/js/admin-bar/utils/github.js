/**
 * Base URL for the GitHub API.
 *
 * @type {string}
 */
const baseUrl = 'https://api.github.com';

/**
 * Wrapper for `fetch` to catch any errors while making a request.
 *
 * @private
 *
 * @param {Request|string} resource The resource that you wish to fetch.
 * @param {Object} opts An object containing any custom settings that you want to apply to the request.
 * @return {Promise<Response>} A Promise that resolves to a Response object.
 */
const _fetch = ( resource, opts = {} ) => {
	return fetch( resource, opts )
		.then( ( response ) => {
			if ( ! response.ok ) {
				return Promise.reject( response.statusText );
			}

			return response;
		} )
		.catch( ( error ) => {
			return Promise.reject( error );
		} );
};

/**
 * Fetches all open PRs that have build zips available for download.
 *
 * @return {Promise<Object[]>} Promise containing a list of PR items.
 */
export const getPullRequestsWithBuilds = () => {
	const url = new URL( `${ baseUrl }/search/issues` );
	const params = {
		/* eslint-disable-next-line prettier/prettier */
		q: 'repo:ampproject/amp-wp is:pr commenter:app/github-actions in:comments "Download development build"',
		sort: 'created',
		order: 'desc',
	};

	url.search = new URLSearchParams( params ).toString();

	return _fetch( url )
		.then( ( response ) => response.json() )
		.then( ( json ) => json.items || [] );
};

/**
 * Get the list of protected branches.
 *
 * @return {Promise<Object[]>} Promise containing list of protected branches.
 */
export const getProtectedBranches = () => {
	// Add the `protected` query to filter PR branches.
	/* eslint-disable-next-line prettier/prettier */
	const url = `${ baseUrl }/repos/ampproject/amp-wp/branches?protected=true`;

	return _fetch( url ).then( ( response ) => response.json() );
};
