import { ReduxModule } from 'react-website'

const redux = new ReduxModule()

export const uploadPicture = redux.action
(
	(file) => (http) => http.post(`/images/upload`, { file })
)

export default redux.reducer()