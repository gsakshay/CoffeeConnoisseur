import styles from "./banner.module.css"
import { Button } from "@mui/material"

const Banner = (props) => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<span className={styles.title1}>Coffee</span>
				<span className={styles.title2}>Connoisseur</span>
			</h1>
			<p className={styles.subTitle}>Discover your local coffee shops!</p>
			<div className={styles.buttonWrapper}>
				<Button
					color='secondary'
					variant='contained'
					size='large'
					onClick={props.handleOnClick}>
					{props.buttonText}
				</Button>
			</div>
		</div>
	)
}

export default Banner
