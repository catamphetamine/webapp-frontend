import { createConfig } from './react-website.common'

import routes  from './routes'
import * as reducers from './redux'

// "Favicon" must be imported on the client side too
// since no assets are emitted on the server side
export { default as icon } from '../assets/images/icon.png'

export default createConfig({ routes, reducers })