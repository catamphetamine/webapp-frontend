import settings, { icon } from '../src/react-pages'
import configuration from '../configuration'

import startRenderingService from './start'

export default function(parameters) {
  startRenderingService(settings, configuration, parameters, icon)
}