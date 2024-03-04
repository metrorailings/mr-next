
const VideoComponent = ({ videos }) => {
	return (
		<video controls autoPlay muted loop playsInline={ true }>
			<source src={ videos[0].url } type='video/webm' />
			{ /* @TODO - Put up an image here in the event that user's browser cannot play videos */ }
		</video>
	)
}

export default VideoComponent;