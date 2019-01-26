import { PRELOAD_STARTED, PRELOAD_FINISHED, PRELOAD_FAILED } from 'react-website';

export const preloadStarted = () => ({
	type : PRELOAD_STARTED,
	immediate : true
})

export const preloadFinished = () => ({
	type : PRELOAD_FINISHED
})
