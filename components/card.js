import Link from "next/link"
import Image from "next/image"
import cls from "classnames"

import styles from "./card.module.css"

// MUI Card
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"

const CardComponent = (props) => {
	return (
		<Link href={props.href}>
			<a className={styles.cardLink}>
				<Card sx={{ width: 350 }}>
					<CardActionArea>
						<CardMedia
							component='img'
							width={260}
							height={160}
							image={props.imgUrl}
							alt={props.name}
						/>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div'>
								{props.name}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</a>
		</Link>
	)
}

export default CardComponent
