import { resolveRefs } from 'json-refs';
import YAML from 'js-yaml';
import fs from 'fs';
import config from 'config';

const root = YAML.load(fs.readFileSync('src/api/swagger/swagger.yaml').toString());
const options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent(res, callback) {
      callback(null, YAML.load(res.text));
    }
  }
};

const host = `${config.get('app.host')}:${config.get('app.port')}`;
export default function () {
  return resolveRefs(root, options).then(results => {
    const spec = results.resolved;
    spec.host = host;
    if (process.env.NODE_ENV === 'production') {
      spec.schemes = ['https'];
    }
    return spec;
  });
}
