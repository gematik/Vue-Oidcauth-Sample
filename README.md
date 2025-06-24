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

## License

Copyright 2021-2025 gematik GmbH

EUROPEAN UNION PUBLIC LICENCE v. 1.2

EUPL © the European Union 2007, 2016

See the [LICENSE](./LICENSE) for the specific language governing permissions and limitations under the License

## Additional Notes and Disclaimer from gematik GmbH

1. Copyright notice: Each published work result is accompanied by an explicit statement of the license conditions for
   use. These are regularly typical conditions in connection with open source or free software. Programs
   described/provided/linked here are free software, unless otherwise stated.
2. Permission notice: Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
   associated documentation files (the "Software"), to deal in the Software without restriction, including without
   limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions::
  1. The copyright notice (Item 1) and the permission notice (Item 2) shall be included in all copies or substantial
     portions of the Software.
  2. The software is provided "as is" without warranty of any kind, either express or implied, including, but not
     limited to, the warranties of fitness for a particular purpose, merchantability, and/or non-infringement. The
     authors or copyright holders shall not be liable in any manner whatsoever for any damages or other claims arising
     from, out of or in connection with the software or the use or other dealings with the software, whether in an
     action of contract, tort, or otherwise.
  3. The software is the result of research and development activities, therefore not necessarily quality assured and
     without the character of a liable product. For this reason, gematik does not provide any support or other user
     assistance (unless otherwise stated in individual cases and without justification of a legal obligation).
     Furthermore, there is no claim to further development and adaptation of the results to a more current state of
     the art.
3. Gematik may remove published results temporarily or permanently from the place of publication at any time without
   prior notice or justification.
4. Please note: Parts of this code may have been generated using AI-supported technology.’ Please take this into
   account, especially when troubleshooting, for security analyses and possible adjustments.

## FAQ

Visit our [FAQ page](https://wiki.gematik.de/x/tjdCH) for more information.

## Support and Feedback

For inquiries from application developers regarding the API or suggestions, please use the following email address:
[authenticator@gematik.de](mailto:authenticator@gematik.de)
