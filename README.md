<div style='text-align: right; margin-top: 30px'>
  <img alt='Gematik Logo' style='height: 37px' src="src/assets/Gematik_Logo_Flag.png"/>
</div> 

<br/>

# vue-oidcauth-sample

<details>
    <summary>Table of Contents</summary>
        <ol>
            <li><a href="#about-the-project">About The Project</a>
                <ul>
                    <li><a href="#release-notes">Release Notes</a></li>
                </ul>
            </li>
            <li><a href="#development">Development</a>
                <ul>
                    <li><a href="#stack">Stack</a></li>
                    <li><a href="#project-setup">Project Setup</a></li>
                    <li><a href="#compiles-and-hot-reloads-for-development">Compiles and hot-reloads for development</a></li>
                    <li><a href="#compiles-and-minifies-for-production">Compiles and minifies for production</a></li>
                    <li><a href="#lints-and-fixes-files">Lints and fixes files</a></li>
                    <li><a href="#customize-configuration">Customize configuration</a></li>
                    <li><a href="#default-config">Default Config</a></li>
                </ul>
            </li>
            <li><a href="#contributing">Contributing</a></li>
            <li><a href="#license-eupl">License EUPL</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#support-and-feedback">Support and Feedback</a></li>
        </ol>
</details>

## About The Project

This repository is an example Relaying Party project for testing gematik Authenticator. It is a combine of oidc client
and resource server with a simple UI.

### Release Notes

See [ReleaseNotes.md](./ReleaseNotes.md) for all information regarding the (newest) releases.

## Development

### Stack

This is a TypeScript project based Nuxt 3 framework. Behind the scenes, these are the used libraries and frameworks:

- Typescript
- NuxtJS 3
- Vue 3
- Pinia
- TailwindCSS
- Vite
- EsLint
- Prettier

### Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://nuxt.com/docs/api/configuration/nuxt-config).

### Default Config

The `default-configs.yml` file in the root directory contains default configurations for the application. It is possible
to add custom  settings to the file and these settings will appear on the settings page.

The following is a list of the most commonly used configurations that are contained in the `default-configs.yml` file.

#### DEFAULT_CONFIG:

This section of the configuration file contains the default configuration settings for the application.

* `IDP_HOST` - This is the address of the identity provider used for authentication.
* `REDIRECT_URI` - This is the URL that the application will redirect the user to after authentication.
* `CLIENT_ID` - This is the unique identifier for the application when it is connecting to the identity provider.
* `SCOPE` - This is the list of permissions that the user must grant to the application before it can access their data.
* `AUTHENTICATOR_HOST_KEY` - This is the address of the authenticator host.
* `CARD_TYPE_KEY` - This is the type of card that can be used with the application.
* `REDIRECT_AUTOMATICALLY_KEY` - This setting determines whether the application will automatically redirect the user
  after they have authenticated or not.

#### Example YML Structure:

    DEFAULT_CONFIG:
      IDP_HOST: "http://..."
      REDIRECT_URI: "http://.../callback"
      CLIENT_ID: "CLIENT_X"
      SCOPE: "openid gem-auth Person_ID"
      AUTHENTICATOR_HOST_KEY: "authenticator://"
      CARD_TYPE_KEY: "HBA"
      REDIRECT_AUTOMATICALLY_KEY: "false"
    
    DEFAULT_CONFIG_BY_TYPES:
      LOCAL_IDP:
        IDP_HOST: "http://..."
        REDIRECT_URI: "http://.../callback"
        CLIENT_ID: "CLIENT_X"

      REMOTE_IDP:
        IDP_HOST: "http://..."
        REDIRECT_URI: "http://.../callback"
        CLIENT_ID: "CLIENT_Y"

## Contributing

We plan to enable contribution to the Authenticator in the near future.

## License EUPL

Copyright 2023 gematik GmbH

The Authenticator App is licensed under the European Union Public Licence (EUPL); every use of the Authenticator App
Sourcecode must be in compliance with the EUPL.

You will find more details about the EUPL here: https://joinup.ec.europa.eu/collection/eupl

Unless required by applicable law or agreed to in writing, software distributed under the EUPL is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the EUPL for the specific
language governing permissions and limitations under the License.ee the Licence for the specific language governing
permissions and limitations under the Licence.

## FAQ

Visit our [FAQ page](https://wiki.gematik.de/x/tjdCH) for more information.

## Support and Feedback

For inquiries from application developers regarding the API or suggestions, please use the following email address:
[authenticator@gematik.de](mailto:authenticator@gematik.de)
