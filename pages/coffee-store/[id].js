import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"

import useSWR from "swr"

import cls from "classnames"

import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "../../lib/coffee-stores"

import { StoreContext } from "../../store/store-context"

import { fetcher, isEmpty } from "../../utils"

// MUI
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import NearMeIcon from "@mui/icons-material/NearMe"
import StarRateIcon from "@mui/icons-material/StarRate"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
// import { createStyles, makeStyles } from "@mui/styles"

// const useStyles = makeStyles(() =>
// 	createStyles({
// 		infoCard: {
// 			width: "fit-content",
// 			height: "fit-content",
// 			padding: "2rem",
// 		},
// 	})
// )

export async function getStaticProps({ params }) {
	const coffeeStores = await fetchCoffeeStores()
	const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id.toString() === params.id //dynamic id
	})
	return {
		props: {
			coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
		},
	}
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores()
	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		}
	})
	return {
		paths,
		fallback: true,
	}
}

const CoffeeStore = (initialProps) => {
	// const classes = useStyles()
	const router = useRouter()

	const id = router.query.id

	const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {})

	const {
		state: { coffeeStores },
	} = useContext(StoreContext)

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore
			const response = await fetch("/api/createCoffeeStore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					voting: 0,
					imgUrl,
					neighbourhood: neighbourhood || "",
					address: address || "",
				}),
			})

			const dbCoffeeStore = await response.json()
		} catch (err) {
			console.error("Error creating coffee store", err)
		}
	}

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id //dynamic id
				})

				if (coffeeStoreFromContext) {
					setCoffeeStore(coffeeStoreFromContext)
					handleCreateCoffeeStore(coffeeStoreFromContext)
				}
			}
		} else {
			// SSG
			handleCreateCoffeeStore(initialProps.coffeeStore)
		}
	}, [id, initialProps, initialProps.coffeeStore, coffeeStores])

	const {
		address = "",
		name = "",
		neighbourhood = "",
		imgUrl = "",
	} = coffeeStore
	const [votingCount, setVotingCount] = useState(0)

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0])
			setVotingCount(data[0].voting)
		}
	}, [data])

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/favouriteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			})

			const dbCoffeeStore = await response.json()

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1
				setVotingCount(count)
			}
		} catch (err) {
			console.error("Error upvoting the coffee store", err)
		}
	}

	if (error) {
		return <div>Something went wrong retrieving coffee store page</div>
	}

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
				<meta name='description' content={`${name} coffee store`}></meta>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href='/'>
							<ArrowBackOutlinedIcon
								style={{ cursor: "pointer" }}
								fontSize='large'
								color='primary'
							/>
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
						}
						width={450}
						height={360}
						className={styles.storeImg}
						alt={name}></Image>
				</div>

				<Paper
					style={{
						width: "fit-content",
						height: "fit-content",
						padding: "5rem",
						marginTop: "15rem",
					}}
					elevation={2}>
					<div className={styles.iconWrapper}>
						<LocationOnIcon color='primary' />

						<p className={styles.text}>{address}</p>
					</div>
					{neighbourhood && (
						<div className={styles.iconWrapper}>
							<NearMeIcon color='primary' />

							<p className={styles.text}>{neighbourhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<StarRateIcon color='primary' />
						<p className={styles.text}>{votingCount}</p>
					</div>

					<Button variant='outlined' onClick={handleUpvoteButton}>
						Up vote!
					</Button>
				</Paper>
			</div>
		</div>
	)
}

export default CoffeeStore
