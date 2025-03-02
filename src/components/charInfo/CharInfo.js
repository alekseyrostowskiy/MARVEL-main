import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import useMarvelService from '../../services/MarvelService'
import setContent from '../../utils/SetContent'
import './charInfo.scss'

const CharInfo = props => {
	const [char, setChar] = useState(null)

	const { getCharacter, clearError, process, setProcess } =
		/* теперь после использования концепции автоматов нам не нужны loading и error */
		useMarvelService()

	useEffect(() => {
		updateChar()
	}, [props.charId])

	const updateChar = () => {
		const { charId } = props
		if (!charId) {
			return
		}

		clearError()
		getCharacter(charId)
			.then(onCharLoaded)
			.then(() =>
				setProcess('confirmed')
			) /* изменяем process на confirmed именно тут, потому что у нас в http.hook.js и useMarvelService операции асинхронные и если бы мы ставили confirmed уже в hhtp-хуке, то у нас не успевал бы загрузиться наш компонент, так как на тот момент он проходил бы стадию _transformCharacter в ueMarvelservice, поэтому ставим confirmed только по завершении загрузке именно в этом месте   */
	}

	const onCharLoaded = char => {
		setChar(char)
	}

	return <div className='char__info'>{setContent(process, View, char)}</div>
}

const View = ({ data }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = data

	let imgStyle = { objectFit: 'cover' }
	if (
		thumbnail ===
		'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
	) {
		imgStyle = { objectFit: 'contain' }
	}

	return (
		<>
			<div className='char__basics'>
				<img src={thumbnail} alt={name} style={imgStyle} />
				<div>
					<div className='char__info-name'>{name}</div>
					<div className='char__btns'>
						<a className='button button__main'>
							<div className='inner'>homepage</div>
						</a>
						<a className='button button__secondary'>
							<div className='inner'>Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className='char__descr'>{description}</div>
			<div className='char__comics'>Comics:</div>
			<ul className='char__comics-list'>
				{comics.length > 0 ? null : 'There is no comics with this character'}
				{comics.map((item, i) => {
					// eslint-disable-next-line
					if (i > 9) return
					return (
						<li key={i} className='char__comics-item'>
							{item.name}
						</li>
					)
				})}
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number,
}

export default CharInfo
