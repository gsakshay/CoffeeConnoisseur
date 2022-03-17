//initialize unsplash

import { createApi } from "unsplash-js"

// on your node server
const unsplashApi = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
	//...other fetch options
})

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`
}

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplashApi.search.getPhotos({
		query: "coffee shop",
		perPage: 40,
	})
	const unsplashResults = photos.response?.results || []
	return unsplashResults.map((result) => result.urls["small"])
}

export const fetchCoffeeStores = async (
	latLong = "12.972442,77.580643",
	limit = 8
) => {
	try {
		const photos = /* await getListOfCoffeeStorePhotos() */ []
		const response = await fetch(
			getUrlForCoffeeStores(latLong, "coffee stores", limit),
			{
				headers: {
					Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
				},
			}
		)
		const data = await response.json()

		return (
			data.results?.map((venue, idx) => {
				const neighbourhood = venue.location.neighborhood
				return {
					// ...venue,
					id: venue.fsq_id,
					address: venue.location.address || "",
					name: venue.name,
					neighbourhood:
						(neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
						venue.location.cross_street ||
						"",
					imgUrl:
						photos[idx] ||
						"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
				}
			}) || []
		)
	} catch (error) {
		if (
			!process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY ||
			!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
		) {
			console.error("Setup API Keys")
		}
		console.log("Something went wrong fetching coffee stores", error)
		return []
	}
}
